import React from 'react';

export default function PrivacyPage({ onNavigateHome }) {
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #fff0f3 0%, #fffaf7 70%)', padding: '2rem 1rem 5rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Back nav */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#be123c',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            padding: '0.5rem 0',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'inherit'
          }}
        >
          ← Back to OurStory
        </button>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2.5rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid #fecdd3'
        }}>
          <h1 className="font-serif gradient-text" style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.2 }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '2rem', borderBottom: '1px solid #f7d6e0', paddingBottom: '1.25rem' }}>
            Effective date: September 30, 2026
          </p>

          <div style={{ color: 'var(--text-main)', lineHeight: 1.75, fontSize: '0.97rem' }}>

            {/* Section A */}
            <h2 style={sectionHeading}>What is OurStory?</h2>
            <p style={para}>
              OurStory is a shared, private relationship timeline. It lets two people log memories — dates,
              milestones, trips, notes, and optional photos — and view them together through a shared link.
              OurStory does not use accounts or passwords. Access to a shared space is granted to anyone who
              holds its share link.
            </p>

            {/* Section B */}
            <h2 style={sectionHeading}>What information is collected?</h2>
            <p style={para}>When you use OurStory, the following information is submitted and stored:</p>
            <ul style={list}>
              <li><strong>Space name</strong> — the name you give your shared space (e.g. a couple's name or nickname).</li>
              <li><strong>Relationship start date</strong> — an optional date you provide when creating a space.</li>
              <li><strong>Moment titles</strong> — a short title for each memory you log.</li>
              <li><strong>Moment descriptions</strong> — optional free-text notes about a memory.</li>
              <li><strong>Moment dates</strong> — the date associated with each memory.</li>
              <li><strong>Categories</strong> — optional labels you assign to moments (e.g. "trip", "first", "milestone").</li>
              <li>
                <strong>Photos</strong> — if you attach a photo to a moment, either:
                (a) the image file is converted to a base64 data string in your browser and that string is stored
                in the database, or (b) an external image URL you provide is stored as text. No separate file
                storage service is used.
              </li>
            </ul>
            <p style={para}>
              OurStory does not collect your name, email address, phone number, or any other personal
              identification separately from what you choose to include in the content above.
            </p>

            {/* Technical */}
            <h3 style={subHeading}>Technical information</h3>
            <p style={para}>
              OurStory is deployed on Vercel. When you make a request to the application, Vercel's
              infrastructure processes that request. This typically involves standard web server logging
              (such as IP addresses and request metadata) carried out by the hosting platform. OurStory
              itself does not collect or store IP addresses, browser fingerprints, or device identifiers
              in its own database.
            </p>
            <p style={para}>
              OurStory's frontend loads fonts from Google Fonts (fonts.googleapis.com). When your browser
              fetches these fonts, Google may process your IP address and browser information in accordance
              with Google's own privacy policy. OurStory has no control over this processing.
            </p>
            <p style={para}>
              OurStory does not use cookies, localStorage, sessionStorage, or any analytics or tracking
              tools.
            </p>

            {/* Section C */}
            <h2 style={sectionHeading}>Why is this information collected?</h2>
            <p style={para}>Information you submit is used only to:</p>
            <ul style={list}>
              <li>Create and display your shared story and timeline.</li>
              <li>Store, retrieve, and present your moments in chronological order.</li>
              <li>Power the Story Recap page (computing stats such as days together and category counts).</li>
              <li>Allow you to edit or delete moments you have logged.</li>
              <li>Provide the share-link experience so both people can access the space.</li>
            </ul>
            <p style={para}>
              OurStory does not use your content for advertising, profiling, or any purpose unrelated to
              operating the service.
            </p>

            {/* Section D */}
            <h2 style={sectionHeading}>How is your space accessed?</h2>
            <div style={{ backgroundColor: '#fff5f7', border: '1px solid #fecdd3', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
              <p style={{ ...para, margin: 0, fontWeight: 500 }}>
                ⚠️ Important: OurStory uses link-based access, not account-based authentication.
              </p>
            </div>
            <p style={para}>
              When you create a space, you receive a unique share link containing a randomly generated
              identifier (a UUID). <strong>Anyone who has this link can view and edit the space.</strong> There
              is no password, PIN, or login required to access it.
            </p>
            <p style={para}>
              This means:
            </p>
            <ul style={list}>
              <li>You are responsible for keeping the link private.</li>
              <li>If you share the link with someone, they will have full access to the space.</li>
              <li>If the link is seen or copied by someone you did not intend, they may be able to access your space.</li>
              <li>OurStory does not currently provide a way to revoke, reset, or password-protect a link.</li>
              <li>OurStory cannot recover a lost link for you, as there is no account login system.</li>
            </ul>
            <p style={para}>
              Only share the link with people you trust, and store it somewhere safe.
            </p>

            {/* Section E */}
            <h2 style={sectionHeading}>Where is data stored?</h2>
            <p style={para}>
              Content you submit is stored in a PostgreSQL database. The specific cloud database provider
              and the physical location of its servers are determined by the deployment configuration, which
              may change. OurStory does not store data locally on your device beyond normal browser memory
              used during a page session.
            </p>
            <p style={para}>
              If OurStory is accessed without a database connection (for example, during local development),
              data falls back to an in-memory store that does not persist between server restarts.
            </p>

            {/* Section F */}
            <h2 style={sectionHeading}>Photos</h2>
            <p style={para}>
              If you upload a photo from your device, it is converted to a base64-encoded string in your
              browser before being sent to the server. That string is stored as a text field in the
              database alongside the moment it belongs to. There is no separate image or file storage
              service. Base64-encoded images can be large and this approach has practical size limitations;
              the application currently limits uploads to 10 MB.
            </p>
            <p style={para}>
              If you paste an external image URL instead, only that URL is stored — the image itself
              continues to be hosted wherever it already is.
            </p>
            <p style={para}>
              Think carefully before adding photos that contain sensitive or identifying information,
              because anyone with your share link can see them.
            </p>

            {/* Section G */}
            <h2 style={sectionHeading}>Sharing</h2>
            <p style={para}>
              Because access is controlled only by possession of a link, you should only add content to
              a shared space that you would be comfortable with anyone who might obtain the link seeing.
              This includes space names, descriptions, categories, and especially photos.
            </p>

            {/* Section H */}
            <h2 style={sectionHeading}>Data retention and deletion</h2>
            <p style={para}>
              Individual moments can be deleted at any time by anyone with access to the share link, using
              the delete button on each moment card. Deletion is permanent and cannot be undone.
            </p>
            <p style={para}>
              OurStory does not currently provide a way to delete an entire space through the user interface.
              There is no automatic data expiry or scheduled deletion.
            </p>
            <p style={para}>
              If you would like to request deletion of a space or all associated data, please contact us
              using the address in the "Contact" section below. We will handle such requests on a
              case-by-case basis.
            </p>

            {/* Section I */}
            <h2 style={sectionHeading}>Your rights and data requests</h2>
            <p style={para}>
              You may request access to, correction of, or deletion of information associated with a
              space you control. Because OurStory has no account system, we cannot independently verify
              ownership. Please include the share link for the space in your request so we can locate the
              relevant data.
            </p>
            <p style={para}>
              To make a request, contact us at: <a href="mailto:dev.arhamkhan@gmail.com" style={{ color: '#e11d48', fontWeight: 600 }}>dev.arhamkhan@gmail.com</a>.
            </p>

            {/* Section J */}
            <h2 style={sectionHeading}>Third-party services</h2>
            <p style={para}>OurStory currently relies on the following external services:</p>
            <ul style={list}>
              <li>
                <strong>Vercel</strong> — application hosting and serverless function execution. Vercel
                processes requests made to OurStory and may log standard server-side information (such as
                IP addresses) as part of operating the platform. See{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#e11d48' }}>Vercel's Privacy Policy</a>.
              </li>
              <li>
                <strong>PostgreSQL database provider</strong> — the database hosting provider is configured
                via an environment variable and is not determinable from the application source code alone.
                The specific provider and its data processing terms depend on the deployment configuration.
              </li>
              <li>
                <strong>Google Fonts</strong> — the application loads fonts from Google's servers. This
                causes your browser to make a request to Google, which may include your IP address. See{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#e11d48' }}>Google's Privacy Policy</a>.
              </li>
            </ul>
            <p style={para}>
              There are no advertising networks, analytics platforms, email service providers, or other
              third-party services integrated into the application.
            </p>

            {/* Section K */}
            <h2 style={sectionHeading}>Cookies and local storage</h2>
            <p style={para}>
              OurStory does not set cookies. It does not use localStorage, sessionStorage, or any
              client-side persistent storage. No cookie consent banner is presented because there is
              nothing to consent to on OurStory's part.
            </p>

            {/* Section L */}
            <h2 style={sectionHeading}>Security</h2>
            <p style={para}>
              OurStory applies reasonable measures appropriate to a link-based personal application, including
              parameterised database queries to prevent injection attacks, HTTPS transport via Vercel, and
              keeping database credentials in server-side environment variables that are not exposed to the
              browser.
            </p>
            <p style={para}>
              No internet-based service can guarantee complete security. The most significant access control
              mechanism in OurStory is the share link itself — keeping it private is the primary way to
              protect your space.
            </p>

            {/* Section M */}
            <h2 style={sectionHeading}>Minors</h2>
            <p style={para}>
              OurStory is not specifically directed at children. If you believe content involving a minor
              has been submitted without appropriate consent, please contact us using the address below so
              we can take appropriate action.
            </p>

            {/* Section N */}
            <h2 style={sectionHeading}>International data processing</h2>
            <p style={para}>
              OurStory is hosted on Vercel's infrastructure and uses a third-party PostgreSQL provider. Data
              submitted to OurStory may be processed or stored in locations outside Pakistan, depending on
              where the hosting and database providers operate their servers. By using OurStory, you acknowledge
              that your data may be transferred to and processed in other jurisdictions.
            </p>

            {/* Section O */}
            <h2 style={sectionHeading}>Changes to this policy</h2>
            <p style={para}>
              If this policy changes materially, we will update the effective date at the top of this page.
              Because OurStory has no account system, we cannot notify users directly; you are responsible
              for reviewing this policy periodically if you continue using the service.
            </p>

            {/* Contact */}
            <h2 style={sectionHeading}>Contact</h2>
            <p style={para}>
              For privacy-related questions or data requests, contact us at:{' '}
              <a href="mailto:dev.arhamkhan@gmail.com" style={{ color: '#e11d48', fontWeight: 600 }}>dev.arhamkhan@gmail.com</a>.
            </p>

          </div>
        </div>

        {/* Footer links */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <LegalFooter navigate={navigate} current="privacy" />
        </div>
      </div>
    </div>
  );
}

function LegalFooter({ navigate, current }) {
  const linkStyle = (active) => ({
    color: active ? '#be123c' : 'var(--text-muted)',
    fontSize: '0.82rem',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
    padding: 0
  });
  return (
    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <button style={linkStyle(false)} onClick={() => navigate('/')}>← Home</button>
      <span style={{ color: '#fecdd3' }}>·</span>
      <button style={linkStyle(current === 'privacy')} onClick={() => navigate('/privacy')}>Privacy Policy</button>
      <span style={{ color: '#fecdd3' }}>·</span>
      <button style={linkStyle(current === 'terms')} onClick={() => navigate('/terms')}>Terms of Use</button>
    </div>
  );
}

const sectionHeading = {
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#331e28',
  marginTop: '2rem',
  marginBottom: '0.6rem',
  paddingBottom: '0.35rem',
  borderBottom: '1px solid #fdf0f3'
};

const subHeading = {
  fontSize: '1rem',
  fontWeight: 600,
  color: '#331e28',
  marginTop: '1.25rem',
  marginBottom: '0.5rem'
};

const para = {
  marginBottom: '0.85rem',
  color: 'var(--text-main)'
};

const list = {
  paddingLeft: '1.4rem',
  marginBottom: '0.85rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem'
};

export { LegalFooter };
