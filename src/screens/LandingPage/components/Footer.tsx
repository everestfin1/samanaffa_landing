import React, { useState } from 'react';
import { TermsModal } from './TermsModal';

export const Footer: React.FC = () => {
    const [showTerms, setShowTerms] = useState(false);

    return (
        <>
            <footer className="w-full h-auto py-4 lg:py-6 bg-[#f7f6f6] flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 px-4 text-center text-sm lg:text-base">
                <span className="text-black">© 2025 Sama Naffa. Tous droits réservés.</span>
                <button
                    className="text-[#30461f] underline hover:text-[#C38D1C]"
                    onClick={() => setShowTerms(true)}
                >
                    Conditions générales d'utilisation
                </button>
            </footer>

            <TermsModal show={showTerms} onClose={() => setShowTerms(false)} />
        </>
    );
} 