import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon: string; // chemin vers l'icône
  align: 'left' | 'right';
}

const features: Feature[] = [
  {
    title: 'Épargne',
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    icon: '/suitcase-1.png',
    align: 'left',
  },
  {
    title: 'Pourquoi Sama Naffa ?',
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    icon: '/house-1.png',
    align: 'right',
  },
  {
    title: 'Les avantages',
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    icon: '/graph.png',
    align: 'left',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="w-full py-12 lg:py-16 px-4 lg:px-[133px] flex flex-col gap-12 border-t border-b border-gray-300/60 divide-y divide-gray-300/60">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row items-center gap-8 pt-12 md:pt-16 ${
            feature.align === 'right' ? 'md:flex-row-reverse' : ''
          }`}
        >
          {/* Icône */}
          <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
            <img
              src={feature.icon}
              alt={feature.title}
              className="object-contain w-full h-full"
            />
          </div>

          {/* Contenu */}
          <div className="flex-1 text-center md:text-left max-w-3xl">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#30461f] mb-4">
              {feature.title}
            </h3>
            <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}; 