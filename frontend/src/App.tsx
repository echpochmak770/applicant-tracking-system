import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Home from "./pages/Home";

const RootLayout = () => (
  <div className="flex min-h-screen">
    <main>
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
  return <RouterProvider router={router} />;
}
