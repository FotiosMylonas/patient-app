import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Today from "./pages/Today";
import Appointments from "./pages/Appointments";
import Exercises from "./pages/Exercises";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import AppLayout from "./components/AppLayout";
import AppointmentDetail from "./pages/AppointmentDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: "/today", element: <Today /> },
      { path: "/appointments", element: <Appointments /> },
      { path: "/exercises", element: <Exercises /> },
      { path: "/messages", element: <Messages /> },
      { path: "/profile", element: <Profile /> },
      {path : "/appointments/:id", element: <AppointmentDetail/>}
    ],
  },
]);