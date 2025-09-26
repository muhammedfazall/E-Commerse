
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/Context";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

 console.log("ProtectedRoute - User:", user);
  console.log("ProtectedRoute - User role:", user?.role);
  console.log("ProtectedRoute - Is loading:", isLoading);


  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no user or user is not an admin, redirect to home
  if (!user || user.role !== "admin") {
    console.log("Redirecting to home - User:", user);
    console.log("User role:", user?.role);
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // User is admin, allow access
  return children;
}