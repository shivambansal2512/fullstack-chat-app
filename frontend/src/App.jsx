import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Rail from "./components/Rail";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div
        data-theme={theme}
        className="h-screen bg-base-200 flex flex-col items-center justify-center gap-3"
      >
        <Loader className="size-8 animate-spin text-primary" />
        <p className="text-sm text-base-content/50">Loading Chatty...</p>
      </div>
    );

  return (
    <div data-theme={theme} className="h-screen bg-base-200 text-base-content">
      {authUser ? (
        // Logged in: the app shell is always on screen, only the right side changes.
        <div className="flex h-full">
          <Rail />
          <main className="flex-1 min-w-0 h-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        // Logged out: full screen auth pages, no shell.
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

      <Toaster position="top-center" toastOptions={{ style: { background: "#131924", color: "#e4e9f0" } }} />
    </div>
  );
};

export default App;
