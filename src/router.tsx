import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Today from "./pages/Today";
import Appointments from "./pages/Appointments";
import Exercises from "./pages/Exercises";
import Profile from "./pages/Profile";
import AppLayout from "./components/AppLayout";
import AppointmentDetail from "./pages/AppointmentDetail";
import  QuestionnaireDetail from "./pages/QuestionnaireDetail";
import Questionnaires from "./pages/Questionnaires";



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
      { path: "/questionnaires", element: <Questionnaires /> },
      { path: "/questionnaires/:id", element: <QuestionnaireDetail /> },
      { path: "/profile", element: <Profile /> },
      {path : "/appointments/:id", element: <AppointmentDetail/>}
    ],
  },
]);