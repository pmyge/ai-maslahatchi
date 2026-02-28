import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Clock, User, Tag } from 'lucide-react';
import api from '../services/api';
import Pagination from '../components/Pagination';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/messages/?page=${currentPage}`);
                setMessages(response.data.results);
                setCount(response.data.count);
            } catch (error) {
                console.error('Messages loading error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [currentPage]);

    const filteredMessages = messages.filter(m =>
        m.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && messages.length === 0) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Xabarlar tarixi <span className="text-text-secondary text-sm font-normal ml-2">({count})</span></h1>
                    <p className="text-text-secondary text-xs font-medium uppercase tracking-widest mt-1">Bot va aholi o'rtasidagi muloqotlar</p>
                </div>
            </div>

            <div className="glass p-3 rounded-2xl border border-border-primary flex items-center gap-3 focus-within:border-accent/40 shadow-premium">
                <Search className="text-text-secondary ml-2" size={18} />
                <input
                    type="text"
                    placeholder="Xabar matni yoki ism bo'yicha qidirish..."
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
                                <th className="px-6 py-4">Mavzu</th>
                                <th className="px-6 py-4">Xabar matni</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4 text-right">Vaqt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary">
                            {filteredMessages.map((msg, index) => (
                                <motion.tr
                                    key={msg.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.01 }}
                                    className="group hover:bg-accent/5 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-[10px] font-bold">
                                                {msg.user_name?.[0] || 'U'}
                                            </div>
                                            <div className="text-xs font-bold text-text-primary whitespace-nowrap">{msg.user_name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {msg.topic_title ? (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-accent/5 rounded-lg border border-accent/10 w-fit">
                                                <Tag size={10} className="text-accent" />
                                                <span className="text-[10px] font-bold text-accent">{msg.topic_title}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-text-secondary font-medium">Erkin matn</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-text-secondary max-w-xs truncate font-medium group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                                            {msg.text}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${msg.role === 'user' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {msg.role === 'user' ? 'SAVOL' : 'JAVOB'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-[10px] text-text-secondary font-medium">
                                            <Clock size={12} className="opacity-50" />
                                            {new Date(msg.timestamp).toLocaleString('uz-UZ', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
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

            {filteredMessages.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <MessageSquare size={40} className="mx-auto mb-4 text-text-secondary" />
                    <p className="text-sm font-bold">Muloqotlar topilmadi</p>
                </div>
            )}
        </div>
    );
};

export default Messages;
