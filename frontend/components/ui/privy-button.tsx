import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface PrivyButtonProps {
  label: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const PrivyButton: React.FC<PrivyButtonProps> = ({ label, onSuccess, onError }) => {
  const { login, user, loading, error } = usePrivy();

  const handleLogin = async () => {
    try {
      const res = await login(); // Trigger login process
      if (res) {
        onSuccess?.(); // If successful, trigger onSuccess callback
      }
    } catch (err) {
      console.error('Privy login error:', err);
      onError?.(err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="w-full p-3 mt-4 text-white bg-gray-950 rounded-lg hover:bg-black disabled:bg-gray-400 flex justify-center items-center"
    >
      {loading ? (
        <div className="animate-spin border-t-2 border-b-2 border-white w-5 h-5 rounded-md"></div>
      ) : (
        label
      )}
    </button>
  );
};

export default PrivyButton;
