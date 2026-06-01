'use client';

import { useRouter } from 'next/navigation';

type OtpDeliveryHelpProps = {
  onCreateAccount?: () => void;
};

/**
 * Production-safe help when OTP may not arrive — does not reveal whether the number is registered.
 */
export default function OtpDeliveryHelp({ onCreateAccount }: OtpDeliveryHelpProps) {
  const router = useRouter();

  const goToOnboarding = () => {
    if (onCreateAccount) {
      onCreateAccount();
      return;
    }
    router.push('/onboarding');
  };

  return (
    <div className="rounded-lg border border-timberwolf/25 bg-timberwolf/10 px-4 py-3 text-sm text-night/80">
      <p className="font-medium text-night">Vous ne recevez pas de code ?</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Utilisez le même numéro que lors de la création de votre compte</li>
        <li>Le SMS peut prendre jusqu&apos;à une minute</li>
        <li>
          Pas encore inscrit ?{' '}
          <button
            type="button"
            onClick={goToOnboarding}
            className="font-medium text-gold-metallic hover:text-gold-metallic/80 underline-offset-2 hover:underline"
          >
            Créer un Naffa
          </button>
        </li>
      </ul>
    </div>
  );
}
