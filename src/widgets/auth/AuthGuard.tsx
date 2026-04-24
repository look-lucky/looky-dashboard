import { useEffect } from 'react';
import { toast } from 'sonner';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../shared/lib/auth/authStore';

export function AuthGuard() {
    const { isAuthenticated, role, authReady, hadAuthenticatedSession, sessionExpired } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authReady) {
            return;
        }

        if (sessionExpired) {
            return;
        }

        if (!isAuthenticated) {
            if (hadAuthenticatedSession) {
                useAuthStore.getState().markSessionExpired();
                return;
            }

            navigate('/login', { replace: true, state: { from: location } });
            return;
        }

        if (role !== 'ROLE_ADMIN') {
            toast.error('관리자 권한이 필요합니다.');
            useAuthStore.getState().logout();
            navigate('/login', { replace: true });
        }
    }, [authReady, hadAuthenticatedSession, isAuthenticated, role, navigate, location, sessionExpired]);

    if (!authReady) {
        return null;
    }

    if (sessionExpired) {
        return <Outlet />;
    }

    if (!isAuthenticated || role !== 'ROLE_ADMIN') {
        return null;
    }

    return <Outlet />;
}
