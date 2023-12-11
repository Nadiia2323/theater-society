import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Profile from "./pages/Profile.tsx";
import Home from "./pages/Home.tsx";
import { AuthContextProvider } from "./context/AuhContext.tsx";
import UpdateProfile from "./Components/UpdateProfile.tsx";
import ProtectedRoute from "./context/ProtectedRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
        </ProtectedRoute>),
  },
   {
    path: "/profileSettings",
     element: (<ProtectedRoute>
      <UpdateProfile />
    </ProtectedRoute>),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
