'use client';

import Image from 'next/image';
import blinkImage from '@/public/assets/blinkshare-image.png';

const BlinkShareBot = () => {
  const features = [
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
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2
            className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
            aria-label="Introducing BlinkShare Bot for Discord"
          >
            Introducing BlinkShare Bot for Discord
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Simplify user interactions and enhance your Discord server with BlinkShare Bot.
            Here's how it works:
          </p>

          <ul className="space-y-8">
            {features.map((item, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {/* Icon Placeholder */}
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Image */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <Image
            src={blinkImage}
            alt="BlinkShare Bot in action"
            className="rounded-lg shadow-lg w-full max-w-md mx-auto md:mx-0"
            width={500}
            height={350}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default BlinkShareBot;
