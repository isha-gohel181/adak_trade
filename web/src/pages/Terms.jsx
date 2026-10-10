import React, { useEffect } from 'react';
import gsap from 'gsap';

const Terms = () => {
  useEffect(() => {
    gsap.fromTo('.terms-animate',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="terms-animate text-4xl md:text-5xl font-newsreader font-bold text-amber-600 mb-8">Terms & Conditions</h1>

        <div className="terms-animate space-y-6 text-base leading-relaxed">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>
            Welcome to ADAK TRADE EFFORT. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">1. Use of the Platform</h2>
          <p>
            ADAK TRADE EFFORT provides financial education, trading mentorship, capital market analysis, and certification materials for trading and investment professionals. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use of your account.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">3. Intellectual Property</h2>
          <p>
            All content on the ADAK TRADE platform, including videos, datasets, study guides, practice tests, course materials, and logos, is the exclusive property of ADAK TRADE EFFORT. You may not reproduce, distribute, or modify any content without written permission.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">4. Limitation of Liability</h2>
          <p>
            ADAK TRADE EFFORT strives to provide accurate, industry-leading trading and financial educational materials. We shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our services.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the platform after any changes indicates your acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
