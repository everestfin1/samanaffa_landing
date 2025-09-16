'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import LandingTab from '../components/LandingTab';
import SamaNaffaTab from '../components/SamaNaffaTab';
import APETab from '../components/APETab';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'sama-naffa' | 'ape'>('home');

  const handleTabChange = (tab: 'home' | 'sama-naffa' | 'ape') => {
    setActiveTab(tab);
    // Smooth scroll to top when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'sama-naffa':
        return <SamaNaffaTab />;
      case 'ape':
        return <APETab />;
      default:
        return <LandingTab onNavigateToTab={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-white-smoke">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        isAuthenticated={false}
      />
      {renderActiveTab()}
    </div>
  );
}