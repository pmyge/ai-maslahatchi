import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Library,
    HelpCircle,
    Users,
    MessageSquare,
    LogOut,
    Sun,
    Moon,
    Menu,
    X,
    ChevronLeft
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
        { to: "/", icon: LayoutDashboard, label: "Asosiy panel" },
        { to: "/topics", icon: Library, label: "Mavzular" },
        { to: "/faqs", icon: HelpCircle, label: "Savol-javoblar" },
        { to: "/users", icon: Users, label: "Aholi" },
        { to: "/messages", icon: MessageSquare, label: "Xabarlar" },
    ];

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    // Close sidebar on mobile when link is clicked
    const handleLinkClick = () => {
        if (isMobile) toggleSidebar();
    };

    const sidebarVariants = {
        open: { x: 0, width: "288px", opacity: 1 },
        closed: { x: isMobile ? -300 : 0, width: isMobile ? "0px" : "80px", opacity: 1 }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className="fixed lg:relative h-screen glass border-r border-white/10 flex flex-col z-50 overflow-hidden"
            >
                <div className="h-20 flex items-center justify-between px-6 mb-4">
                    <div className={`flex items-center gap-3 ${!isOpen && !isMobile ? 'hidden' : 'flex'}`}>
                        <div className="w-10 h-10 min-w-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                            M
                        </div>
                        <span className="text-xl font-bold text-accent whitespace-nowrap">Maslahatchi</span>
                    </div>
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
                        >
                            <ChevronLeft className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                    )}
                    {isMobile && (
                        <button onClick={toggleSidebar} className="p-2 text-text-secondary">
                            <X size={24} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 space-y-2 px-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={handleLinkClick}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'sidebar-link-active' : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                }`
                            }
                            title={!isOpen ? link.label : ""}
                        >
                            <link.icon size={20} className="min-w-5" />
                            <AnimatePresence>
                                {(isOpen || isMobile) && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="font-medium whitespace-nowrap"
                                    >
                                        {link.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-medium w-full group"
                        title={!isOpen ? "Chiqish" : ""}
                    >
                        <LogOut size={20} className="min-w-5" />
                        <AnimatePresence>
                            {(isOpen || isMobile) && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="whitespace-nowrap"
                                >
                                    Chiqish
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.div>
        </>
    );
};

const Header = ({ toggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-20 glass border-b border-white/10 flex items-center justify-between px-4 sm:px-10 relative z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 lg:hidden text-text-secondary hover:text-accent transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="text-text-secondary font-medium text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                    Jizzax, Do'stlik tumani
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
                <button
                    onClick={toggleTheme}
                    className="p-2 sm:p-3 rounded-xl glass hover:border-accent/50 transition-all text-accent group"
                >
                    {theme === 'dark' ? <Sun size={18} sm:size={20} /> : <Moon size={18} sm:size={20} />}
                </button>

                <div className="flex items-center gap-2 sm:gap-4 border-l border-white/10 pl-2 sm:pl-8">
                    <div className="text-[10px] sm:text-sm text-right hidden xs:block">
                        <div className="font-bold leading-none">Admin</div>
                        <div className="text-[8px] sm:text-xs text-text-secondary">Hokimiyat</div>
                    </div>
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent shadow-inner text-xs sm:text-base">
                        A
                    </div>
                </div>
            </div>
        </header >
    );
};

export const Layout = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(true);
            else setIsSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Decorative blobs */}
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>

                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};
