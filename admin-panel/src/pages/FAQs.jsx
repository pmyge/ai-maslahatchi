import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Filter, ChevronDown, ChevronUp, HelpCircle, Loader2, Tag, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const FAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);

    // Pagination state
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [formData, setFormData] = useState({
        topic: '',
        question: '',
        answer: '',
        is_active: true
    });

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [faqsRes, topicsRes] = await Promise.all([
                api.get(`/faqs/?page=${currentPage}`),
                api.get('/topics/?limit=100') // Fetch all topics for the dropdown
            ]);
            setFaqs(faqsRes.data.results);
            setCount(faqsRes.data.count);
            setTopics(topicsRes.data.results || topicsRes.data);
        } catch (error) {
            console.error('FAQs loading error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (faq = null) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData({
                topic: faq.topic,
                question: faq.question,
                answer: faq.answer,
                is_active: faq.is_active
            });
        } else {
            setEditingFaq(null);
            setFormData({
                topic: topics.length > 0 ? topics[0].id : '',
                question: '',
                answer: '',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingFaq) {
                await api.patch(`/faqs/${editingFaq.id}/`, formData);
            } else {
                await api.post('/faqs/', formData);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            alert("Xatolik yuz berdi. Maydonlarni tekshiring.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Ushbu FAQni o'chirmoqchimisiz?")) {
            try {
                await api.delete(`/faqs/${id}/`);
                fetchData();
            } catch (error) {
                alert("O'chirishda xatolik.");
            }
        }
    };

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && faqs.length === 0) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Savol-javoblar <span className="text-text-secondary text-sm font-normal ml-2">({count})</span></h1>
                    <p className="text-text-secondary text-xs font-medium uppercase tracking-widest mt-1">Aholi uchun tushuntirishlar bazasi</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenModal()}
                    className="bg-accent text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-accent/20"
                >
                    <Plus size={18} />
                    Yangi FAQ
                </motion.button>
            </div>

            <div className="glass p-3 rounded-2xl border border-border-primary flex items-center gap-3 focus-within:border-accent/40 shadow-premium">
                <Search className="text-text-secondary ml-2" size={18} />
                <input
                    type="text"
                    placeholder="Savol yoki javob bo'yicha qidirish..."
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
                                <th className="px-6 py-4">Mavzu</th>
                                <th className="px-6 py-4">Savol</th>
                                <th className="px-6 py-4">Javob</th>
                                <th className="px-6 py-4">Holat</th>
                                <th className="px-6 py-4 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary">
                            <AnimatePresence>
                                {filteredFaqs.map((faq, index) => (
                                    <motion.tr
                                        key={faq.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-accent/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 px-2 py-1 bg-accent/5 rounded-lg border border-accent/10 w-fit">
                                                <Tag size={12} className="text-accent" />
                                                <span className="text-[10px] font-black text-accent uppercase tracking-tighter truncate max-w-[80px]">
                                                    {faq.topic_title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-text-primary leading-snug max-w-[200px] truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:max-w-none transition-all">
                                                {faq.question}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-text-secondary font-medium leading-relaxed max-w-[300px] truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:max-w-none transition-all">
                                                {faq.answer}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${faq.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${faq.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="text-[9px] font-black uppercase">{faq.is_active ? 'Faol' : 'Nofaol'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-all">
                                                <button onClick={() => handleOpenModal(faq)} className="p-2 hover:bg-accent/10 text-accent rounded-lg transition-all" title="Tahrirlash">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(faq.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all" title="O'chirish">
                                                    <Trash2 size={14} />
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

            {filteredFaqs.length === 0 && (
                <div className="text-center py-20 opacity-40">
                    <HelpCircle size={40} className="mx-auto mb-4 text-text-secondary" />
                    <p className="text-xs font-black uppercase tracking-widest">Ma'lumot topilmadi</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingFaq ? "FAQni tahrirlash" : "Yangi FAQ qo'shish"}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Mavzu</label>
                        <select
                            className="w-full bg-bg-primary border border-border-primary rounded-xl p-3 text-sm font-medium outline-none focus:border-accent appearance-none cursor-pointer"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        >
                            <option value="">Mavzuni tanlang</option>
                            {topics.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.title}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Savol</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-bg-primary border border-border-primary rounded-xl p-3 text-sm font-medium outline-none focus:border-accent"
                            placeholder="Masalan: Nafaqa qachon beriladi?"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Javob (Sodda tushuntirish)</label>
                        <textarea
                            required
                            rows="5"
                            className="w-full bg-bg-primary border border-border-primary rounded-xl p-3 text-sm font-medium outline-none focus:border-accent resize-none custom-scrollbar"
                            placeholder="Savolga aholi tushunadigan tilda javob yozing..."
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-bg-primary rounded-xl border border-border-primary">
                        <input
                            type="checkbox"
                            id="faq_active"
                            className="w-4 h-4 accent-accent"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <label htmlFor="faq_active" className="text-xs font-bold text-text-primary">Faol holatda</label>
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

export default FAQs;
