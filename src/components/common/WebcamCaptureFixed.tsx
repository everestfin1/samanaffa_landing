'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  CameraIcon, 
  XMarkIcon, 
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface WebcamCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  facingMode?: 'user' | 'environment';
  title?: string;
}

export default function WebcamCapture({
  isOpen,
  onClose,
  onCapture,
  facingMode = 'user',
  title = 'Prendre une photo'
}: WebcamCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isInitializingRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Check if webcam is supported
  const isWebcamSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  // Cleanup function - centralized
  const cleanupStream = useCallback(() => {
    console.log('Cleaning up webcam stream...');
    const currentStream = streamRef.current;
    if (currentStream) {
      currentStream.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
  }, []);

  // Request webcam access with better error handling
  const requestWebcam = useCallback(async (forceNew = false) => {
    if (isInitializingRef.current && !forceNew) {
      console.log('Webcam already initializing, skipping...');
      return;
    }

    isInitializingRef.current = true;
    retryCountRef.current = 0;
    setError('');
    setHasPermission(null);

    try {
      // Check if we already have a stream
      if (streamRef.current && !forceNew) {
        console.log('Using existing stream...');
        setStream(streamRef.current);
        setHasPermission(true);
        isInitializingRef.current = false;
        return;
      }

      // Cleanup existing stream before requesting new one
      cleanupStream();

      if (!isWebcamSupported()) {
        throw new Error('Webcam not supported');
      }

      console.log('Requesting webcam access...');
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Store stream in ref and state
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermission(true);
      setError('');

        // Set up video element with proper error handling
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;

          // Handle video loading with proper error handling
          const handleLoadedMetadata = () => {
            console.log('Video metadata loaded:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);

            // Ensure video plays when metadata is loaded
            if (videoRef.current) {
              const playVideo = async (retries = 3) => {
                try {
                  await videoRef.current!.play();
                  console.log('Video started playing successfully');
                  setIsPlaying(true);
                } catch (playError) {
                  console.warn('Video play failed, retrying...', playError);
                  setIsPlaying(false);
                  if (retries > 0) {
                    setTimeout(() => playVideo(retries - 1), 100);
                  } else {
                    console.error('Video play failed after retries:', playError);
                    // Don't set error here, let the manual play overlay handle it
                  }
                }
              };
              playVideo();
            }
          };

          const handleCanPlay = () => {
            console.log('Video can play - ready to display');
            videoRef.current?.removeEventListener('canplay', handleCanPlay);
          };

          const handleError = (e: Event) => {
            console.error('Video element error:', e);
            videoRef.current?.removeEventListener('error', handleError);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current?.removeEventListener('canplay', handleCanPlay);
            setError('Erreur lors du chargement de la vidéo');
          };

          // Add event listeners with a small delay to ensure video element is ready
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
              videoRef.current.addEventListener('canplay', handleCanPlay);
              videoRef.current.addEventListener('error', handleError);
            }
          }, 50);
        }

    } catch (err) {
      console.error('Webcam access error:', err);
      setHasPermission(false);
      cleanupStream();

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Permission d\'accès à la webcam refusée. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
        } else if (err.name === 'NotFoundError') {
          setError('Aucune webcam trouvée sur votre appareil.');
        } else if (err.name === 'NotReadableError') {
          setError('La webcam est déjà utilisée par une autre application.');
          // Add retry logic for this specific case
          if (retryCountRef.current < maxRetries) {
            retryCountRef.current++;
            console.log(`Retrying webcam access (${retryCountRef.current}/${maxRetries})...`);
            setTimeout(() => requestWebcam(true), 1000);
            return;
          }
        } else {
          setError('Erreur lors de l\'accès à la webcam. Veuillez réessayer.');
        }
      } else {
        setError('Erreur inconnue lors de l\'accès à la webcam.');
      }

      // Auto-retry for general errors
      if (!error && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(() => requestWebcam(true), 2000);
      }
    } finally {
      isInitializingRef.current = false;
    }
  }, [cleanupStream, facingMode, isWebcamSupported]);

  // Capture photo with simplified logic
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) {
      console.error('Missing elements for capture');
      return;
    }

    setIsCapturing(true);
    setError('');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Erreur lors de la capture de l\'image');
      setIsCapturing(false);
      return;
    }

    // Ensure video is ready
    if (video.readyState < 2) {
      setTimeout(() => capturePhoto(), 100);
      return;
    }

    // Set canvas dimensions to match video
    const rect = video.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const timestamp = new Date().getTime();
          const filename = `photo-${timestamp}.jpg`;
          const file = new File([blob], filename, { type: 'image/jpeg' });

          const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImage(imageUrl);

          // Small delay before closing to show preview
          setTimeout(() => {
            onCapture(file);
            cleanupStream();
            onClose();
            setIsCapturing(false);
          }, 500);
        } else {
          setError('Erreur lors de la création du fichier image');
          setIsCapturing(false);
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error('Capture error:', err);
      setError('Erreur lors de la capture de l\'image');
      setIsCapturing(false);
    }
  }, [cleanupStream, onCapture, onClose]);

  // Initialize webcam when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset all states
      setHasPermission(null);
      setError('');
      setCapturedImage(null);
      setIsPlaying(false);
      retryCountRef.current = 0;

      // Small delay to ensure DOM is ready
      const initTimer = setTimeout(() => {
        requestWebcam();
      }, 100);

      return () => {
        clearTimeout(initTimer);
      };
    } else {
      // Clean up when modal closes
      cleanupStream();
      setError('');
      setHasPermission(null);
      setCapturedImage(null);
    }
  }, [isOpen, requestWebcam, cleanupStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  // Render state - useMemo to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    if (error && !hasPermission) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">Erreur d'accès à la webcam</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
              <button
                onClick={() => requestWebcam(true)}
                className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
              >
                <ArrowPathIcon className="w-3 h-3" />
                Réessayer
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (hasPermission === null) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-gold-metallic/30 border-t-gold-metallic rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-600">Initialisation de la webcam...</p>
        </div>
      );
    }

    if (hasPermission && streamRef.current && !capturedImage) {
      return (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onPlay={() => {
                console.log('Video started playing');
                setIsPlaying(true);
              }}
              onPause={() => {
                console.log('Video paused');
                setIsPlaying(false);
              }}
              className="w-full h-64 object-cover"
              style={{
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
              }}
            />

            {/* Manual play button overlay when video is not playing */}
            {!isPlaying && hasPermission && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 space-y-3 p-4">
                <div className="text-white text-center">
                  <p className="font-medium mb-1">Vidéo bloquée par le navigateur</p>
                  <p className="text-xs opacity-80">Cliquez pour démarrer</p>
                </div>
                <button
                  onClick={async () => {
                    console.log('Manual play button clicked, video readyState:', videoRef.current?.readyState);
                    console.log('Video paused:', videoRef.current?.paused);
                    console.log('Stream active:', streamRef.current?.active);

                    if (videoRef.current && streamRef.current) {
                      try {
                        // Ensure video element is properly configured
                        videoRef.current.srcObject = streamRef.current;
                        videoRef.current.muted = true;
                        videoRef.current.playsInline = true;

                        const playPromise = videoRef.current.play();
                        if (playPromise !== undefined) {
                          await playPromise;
                          console.log('Manual play successful');
                          setIsPlaying(true);
                          setError('');
                        }
                      } catch (err) {
                        console.error('Manual play failed:', err);
                        // Try requesting new stream as fallback
                        console.log('Attempting stream reconnection...');
                        setTimeout(() => requestWebcam(true), 500);
                      }
                    } else {
                      console.log('Video element or stream not available, requesting new stream');
                      requestWebcam(true);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Démarrer la vidéo
                </button>
              </div>
            )}

            {/* Overlay guidelines for selfies */}
            {facingMode === 'user' && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-56 border-2 border-white/50 rounded-full"></div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                    Centrez votre visage dans le cercle
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={capturePhoto}
              disabled={isCapturing}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 ${
                isCapturing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gold-metallic hover:bg-gold-metallic/90 hover:shadow-xl'
              }`}
            >
              {isCapturing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Capture...</span>
                </>
              ) : (
                <>
                  <CameraIcon className="w-5 h-5" />
                  <span>Prendre la photo</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 font-medium mb-1">Conseils :</p>
            <ul className="text-xs text-blue-700 space-y-0.5">
              {facingMode === 'user' ? (
                <>
                  <li>• Éclairage naturel de face</li>
                  <li>• Regardez directement la caméra</li>
                  <li>• Évitez les lunettes de soleil</li>
                </>
              ) : (
                <>
                  <li>• Document bien éclairé et net</li>
                  <li>• Cadrez entièrement le document</li>
                  <li>• Évitez les reflets</li>
                </>
              )}
            </ul>
          </div>
        </div>
      );
    }

    if (capturedImage) {
      return (
        <div className="text-center space-y-4">
          <div className="relative">
            <img
              src={capturedImage}
              alt="Photo capturée"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
              <CheckIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckIcon className="w-5 h-5" />
            <span className="font-medium">Photo capturée avec succès !</span>
          </div>
        </div>
      );
    }

    return null;
  }, [error, hasPermission, capturedImage, isCapturing, facingMode, capturePhoto, requestWebcam, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-night">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic content based on state */}
        {renderContent}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
