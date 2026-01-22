

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type FormType = "ape_subscription" | "pee_lead" | "registration";
export type TelemetryEventType =
  | "form_viewed"
  | "form_started"
  | "step_viewed"
  | "field_changed"
  | "field_completed"
  | "validation_error"
  | "draft_saved"
  | "form_abandoned";

interface TelemetryEvent {
  anonymousId: string;
  sessionId: string;
  formInstanceId: string;
  formType: FormType;
  eventType: TelemetryEventType;
  fieldKey?: string;
  step?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

interface DraftPayload<TDraft extends object> {
  anonymousId: string;
  sessionId: string;
  formInstanceId: string;
  formType: FormType;
  draftData: TDraft;
  email?: string | null;
  phone?: string | null;
  stepReached?: string | null;
  fieldsCompleted?: number | null;
  totalFields?: number | null;
  source?: Record<string, unknown> | null;
  deviceInfo?: Record<string, unknown> | null;
}

interface UseFormTelemetryOptions<TDraft extends object> {
  formType: FormType;
  storageVersion?: string;
  initialDraft?: TDraft;
}

const STORAGE_VERSION = "v1";
const ANONYMOUS_ID_KEY = `anonymous_id:${STORAGE_VERSION}`;
const SESSION_ID_KEY = `session_id:${STORAGE_VERSION}`;

const storageCache = new Map<string, string | null>();
let visibilityListenersRegistered = false;
const visibilityHandlers = new Set<() => void>();

const getSafeStorageItem = (key: string): string | null => {
  if (storageCache.has(key)) {
    return storageCache.get(key) ?? null;
  }
  try {
    const value = window.localStorage.getItem(key);
    storageCache.set(key, value);
    return value;
  } catch {
    return null;
  }
};

const setSafeStorageItem = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
    storageCache.set(key, value);
  } catch {
    // Ignore storage failures (private mode, quota exceeded)
  }
};

const getSessionStorageItem = (key: string): string | null => {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const setSessionStorageItem = (key: string, value: string) => {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore session storage failures
  }
};

const ensureVisibilityListeners = () => {
  if (visibilityListenersRegistered || typeof window === "undefined") return;
  visibilityListenersRegistered = true;

  const handler = () => {
    visibilityHandlers.forEach((callback) => callback());
  };

  window.addEventListener("visibilitychange", handler);
  window.addEventListener("pagehide", handler);
  window.addEventListener("beforeunload", handler);
};

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `anon-${Math.random().toString(36).slice(2)}${Date.now()}`;
};

const getAnonymousId = (): string => {
  if (typeof window === "undefined") return "anonymous";
  const stored = getSafeStorageItem(ANONYMOUS_ID_KEY);
  if (stored) return stored;
  const generated = generateId();
  setSafeStorageItem(ANONYMOUS_ID_KEY, generated);
  return generated;
};

const getSessionId = (): string => {
  if (typeof window === "undefined") return "session";
  const stored = getSessionStorageItem(SESSION_ID_KEY);
  if (stored) return stored;
  const generated = generateId();
  setSessionStorageItem(SESSION_ID_KEY, generated);
  return generated;
};

const buildDraftStorageKey = (formType: FormType, anonymousId: string, version: string) =>
  `draft:${formType}:${version}:${anonymousId}`;

const postJson = async (url: string, payload: unknown, keepalive = false) => {
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive,
  });
};

