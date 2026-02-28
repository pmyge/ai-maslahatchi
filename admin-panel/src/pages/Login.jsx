import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/token/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            navigate('/');
        } catch (err) {
            setError('Username yoki parol noto\'g\'ri!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden text-text-primary">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-xl w-full glass p-12 md:p-16 rounded-[3rem] border border-white/10 flex flex-col items-center relative z-10 shadow-2xl"
            >
                <motion.div
                    initial={{ rotate: -20, scale: 0.5 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="w-24 h-24 rounded-3xl bg-accent mb-10 flex items-center justify-center shadow-2xl shadow-accent/40 text-white"
                >
                    <ShieldCheck size={48} />
                </motion.div>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black mb-4 tracking-tighter">Xush kelibsiz!</h1>
                    <p className="text-text-secondary text-lg font-medium">Do'stlik tumani AI Maslahatchisi <br /> admin paneliga kiring</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="w-full mb-8 overflow-hidden"
                        >
                            <div className="p-4 bg-red-400/10 border border-red-400/20 text-red-400 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2">
                                <Zap size={16} />
                                {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="w-full space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-black text-text-secondary uppercase tracking-widest ml-2">Username</label>
                        <div className="glass border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 focus-within:border-accent/50 transition-all group">
                            <User size={22} className="text-text-secondary group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                required
                                className="bg-transparent border-none outline-none flex-1 text-text-primary text-lg font-medium placeholder:text-text-secondary/30"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-text-secondary uppercase tracking-widest ml-2">Parol</label>
                        <div className="glass border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 focus-within:border-accent/50 transition-all group">
                            <Lock size={22} className="text-text-secondary group-focus-within:text-accent transition-colors" />
                            <input
                                type="password"
                                required
                                className="bg-transparent border-none outline-none flex-1 text-text-primary text-lg font-medium placeholder:text-text-secondary/30"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 30px -10px rgba(14, 165, 233, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-accent text-white font-black text-xl py-5 rounded-[2rem] transition-all shadow-xl shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{loading ? 'Kirilmoqda...' : 'Kirish'}</span>
                        {!loading && <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </motion.button>
                </form>

                <div className="mt-12 text-center text-text-secondary text-sm font-bold uppercase tracking-widest">
                    Jizzax Viloyati, Do'stlik Tumani Hokimiyati
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
