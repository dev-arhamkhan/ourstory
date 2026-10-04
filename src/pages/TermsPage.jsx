import React from 'react';
import { LegalFooter } from './PrivacyPage';

export default function TermsPage({ onNavigateHome }) {
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
            Terms of Use
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '2rem', borderBottom: '1px solid #f7d6e0', paddingBottom: '1.25rem' }}>
            Effective date: September 30, 2026
          </p>

          <div style={{ color: 'var(--text-main)', lineHeight: 1.75, fontSize: '0.97rem' }}>

            {/* A */}
            <h2 style={sectionHeading}>Acceptance of these terms</h2>
            <p style={para}>
              By creating a space or using OurStory in any way, you agree to these Terms of Use. If you do not
              agree, please do not use the service. These terms apply equally to anyone who accesses a space via
              a share link.
            </p>

            {/* B */}
            <h2 style={sectionHeading}>What OurStory is</h2>
            <p style={para}>
              OurStory is a personal, shared memory timeline. It allows people to create a private space and
              log moments — memories, dates, milestones, notes, and optional photos — which are accessible
              to anyone who holds the space's share link.
            </p>
            <p style={para}>
              OurStory uses link-based access rather than accounts or passwords. There is no login system.
              A space is accessible to anyone who has its share link.
            </p>

            {/* C */}
            <h2 style={sectionHeading}>Your responsibilities</h2>
            <p style={para}>You are responsible for:</p>
            <ul style={list}>
              <li>All content you submit to OurStory, including space names, moment descriptions, and photos.</li>
              <li>Keeping your share link private and only sharing it with people you intend to have access.</li>
              <li>Ensuring you have the necessary rights or permissions for any photos or content you upload —
                particularly photos that include other people.</li>
              <li>Any consequences that result from your share link being seen or accessed by others, whether
                intentionally shared or not.</li>
            </ul>

            {/* D */}
            <h2 style={sectionHeading}>Prohibited uses</h2>
            <p style={para}>You must not use OurStory to:</p>
            <ul style={list}>
              <li>Upload, store, or share content that is illegal under applicable law.</li>
              <li>Harass, abuse, threaten, or harm any individual.</li>
              <li>Upload photos or content depicting non-consensual intimate imagery or sexual content
                involving minors.</li>
              <li>Attempt to gain unauthorised access to other users' spaces or to OurStory's
                infrastructure.</li>
              <li>Deliberately exploit, damage, or disrupt the service.</li>
              <li>Use the service in a way that violates the rights of others, including intellectual
                property rights.</li>
            </ul>
            <p style={para}>
              We reserve the right to remove content or terminate access to a space where we determine
              (at our discretion) that these terms have been violated.
            </p>

            {/* E */}
            <h2 style={sectionHeading}>Your content</h2>
            <p style={para}>
              You retain ownership of the content you submit to OurStory, to the extent you own it. By
              submitting content, you grant OurStory a limited, non-exclusive licence to store, process,
              and display that content for the sole purpose of operating the service — that is, showing
              your moments on your timeline and recap page.
            </p>
            <p style={para}>
              OurStory does not claim ownership of your memories, photos, or personal content.
            </p>

            {/* F */}
            <h2 style={sectionHeading}>Share-link access model</h2>
            <div style={{ backgroundColor: '#fff5f7', border: '1px solid #fecdd3', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
              <p style={{ ...para, margin: 0, fontWeight: 500 }}>
                ⚠️ Your space is not password-protected. Access is controlled entirely by the link.
              </p>
            </div>
            <p style={para}>
              Access to a space is granted to anyone in possession of its share link. OurStory provides no
              additional authentication layer. You should treat the share link as you would a password:
              keep it private, do not post it publicly, and only give it to people you want to have access.
            </p>
            <p style={para}>
              OurStory is not responsible for unauthorised access that results from a share link being
              disclosed, forwarded, or discovered by unintended parties.
            </p>

            {/* G */}
            <h2 style={sectionHeading}>Availability</h2>
            <p style={para}>
              OurStory is provided on an "as available" basis. We do not guarantee uninterrupted, error-free,
              or permanent availability of the service. The service may be modified, suspended, or discontinued
              at any time without notice.
            </p>
            <p style={para}>
              Because OurStory uses link-based access with no account system, there is no guaranteed recovery
              mechanism if a share link is lost. We strongly recommend saving your share link somewhere safe.
            </p>

            {/* H */}
            <h2 style={sectionHeading}>Content removal</h2>
            <p style={para}>
              OurStory may remove or disable access to content at our discretion where we have reason to
              believe it violates these Terms, applicable law, or poses risks to the security or operation
              of the service. We will act reasonably in doing so.
            </p>

            {/* I */}
            <h2 style={sectionHeading}>Disclaimer</h2>
            <p style={para}>
              OurStory is provided "as is" without warranties of any kind, whether express or implied,
              including but not limited to warranties of merchantability, fitness for a particular purpose,
              or non-infringement. We do not warrant that the service will be free of errors, that data
              will never be lost, or that any particular feature will remain available.
            </p>

            {/* J */}
            <h2 style={sectionHeading}>Limitation of liability</h2>
            <p style={para}>
              To the extent permitted by applicable law, OurStory and its operators shall not be liable for
              indirect, incidental, or consequential damages arising from your use of the service, including
              but not limited to loss of data, unauthorised access resulting from a disclosed share link, or
              service interruptions.
            </p>
            <p style={para}>
              Our total liability for any claim related to OurStory is limited to the amount you have paid
              to use the service (which, for a free service, is zero).
            </p>

            {/* K */}
            <h2 style={sectionHeading}>Governing law</h2>
            <div style={{ backgroundColor: '#fff5f7', border: '1px solid #fecdd3', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.88rem', color: '#be123c' }}>
              📌 Legal review required: Governing jurisdiction has not been specified. A lawyer should advise
              on the appropriate jurisdiction, venue, and governing law clause before these terms are shown
              to real users.
            </div>
            <p style={para}>
              <strong>[Governing law and jurisdiction — requires legal review before production use.]</strong>
            </p>

            {/* L */}
            <h2 style={sectionHeading}>Changes to these terms</h2>
            <p style={para}>
              We may update these Terms of Use from time to time. When we do, we will update the effective
              date at the top of this page. Because OurStory has no account system, we cannot notify users
              directly. Continued use of the service after terms are updated constitutes acceptance of the
              updated terms.
            </p>

            {/* M */}
            <h2 style={sectionHeading}>Contact</h2>
            <p style={para}>
              For questions about these terms, please contact us at:{' '}
              <a href="mailto:dev.arhamkhan@gmail.com" style={{ color: '#e11d48', fontWeight: 600 }}>dev.arhamkhan@gmail.com</a>.
            </p>

          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <LegalFooter navigate={navigate} current="terms" />
        </div>
      </div>
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
