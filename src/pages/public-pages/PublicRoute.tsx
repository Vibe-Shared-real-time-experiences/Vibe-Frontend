import { useAppSelector } from '../../features/hooks';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {

    const { isAuthenticated } = useAppSelector((state) => state.auth);

    console.log("authenticate: " + isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default PublicRoute