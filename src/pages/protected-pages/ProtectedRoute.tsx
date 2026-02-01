import { Navigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { useEffect } from 'react';
import { fetchUserProfile } from '../../features/auth/authThunk';

const ProtectedRoute = () => {

    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUserProfile());
        }
    }, [isAuthenticated, dispatch]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute