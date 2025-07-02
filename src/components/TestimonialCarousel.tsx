import React, { useState, useEffect } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Sama Naffa a complètement transformé ma façon d'épargner. L'interface est intuitive et les objectifs sont clairs. J'ai réussi à économiser pour ma maison en seulement 2 ans !",
    name: "Rabyatou",
    role: "Digital Marketing Specialist",
    avatar: "/rectangle-13-1.png",
    rating: 5,
  },
  {
    id: 2,
    text: "Une application révolutionnaire ! Le système de suivi des objectifs m'a motivé à épargner régulièrement. Je recommande vivement Sama Naffa à tous mes amis.",
    name: "Bilal",
    role: "Product Designer",
    avatar: "/rectangle-13-1-1.png",
    rating: 5,
  },
  {
    id: 3,
    text: "Grâce à Sama Naffa, j'ai pu financer mes études supérieures sans stress. L'application rend l'épargne ludique et accessible à tous.",
    name: "Aminata",
    role: "Étudiante en Finance",
    avatar: "/rectangle-13-1.png",
    rating: 5,
  },
];

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <img
        key={i}
        className={`w-4 h-4 ${i < rating ? 'opacity-100' : 'opacity-30'}`}
        alt="Star"
        src="/vuesax-linear-star.svg"
      />
    ));
  };

  return (
    <section className="w-full px-4 lg:px-[135px] py-12 lg:py-[120px] bg-[#30461f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute w-[200px] h-[200px] top-[226px] right-[350px] bg-secondary-shades80 rounded-[100px] blur-[100px] opacity-60 hidden lg:block" />
      <div className="absolute w-[150px] h-[150px] top-[100px] left-[200px] bg-[#b3830f] rounded-[75px] blur-[80px] opacity-20 hidden lg:block" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-[72px] relative z-10">
        {/* Left side - Content */}
        <div className="flex-1 text-left">
          <div className="mb-6 lg:mb-10">
            <div className="font-semibold text-[#b3830f] text-sm lg:text-base mb-1 animate-fade-in">
              TÉMOIGNAGES
            </div>
            <h2 className="font-bold text-white text-2xl lg:text-[38px] leading-tight lg:leading-[45.6px] max-w-full lg:w-[420px] mb-3 animate-fade-in">
              Nous avons établi une relation de confiance avec les avis de
              vrais utilisateurs
            </h2>
            <p className="text-white text-sm lg:text-base leading-relaxed max-w-full lg:w-[461px] opacity-90 animate-fade-in">
              Renforcez votre crédibilité en présentant de véritables
              témoignages d'utilisateurs réels, mettant en valeur leurs
              expériences positives et leur satisfaction avec les services
              de Sama Naffa.
            </p>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <Button
              onClick={goToPrevious}
              variant="outline"
              size="icon"
              className="rounded-full border-[#cfd0d1] border-2 bg-transparent hover:bg-white/10 p-3 lg:p-4 transition-all duration-300 hover:scale-110"
            >
              <ChevronRightIcon className="rotate-180 h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </Button>
            <Button
              onClick={goToNext}
              variant="default"
              size="icon"
              className="rounded-full bg-white hover:bg-gray-100 p-3 lg:p-4 transition-all duration-300 hover:scale-110 animate-pulse-glow"
            >
              <ChevronRightIcon className="h-5 w-5 lg:h-6 lg:w-6 text-black" />
            </Button>
            
            {/* Progress indicators */}
            <div className="flex gap-2 ml-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-[#b3830f] w-6' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Testimonials carousel */}
        <div className="flex-1 relative">
          <div className="w-full max-w-[400px] h-[280px] lg:h-[300px] relative overflow-hidden mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={`absolute top-0 left-0 w-full bg-white rounded-2xl shadow-xl transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? 'opacity-100 scale-100 translate-x-0' 
                    : index < currentIndex
                    ? 'opacity-0 scale-95 -translate-x-full'
                    : 'opacity-0 scale-95 translate-x-full'
                } hover:shadow-2xl`}
              >
                <CardContent className="p-4 lg:p-6 pt-6 lg:pt-8">
                  <div className="mb-6 lg:mb-8">
                    {/* Rating stars */}
                    <div className="flex mb-3 lg:mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    {/* Testimonial text */}
                    <p className="text-general-colorsparagraph text-sm lg:text-base leading-relaxed min-h-[100px] lg:min-h-[120px]">
                      "{testimonial.text}"
                    </p>
                  </div>

                  {/* User info */}
                  <div className="flex items-center gap-[9px]">
                    <Avatar className="w-[44px] h-[44px] lg:w-[52px] lg:h-[52px] rounded-full bg-[#f7f0fc] ring-2 ring-[#30461f]/20">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-[#30461f] text-white font-semibold text-sm lg:text-base">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-general-colorsdark text-base lg:text-lg leading-tight">
                        {testimonial.name}
                      </div>
                      <div className="text-general-colorsparagraph text-sm lg:text-base leading-relaxed">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && (
        <div className="absolute bottom-4 lg:bottom-8 right-4 lg:right-8 flex items-center gap-2 text-white/60 text-xs lg:text-sm">
          <div className="w-2 h-2 bg-[#b3830f] rounded-full animate-pulse"></div>
          <span className="hidden lg:inline">Lecture automatique</span>
        </div>
      )}
    </section>
  );
};