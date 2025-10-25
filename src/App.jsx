// Color palette
// Orange: #FD4A08
// Dark: #120300

// Modules imports
import { createBrowserRouter, RouterProvider, Navigate, useOutlet, useLocation, useMatches } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import React from "react";

// Components imports
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    element:
      <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          { index: true, element: <div>Discover Page</div> },
          { path: "search", element: <div>Search Page</div> },
          { path: "song/:songId", element: <div>Song Page</div> },
          { path: "album/:albumId", element: <div>Album Page</div> },
          { path: "artist/:artistId", element: <div>Artist Page</div> },
        ],
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/not-found", element: <NotFoundPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "*", element: <Navigate to="/not-found" replace /> },
    ],
  }
]);

function RootLayout() {
  const outletElement = useOutlet();
  const matches = useMatches();
  const topLevel = matches[1];
  const key = topLevel?.route?.id ?? topLevel?.pathname ?? "/";

  return (
    <div className="h-screen w-screen min-w-[375px] overflow-x-auto">
      <AnimatePresence mode="wait">
        {outletElement && React.cloneElement(outletElement, { key })}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