export const useFormTelemetry = <TDraft extends object>({
  formType,
  storageVersion = STORAGE_VERSION,
  initialDraft,
}: UseFormTelemetryOptions<TDraft>) => {
  const [draftData, setDraftData] = useState<TDraft | null>(initialDraft ?? null);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const anonymousId = useMemo(() => getAnonymousId(), []);
  const sessionId = useMemo(() => getSessionId(), []);
  const formInstanceId = useMemo(() => generateId(), []);

  const eventQueueRef = useRef<TelemetryEvent[]>([]);
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const draftTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const draftStorageKey = useMemo(
    () => buildDraftStorageKey(formType, anonymousId, storageVersion),
    [anonymousId, formType, storageVersion]
  );

  const enqueueEvent = useCallback(
    (event: Omit<TelemetryEvent, "anonymousId" | "sessionId" | "formInstanceId" | "formType">) => {
      eventQueueRef.current.push({
        anonymousId,
        sessionId,
        formInstanceId,
        formType,
        ...event,
        createdAt: new Date().toISOString(),
      });

      if (!flushTimeoutRef.current) {
        flushTimeoutRef.current = setTimeout(() => {
          flushTimeoutRef.current = null;
          const batch = [...eventQueueRef.current];
          eventQueueRef.current = [];
          if (batch.length === 0) return;
          postJson("/api/telemetry/events", { events: batch }).catch(() => undefined);
        }, 1200);
      }
    },
    [anonymousId, sessionId, formInstanceId, formType]
  );

  const flushEvents = useCallback(
    (useBeacon = false) => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
        flushTimeoutRef.current = null;
      }

      const batch = [...eventQueueRef.current];
      eventQueueRef.current = [];
      if (batch.length === 0) return;

      const payload = JSON.stringify({ events: batch });
      if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/telemetry/events", payload);
        return;
      }

      postJson("/api/telemetry/events", { events: batch }, useBeacon).catch(() => undefined);
    },
    []
  );

  const saveDraft = useCallback(
    (payload: DraftPayload<TDraft>) => {
      setDraftData(payload.draftData);
      setSafeStorageItem(
        draftStorageKey,
        JSON.stringify({ version: storageVersion, updatedAt: new Date().toISOString(), data: payload.draftData })
      );

      enqueueEvent({ eventType: "draft_saved", step: payload.stepReached ?? undefined });

      if (draftTimeoutRef.current) {
        clearTimeout(draftTimeoutRef.current);
      }

      draftTimeoutRef.current = setTimeout(() => {
        postJson("/api/telemetry/draft", payload).catch(() => undefined);
      }, 1500);
    },
    [draftStorageKey, enqueueEvent, storageVersion]
  );

  const clearDraft = useCallback(() => {
    setDraftData(null);
    try {
      window.localStorage.removeItem(draftStorageKey);
      storageCache.set(draftStorageKey, null);
    } catch {
      // Ignore
    }
  }, [draftStorageKey]);

  const trackEvent = useCallback(
    (eventType: TelemetryEventType, payload?: { fieldKey?: string; step?: string; metadata?: Record<string, unknown> }) => {
      enqueueEvent({
        eventType,
        fieldKey: payload?.fieldKey,
        step: payload?.step,
        metadata: payload?.metadata,
      });
    },
    [enqueueEvent]
  );

  const trackFieldChange = useCallback(
    (fieldKey: string, value: unknown, step?: string) => {
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        enqueueEvent({ eventType: "form_started", step });
      }
      enqueueEvent({ eventType: "field_changed", fieldKey, step, metadata: { value: String(value ?? "") } });
    },
    [enqueueEvent]
  );

  const trackValidationError = useCallback(
    (fieldKey: string, message: string, step?: string) => {
      enqueueEvent({ eventType: "validation_error", fieldKey, step, metadata: { message } });
    },
    [enqueueEvent]
  );

  const markSubmitted = useCallback(() => {
    hasSubmittedRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (draftLoaded) return;
    const cached = getSafeStorageItem(draftStorageKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { data?: TDraft };
        if (parsed?.data) {
          setDraftData(parsed.data);
        }
      } catch {
        // Ignore parse failures
      }
    }
    setDraftLoaded(true);
  }, [draftLoaded, draftStorageKey]);

  useEffect(() => {
    trackEvent("form_viewed");
  }, [trackEvent]);

  useEffect(() => {
    ensureVisibilityListeners();
    const handleVisibility = () => {
      const useBeacon = document.visibilityState === "hidden";
      if (!hasSubmittedRef.current && hasStartedRef.current) {
        enqueueEvent({ eventType: "form_abandoned" });
      }
      flushEvents(useBeacon);
    };

    visibilityHandlers.add(handleVisibility);
    return () => {
      visibilityHandlers.delete(handleVisibility);
    };
  }, [enqueueEvent, flushEvents]);

  return {
    anonymousId,
    sessionId,
    formInstanceId,
    draftData,
    draftLoaded,
    trackEvent,
    trackFieldChange,
    trackValidationError,
    saveDraft,
    clearDraft,
    markSubmitted,
  };
};
