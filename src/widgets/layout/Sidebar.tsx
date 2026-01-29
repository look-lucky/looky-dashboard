import { Home, ClipboardList, MapPin, Handshake, GraduationCap, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const API_MENU_ITEMS = [
    { name: '홈', path: '/', icon: Home },
    { name: '가게 점유 심사', path: '/reviews', icon: ClipboardList },
    { name: '기초 상권 관리', path: '/commercial-areas', icon: MapPin },
    { name: '제휴 관리', path: '/partnerships', icon: Handshake },
    { name: '대학 관리', path: '/universities', icon: GraduationCap },
    { name: '조직 관리', path: '/organizations', icon: Users },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-20">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="font-bold text-lg">L</span>
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-white">LOOKY ADMIN</h1>
                </div>
            </div>

            <div className="px-4 py-6">
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu</p>
                <nav className="space-y-1">
                    {API_MENU_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                                    isActive
                                        ? 'bg-blue-600/10 text-blue-400 shadow-sm ring-1 ring-blue-600/20'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={clsx("w-5 h-5 mr-3 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white")} />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">AD</span>
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">Admin User</p>
                        <p className="text-xs text-slate-500 truncate">admin@looky.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
