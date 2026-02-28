import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    ></motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg mx-auto bg-bg-card border border-border-primary rounded-[2rem] shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-border-primary">
                            <h3 className="text-xl font-black tracking-tight">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-accent/10 rounded-xl transition-colors text-text-secondary hover:text-accent"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
