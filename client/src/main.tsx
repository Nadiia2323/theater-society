import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Profile from "./pages/Profile.tsx";
import Home from "./pages/Home.tsx";
import { AuthContextProvider } from "./context/AuhContext.tsx";
import UpdateProfile from "./Components/UpdateProfile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
   {
    path: "/profileSettings",
    element: <UpdateProfile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
