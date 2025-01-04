import { useUserStore } from '@/hooks/use-user-store';

const UserMarketplace = () => {
  const { token, userData, discordConnected, discordDisconnected, setToken } = useUserStore();
  
  // Logging store data for debugging
  console.log(token, userData, discordConnected, discordDisconnected);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to the User Marketplace</h1>
      
      {/* User status */}
      {discordConnected ? (
        <p className="text-green-500">Discord Connected</p>
      ) : (
        <p className="text-red-500">Discord Disconnected</p>
      )}

      {/* Display User Data */}
      {userData ? (
        <div className="mt-4">
          <h2 className="text-xl">Welcome, {userData.username}</h2>
          <img 
            src={userData.avatarUrl} 
            alt="User Avatar" 
            className="rounded-full w-16 h-16 mt-2"
          />
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Loading user data...</p>
      )}

      {/* Marketplace content */}
      <div className="mt-6">
        <h3 className="text-lg">Browse the Marketplace:</h3>
        {/* Add marketplace-related content here */}
      </div>
    </div>
  );
};

export default UserMarketplace;
