import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/query";
import { useMeQuery } from "./api/auth/model/queries";
import { Header } from "./components/layout/header/Header";
import { Toaster } from "./components/ui/sonner";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import VacancyListPage from "./pages/vacancies/VacanciesListPage";
import CreateVacancyPage from "./pages/vacancies/CreateVacancyPage";
import ApplicationsListPage from "./pages/applications/ApplicationsListPage";
// import ApplicationHistoryPage from "./pages/applications/ApplicationHistoryPage";
import CreateApplicationPage from "./pages/applications/CreateApplicationPage";

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
      <main className="w-full max-w-[1440px] mx-auto p-6"> 
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

// const authLoader = async () => {
//   try {
//     return await queryClient.ensureQueryData(useMeQuery.getOptions());
//   } catch (e) {
//     return null;
//   }
// };

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
            path: "vacancies",
            children: [
              { 
                index: true, 
                element: <VacancyListPage /> 
              },
              { 
                path: "create", 
                element: <CreateVacancyPage /> 
              },
              {
                path: ":vacancyId/applications",
                children: [
                  { 
                    index: true, 
                    element: <ApplicationsListPage /> 
                  },
                  { 
                    path: "create", 
                    element: <CreateApplicationPage /> 
                  },
                  // { 
                  //   path: ":applicationId/history", 
                  //   element: <ApplicationHistoryPage /> 
                  // },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
]);

export default function App() {
  return (
    <AgGridProvider modules={modules}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AgGridProvider>
  );
}