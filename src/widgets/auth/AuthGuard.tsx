import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../shared/lib/auth/authStore';

export function AuthGuard() {
    const { isAuthenticated, role, authReady } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authReady) {
            return;
        }

        if (!isAuthenticated) {
            navigate('/login', { replace: true, state: { from: location } });
            return;
        }

        if (role !== 'ROLE_ADMIN') {
            alert('관리자 권한이 필요합니다.');
            useAuthStore.getState().logout();
            navigate('/login', { replace: true });
        }
    }, [authReady, isAuthenticated, role, navigate, location]);

    if (!authReady || !isAuthenticated || role !== 'ROLE_ADMIN') {
        return null;
    }

    return <Outlet />;
}
