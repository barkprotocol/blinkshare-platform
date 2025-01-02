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
            <div className="flex items-start space-x-4">
              <div className="text-xl font-semibold text-gray-700 dark:text-white">
                <h3>Interact and Send Transactions</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-300">
                With BlinkShare Bot, users can directly interact with the app and send transactions, all without leaving Discord.
              </p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-xl font-semibold text-gray-700 dark:text-white">
                <h3>Instantly Detect Blink URLs</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-300">
                The bot detects Blink URLs and instantly provides available actions, simplifying user interactions and saving time.
              </p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-xl font-semibold text-gray-700 dark:text-white">
                <h3>Secure Solana Wallet Management</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-300">
                Users can create and manage their Solana wallet securely without leaving Discord, offering a seamless experience.
              </p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-xl font-semibold text-gray-700 dark:text-white">
                <h3>Enhanced Wallet Security</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-300">
                BlinkShare Bot uses a dedicated Key Management Service (KMS) and Privy.io embedded wallets to ensure wallet security.
              </p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-xl font-semibold text-gray-700 dark:text-white">
                <h3>Instant Premium Role Assignment</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-300">
                After a successful payment, BlinkShare Bot automatically assigns premium roles, giving users instant access to exclusive content.
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 mb-8 md:mb-0">
          <Image
            src={blinkImage}
            alt="BlinkShare Bot in action"
            className="rounded-lg shadow-lg"
            width={500} // Adjust the width as needed
            height={350} // Adjust the height as needed
          />
        </div>
      </div>
    </section>
  );
};

export default BlinkShareBot;
