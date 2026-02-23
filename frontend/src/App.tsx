import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Home from "./pages/Home";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";

const modules = [AllCommunityModule];

const RootLayout = () => (
  <div className="flex min-h-screen">
    <main className="min-w-360 m-auto">
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
        path: "candidates",
        element: <div>Список кандидатов</div>,
      },
    ],
  },
]);

export default function App() {
  return (
    <AgGridProvider modules={modules}>
      <RouterProvider router={router} />
    </AgGridProvider>
  );
}
