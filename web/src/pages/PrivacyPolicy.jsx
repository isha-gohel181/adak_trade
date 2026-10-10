import React, { useEffect } from 'react';
import gsap from 'gsap';

const PrivacyPolicy = () => {
  useEffect(() => {
    gsap.fromTo('.privacy-animate',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="privacy-animate text-4xl md:text-5xl font-newsreader font-bold text-amber-600 mb-8">Privacy Policy</h1>

        <div className="privacy-animate space-y-6 text-base leading-relaxed">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>
            At ADAK TRADE EFFORT, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal and account information when you use our educational and trading mentorship platform.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, professional background, and payment details when you register for an account, enroll in trading courses, or interact with our platform.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our trading masterclasses, workshops, and mentorship services.</li>
            <li>To process your course enrollments, certifications, and consultations.</li>
            <li>To communicate with you regarding curriculum updates, market events, and support.</li>
            <li>To improve the platform experience and educational features.</li>
          </ul>

          <h2 className="text-xl font-bold text-amber-600 mt-6">3. Data Security</h2>
          <p>
            We implement enterprise-grade encryption and security measures to protect your account and data from unauthorized access.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">4. Third-Party Services</h2>
          <p>
            We may use trusted third-party services (such as secure payment gateways and cloud infrastructure) that have their own privacy policies conforming to global standards.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">5. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please contact our support team at <a href="mailto:support@adaktrade.com" className="text-amber-700 font-bold hover:underline">support@adaktrade.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
