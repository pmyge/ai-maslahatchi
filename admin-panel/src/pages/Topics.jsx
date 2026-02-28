import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Zap, Check, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const Topics = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);

    // Pagination state
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [formData, setFormData] = useState({
        title: '',
        emoji: '📂',
        slug: '',
        is_active: true
    });

    useEffect(() => {
        fetchTopics();
    }, [currentPage]);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/topics/?page=${currentPage}`);
            setTopics(response.data.results);
            setCount(response.data.count);
        } catch (error) {
            console.error('Topics error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (topic = null) => {
        if (topic) {
            setEditingTopic(topic);
            setFormData({
                title: topic.title,
                emoji: topic.emoji,
                slug: topic.slug,
                is_active: topic.is_active
            });
        } else {
            setEditingTopic(null);
            setFormData({ title: '', emoji: '📂', slug: '', is_active: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingTopic) {
                await api.patch(`/topics/${editingTopic.id}/`, formData);
            } else {
                await api.post('/topics/', formData);
            }
            fetchTopics();
            setIsModalOpen(false);
        } catch (error) {
            alert("Xatolik yuz berdi. Slug takrorlanmaganligini tekshiring.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Haqiqatan ham ushbu mavzuni o'chirmoqchimisiz?")) {
            try {
                await api.delete(`/topics/${id}/`);
                fetchTopics();
            } catch (error) {
                alert("O'chirishda xatolik yuz berdi.");
            }
        }
    };

    const filteredTopics = topics.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && topics.length === 0) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Mavzular <span className="text-text-secondary text-sm font-normal ml-2">({count})</span></h1>
                    <p className="text-text-secondary text-xs font-medium uppercase tracking-widest mt-1">Bot yo'nalishlarini boshqarish</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenModal()}
                    className="bg-accent text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-accent/20"
                >
                    <Plus size={18} />
                    Yangi qo'shish
                </motion.button>
            </div>

            <div className="glass p-3 rounded-2xl border border-border-primary flex items-center gap-3 focus-within:border-accent/40 shadow-premium">
                <Search className="text-text-secondary ml-2" size={18} />
                <input
                    type="text"
                    placeholder="Qidirish..."
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
                                <th className="px-6 py-4 w-20">Emoji</th>
                                <th className="px-6 py-4">Sarlavha</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Savol soni</th>
                                <th className="px-6 py-4">Holat</th>
                                <th className="px-6 py-4 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary">
                            <AnimatePresence>
                                {filteredTopics.map((topic, index) => (
                                    <motion.tr
                                        key={topic.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-accent/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border-primary flex items-center justify-center text-xl">
                                                {topic.emoji}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-text-primary">{topic.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-[10px] bg-bg-primary px-2 py-1 rounded text-text-secondary font-bold">/{topic.slug}</code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-accent">{topic.faq_count} ta savol</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${topic.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${topic.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="text-[9px] font-black uppercase">{topic.is_active ? 'Faol' : 'Nofaol'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-10 sm:opacity-100 group-hover:opacity-100 transition-all">
                                                <button onClick={() => handleOpenModal(topic)} className="p-2 hover:bg-accent/10 text-accent rounded-lg transition-all"><Edit2 size={14} /></button>
                                                <button onClick={() => handleDelete(topic.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTopic ? "Mavzuni tahrirlash" : "Yangi mavzu qo'shish"}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Emoji</label>
                            <input
                                type="text"
                                maxLength="2"
                                className="w-full bg-bg-primary border border-border-primary rounded-xl p-3 text-2xl text-center outline-none focus:border-accent"
                                value={formData.emoji}
                                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                            />
                        </div>
                        <div className="col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Sarlavha</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-bg-primary border border-border-primary rounded-xl p-3 text-sm font-medium outline-none focus:border-accent"
                                placeholder="Masalan: Bolalar nafaqasi"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Slug (Link uchun)</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-bg-primary border border-border-primary rounded-xl p-3 text-sm font-mono outline-none focus:border-accent"
                            placeholder="children_benefit"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-bg-primary rounded-xl border border-border-primary">
                        <input
                            type="checkbox"
                            id="topic_active"
                            className="w-4 h-4 accent-accent"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <label htmlFor="topic_active" className="text-xs font-bold text-text-primary">Faol holatda</label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 rounded-2xl font-bold text-[10px] text-text-secondary hover:bg-bg-primary transition-colors uppercase tracking-widest"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-[2] bg-accent text-white py-4 rounded-2xl font-bold text-[10px] shadow-lg shadow-accent/10 uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={14} className="animate-saving" />
                                    Saqlanmoqda...
                                </>
                            ) : "Saqlash"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Topics;
