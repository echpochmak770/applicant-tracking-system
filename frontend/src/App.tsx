import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import LoginPage from "./pages/landing/Auth";
import RegisterPage from "./pages/landing/Register";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";

const modules = [AllCommunityModule];

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("auth_token") === "true"; 

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

const RootLayout = () => (
  <div className="flex min-h-screen bg-background">
    <main className="w-full max-w-[1440px] m-auto p-6"> 
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: "auth",
    element: <LoginPage />,
  },
    {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, 
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true, 
            element: <Navigate to="/vacancies" replace />,
          },
          {
            path: "vacancies",
            element: <Home />,
          },
          {
            path: "applications/:id",
            element: <Applications />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return (
    <AgGridProvider modules={modules}>
      <RouterProvider router={router} />
    </AgGridProvider>
  );
}