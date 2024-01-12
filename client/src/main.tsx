import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Profile from "./pages/Profile.tsx";
import Home from "./pages/Home.tsx";
import { AuthContextProvider } from "./context/AuhContext.tsx";
import UpdateProfile from "./Components/UpdateProfile.tsx";
import ProtectedRoute from "./context/ProtectedRoute.tsx";
import AllUsers from "./pages/AllUsers.tsx";
import UserPage from "./pages/UserPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: (
      //! this is causing issue with navigate after login
     <ProtectedRoute>
        <Profile />
     </ProtectedRoute>
    ),
  },
  {
    path: "allUsers",
    element:<AllUsers/>
  },
  {
    path:"/user/:userId" ,
    element: <UserPage />
  },
  {
    path: "/profileSettings",
    element: (
      <ProtectedRoute>
        <UpdateProfile />
      </ProtectedRoute> 
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
