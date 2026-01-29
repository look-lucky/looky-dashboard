import { Home, ClipboardList, MapPin, Handshake, GraduationCap, Calendar, Store, ChevronDown, ChevronRight, School } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

type MenuItem = {
    name: string;
    path?: string;
    icon: any;
    children?: MenuItem[];
};

const MENU_ITEMS: MenuItem[] = [
    { name: '홈', path: '/', icon: Home },
    {
        name: '가게 관리',
        icon: Store,
        children: [
            { name: '가게 점유 심사', path: '/reviews', icon: ClipboardList },
            { name: '대학별 상권 관리', path: '/commercial-areas', icon: MapPin },
        ]
    },
    { name: '대학 / 소속 관리', path: '/universities', icon: GraduationCap },
    {
        name: '대학별 관리',
        icon: School,
        children: [
            { name: '제휴 관리', path: '/partnerships', icon: Handshake },
            { name: '이벤트 관리', path: '/events', icon: Calendar },
        ]
    }
];

export function Sidebar() {
    const location = useLocation();
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['가게 관리', '대학별 관리']);

    const toggleGroup = (name: string) => {
        setExpandedGroups(prev =>
            prev.includes(name)
                ? prev.filter(g => g !== name)
                : [...prev, name]
        );
    };

    const isGroupActive = (item: MenuItem): boolean => {
        if (!item.children) return false;
        return item.children.some(child => child.path === location.pathname);
    };

    useEffect(() => {
        MENU_ITEMS.forEach(item => {
            if (isGroupActive(item) && !expandedGroups.includes(item.name)) {
                setExpandedGroups(prev => [...prev, item.name]);
            }
        });
    }, [location.pathname]);

    const renderMenuItem = (item: MenuItem, depth = 0) => {
        if (item.children) {
            const isExpanded = expandedGroups.includes(item.name);
            const isActiveGroup = isGroupActive(item);

            return (
                <div key={item.name} className="space-y-1">
                    <button
                        onClick={() => toggleGroup(item.name)}
                        className={clsx(
                            'w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                            isActiveGroup ? 'text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        )}
                    >
                        <div className="flex items-center">
                            <item.icon className={clsx("w-5 h-5 mr-3 transition-colors", isActiveGroup ? "text-blue-400" : "text-slate-500 group-hover:text-white")} />
                            {item.name}
                        </div>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                        <div className="space-y-1">
                            {item.children.map(child => renderMenuItem(child, depth + 1))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <NavLink
                key={item.path}
                to={item.path!}
                className={({ isActive }) =>
                    clsx(
                        'group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                        depth > 0 ? 'ml-4 bg-slate-800/30' : '',
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
        );
    };

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

            <div className="px-4 py-6 flex-1 overflow-y-auto">
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu</p>
                <nav className="space-y-1">
                    {MENU_ITEMS.map(item => renderMenuItem(item))}
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
