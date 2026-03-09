import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import LoginPage from "./pages/landing/Auth";
import RegisterPage from "./pages/landing/Register";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/query";
import { useState } from "react";
import ApplicationHistory from "./pages/ApplicationHistory";
import { useMeQuery } from "./api/auth/model/queries";
import { Header } from "./components/layout/header/Header";

const modules = [AllCommunityModule];

const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useMeQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }
  if (isError || !user) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
};

const RootLayout = () => {
  const { data: user } = useMeQuery();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={user}/>
      <main className="w-full max-w-[1440px] m-auto p-6"> 
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <LoginPage />,
  },
  {
    path: "/register",
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
            path: "vacancies/:vacancyId/applications/:applicationId/history", 
            element: <ApplicationHistory /> 
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
  const [stateQueryClient] = useState(() => queryClient);
  return (
    <AgGridProvider modules={modules}>
      <QueryClientProvider client={stateQueryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AgGridProvider>
  );
}