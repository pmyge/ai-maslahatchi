import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    MessageSquare,
    TrendingUp,
    Activity,
    ArrowUpRight,
    Clock,
    ExternalLink
} from 'lucide-react';
import {
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis
} from 'recharts';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, trend, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="card-premium p-5 relative overflow-hidden group"
    >
        <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <Icon size={20} className="text-accent group-hover:text-white" />
            </div>
            <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trend >= 0 ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-0.5 rounded-full`}>
                <ArrowUpRight size={10} className={trend < 0 ? 'rotate-90' : ''} />
                {Math.abs(trend)}%
            </div>
        </div>

        <div className="mt-4 relative z-10">
            <div className="text-2xl font-black mb-0.5 tracking-tight text-text-primary">
                {value}
            </div>
            <div className="text-text-secondary text-xs font-medium uppercase tracking-wider">{title}</div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentMessages, setRecentMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, messagesRes] = await Promise.all([
                    api.get('/stats/'),
                    api.get('/messages/')
                ]);

                // Set stats with safe defaults
                setStats(statsRes.data || {});

                // Handle both paginated and non-paginated message responses
                const messagesData = messagesRes.data.results || messagesRes.data;
                setRecentMessages(Array.isArray(messagesData) ? messagesData.slice(0, 5) : []);

            } catch (error) {
                console.error('Dashboard data error:', error);
                // Set empty states to prevent undefined errors
                setStats({});
                setRecentMessages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        Asosiy panel <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-lg">Real-vaqt</span>
                    </h1>
                    <p className="text-text-secondary text-sm font-medium">Do'stlik tumani bot statistikasi</p>
                </div>
                <div className="text-xs font-medium text-text-secondary glass px-3 py-1.5 rounded-xl border-white/5 flex items-center gap-2">
                    <Clock size={12} />
                    Bugun: {new Date().toLocaleDateString('uz-UZ')}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Jami aholi" value={stats?.total_users || 0} icon={Users} trend={12} index={0} />
                <StatCard title="Murojaatlar" value={stats?.total_messages || 0} icon={MessageSquare} trend={18} index={1} />
                <StatCard title="Haftalik faollik" value={stats?.new_users_7d || 0} icon={Activity} trend={5} index={2} />
                <StatCard title="Yangi xabarlar" value={stats?.new_messages_7d || 0} icon={TrendingUp} trend={24} index={3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-premium p-6 h-[400px] flex flex-col">
                        <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary mb-6 flex items-center justify-between">
                            Haftalik murojaatlar
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                                <div className="w-2 h-2 rounded-full bg-accent/20"></div>
                            </div>
                        </h3>
                        <div className="flex-1 w-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.daily_messages || []}>
                                    <defs>
                                        <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.03} vertical={false} />
                                    <XAxis dataKey="date" stroke="currentColor" opacity={0.3} fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="currentColor" opacity={0.3} fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-card)',
                                            borderColor: 'var(--border-primary)',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            boxShadow: 'var(--shadow-md)'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMessages)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card-premium p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary">So'ngi xabarlar</h3>
                            <button
                                onClick={() => navigate('/messages')}
                                className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                            >
                                Barchasini ko'rish <ExternalLink size={10} />
                            </button>
                        </div>
                        <div className="overflow-x-auto -mx-6 px-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase text-text-secondary border-b border-border-primary">
                                        <th className="pb-3">Foydalanuvchi</th>
                                        <th className="pb-3 text-center">Rol</th>
                                        <th className="pb-3">Murojaat</th>
                                        <th className="pb-3 text-right">Vaqt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-primary">
                                    {recentMessages.map((msg, i) => (
                                        <tr key={msg.id} className="group hover:bg-accent/5 transition-colors">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
                                                        {msg.user_name?.[0] || 'U'}
                                                    </div>
                                                    <div className="text-xs font-bold text-text-primary whitespace-nowrap">{msg.user_name}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${msg.role === 'user' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    {msg.role === 'user' ? 'SAVOL' : 'JAVOB'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-xs text-text-secondary truncate max-w-[200px] font-medium">
                                                {msg.text}
                                            </td>
                                            <td className="py-3 text-right text-[10px] font-medium text-text-secondary">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card-premium p-6 flex flex-col h-full">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary mb-6">Top Mavzular</h3>
                    <div className="flex-1 space-y-3">
                        {stats?.top_topics?.map((topic, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ x: 3 }}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/5 border border-transparent hover:border-accent/10 transition-all cursor-default"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{topic.topic__emoji}</span>
                                    <div>
                                        <div className="text-xs font-bold text-text-primary">{topic.topic__title}</div>
                                        <div className="text-[9px] text-text-secondary uppercase tracking-wider font-bold">Bot bo'limi</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-accent">{topic.count}</div>
                                    <div className="text-[8px] text-text-secondary uppercase font-bold">marta</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border-primary">
                        <div className="bg-accent/10 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20">
                                <Activity size={20} />
                            </div>
                            <div>
                                <div className="text-xs font-black text-text-primary">Analitika kuchi</div>
                                <p className="text-[9px] text-text-secondary font-medium mt-0.5">Tuman aholisi ehtiyojlarini o'rganing.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
