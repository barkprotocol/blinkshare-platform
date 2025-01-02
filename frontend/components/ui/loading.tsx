import React from "react";
import SpinnerSvg from "./spinner-svg";

export const LoadingSpinner = ({ message }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <SpinnerSvg className="animate-spin h-8 w-8 text-gray-500" />
      {message && <p className="text-gray-500 text-lg">{message}</p>}
    </div>
  );
};
