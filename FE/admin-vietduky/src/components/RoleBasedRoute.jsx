import { Navigate, Outlet } from "react-router-dom";
import { StorageService } from "../services/storage/StorageService";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutStaff from "../layouts/LayoutStaff";

// eslint-disable-next-line react/prop-types
export default function RoleBasedRoute({ allowedRoles }) {
    const token = StorageService.getToken();
    const user = StorageService.getUser();
    const isAuthenticated = token && !StorageService.isExpired();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // eslint-disable-next-line react/prop-types
    if (!allowedRoles.includes(user.role_name)) {
        return <Navigate to="/" replace />;
    }

    const Layout = user.role_name === "admin" ? LayoutAdmin : LayoutStaff;

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}
