import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Building2,
    LogOut,
    Menu,
    ClipboardList,
    UserPlus,
    Search,
    ChevronRight,
    Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../ui';

interface SidebarItem {
    name: string;
    path: string;
    icon: React.ElementType;
    roles: string[];
}

const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['hr', 'tenant'] },
    { name: 'Doctors', path: '/admin/doctors', icon: Users, roles: ['hr', 'tenant'] },
    { name: 'Departments', path: '/admin/departments', icon: Building2, roles: ['hr', 'tenant'] },
    { name: 'Queue Feed', path: '/admin/queue', icon: ClipboardList, roles: ['hr', 'tenant'] },

    { name: 'Network Hub', path: '/superadmin', icon: LayoutDashboard, roles: ['superadmin'] },
    { name: 'Manage Hospitals', path: '/superadmin/hospitals', icon: Building2, roles: ['superadmin'] },

    { name: 'Patient Queue', path: '/doctor', icon: LayoutDashboard, roles: ['doctor'] },
    { name: 'Detailed Queue', path: '/doctor/queue', icon: ClipboardList, roles: ['doctor'] },

    { name: 'Register Patient', path: '/patient/register', icon: UserPlus, roles: ['hr', 'employee'] },
    { name: 'Patient Lookup', path: '/patient/lookup', icon: Search, roles: ['hr', 'employee'] },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const filteredItems = sidebarItems.filter(item =>
        item.roles.some(role => user?.rolelist.includes(role))
    );

    return (
        <div className="min-h-screen bg-clinical-surface flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-clinical-text/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-clinical-border transition-all duration-300 lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0 shadow-premium" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col p-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-12 px-2">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-brand-100">
                            <Building2 size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-display font-bold text-clinical-text leading-tight">Antigravity</span>
                            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Medical Center</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 custom-scrollbar">
                        <p className="px-3 text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] mb-4 opacity-70">Clinical Management</p>
                        {filteredItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "group flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all",
                                        isActive
                                            ? "bg-brand-600 text-white shadow-lg shadow-brand-100"
                                            : "text-clinical-slate hover:bg-clinical-surface hover:text-clinical-text"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <Icon size={18} className={cn(isActive ? "text-white" : "text-clinical-slate group-hover:text-brand-600")} />
                                    <span className="text-sm font-semibold">{item.name}</span>
                                    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="pt-6 border-t border-clinical-border">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-clinical-surface/50 border border-clinical-border/50 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-clinical-border flex items-center justify-center font-bold text-brand-600 shadow-sm">
                                {user?.name?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-clinical-text truncate">{user?.name}</p>
                                <p className="text-[10px] font-bold text-clinical-slate uppercase tracking-wider">{user?.rolelist[0]}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-xs"
                        >
                            <LogOut size={16} />
                            <span>Sign Out System</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-clinical-border flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-clinical-slate hover:bg-clinical-surface rounded-xl"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg font-display font-bold text-clinical-text hidden sm:block">
                            {sidebarItems.find(i => i.path === location.pathname)?.name || "Clinical Console"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-3 bg-clinical-surface px-4 py-2.5 rounded-2xl border border-clinical-border">
                            <Search size={16} className="text-clinical-slate" />
                            <input
                                type="text"
                                placeholder="Search medical records..."
                                className="bg-transparent border-none outline-none text-xs font-semibold w-64 placeholder:text-clinical-slate/50"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2.5 text-clinical-slate hover:bg-clinical-surface rounded-xl relative transition-all">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </button>
                            <div className="h-6 w-[1px] bg-clinical-border mx-2" />
                            <div className="text-right">
                                <p className="text-[10px] font-black text-clinical-slate uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                <p className="text-xs font-bold text-clinical-text">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto custom-scrollbar animate-fade-in bg-clinical-surface/50">
                    <div className="max-w-[1400px] mx-auto pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
