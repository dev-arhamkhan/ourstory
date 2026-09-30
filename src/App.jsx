import React, { useState, useEffect } from 'react';
import HomeCreatePage from './pages/HomeCreatePage';
import TimelinePage from './pages/TimelinePage';
import RecapPage from './pages/RecapPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleSpaceCreated = (spaceId) => {
    navigateTo(`/space/${spaceId}`);
  };

  const handleNavigateRecap = (spaceId) => {
    navigateTo(`/space/${spaceId}/recap`);
  };

  const handleNavigateTimeline = (spaceId) => {
    navigateTo(`/space/${spaceId}`);
  };

  // /privacy
  if (currentPath === '/privacy') {
    return <PrivacyPage />;
  }

  // /terms
  if (currentPath === '/terms') {
    return <TermsPage />;
  }

  // /space/:id/recap
  const recapMatch = currentPath.match(/^\/space\/([^\/]+)\/recap\/?$/);
  if (recapMatch) {
    const spaceId = recapMatch[1];
    return <RecapPage spaceId={spaceId} onNavigateTimeline={handleNavigateTimeline} />;
  }

  // /space/:id
  const timelineMatch = currentPath.match(/^\/space\/([^\/]+)\/?$/);
  if (timelineMatch) {
    const spaceId = timelineMatch[1];
    return <TimelinePage spaceId={spaceId} onNavigateRecap={handleNavigateRecap} />;
  }

  // Home / Create
  return <HomeCreatePage onSpaceCreated={handleSpaceCreated} />;
}
