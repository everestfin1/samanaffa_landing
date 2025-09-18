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
          { value: 'orange-money', label: 'Orange Money' },
          { value: 'wave', label: 'Wave' },
          { value: 'card', label: 'Carte bancaire' }
        ];
      case 'withdraw':
        return [
          { value: 'orange-money', label: 'Orange Money' },
          { value: 'wave', label: 'Wave' }
        ];
      case 'payment':
        return [
          { value: 'orange-money', label: 'Orange Money' },
          { value: 'wave', label: 'Wave' },
          { value: 'card', label: 'Carte bancaire' }
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
    <div>
      <label className="block text-sm font-medium text-night mb-2">
        {getLabel()}
      </label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent ${className}`}
      >
        {getOptions().map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
