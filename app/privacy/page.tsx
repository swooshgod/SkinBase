export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui', color: '#333' }}>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated: March 22, 2026</strong></p>

      <h2>Introduction</h2>
      <p>SkinBase ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application and website.</p>

      <h2>Information We Collect</h2>
      <h3>Information You Provide</h3>
      <ul>
        <li>Account information (email address, name)</li>
        <li>Skin analysis photos you upload for AI analysis</li>
        <li>Skincare routine and product preferences</li>
        <li>Payment information (processed securely through Stripe)</li>
      </ul>

      <h3>Automatically Collected Information</h3>
      <ul>
        <li>Device information and identifiers</li>
        <li>Usage data and app interactions</li>
        <li>IP address and approximate location</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide AI-powered skin analysis and personalized recommendations</li>
        <li>To manage your account and subscriptions</li>
        <li>To improve our services and user experience</li>
        <li>To communicate with you about your account</li>
      </ul>

      <h2>Photo Data</h2>
      <p>Photos you submit for skin analysis are processed by our AI system (powered by Anthropic Claude Vision) to provide skincare recommendations. Photos are not shared with third parties and are stored securely. You may delete your photos at any time.</p>

      <h2>Third-Party Services</h2>
      <ul>
        <li><strong>Supabase:</strong> Database and authentication</li>
        <li><strong>Stripe:</strong> Payment processing</li>
        <li><strong>Anthropic:</strong> AI skin analysis</li>
        <li><strong>Replicate:</strong> AI image processing</li>
      </ul>

      <h2>Data Security</h2>
      <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

      <h2>Your Rights</h2>
      <p>You may request to access, update, or delete your personal data at any time by contacting us.</p>

      <h2>Children's Privacy</h2>
      <p>SkinBase is not intended for children under 13. We do not knowingly collect information from children under 13.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, contact us at: <a href="mailto:f2g1994@icloud.com">f2g1994@icloud.com</a></p>
    </div>
  );
}
