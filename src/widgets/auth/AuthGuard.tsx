import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../shared/lib/auth/authStore';

export function AuthGuard() {
    const { isAuthenticated, role } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true, state: { from: location } });
        } else if (role !== 'ROLE_ADMIN') {
            alert('관리자 권한이 필요합니다.');
            useAuthStore.getState().logout();
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, role, navigate, location]);

    if (!isAuthenticated || role !== 'ROLE_ADMIN') {
        return null; // or a loading spinner
    }

    return <Outlet />;
}
