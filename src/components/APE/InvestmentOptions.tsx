import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Counter } from '../../../components/ui/counter';

interface Tranche {
  id: string;
  duration: string;
  rate: number;
  amount: string;
  nominalValue: string;
  additionalInfo: {
    maturite: string;
    differe: string;
    duration: string;
    remboursement: string;
  };
}

interface InvestmentOptionsProps {
  tranches: Tranche[];
  scrollToFormWithTranche: (trancheId: string) => void;
}

export const InvestmentOptions = ({ tranches, scrollToFormWithTranche }: InvestmentOptionsProps) => {
  return (
    <section id="investment-options" className="w-full bg-[#1f201f] py-12 lg:py-20">
      <div className="container mx-auto px-16 lg:px-[180px]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl lg:text-4xl font-semibold mb-4 lg:mb-6 animate-fade-in-up">
            <span className="text-white">Portons </span>
            <span className="text-[#b3830f]">collectivement</span>
            <span className="text-white">
              {" "}
              cette ambition… <br />
              en passant à l&apos;action !
            </span>
          </h2>

          <p className="text-white text-lg lg:text-xl mb-8 lg:mb-12 animate-fade-in-up animation-delay-200">
            Chaque souscription compte. Chaque geste nous rapproche de notre
            objectif.
          </p>
        </div>

        {/* Responsive Grid for Investment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {tranches.map((tranche, index) => (
            <Card 
              key={tranche.id} 
              className="w-full bg-white rounded-2xl hover:shadow-xl transition-shadow duration-300 animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${400 + index * 200}ms` }}
            >
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="font-bold text-xl text-[#30461f] text-center mb-4">
                    Tranche {tranche.id}
                  </h3>

                  <div className="text-center mb-6">
                    <div className="font-bold text-[#30461f] text-5xl leading-none">
                      {tranche.duration}
                    </div>
                    <Counter
                      targetValue={tranche.rate}
                      duration={2500}
                      decimals={2}
                      suffix="%"
                      delay={600 + index * 300}
                      className="font-bold text-[#b3830f] text-6xl leading-none"
                    />
                  </div>

                  <div className="space-y-3 text-base mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant</span>
                      <span className="font-bold text-black">{tranche.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valeur nominale</span>
                      <span className="font-bold text-black">{tranche.nominalValue}</span>
                    </div>
                  </div>
                  
                  <hr className="my-4" />

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">Maturité:</span>
                      <span className="font-medium text-gray-700">{tranche.additionalInfo.maturite}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">Différé:</span>
                      <span className="font-medium text-gray-700">{tranche.additionalInfo.differe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">Duration:</span>
                      <span className="font-medium text-gray-700">{tranche.additionalInfo.duration}</span>
                    </div>
                    <div className="flex justify-between text-left">
                      <span className="font-bold text-gray-700">Remboursement:</span>
                      <span className="font-medium text-gray-700">{tranche.additionalInfo.remboursement}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => scrollToFormWithTranche(tranche.id)}
                  className="w-full mt-6 h-12 cta-card rounded-lg font-bold text-white text-base"
                >
                  Je souscris
                  <img
                    className="ml-2 w-5 h-2.5 arrow-bounce"
                    alt="Vector"
                    src="vector-1.svg"
                  />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 