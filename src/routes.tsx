// routesConfig.js

import { Navigate } from "react-router";
import { RoutesObject } from "./types";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/LoginPage";
import SignUp from "./Pages/SignUpPage";
import Dashboard from "./Pages/DashboardPage";
import GroupExpense from "./Pages/GroupExpensePage";
import RecentActivityPage from "./Pages/RecentActivityPage";
import ProfilePage from "./Pages/ProfilePage";

const routes: RoutesObject = (userInfo) => [
  { id:1, path: "/", element: <LandingPage /> },
  { id:2, path: "/login", element: userInfo ? <Navigate to="/dashboard" /> : <Login /> },
  { id:3, path: "/signup", element: userInfo ? <Navigate to="/dashboard" /> : <SignUp /> },
  { id:4, path: "/dashboard", element: userInfo ? <Dashboard /> : <Navigate to="/login" /> },
  { id:5, path: "/group/:id", element: userInfo ? <GroupExpense /> : <Navigate to="/login" /> },
  { id:6, path: "/recentactivity", element: userInfo ? <RecentActivityPage /> : <Navigate to="/login" /> },
  { id:7, path: "/profile", element: userInfo ? <ProfilePage /> : <Navigate to="/login" /> },
];

export default routes;

