import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ count, currentPage, pageSize, onPageChange }) => {
    const totalPages = Math.ceil(count / pageSize);
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-8 p-4 glass rounded-2xl border-border-primary shadow-premium">
            <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                Jami: <span className="text-accent">{count}</span> ta
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-border-primary hover:bg-accent/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        // Basic logic to show first, last and current page if many
                        if (totalPages > 5) {
                            if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                                if (page === 2 || page === totalPages - 1) return <span key={page} className="text-text-secondary px-1 italic">.</span>;
                                return null;
                            }
                        }
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-8 h-8 rounded-xl text-[10px] font-bold transition-all ${currentPage === page
                                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                        : 'text-text-secondary hover:bg-accent/5'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-border-primary hover:bg-accent/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
