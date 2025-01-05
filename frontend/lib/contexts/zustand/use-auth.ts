import { useUserStore } from './blink-store';

// Accessing the token, login status, and other methods
const { token, isUserLoggedIn, setToken, clearUserData, checkTokenExpiry } = useUserStore((state: { token: any; isUserLoggedIn: any; setToken: any; clearUserData: any; checkTokenExpiry: any; }) => ({
  token: state.token,
  isUserLoggedIn: state.isUserLoggedIn,
  setToken: state.setToken,
  clearUserData: state.clearUserData,
  checkTokenExpiry: state.checkTokenExpiry,
}));

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
