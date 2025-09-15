"use client";

import { useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/common/Button";
import { faqItems, faqCategories, getFAQByCategory, searchFAQ } from "../../content/faq";
import { ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getFilteredFAQ = () => {
    let filtered = faqItems;

    if (selectedCategory !== 'all') {
      filtered = getFAQByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = searchFAQ(searchQuery);
    }

    return filtered;
  };

  const filteredFAQ = getFilteredFAQ();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Link>
              
              <h1 className="text-5xl font-bold text-card-foreground mb-6">
                Questions fréquentes
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Trouvez rapidement les réponses à vos questions sur Sama Naffa, 
                l&apos;épargne personnalisée et l&apos;Actionnariat Populaire Economique
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher une question..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                Toutes les questions
              </button>
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Items */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredFAQ.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  Aucune question trouvée
                </h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier votre recherche ou de changer de catégorie
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  variant="outline"
                >
                  Réinitialiser la recherche
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQ.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-2xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-muted transition-colors duration-300"
                    >
                      <span className="text-lg font-semibold text-card-foreground pr-4">
                        {item.question}
                      </span>
                      {expandedItems.has(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedItems.has(item.id) && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-border pt-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-card-foreground mb-6">
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Notre équipe d&apos;assistance est là pour vous aider 7j/7
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-muted rounded-2xl p-6">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-background text-xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  WhatsApp
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Réponse immédiate
                </p>
                <a
                  href="https://wa.me/221XXXXXXXXX"
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                >
                  +221 XX XX XX XX XX
                </a>
              </div>

              <div className="bg-muted rounded-2xl p-6">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-background text-xl">📧</span>
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Email
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Réponse sous 24h
                </p>
                <a
                  href="mailto:support@sama-naffa.sn"
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                >
                  support@sama-naffa.sn
                </a>
              </div>

              <div className="bg-muted rounded-2xl p-6">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-background text-xl">📞</span>
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Téléphone
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Lun-Ven 8h-18h
                </p>
                <a
                  href="tel:+221XXXXXXXXX"
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                >
                  +221 XX XX XX XX XX
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/assistance" size="lg">
                Page d&apos;assistance
              </Button>
              <Button href="/" variant="outline" size="lg">
                Retour à l&apos;accueil
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
