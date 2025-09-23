import Image from 'next/image';

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
  type: 'deposit' | 'withdraw' | 'payment';
  className?: string;
}

export default function PaymentMethodSelect({ 
  value, 
  onChange, 
  type, 
  className = "" 
}: PaymentMethodSelectProps) {
  const getLabel = () => {
    switch (type) {
      case 'deposit':
        return 'Méthode de dépôt';
      case 'withdraw':
        return 'Méthode de retrait';
      case 'payment':
        return 'Méthode de paiement';
      default:
        return 'Méthode de paiement';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-night mb-3">
        {getLabel()}
      </label>
      <div className="w-full">
        <div className="w-full p-6 border-2 border-gold-metallic bg-gold-light/20 text-gold-dark rounded-lg">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex-shrink-0">
              <Image
                src="/intouch_logo.png"
                alt="Intouch Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">Continuer avec Intouch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
