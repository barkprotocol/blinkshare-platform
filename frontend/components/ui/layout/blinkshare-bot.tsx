'use client';

import Image from 'next/image';
import blinkImage from '@/public/assets/blinkshare-image.png';

const BlinkShareBot = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Introducing BlinkShare Bot for Discord
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Simplify user interactions and enhance your Discord server with BlinkShare Bot.
            Here's how it works:
          </p>

          <div className="space-y-8">
            {[
              {
                title: 'Interact and Send Transactions',
                description:
                  'With BlinkShare Bot, users can directly interact with the app and send transactions, all without leaving Discord.',
              },
              {
                title: 'Instantly Detect Blink URLs',
                description:
                  'The bot detects Blink URLs and instantly provides available actions, simplifying user interactions and saving time.',
              },
              {
                title: 'Secure Solana Wallet Management',
                description:
                  'Users can create and manage their Solana wallet securely without leaving Discord, offering a seamless experience.',
              },
              {
                title: 'Enhanced Wallet Security',
                description:
                  'BlinkShare Bot uses a dedicated Key Management Service (KMS) and Privy.io embedded wallets to ensure wallet security.',
              },
              {
                title: 'Instant Premium Role Assignment',
                description:
                  'After a successful payment, BlinkShare Bot automatically assigns premium roles, giving users instant access to exclusive content.',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="text-xl font-semibold text-gray-700 dark:text-white">
                  <h3>{item.title}</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 mb-8 md:mb-0">
          <Image
            src={blinkImage}
            alt="BlinkShare Bot in action"
            className="rounded-lg shadow-lg w-full max-w-md"
            width={500}
            height={350}
          />
        </div>
      </div>
    </section>
  );
};

export default BlinkShareBot;
