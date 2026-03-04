import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/query";
import { useState } from "react";

const modules = [AllCommunityModule];

const RootLayout = () => (
  <div className="flex min-h-screen">
    <main className="w-full max-w-360 m-auto">
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "applications/:id",
        element: <Applications />,
      },
    ],
  },
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
