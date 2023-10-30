import GroupExpense from "./Pages/GroupExpensePage.tsx";
import Login from "./Pages/LoginPage.tsx";
import SignUp from "./Pages/SignUpPage.tsx";
import RecentActivityPage from "./Pages/RecentActivityPage.tsx";
import ProfilePage from "./Pages/ProfilePage.tsx";
import Dashboard from "./Pages/DashboardPage.tsx";

export const routesData = [
    {
      path: "/login",
      element: <Login />,
      requiresAuth: false, // Indicates this route doesn't require authentication
    },
    {
      path: "/signup",
      element: <SignUp />,
      requiresAuth: false,
    },
    {
      path: "/",
      element: <Dashboard />,
      requiresAuth: true, // Requires authentication
    },
    {
      path: "/group/:id",
      element: <GroupExpense />,
      requiresAuth: true,
    },
    {
      path: "/recentactivity",
      element: <RecentActivityPage />,
      requiresAuth: true,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
      requiresAuth: true,
    },
  ];