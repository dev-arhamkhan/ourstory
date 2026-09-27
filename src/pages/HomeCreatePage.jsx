import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomeCreatePage({ onSpaceCreated }) {
  const [name, setName] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name for your space');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), started_at: startedAt || null })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create space');
      }

      const space = await res.json();
      onSpaceCreated(space.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem', background: 'radial-gradient(circle at top, #fff0f3 0%, #fffaf7 70%)' }}>
      
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
        
        {/* Heart Icon Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ffe4e6', color: '#e11d48', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(225, 29, 72, 0.15)' }} className="animate-pulse-heart">
          <Heart fill="#e11d48" size={32} />
        </div>

        <h1 className="font-serif gradient-text" style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.15 }}>
          OurStory
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
          A private, shared timeline for your dates, photos, and milestones.
        </p>

        {/* Create Form Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid #fecdd3', textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#f43f5e" /> Create Your Shared Space
          </h2>

          {error && (
            <div style={{ backgroundColor: '#fff1f2', color: '#be123c', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.25rem', border: '1px solid #fecdd3' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Space Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Me & Aimen, Sam & Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">When did it start? (Optional)</label>
              <input
                type="date"
                className="form-input"
                value={startedAt}
                onChange={(e) => setStartedAt(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.88rem' }} disabled={loading}>
              {loading ? 'Creating space...' : (
                <>
                  Create Our Shared Space <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.82rem', backgroundColor: '#fff5f7', padding: '0.75rem', borderRadius: '10px' }}>
            <ShieldCheck size={18} color="#e11d48" style={{ flexShrink: 0 }} />
            <span>Private & unguessable share link. No accounts or passwords required.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
