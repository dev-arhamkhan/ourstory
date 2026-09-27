import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Plus, 
  Share2, 
  PieChart, 
  Calendar, 
  Tag, 
  Pencil, 
  Trash2, 
  X, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  AlertCircle, 
  Image as ImageIcon 
} from 'lucide-react';

export default function TimelinePage({ spaceId, onNavigateRecap }) {
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Banner warning state
  const [showSavedWarning, setShowSavedWarning] = useState(true);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showMomentModal, setShowMomentModal] = useState(false);
  const [editingMoment, setEditingMoment] = useState(null);
  const [deletingMomentId, setDeletingMomentId] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [momentDate, setMomentDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoInputMode, setPhotoInputMode] = useState('upload'); // 'upload' | 'url'
  const [submitting, setSubmitting] = useState(false);

  // Preview full image modal
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);

  const fetchSpace = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/spaces/${spaceId}`);
      if (!res.ok) {
        throw new Error('Space not found or unavailable');
      }
      const data = await res.json();
      setSpace(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const copyShareLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    showToast('Private share link copied to clipboard!');
  };

  // Open modal for adding
  const openAddModal = () => {
    setEditingMoment(null);
    setTitle('');
    setMomentDate(new Date().toISOString().split('T')[0]);
    setCategory('');
    setDescription('');
    setPhotoUrl('');
    setShowMomentModal(true);
  };

  // Open modal for editing
  const openEditModal = (moment) => {
    setEditingMoment(moment);
    setTitle(moment.title || '');
    setMomentDate(moment.moment_date || '');
    setCategory(moment.category || '');
    setDescription(moment.description || '');
    setPhotoUrl(moment.photo_url || '');
    setShowMomentModal(true);
  };

  // Handle image file upload to base64
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Please select an image smaller than 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit moment form
  const handleSaveMoment = async (e) => {
    e.preventDefault();
    if (!title.trim() || !momentDate) {
      alert('Please provide a title and date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description,
        moment_date: momentDate,
        photo_url: photoUrl || null,
        category: category.trim().toLowerCase()
      };

      let res;
      if (editingMoment) {
        res = await fetch(`/api/moments/${editingMoment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/spaces/${spaceId}/moments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        throw new Error('Failed to save moment');
      }

      setShowMomentModal(false);
      showToast(editingMoment ? 'Moment updated!' : 'New moment added!');
      fetchSpace();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete moment
  const handleDeleteMoment = async () => {
    if (!deletingMomentId) return;
    try {
      const res = await fetch(`/api/moments/${deletingMomentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete moment');
      setDeletingMomentId(null);
      showToast('Moment deleted');
      fetchSpace();
    } catch (err) {
      alert(err.message);
    }
  };

  // Calculate days together
  const calculateDays = () => {
    if (!space?.started_at) return null;
    const startMs = new Date(space.started_at + 'T00:00:00').getTime();
    const nowMs = new Date().getTime();
    if (isNaN(startMs) || nowMs < startMs) return 0;
    return Math.floor((nowMs - startMs) / (1000 * 60 * 60 * 24));
  };

  const daysTogether = calculateDays();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#e11d48' }}>
          <Heart fill="#e11d48" size={40} className="animate-pulse-heart" />
          <p style={{ marginTop: '1rem', fontWeight: 500 }}>Loading your story...</p>
        </div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center', maxWidth: '450px', border: '1px solid #fecdd3', boxShadow: 'var(--shadow-md)' }}>
          <AlertCircle size={48} color="#e11d48" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Space Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            This space URL might be invalid or no longer exists.
          </p>
          <a href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            Create New Space
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#331e28',
          color: '#ffffff',
          padding: '0.8rem 1.4rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          <Check size={18} color="#4ade80" /> {toastMessage}
        </div>
      )}

      {/* Save Link Alert Banner */}
      {showSavedWarning && (
        <div style={{
          backgroundColor: '#fff1f2',
          borderBottom: '1px solid #fecdd3',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#be123c',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#e11d48" />
            <span>
              <strong>Save this link!</strong> Access is via this private link — there is no login to recover it otherwise.
            </span>
          </div>
          <button 
            onClick={() => setShowSavedWarning(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#be123c', padding: '0.2rem' }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header Container */}
      <header style={{
        maxWidth: '840px',
        margin: '2rem auto 3rem auto',
        padding: '0 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffe4e6', color: '#be123c', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Heart size={14} fill="#be123c" /> OUR SHARED SPACE
        </div>

        <h1 className="font-serif gradient-text" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.5rem' }}>
          {space.name}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          {space.started_at && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} color="#f43f5e" /> Started {new Date(space.started_at + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {daysTogether !== null && (
            <span style={{ backgroundColor: '#fff0f3', color: '#e11d48', padding: '0.25rem 0.85rem', borderRadius: '9999px', fontWeight: 700, border: '1px solid #fecdd3' }}>
              ♥ {daysTogether} Days Together
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={openAddModal} className="btn-primary">
            <Plus size={18} /> Add Moment
          </button>
          <button onClick={() => onNavigateRecap(spaceId)} className="btn-secondary">
            <PieChart size={18} /> Story Recap
          </button>
          <button onClick={copyShareLink} className="btn-outline">
            <Share2 size={16} /> Share Link
          </button>
        </div>
      </header>

      {/* Main Timeline View */}
      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {space.moments.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '2px dashed #fecdd3',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#fff0f3', borderRadius: '50%', marginBottom: '1rem' }}>
              <Sparkles size={32} color="#f43f5e" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>No moments logged yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              Start building your shared memory timeline by logging your first date, trip, or silly moment together!
            </p>
            <button onClick={openAddModal} className="btn-primary">
              <Plus size={18} /> Log First Moment
            </button>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            
            {/* Vertical Center Line */}
            <div style={{
              position: 'absolute',
              left: '24px',
              top: '20px',
              bottom: '20px',
              width: '3px',
              background: 'linear-gradient(to bottom, #fecdd3, #f43f5e, #fecdd3)',
              borderRadius: '2px',
              zIndex: 1
            }} />

            {/* Moments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 2 }}>
              {space.moments.map((moment, idx) => (
                <div key={moment.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  
                  {/* Heart Marker Node */}
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '3px solid #f43f5e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e11d48',
                    boxShadow: '0 4px 12px rgba(225,29,72,0.15)',
                    flexShrink: 0,
                    marginTop: '0.5rem'
                  }}>
                    <Heart size={20} fill="#f43f5e" />
                  </div>

                  {/* Moment Card */}
                  <div style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid #ffe4e6',
                    transition: 'transform 0.2s ease',
                    position: 'relative'
                  }}>

                    {/* Top Row: Date Pill & Category Badge & Edit/Delete actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ backgroundColor: '#fff0f3', color: '#be123c', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 600 }}>
                          {new Date(moment.moment_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {moment.category && (
                          <span className="category-tag">
                            {moment.category}
                          </span>
                        )}
                      </div>

                      {/* Edit / Delete Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button 
                          onClick={() => openEditModal(moment)}
                          title="Edit Moment"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.3rem', borderRadius: '6px' }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => setDeletingMomentId(moment.id)}
                          title="Delete Moment"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e', padding: '0.3rem', borderRadius: '6px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Photo if present */}
                    {moment.photo_url && (
                      <div 
                        onClick={() => setPreviewPhotoUrl(moment.photo_url)}
                        style={{
                          marginBottom: '1rem',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          maxHeight: '320px',
                          cursor: 'pointer',
                          border: '1px solid #fecdd3',
                          backgroundColor: '#fffafb'
                        }}
                      >
                        <img 
                          src={moment.photo_url} 
                          alt={moment.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      {moment.title}
                    </h3>

                    {/* Description */}
                    {moment.description && (
                      <p style={{ color: '#4a333d', fontSize: '0.98rem', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {moment.description}
                      </p>
                    )}

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Add / Edit Moment Modal */}
      {showMomentModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart fill="#f43f5e" color="#f43f5e" size={20} />
                {editingMoment ? 'Edit Moment' : 'Add New Moment'}
              </h2>
              <button onClick={() => setShowMomentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMoment}>
              
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Picnic in Central Park"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={momentDate}
                    onChange={(e) => setMomentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. trip, milestone, silly, first"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Quick Tags */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {['first', 'trip', 'milestone', 'silly', 'date night'].map((catTag) => (
                  <button
                    key={catTag}
                    type="button"
                    onClick={() => setCategory(catTag)}
                    style={{
                      border: category.toLowerCase() === catTag ? '1.5px solid #e11d48' : '1px solid #fecdd3',
                      backgroundColor: category.toLowerCase() === catTag ? '#ffe4e6' : '#fff9fa',
                      color: category.toLowerCase() === catTag ? '#be123c' : 'var(--text-muted)',
                      borderRadius: '9999px',
                      padding: '0.2rem 0.65rem',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    + {catTag}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Description / Memory Notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Write a few sweet details about this moment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Photo Upload / URL */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label className="form-label">Photo (Optional)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem' }}>
                    <button
                      type="button"
                      onClick={() => setPhotoInputMode('upload')}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontWeight: photoInputMode === 'upload' ? 700 : 400,
                        color: photoInputMode === 'upload' ? '#e11d48' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      Upload File
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setPhotoInputMode('url')}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontWeight: photoInputMode === 'url' ? 700 : 400,
                        color: photoInputMode === 'url' ? '#e11d48' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {photoInputMode === 'upload' ? (
                  <div style={{
                    border: '1.5px dashed var(--border-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: '#fffafb',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                      id="photo-file-input"
                    />
                    <label htmlFor="photo-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={22} color="#f43f5e" />
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        Click to select a photo from your device
                      </span>
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/photo.jpg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                )}

                {/* Photo Preview thumbnail if set */}
                {photoUrl && (
                  <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                    <img src={photoUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #fecdd3' }} />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        backgroundColor: '#e11d48',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowMomentModal(false)} className="btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Saving...' : (editingMoment ? 'Save Changes' : 'Add Moment')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingMomentId && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={40} color="#e11d48" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Delete this moment?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeletingMomentId(null)} className="btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleDeleteMoment} className="btn-primary" style={{ flex: 1, backgroundColor: '#e11d48' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Fullscreen Preview Modal */}
      {previewPhotoUrl && (
        <div className="modal-overlay" onClick={() => setPreviewPhotoUrl(null)}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <img src={previewPhotoUrl} alt="Enlarged preview" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '16px', objectFit: 'contain' }} />
            <button 
              onClick={() => setPreviewPhotoUrl(null)} 
              style={{ position: 'absolute', top: '-15px', right: '-15px', backgroundColor: '#ffffff', color: '#333', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
