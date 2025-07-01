import React from 'react';

interface TermsModalProps {
  show: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white max-w-3xl w-full rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-[#30461f]">Conditions Générales d'Utilisation</h3>
          <button
            aria-label="Fermer"
            onClick={onClose}
            className="text-2xl leading-none text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-800">
          <p>
            Les présentes Conditions Générales d'Utilisation ("CGU") régissent l'accès et l'utilisation de l'application
            et du site web <strong>Sama Naffa</strong> ("nous", "notre", "nos"). En utilisant nos services, vous acceptez
            sans réserve ces CGU.
          </p>

          <h4 className="font-semibold text-[#30461f]">1. Objet du service</h4>
          <p>
            Sama Naffa est une plateforme d'épargne digitale vous permettant de définir des objectifs, de programmer des
            versements et de suivre la progression de votre capital. Les performances passées ne préjugent pas des
            performances futures.
          </p>

          <h4 className="font-semibold text-[#30461f]">2. Ouverture de compte</h4>
          <p>
            Vous devez fournir des informations exactes et à jour. Toute fausse déclaration peut entraîner la clôture du
            compte.
          </p>

          <h4 className="font-semibold text-[#30461f]">3. Sécurité des fonds</h4>
          <p>
            Les montants épargnés sont détenus auprès d'institutions financières partenaires régulées. Nous appliquons
            des standards de sécurité stricts pour protéger vos transactions.
          </p>

          <h4 className="font-semibold text-[#30461f]">4. Données personnelles</h4>
          <p>
            Conformément à la loi n°2008-12 sur la protection des données à caractère personnel au Sénégal, Sama Naffa a
            déclaré son fichier clients auprès de la <strong>Commission de Protection des Données Personnelles (CDP)</strong>.
            Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
          </p>

          <h4 className="font-semibold text-[#30461f]">5. Responsabilité</h4>
          <p>
            Nous nous efforçons de fournir un service disponible et sécurisé. Toutefois, notre responsabilité ne saurait
            être engagée en cas de force majeure ou de défaillance d'un partenaire financier.
          </p>

          <h4 className="font-semibold text-[#30461f]">6. Modification des CGU</h4>
          <p>
            Nous pouvons modifier les présentes CGU pour refléter l'évolution de nos services ou de la réglementation.
            Les utilisateurs seront informés par tout moyen approprié.
          </p>

          <h4 className="font-semibold text-[#30461f]">7. Contact</h4>
          <p>
            Pour toute question, contactez-nous à <a href="mailto:contact@samanaffa.com" className="text-[#C38D1C] underline">contact@samanaffa.com</a> ou via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}; 