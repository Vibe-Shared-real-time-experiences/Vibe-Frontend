import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../features/hooks';

const ProtectedRoute = () => {

    const { isAuthenticated } = useAppSelector((state) => state.auth);

    console.log("authenticate: " + isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute