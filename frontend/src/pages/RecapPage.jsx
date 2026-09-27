import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  ArrowLeft, 
  Share2, 
  Calendar, 
  Flame, 
  Bookmark, 
  Compass, 
  Check, 
  Star,
  Clock
} from 'lucide-react';

export default function RecapPage({ spaceId, onNavigateTimeline }) {
  const [recap, setRecap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchRecap = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/spaces/${spaceId}/recap`);
        if (!res.ok) {
          throw new Error('Failed to load story recap');
        }
        const data = await res.json();
        setRecap(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      fetchRecap();
    }
  }, [spaceId]);

  const copyRecapLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage('Recap link copied to clipboard!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e0915 0%, #3d0c24 50%, #1e0915 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fda4af'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Heart fill="#f43f5e" color="#f43f5e" size={48} className="animate-pulse-heart" />
          <p style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>Generating your Story Recap...</p>
        </div>
      </div>
    );
  }

  if (error || !recap) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e0915 0%, #3d0c24 50%, #1e0915 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ backgroundColor: '#2d0f22', color: '#fff', borderRadius: '24px', padding: '2.5rem', textAlign: 'center', maxWidth: '420px', border: '1px solid #701a45' }}>
          <Heart size={40} color="#f43f5e" style={{ marginBottom: '1rem' }} />
          <h2>Recap Unavailable</h2>
          <p style={{ color: '#fda4af', margin: '0.75rem 0 1.5rem 0' }}>{error || 'Space not found'}</p>
          <button onClick={() => onNavigateTimeline(spaceId)} className="btn-primary">
            <ArrowLeft size={16} /> Return to Timeline
          </button>
        </div>
      </div>
    );
  }

  const {
    spaceName,
    startedAt,
    daysTogether,
    totalMoments,
    firstMoment,
    latestMoment,
    busiestMonth,
    categoryCounts = {}
  } = recap;

  const categories = Object.entries(categoryCounts);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0612 0%, #3b0a23 35%, #4c0f2e 65%, #180510 100%)',
      color: '#ffffff',
      padding: '2rem 1.5rem 5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Floating Sparkles & Heart Backdrops */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.15, pointerEvents: 'none' }} className="animate-float">
        <Heart size={120} fill="#f43f5e" />
      </div>
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', opacity: 0.12, pointerEvents: 'none' }} className="animate-float">
        <Sparkles size={140} color="#fb7185" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#fda4af',
          color: '#3b0a23',
          padding: '0.8rem 1.4rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 700
        }}>
          <Check size={18} /> {toastMessage}
        </div>
      )}

      <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Navigation Bar */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <button 
            onClick={() => onNavigateTimeline(spaceId)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.6rem 1.2rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              backdropFilter: 'blur(10px)'
            }}
          >
            <ArrowLeft size={16} /> Back to Timeline
          </button>

          <button 
            onClick={copyRecapLink}
            style={{
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '0.66rem 1.3rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              boxShadow: '0 8px 20px rgba(244, 63, 94, 0.4)'
            }}
          >
            <Share2 size={16} /> Share Story Recap
          </button>
        </nav>

        {/* Hero Header */}
        <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(244, 63, 94, 0.2)',
            color: '#fecdd3',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            padding: '0.35rem 1.1rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={15} color="#fb7185" /> OUR STORY WRAPPED
          </div>

          <h1 className="font-serif gradient-recap-text" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.75rem' }}>
            {spaceName}
          </h1>

          <p style={{ color: '#fda4af', fontSize: '1.15rem', fontWeight: 300, maxWidth: '500px', margin: '0 auto' }}>
            {startedAt ? (
              <>Together since <strong style={{ color: '#ffffff' }}>{new Date(startedAt + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></>
            ) : (
              'Every memory, milestone, and date logged so far.'
            )}
          </p>
        </header>

        {/* Big Stat Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Stat 1: Days Together */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(253, 164, 175, 0.25)',
            borderRadius: '28px',
            padding: '2.5rem 1.75rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'inline-flex', padding: '0.8rem', backgroundColor: 'rgba(244, 63, 94, 0.25)', borderRadius: '50%', marginBottom: '1rem' }} className="animate-pulse-heart">
              <Heart fill="#f43f5e" color="#f43f5e" size={32} />
            </div>
            <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, color: '#ffffff', fontFamily: 'var(--font-serif)', marginBottom: '0.4rem' }}>
              {daysTogether}
            </div>
            <div style={{ color: '#fecdd3', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Days Together
            </div>
          </div>

          {/* Stat 2: Total Moments */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(253, 164, 175, 0.25)',
            borderRadius: '28px',
            padding: '2.5rem 1.75rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'inline-flex', padding: '0.8rem', backgroundColor: 'rgba(251, 113, 133, 0.25)', borderRadius: '50%', marginBottom: '1rem' }}>
              <Bookmark color="#fb7185" size={32} />
            </div>
            <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, color: '#ffffff', fontFamily: 'var(--font-serif)', marginBottom: '0.4rem' }}>
              {totalMoments}
            </div>
            <div style={{ color: '#fecdd3', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Moments Logged
            </div>
          </div>

        </div>

        {/* Highlight Cards: First & Latest Moment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Card A: First Moment */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(253, 164, 175, 0.3)',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Star size={16} fill="#fb7185" /> WHERE IT ALL BEGAN
            </div>

            {firstMoment ? (
              <>
                {firstMoment.photo_url && (
                  <div style={{ height: '180px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <img src={firstMoment.photo_url} alt={firstMoment.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ fontSize: '0.82rem', color: '#fda4af', fontWeight: 600, marginBottom: '0.2rem' }}>
                  {new Date(firstMoment.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {firstMoment.title}
                </h3>
                {firstMoment.description && (
                  <p style={{ color: '#fecdd3', fontSize: '0.92rem', lineHeight: 1.5, opacity: 0.9 }}>
                    "{firstMoment.description}"
                  </p>
                )}
              </>
            ) : (
              <p style={{ color: '#fda4af', fontSize: '0.95rem' }}>No moments logged yet.</p>
            )}
          </div>

          {/* Card B: Latest Moment */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(253, 164, 175, 0.3)',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Clock size={16} /> MOST RECENT MEMORY
            </div>

            {latestMoment ? (
              <>
                {latestMoment.photo_url && (
                  <div style={{ height: '180px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <img src={latestMoment.photo_url} alt={latestMoment.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ fontSize: '0.82rem', color: '#fda4af', fontWeight: 600, marginBottom: '0.2rem' }}>
                  {new Date(latestMoment.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {latestMoment.title}
                </h3>
                {latestMoment.description && (
                  <p style={{ color: '#fecdd3', fontSize: '0.92rem', lineHeight: 1.5, opacity: 0.9 }}>
                    "{latestMoment.description}"
                  </p>
                )}
              </>
            ) : (
              <p style={{ color: '#fda4af', fontSize: '0.95rem' }}>No moments logged yet.</p>
            )}
          </div>

        </div>

        {/* Busiest Month Card */}
        {busiestMonth && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(190, 18, 60, 0.3) 100%)',
            border: '1px solid rgba(253, 164, 175, 0.4)',
            borderRadius: '24px',
            padding: '1.75rem 2rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#e11d48', borderRadius: '16px', color: '#fff' }}>
                <Flame size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#fecdd3', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Busiest Memory Month
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
                  {busiestMonth}
                </div>
              </div>
            </div>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
              Peak Memory Activity
            </span>
          </div>
        )}

        {/* Category Breakdown */}
        {categories.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(253, 164, 175, 0.2)',
            borderRadius: '24px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} color="#fb7185" /> Memory Categories Breakdown
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {categories.map(([catName, count]) => (
                <div key={catName} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#fecdd3', fontSize: '0.95rem' }}>
                    {catName}
                  </span>
                  <span style={{
                    backgroundColor: '#f43f5e',
                    color: '#ffffff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '4rem', color: '#fda4af', fontSize: '0.88rem', opacity: 0.8 }}>
          <p>OurStory — Private & Shared Relationship Timeline</p>
        </footer>

      </div>

    </div>
  );
}
