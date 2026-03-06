import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux';

export const ProtectedRoute = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};
