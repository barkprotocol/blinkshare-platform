import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/">
            <Button size="lg" className="bg-[#d0c8b9] hover:bg-[#c5bdae] text-gray-900" aria-label="Return to Home Page">
              Return Home
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" size="lg" className="bg-white dark:bg-gray-800 bg-opacity-20 hover:bg-opacity-30" aria-label="Explore the Marketplace">
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
