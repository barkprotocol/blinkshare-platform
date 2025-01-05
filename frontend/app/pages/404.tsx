"use client";

import { FC } from "react";

const Custom404: FC = () => {
  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-2">Sorry, the page you're looking for doesn't exist.</p>
    </div>
  );
};

export default Custom404;