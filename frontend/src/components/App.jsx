import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Home from './pages/Home';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyClient from './pages/VerifyClient';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return children;
}

// redirect authenticated users to home page
const RedirectAuthenticatedUserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // The checkAuth function makes an API request to check if the user is authenticated.
  // If the user is authenticated, it updates the store state with isAuthenticated: true and stores the user's details in user.

  useEffect(() => { // handles side effects by checking and updating & re-rendering states
    checkAuth();
  }, [checkAuth]);

  // console.log("isAuthenticated", isAuthenticated);
  // console.log("user", user);

  return (
    <div className="min-h-screen bg-gradient-to-tl from-gray-700/95 via-black to-gray-700/95 flex items-center justify-center relative overflow-hidden">

      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/sign-up' element={
          <RedirectAuthenticatedUserRoute>
            <Signup />
          </RedirectAuthenticatedUserRoute>
        } />
        <Route path='/login' element={
          <RedirectAuthenticatedUserRoute>
            <Login />
          </RedirectAuthenticatedUserRoute>
        } />
        <Route path='/verify-email' element={
          <RedirectAuthenticatedUserRoute>
            <VerifyClient />
          </RedirectAuthenticatedUserRoute>
        } />
        <Route path='/forgot-password' element={
          <RedirectAuthenticatedUserRoute>
            <ForgotPassword />
          </RedirectAuthenticatedUserRoute>
        } />
        <Route path='/reset-password/:token' element={
          <RedirectAuthenticatedUserRoute>
            <ResetPassword />
          </RedirectAuthenticatedUserRoute>
        } />
        <Route path='*' element={<Navigate to="/" replace /> } />
      </Routes>
    </div>
  );
}

export default App;
