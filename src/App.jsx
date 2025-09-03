import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import HeroCover from './components/HeroCover';
import Dashboard from './components/Dashboard';
import MainContent from './components/MainContent';

function App() {
  const [currentSection, setCurrentSection] = useState('Dashboard');
  const [utmLinks, setUtmLinks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Team update: New UTM template for Black Friday added.', time: '2h ago' },
    { id: 2, message: 'Analytics refreshed for Q3 campaigns.', time: '6h ago' },
  ]);

  useEffect(() => {
    try {
      const savedLinks = JSON.parse(localStorage.getItem('utmLinks') || '[]');
      const savedTemplates = JSON.parse(localStorage.getItem('utmTemplates') || '[]');
      setUtmLinks(savedLinks);
      setTemplates(savedTemplates);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('utmLinks', JSON.stringify(utmLinks));
  }, [utmLinks]);

  useEffect(() => {
    localStorage.setItem('utmTemplates', JSON.stringify(templates));
  }, [templates]);

  const stats = useMemo(() => {
    const totalClicks = utmLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);
    const topCampaign = utmLinks
      .slice()
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]?.campaign;
    const uniqueCampaigns = new Set(utmLinks.map((l) => l.campaign)).size;
    return { totalClicks, topCampaign: topCampaign || '—', uniqueCampaigns };
  }, [utmLinks]);

  const addUTMLink = (link) => {
    setUtmLinks((prev) => [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), clicks: Math.floor(Math.random() * 5000), ...link }, ...prev]);
    setNotifications((prev) => [
      { id: crypto.randomUUID(), message: `Created UTM for campaign “${link.campaign}”.`, time: 'just now' },
      ...prev,
    ]);
  };

  const saveTemplate = (template) => {
    const exists = templates.find((t) => t.name.toLowerCase() === template.name.toLowerCase());
    if (exists) {
      setTemplates((prev) => prev.map((t) => (t.name === template.name ? { ...t, ...template } : t)));
    } else {
      setTemplates((prev) => [{ id: crypto.randomUUID(), ...template }, ...prev]);
    }
  };

  const applyTemplate = (name) => templates.find((t) => t.name === name);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex">
      <Sidebar current={currentSection} onNavigate={setCurrentSection} />

      <main className="flex-1 flex flex-col">
        {currentSection === 'Dashboard' && <HeroCover />}

        {currentSection === 'Dashboard' ? (
          <Dashboard
            stats={stats}
            notifications={notifications}
            utmLinks={utmLinks}
            onQuickCreate={(link) => {
              addUTMLink(link);
            }}
            onGoToBuilder={() => setCurrentSection('UTM Builder')}
          />
        ) : (
          <MainContent
            section={currentSection}
            utmLinks={utmLinks}
            onAddLink={addUTMLink}
            templates={templates}
            onSaveTemplate={saveTemplate}
            onApplyTemplate={applyTemplate}
          />
        )}
      </main>
    </div>
  );
}

export default App;
