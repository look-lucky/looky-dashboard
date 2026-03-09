import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../shared/lib/auth/authStore';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useEffect } from 'react';

export function DashboardLayout() {
    const logout = useAuthStore((state) => state.logout);
    const sessionExpired = useAuthStore((state) => state.sessionExpired);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOpenLogin = () => {
        window.open('/login', '_blank');
    };

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== 'auth-storage' || !event.newValue) {
                return;
            }

            try {
                const parsed = JSON.parse(event.newValue);
                const nextToken = parsed?.state?.accessToken;

                if (typeof nextToken === 'string' && nextToken.length > 0) {
                    useAuthStore.getState().login(nextToken);
                    useAuthStore.getState().clearSessionExpired();
                }
            } catch (error) {
                console.error('Failed to sync auth state from another tab.', error);
            }
        };

        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50 flex items-center justify-between px-8 shadow-sm">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Looky Dashboard
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors flex items-center space-x-1"
                            title="로그아웃"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">로그아웃</span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white shadow-md"></div>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {sessionExpired && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-600">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-900">로그인이 만료되었습니다</h2>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    현재 작성 중인 내용은 이 탭에 그대로 유지됩니다. 새 탭에서 다시 로그인한 뒤 이 화면으로 돌아와 다시 제출하세요.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                로그아웃
                            </button>
                            <button
                                type="button"
                                onClick={handleOpenLogin}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                새 탭에서 로그인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
