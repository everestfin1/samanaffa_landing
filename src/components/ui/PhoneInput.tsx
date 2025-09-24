'use client';

import React, { useState } from 'react';
import PhoneInput2 from 'react-phone-number-input';
import { isValidPhoneNumber, isPossiblePhoneNumber } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  showValidationMessage?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  onValidationChange,
  error,
  placeholder = "Numéro de téléphone",
  className,
  disabled = false,
  required = false,
  label,
  showValidationMessage = true,
}: PhoneInputProps) {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [hasBlurred, setHasBlurred] = useState(false);

  // Use useRef to avoid infinite loops with onValidationChange
  const onValidationChangeRef = React.useRef(onValidationChange);
  onValidationChangeRef.current = onValidationChange;

  // Validation function using libphonenumber-js
  const validatePhoneNumber = React.useCallback((phone: string | undefined, showRequiredError: boolean = false) => {
    let valid = true;
    let message = '';

    // If no phone number and required error should be shown
    if (!phone || phone.trim() === '') {
      if (required && showRequiredError) {
        valid = false;
        message = 'Numéro de téléphone est requis';
      }
    } else {
      // First validate if it's a possible phone number (basic format)
      if (!isPossiblePhoneNumber(phone)) {
        valid = false;
        message = 'Numéro de téléphone trop court ou trop long';
      } else if (!isValidPhoneNumber(phone)) {
        // Then validate if it's a valid phone number
        valid = false;
        message = 'Numéro de téléphone invalide pour ce pays';
      }
    }

    setIsValid(valid);
    setValidationMessage(message);
    
    // Notify parent component about validation change using ref to avoid dependency loop
    onValidationChangeRef.current?.(valid, message);
    
    return valid;
  }, [required]); // Removed onValidationChange from dependencies

  // Initialize validation state based on initial value
  React.useEffect(() => {
    if (value) {
      validatePhoneNumber(value, false);
    }
  }, [value, validatePhoneNumber]);

  const handleChange = (phone: string | undefined) => {
    onChange(phone);
    // Only show required error during change if field has been blurred before
    validatePhoneNumber(phone, hasBlurred);
  };

  const handleBlur = () => {
    setHasBlurred(true);
    // On blur, validate the phone number but don't show required error if it already has a value
    // This prevents showing "required" error when the user has already entered a valid number
    if (value && value.trim() !== '') {
      validatePhoneNumber(value, false); // Don't show required error if we have a value
    } else {
      validatePhoneNumber(value, true); // Show required error only if no value
    }
    onBlur?.();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-night">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <PhoneInput2
          international
          defaultCountry="SN"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'phone-input-wrapper',
            error || !isValid ? 'error' : '',
            className
          )}
          style={{
            '--PhoneInput-color--focus': '#D4AF37',
            '--PhoneInputCountryFlag-borderColor': 'rgba(0, 0, 0, 0.1)',
            '--PhoneInputCountrySelectArrow-color': '#666',
          } as React.CSSProperties}
        />
      </div>

      {/* Validation Messages */}
      {showValidationMessage && (
        <>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
          {!error && !isValid && validationMessage && (
            <p className="text-red-500 text-sm mt-1">{validationMessage}</p>
          )}
          {isValid && value && !error && (
            <p className="text-green-600 text-sm mt-1">✓ Numéro de téléphone valide</p>
          )}
        </>
      )}

      {/* Helper text */}
      <p className="text-xs text-night/60 mt-1">
        Choisissez votre pays et saisissez votre numéro local
      </p>

      <style jsx>{`
        .phone-input-wrapper :global(.PhoneInputInput) {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(156, 163, 175, 0.3);
          border-radius: 12px;
          background: white;
          font-size: 16px;
          transition: all 0.2s;
        }

        .phone-input-wrapper :global(.PhoneInputInput:focus) {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .phone-input-wrapper :global(.PhoneInputCountrySelect) {
          border: 1px solid rgba(156, 163, 175, 0.3);
          border-radius: 12px 0 0 12px;
          border-right: none;
          background: white;
          padding: 12px 8px;
        }

        .phone-input-wrapper :global(.PhoneInputCountrySelect:focus) {
          border-color: #D4AF37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .phone-input-wrapper.error :global(.PhoneInputInput) {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        .phone-input-wrapper.error :global(.PhoneInputCountrySelect) {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        .phone-input-wrapper :global(.PhoneInputCountrySelectArrow) {
          color: #666;
          opacity: 0.8;
        }

        .phone-input-wrapper :global(.PhoneInputCountryFlag) {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
}
