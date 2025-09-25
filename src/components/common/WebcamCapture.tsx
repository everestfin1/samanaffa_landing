'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if webcam is supported
  const isWebcamSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  // Request webcam access
  const requestWebcam = useCallback(async () => {
    if (!isWebcamSupported()) {
      setError('Votre navigateur ne supporte pas l\'accès à la webcam');
      setHasPermission(false);
      return;
    }

    try {
      setError('');

      // More flexible constraints for better compatibility across devices
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);

      // Use a small delay to ensure video element is stable
      setTimeout(() => {
        if (videoRef.current && videoRef.current.srcObject !== mediaStream) {
          videoRef.current.srcObject = mediaStream;

          // Handle play promise properly with retry mechanism
          const playVideo = async (retries = 3) => {
            try {
              if (videoRef.current) {
                await videoRef.current.play();
              }
            } catch (playError) {
              console.warn('Video play failed, retrying...', playError);

              if (retries > 0) {
                // Wait a bit and retry
                setTimeout(() => playVideo(retries - 1), 100);
              } else {
                console.error('Video play failed after retries:', playError);
                // Don't treat this as a fatal error, the video might still work
              }
            }
          };

          playVideo();
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setHasPermission(false);

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Permission d\'accès à la webcam refusée. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
        } else if (err.name === 'NotFoundError') {
          setError('Aucune webcam trouvée sur votre appareil.');
        } else if (err.name === 'NotReadableError') {
          setError('La webcam est déjà utilisée par une autre application.');
        } else {
          setError('Erreur lors de l\'accès à la webcam. Veuillez réessayer.');
        }
      } else {
        setError('Erreur inconnue lors de l\'accès à la webcam.');
      }
    }
  }, [facingMode, isWebcamSupported]);

  // Stop webcam stream
  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }

    // Clear video element srcObject to prevent memory leaks
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Reset video element
    }

    setCapturedImage(null);
  }, [stream]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Erreur lors de la capture de l\'image');
      setIsCapturing(false);
      return;
    }

    // Wait for video to be ready and stable
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      setTimeout(() => {
        capturePhoto();
      }, 100);
      return;
    }

    // Set canvas dimensions to match video display dimensions
    const rect = video.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame to canvas with better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob and then to file with better quality
      canvas.toBlob((blob) => {
        if (blob) {
          const timestamp = new Date().getTime();
          const filename = `photo-${timestamp}.jpg`;
          const file = new File([blob], filename, { type: 'image/jpeg' });

          // Create preview URL with better quality
          const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImage(imageUrl);

          // Call parent callback after a brief delay to show preview
          setTimeout(() => {
            onCapture(file);
            stopWebcam();
            onClose();
            setIsCapturing(false);
          }, 800);
        } else {
          setError('Erreur lors de la création du fichier image');
          setIsCapturing(false);
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error('Error capturing image:', err);
      setError('Erreur lors de la capture de l\'image');
      setIsCapturing(false);
    }
  }, [onCapture, onClose, stopWebcam]);

  // Initialize webcam when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset all states first
      setHasPermission(null);
      setError('');
      setCapturedImage(null);

      // Small delay to ensure DOM is stable before requesting webcam
      const initTimer = setTimeout(() => {
        requestWebcam();
      }, 50);

      return () => {
        clearTimeout(initTimer);
        stopWebcam();
      };
    } else {
      // Clean up when modal closes
      stopWebcam();
      setError('');
      setHasPermission(null);
      setCapturedImage(null);
    }
  }, [isOpen, requestWebcam, stopWebcam]);

  // Cleanup on unmount
  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      console.log('WebcamCapture component unmounting, cleaning up...');
      stopWebcam();

      // Additional cleanup to ensure video element is properly disposed
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [stopWebcam]);

  // Additional safety cleanup when modal closes
  useEffect(() => {
    if (!isOpen && stream) {
      console.log('Modal closed, cleaning up webcam...');
      const cleanupTimer = setTimeout(() => {
        stopWebcam();
      }, 100);

      return () => clearTimeout(cleanupTimer);
    }
  }, [isOpen, stream, stopWebcam]);

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

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 font-medium">Erreur d'accès à la webcam</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
                <button
                  onClick={requestWebcam}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                >
                  <ArrowPathIcon className="w-3 h-3" />
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {hasPermission === null && !error && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-gold-metallic/30 border-t-gold-metallic rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-600">Initialisation de la webcam...</p>
          </div>
        )}

        {/* Webcam View */}
        {hasPermission && stream && !capturedImage && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                key={`webcam-${stream.id}`} // Force re-render when stream changes
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover block"
                style={{
                  backgroundColor: 'black',
                  transform: 'scaleX(-1)', // Mirror selfie camera
                  filter: 'none',
                  display: 'block'
                }}
                onLoadedMetadata={(e) => {
                  // Ensure video dimensions are set correctly and prevent interruptions
                  const video = e.currentTarget;
                  video.style.width = '100%';
                  video.style.height = 'auto';

                  // Additional check to ensure video is still in DOM
                  if (document.contains(video)) {
                    console.log('Video loaded successfully:', video.videoWidth, 'x', video.videoHeight);
                  }
                }}
                onCanPlay={() => {
                  // Video is ready to play
                  console.log('Video can play');
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                  setError('Erreur lors du chargement de la vidéo');
                }}
              />

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

              {/* Loading indicator while video initializes */}
              {hasPermission === true && videoRef.current && videoRef.current.readyState < 2 && (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2 mx-auto"></div>
                    <p className="text-xs">Chargement de la caméra...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Capture Button */}
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

            {/* Tips */}
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
        )}

        {/* Captured Image Preview */}
        {capturedImage && (
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
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
