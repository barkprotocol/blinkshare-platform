'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex justify-center items-center p-6 bg-gray-50">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-lg overflow-y-auto h-[80vh]">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Privacy Policy for BlinkShare Bot
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          This Privacy Policy governs the collection, use, and sharing of personal information by BlinkShare Bot, a Discord bot developed by BARK Protocol. By using BlinkShare Bot, you agree to the terms of this Privacy Policy.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Information We Collect</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            We collect information that you provide to us through your use of the bot, such as your Discord user ID and username, server and channel information, and message content. We may also collect usage data, such as the frequency and duration of your use of the bot.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">How We Use Your Information</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            We use your information to operate and improve BlinkShare Bot, including to provide support and respond to your requests. We may also use your information to develop new features or services, to conduct research and analytics, and to comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sharing Your Information</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            We do not sell or share your personal information with third parties. However, we may disclose your information in response to legal process or a request from a law enforcement agency or regulatory authority.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Data Retention</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            We retain your information for as long as necessary to provide BlinkShare Bot&rsquo;s services or as required by law. We will delete your information upon your request or when it is no longer needed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Data Security</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. However, no security measure is perfect, and we cannot guarantee the security of your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Changes to this Policy</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            We may update this Privacy Policy from time to time, and we will post the updated policy on our website. Your continued use of BlinkShare Bot after we make changes to this policy indicates your acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            If you have any questions or concerns about this Privacy Policy, please contact us at{' '}
            <a href="mailto:contact@blinkshare.fun" className="text-gray-500 hover:underline">
              contact@blinkshare.fun
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Effective Date</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            This Privacy Policy is effective as of 2025-01-01.
          </p>
        </section>

        <div className="mt-8 flex justify-center">
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300">
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
