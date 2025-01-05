import { useUserStore } from "@/hooks/use-user-store"; // Adjust path as needed

const SomeComponent = () => {
  // Access the store state and methods
  const { token, isUserLoggedIn, setToken, clearUserData, checkTokenExpiry } = useUserStore((state) => ({
    token: state.token,
    isUserLoggedIn: state.isUserLoggedIn,  // If it's a method in your store
    setToken: state.setToken,
    clearUserData: state.clearUserData,   // If it's a method in your store
    checkTokenExpiry: state.checkTokenExpiry, // If it's a method in your store
  }));

  // Logic for logged-in status
  if (isUserLoggedIn()) {
    console.log("User is logged in");
    // Handle logged-in state
  } else {
    console.log("User is not logged in");
    // Handle logged-out state
  }

  // Example of clearing user data
  clearUserData();

  // Example of checking token expiry
  checkTokenExpiry();

  return <div>Component Content</div>;
};
