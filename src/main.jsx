// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";

// Pages
import ProfessionalFinder from "./ProfessionalFinder.jsx";
import SignIn from "./pages/SignIn.jsx";
import JoinProfessional from "./pages/JoinProfessional.jsx";
import ProfessionalDetail from "./pages/ProfessionalDetail.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Layout
import Header from "./components/Header.jsx";

// Simple layout wrapper: can hide header on some pages
function PageLayout({ children, showHeader = true }) {
  return (
    <div className="app-shell">
      {showHeader && <Header />}
      <div className="page-wrapper">{children}</div>
    </div>
  );
}

function AppRouter() {
  // if you ever deploy under a sub-path, use the Vite-provided base URL
  const basename = import.meta.env.BASE_URL || "/";
  return (
    <BrowserRouter basename={basename}>

      <Routes>
        {/* Auth routes (no header) */}
        <Route
          path="/signin"
          element={
            <AuthPage>
              <SignIn />
            </AuthPage>
          }
        />
        <Route
          path="/join"
          element={
            <PageLayout>
              <JoinProfessional />
            </PageLayout>
          }
        />

        {/* Main routes (with header) */}
        {/* Protect main routes - require signed in user */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <PageLayout>
                <ProfessionalFinder />
              </PageLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/professional/:id"
          element={
            <RequireAuth>
              <PageLayout>
                <ProfessionalDetail />
              </PageLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/favorites"
          element={
            <RequireAuth>
              <PageLayout>
                <FavoritesPage />
              </PageLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <PageLayout>
                <HistoryPage />
              </PageLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <PageLayout>
                <Dashboard />
              </PageLayout>
            </RequireAuth>
          }
        />

        {/* Redirect any unknown route to appropriate start page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Simple route guard - protects main application routes
function RequireAuth({ children }) {
  try {
    const json = localStorage.getItem("currentUser");
    const user = json ? JSON.parse(json) : null;
    if (!user?.isLoggedIn) return <Navigate to="/signin" replace />;
    return children;
  } catch {
    return <Navigate to="/signin" replace />;
  }
}

// Redirect authenticated users away from auth pages (signin/join)
function AuthPage({ children }) {
  try {
    const json = localStorage.getItem("currentUser");
    const user = json ? JSON.parse(json) : null;
    if (user?.isLoggedIn) return <Navigate to="/" replace />;
    return <PageLayout showHeader={false}>{children}</PageLayout>;
  } catch {
    return <PageLayout showHeader={false}>{children}</PageLayout>;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
