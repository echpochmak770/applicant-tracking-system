import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/query";
import { useMeQuery } from "./api/auth/model/queries";
import { Header } from "./components/layout/header/Header";
import { Toaster } from "./components/ui/sonner";
import { Suspense } from "react";
import { lazy } from "react";
import Loader from "./components/ui/loader";

const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const VacancyListPage = lazy(
  () => import("./pages/vacancies/VacanciesListPage"),
);
const CreateVacancyPage = lazy(
  () => import("./pages/vacancies/CreateVacancyPage"),
);
const UpdateVacancyPage = lazy(
  () => import("./pages/vacancies/UpdateVacancyPage"),
);
const ApplicationsListPage = lazy(
  () => import("./pages/applications/ApplicationsListPage"),
);
const ApplicationHistoryPage = lazy(
  () => import("./pages/applications/ApplicationHistoryPage"),
);
const CreateApplicationPage = lazy(
  () => import("./pages/applications/CreateApplicationPage"),
);
const UpdateApplicationPage = lazy(
  () => import("./pages/applications/UpdateApplicationPage"),
);

const StagesBoardPage = lazy(() => import("./pages/stages/StagesBoardPage"));

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
      <Header user={user} />
      <main className="w-full max-w-[1440px] mx-auto p-6">
        <Outlet />
      </main>
      <Toaster />
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
            path: "vacancies",
            children: [
              {
                index: true,
                element: <VacancyListPage />,
              },
              {
                path: "create",
                element: <CreateVacancyPage />,
              },
              {
                path: "update/:vacancyId",
                element: <UpdateVacancyPage />,
              },
              {
                path: ":vacancyId/applications",
                children: [
                  {
                    index: true,
                    element: <ApplicationsListPage />,
                  },
                  {
                    path: "create",
                    element: <CreateApplicationPage />,
                  },
                  {
                    path: ":applicationId/update",
                    element: <UpdateApplicationPage />,
                  },
                  {
                    path: ":applicationId/history",
                    element: <ApplicationHistoryPage />,
                  },
                ],
              },
            ],
          },
          {
            path: "stages",
            element: <StagesBoardPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AgGridProvider modules={modules}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </AgGridProvider>
  );
}
