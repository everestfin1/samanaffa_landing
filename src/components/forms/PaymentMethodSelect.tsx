import Image from 'next/image';

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
  type: 'deposit' | 'withdraw' | 'payment';
  className?: string;
  showOptions?: boolean;
}

export default function PaymentMethodSelect({ 
  value, 
  onChange, 
  type, 
  className = "",
  showOptions = true
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

  const paymentMethods = [
    {
      id: 'intouch',
      name: 'Intouch',
      description: 'Paiement sécurisé via Intouch',
      logo: '/intouch_logo.png',
      color: 'border-gold-metallic bg-gold-light/20 text-gold-dark'
    }
  ];

  if (!showOptions) {
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

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-night mb-3">
        {getLabel()}
      </label>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onChange(method.id)}
            className={`w-full p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              value === method.id
                ? `${method.color} border-2`
                : 'border-timberwolf/30 hover:border-gold-metallic/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src={method.logo}
                  alt={`${method.name} Logo`}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-night">{method.name}</div>
                <div className="text-sm text-night/70">{method.description}</div>
              </div>
              <div className="flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  value === method.id
                    ? 'bg-gold-metallic border-gold-metallic'
                    : 'border-timberwolf/30'
                }`}>
                  {value === method.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
