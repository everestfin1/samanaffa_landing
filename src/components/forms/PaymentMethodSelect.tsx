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
  const handleIntouchClick = () => {
    // WhatsApp redirect for payment processing
    const message = encodeURIComponent(
      `Bonjour, je souhaite effectuer un ${type === 'deposit' ? 'dépôt' : type === 'withdraw' ? 'retrait' : 'paiement'} via Intouch. Pouvez-vous m'aider avec le traitement du paiement ?`
    );
    const whatsappUrl = `https://wa.me/221771234567?text=${message}`;
    window.open(whatsappUrl, '_blank');
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
      <div className="w-full">
        <button
          type="button"
          onClick={handleIntouchClick}
          className="w-full p-6 border-2 border-gold-metallic bg-gold-light/20 text-gold-dark rounded-lg transition-all hover:bg-gold-metallic hover:text-white hover:border-gold-dark"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gold-metallic rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">I</span>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">Continuer avec Intouch</div>
              <div className="text-sm opacity-80">Paiement sécurisé via WhatsApp</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
