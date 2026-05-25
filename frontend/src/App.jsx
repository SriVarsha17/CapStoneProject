import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import Root from "./components/RootLayout";
import Register from "./components/Register";
import Login from "./components/Login";
import AddArticle from "./components/AddArticle";
import UserDashboard from "./components/UserDashboard";
import AuthorDashboard from "./components/AuthorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ArticleDetails from "./components/ArticleDetails";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthContextProvider from "./context/AuthContextProvider";

function App() {

const routingObj = createBrowserRouter([
    {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
        { index: true, element: <Register /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        {
          path: "addarticle",
          element: (
            <ProtectedRoute allowedRoles={["author"]}>
              <AddArticle />
            </ProtectedRoute>
          ),
        },
        {
          path: "user-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "author-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["author"]}>
              <AuthorDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "articles/:articleId",
          element: (
            <ProtectedRoute allowedRoles={["user", "author", "admin"]}>
              <ArticleDetails />
            </ProtectedRoute>
          ),
        }
    ]
    }
]);
return (
  <AuthContextProvider>
    <Toaster 
      position="top-right" 
      duration={3000}
      toastOptions={{
        success: {
          duration: 3000,
          style: {
            background: '#4caf50',
            color: '#fff',
          },
        },
      }}
    />
    <RouterProvider router={routingObj} />
  </AuthContextProvider>
);
}

export default App;