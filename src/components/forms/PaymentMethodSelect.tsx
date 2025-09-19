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
  const getOptions = () => {
    switch (type) {
      case 'deposit':
        return [
          { 
            value: 'orange-money', 
            label: 'Orange Money',
            logo: '/Orange-Money-logo.png',
            alt: 'Orange Money Logo'
          },
          { 
            value: 'wave', 
            label: 'Wave',
            logo: '/wave-money-logo.png',
            alt: 'Wave Money Logo'
          },
          { 
            value: 'card', 
            label: 'Carte bancaire',
            logo: null,
            alt: null
          }
        ];
      case 'withdraw':
        return [
          { 
            value: 'orange-money', 
            label: 'Orange Money',
            logo: '/Orange-Money-logo.png',
            alt: 'Orange Money Logo'
          },
          { 
            value: 'wave', 
            label: 'Wave',
            logo: '/wave-money-logo.png',
            alt: 'Wave Money Logo'
          }
        ];
      case 'payment':
        return [
          { 
            value: 'orange-money', 
            label: 'Orange Money',
            logo: '/Orange-Money-logo.png',
            alt: 'Orange Money Logo'
          },
          { 
            value: 'wave', 
            label: 'Wave',
            logo: '/wave-money-logo.png',
            alt: 'Wave Money Logo'
          },
          { 
            value: 'card', 
            label: 'Carte bancaire',
            logo: null,
            alt: null
          }
        ];
      default:
        return [];
    }
  };

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
      <div className="grid grid-cols-2 gap-3">
        {getOptions().map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-4 border-2 rounded-lg transition-all text-left ${
              value === option.value
                ? 'border-gold-metallic bg-gold-light/20 text-gold-dark'
                : 'border-timberwolf/30 hover:border-gold-metallic/40 hover:bg-gold-metallic/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              {option.logo ? (
                <div className="flex-shrink-0">
                  <Image
                    src={option.logo}
                    alt={option.alt || option.label}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-xs font-bold">💳</span>
                </div>
              )}
              <div>
                <div className="font-semibold text-sm">{option.label}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
