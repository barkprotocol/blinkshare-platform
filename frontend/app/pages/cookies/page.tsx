import React from 'react';
import { NextPage } from 'next';

const CookiesPage: NextPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cookie Policy</h1>
      <p className="mb-4">
        At BlinkShare, we use cookies to enhance your experience. By using our platform, you agree to our cookie policy.
      </p>
      <h2 className="text-xl font-semibold mb-2">What are Cookies?</h2>
      <p className="mb-4">
        Cookies are small files that are stored on your device when you visit a website. They help enhance your browsing experience and remember your preferences.
      </p>
      <h2 className="text-xl font-semibold mb-2">Types of Cookies We Use</h2>
      <p className="mb-4">
        We use different types of cookies for various purposes, including:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Essential Cookies: Necessary for the operation of the website.</li>
        <li>Performance Cookies: Help us understand how users interact with the site.</li>
        <li>Functional Cookies: Enable features like language preferences.</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Managing Your Cookies</h2>
      <p className="mb-4">
        You can manage your cookie preferences through your browser settings. You can choose to accept or decline cookies, but disabling certain cookies may impact your experience.
      </p>
      <h2 className="text-xl font-semibold mb-2">Updates to Our Cookie Policy</h2>
      <p className="mb-4">
        We may update this cookie policy from time to time. Any changes will be posted on this page with an updated date.
      </p>
    </div>
  );
};

export default CookiesPage;
