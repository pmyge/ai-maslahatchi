import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, User as UserIcon, Trash2, ShieldCheck, ShieldAlert, Hash, Globe } from 'lucide-react';
import api from '../services/api';
import Pagination from '../components/Pagination';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/users/?page=${currentPage}`);
            setUsers(response.data.results);
            setCount(response.data.count);
        } catch (error) {
            console.error('Users error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.telegram_id.toString().includes(searchTerm)
    );

    if (loading && users.length === 0) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Aholi <span className="text-text-secondary text-sm font-normal ml-2">({count})</span></h1>
                    <p className="text-text-secondary text-xs font-medium uppercase tracking-widest mt-1">Bot foydalanuvchilari bazasi</p>
                </div>
            </div>

            <div className="glass p-3 rounded-2xl border border-border-primary flex items-center gap-3 focus-within:border-accent/40 shadow-premium">
                <Search className="text-text-secondary ml-2" size={18} />
                <input
                    type="text"
                    placeholder="Ism yoki Telegram ID orqali qidirish..."
                    className="bg-transparent border-none outline-none flex-1 text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="card-premium border-border-primary overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-text-secondary border-b border-border-primary bg-accent/[0.02]">
                                <th className="px-6 py-4">Foydalanuvchi</th>
                                <th className="px-6 py-4">Telegram ID</th>
                                <th className="px-6 py-4">Til</th>
                                <th className="px-6 py-4">Sana</th>
                                <th className="px-6 py-4 text-right">Harakat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary">
                            <AnimatePresence>
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-accent/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent shadow-inner">
                                                    {user.full_name ? user.full_name[0] : 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-text-primary">{user.full_name || 'Noma\'lum'}</div>
                                                    <div className="text-[10px] text-text-secondary font-medium tracking-tight">@{user.username || 'username_yoq'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-xs font-mono text-text-secondary">
                                                <Hash size={12} className="opacity-40" />
                                                {user.telegram_id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Globe size={12} className="text-text-secondary" />
                                                <span className="text-[10px] font-black bg-bg-primary text-text-secondary px-2 py-0.5 rounded-md uppercase border border-border-primary">
                                                    {user.language_code || 'uz'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                                                <Calendar size={14} className="opacity-40" />
                                                {new Date(user.created_at).toLocaleDateString('uz-UZ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-all">
                                                <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all" title="O'chirish">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                count={count}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />

            {filteredUsers.length === 0 && (
                <div className="text-center py-20 opacity-40">
                    <UserIcon size={40} className="mx-auto mb-4 text-text-secondary" />
                    <p className="text-xs font-black uppercase tracking-widest">Foydalanuvchilar topilmadi</p>
                </div>
            )}
        </div>
    );
};

export default Users;
