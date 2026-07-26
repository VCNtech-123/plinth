
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Clients from "../pages/clients/Clients";
import ClientDetails from "../pages/clients/ClientDetails";
import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";
import Tasks from "../pages/tasks/Tasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "clients",
        element: <Clients />
      },
      {
        path: "clients/:id",
        element: <ClientDetails />
      },
      {
        path: "projects",
        element: <Projects />
      },
      {
        path: "projects/:id",
        element: <ProjectDetails />
      },
      {
        path: "tasks",
        element: <Tasks />
      }
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />
      }
    ]
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};