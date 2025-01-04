'use client';

export default function TermsOfServicePage() {
  return (
    <div className="flex justify-center items-center p-6 bg-gray-50">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-lg overflow-y-auto h-[80vh]">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Terms of Service Agreement
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          This Terms of Service Agreement (the &quot;Agreement&quot;) is entered into between BlinkShare (&quot;Bot Owner&quot;) and the user (&quot;User&quot;) of the BlinkShare Bot Discord bot (the &quot;Bot&quot;).
        </p>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          By using the BlinkShare Bot, the User agrees to be bound by the terms of this Agreement. If the User does not agree to the terms of this Agreement, they should immediately discontinue use of the BlinkShare Bot.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">1. Use of the Bot</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The BlinkShare Bot Owner grants the User a non-exclusive, non-transferable, limited license to use the Bot for personal or non-commercial purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">2. Prohibited Use</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The User may not use the Bot in any way that violates applicable laws, rules, or regulations or infringes upon the rights of any third party. The User may not use the Bot for any commercial purposes without the express written consent of the Bot Owner.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">3. Limitation of Liability</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The Bot Owner shall not be liable for any damages arising out of the use or inability to use the BlinkShare Bot, including but not limited to, damages for loss of profits, loss of data, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">4. Modifications to the Bot</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The Bot Owner may modify or discontinue the Bot at any time without notice. The User agrees that the Bot Owner BARK Protocol shall not be liable to the User or any third party for any modification, suspension, or discontinuance of the Bot.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">5. Intellectual Property</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The Bot and all intellectual property rights therein are and shall remain the property of the BlinkShare Bot Owner. The User agrees not to copy, modify, or distribute the Bot or any portion thereof without the express written consent of the Bot Owner.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">6. Indemnification</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The User agrees to indemnify and hold harmless the Bot Owner, its affiliates, and their respective directors, officers, employees, and agents from any and all claims, damages, liabilities, costs, and expenses, including reasonable attorneys&apos; fees, arising out of the User&apos;s use of the Bot.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">7. Termination</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            This Agreement may be terminated by either party at any time for any reason. Upon termination, the User must immediately cease all use of the BlinkShare Bot.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">8. Governing Law</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            This Agreement shall be governed by and construed in accordance with the laws of [Your country/state/province]. Any dispute arising under or in connection with this Agreement shall be resolved by arbitration in accordance with the rules of [Your arbitration provider].
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">9. Entire Agreement</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            This Agreement constitutes the entire agreement between the parties and supersedes all prior or contemporaneous agreements or representations, whether written or oral, relating to the BlinkShare Bot.
          </p>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            By using the Bot, the User acknowledges that they have read this Agreement, understand it, and agree to be bound by its terms and conditions.
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
