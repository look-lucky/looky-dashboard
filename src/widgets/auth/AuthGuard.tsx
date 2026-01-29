import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../shared/lib/auth/authStore';

export function AuthGuard() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }, [isAuthenticated, navigate, location]);

    if (!isAuthenticated) {
        return null; // or a loading spinner
    }

    return <Outlet />;
}
