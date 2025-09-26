import { Routes, Route } from "react-router-dom";
import UserRoutes from "./UserRoutes"
import AdminRoutes from "./AdminRoutes";
import ProtectedRoute from "./ProtectedRoute";

export default function MainRoutes() {

    return (
        <Routes>
            {/* User side */}
            <Route path="/*" element={<UserRoutes/>} />

            {/* Admin side */}
            <Route path="/admin/*" element={
                <ProtectedRoute>
                    <AdminRoutes/>
                </ProtectedRoute>
            } />
        </Routes>
    )
}