import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Fragment } from 'react';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add custom fonts, metadata, or other external links here */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600&family=Poppins:wght@300;400&display=swap"
            rel="stylesheet"
          />
          {/* You can also add custom scripts or stylesheets */}
        </Head>
        <body className="bg-gray-100 dark:bg-gray-900">
          {/* Main content of Next.js application */}
          <Main />
          {/* Next.js scripts that are needed for the page to function */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
