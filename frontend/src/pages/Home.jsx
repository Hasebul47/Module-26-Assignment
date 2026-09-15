import React, { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import { BreakingTicker } from '../components/BreakingTicker';
import { HeroSection } from '../components/HeroSection';
import { TopNewsSection } from '../components/TopNewsSection';
import { CategorySection } from '../components/CategorySection';
import { LatestNewsSection } from '../components/LatestNewsSection';
import { NewsletterSection } from '../components/NewsletterSection';

export const Home = () => {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        setLoading(true);
        // Fetch general news for hero & latest feed
        const res = await newsAPI.getAll({ limit: 12, sort: 'newest' });
        setAllNews(res.data.news || []);
      } catch (err) {
        console.error('Failed to load homepage news feed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomepageData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Breaking Wire Ticker */}
      <BreakingTicker news={allNews} />

      {/* Section 1: Hero Featured Spotlight */}
      <HeroSection news={allNews} />

      {/* Section 2: Top 6 News (Explicit API Call for Top 6 News) */}
      <TopNewsSection />

      {/* Section 3: Category Spotlight Explorer */}
      <CategorySection />

      {/* Section 4: Latest News Live Feed & Market Pulse */}
      <LatestNewsSection news={allNews} />

      {/* Section 5: Newsletter & Editorial Community */}
      <NewsletterSection />
    </div>
  );
};
