import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function IncomeView({ user, handleLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [income, setIncome] = useState(null);
    const [loading, setLoading] = useState(true);

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };
    };

    useEffect(() => {
        const fetchIncomeDetails = async () => {
            try {
                const response = await axios.get(`https://api.fincapify.com/api/incomes/${id}`, {
                    headers: getHeaders()
                });
                if (response.data.status) {
                    setIncome(response.data.data);
                }
            } catch (err) {
                console.error("Failed to load transaction profile", err);
                alert("Could not load transaction details.");
                navigate('/admin/incomes');
            } finally {
                setLoading(false);
            }
        };
        fetchIncomeDetails();
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const total = Number(income?.total_amount || 0);
    const received = Number(income?.received_amount || 0);
    const paymentPercentage = total > 0 ? Math.min(Math.round((received / total) * 100), 100) : 0;

    return (
        /* Outer flex container - handles responsive row/column stack */
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-100 flex flex-col md:flex-row">
            
            {/* ✅ बिना किसी wrapper div के सीधे Sidebar को रखें */}
            <Sidebar user={user} handleLogout={handleLogout} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />
                
                {/* Responsive main space padding */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-6">
                    
                    {/* Header bar - FIXED INVISIBLE BUTTON BACKGROUND */}
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 max-w-5xl w-full bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[24px] border border-pink-200 shadow-md">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Receipt Voucher</h1>
                            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Audit Ledger ID: <span className="font-extrabold text-pink-600">#{id}</span></p>
                        </div>
                        {/* Inline style fallback for robust button backgrounds */}
                        <button 
                            onClick={() => navigate('/admin/incomes')}
                            className="w-full sm:w-auto px-5 py-3 text-white font-black rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
                            style={{ backgroundColor: '#0f172a' }} // Slate-900 Solid Hex Fallback
                        >
                            <i className="fa-solid fa-arrow-left text-xs text-white"></i> Back to Ledger
                        </button>
                    </div>

                    {loading ? (
                        <div className="max-w-5xl bg-white p-12 sm:p-20 rounded-2xl sm:rounded-[24px] flex justify-center items-center border border-pink-200 shadow-md">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
                        </div>
                    ) : income ? (
                        <div className="max-w-5xl grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 items-start">
                            
                            {/* Column 1 (Left 1/3) - The Invoice Paper Slip */}
                            <div className="xl:col-span-1 bg-white rounded-2xl sm:rounded-3xl border border-pink-200 shadow-xl p-5 sm:p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100/30 rounded-full blur-2xl"></div>
                                
                                {/* Client Badge Icon - FIXED SQUISHING & INVISIBLE BACKGROUND */}
                                <div className="flex flex-col items-center text-center pb-6 border-b border-dashed border-slate-200 relative z-10">
                                    <div 
                                        className="h-14 w-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg mb-4 flex-shrink-0"
                                        style={{ backgroundColor: '#f43f5e' }} // Rose-500 Solid Color Fallback
                                    >
                                        <i className="fa-solid fa-file-invoice text-white text-lg"></i>
                                    </div>
                                    <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight">{income.client_name}</h3>
                                    <span className="text-xs font-extrabold text-slate-700 mt-2 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 max-w-full truncate">{income.project_service}</span>
                                </div>

                                {/* Transaction Quick Info - HIGH CONTRAST LABELS */}
                                <div className="py-6 space-y-4 text-sm border-b border-dashed border-slate-200 relative z-10">
                                    <div className="flex justify-between items-center gap-3">
                                        <span className="text-slate-600 font-extrabold uppercase text-[10px] sm:text-xs tracking-wider flex-shrink-0">Company</span>
                                        <span className="font-black text-slate-900 text-right truncate">{income.company?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-3">
                                        <span className="text-slate-600 font-extrabold uppercase text-[10px] sm:text-xs tracking-wider flex-shrink-0">Invoice No</span>
                                        <span className="font-black text-slate-900 font-mono bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-xs truncate">{income.invoice_no || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-3">
                                        <span className="text-slate-600 font-extrabold uppercase text-[10px] sm:text-xs tracking-wider flex-shrink-0">Payment Mode</span>
                                        <span className="font-black text-slate-900 flex items-center gap-1.5">
                                            <i className="fa-solid fa-credit-card text-pink-500"></i> {income.payment_mode || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Internal Notes / Memo pad look */}
                                <div className="pt-6 relative z-10">
                                    <span className="text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-widest block mb-2">Memo / Notes</span>
                                    <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-200 text-sm font-bold text-slate-800 leading-relaxed italic relative">
                                        <span className="absolute top-2 right-2 text-pink-300/40 text-lg"><i className="fa-solid fa-quote-right"></i></span>
                                        "{income.notes || 'No annotations added.'}"
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 (Right 2/3) - The Ledger Balance sheet */}
                            <div className="xl:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-pink-200 shadow-xl p-5 sm:p-8 space-y-6 sm:space-y-8">
                                
                                {/* Dynamic Status & Progress bar */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center gap-3">
                                        <h3 className="font-black text-slate-900 text-base sm:text-lg">Payment Progress</h3>
                                        <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                                            paymentPercentage === 100 
                                                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300 shadow-sm' 
                                                : 'bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-sm'
                                        }`}>
                                            {paymentPercentage}% Paid
                                        </span>
                                    </div>
                                    {/* Progress track */}
                                    <div className="w-full h-4.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                                        <div 
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${paymentPercentage}%`,
                                                backgroundColor: '#10b981' // Emerald-500 Solid Color Fallback
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Statement Breakdown - HIGH CONTRAST TEXT */}
                                <div className="space-y-5">
                                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm pb-2 border-b-2 border-slate-100 uppercase tracking-wider">Financial Breakdown</h4>
                                    
                                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 gap-3">
                                        <span className="text-slate-600 font-extrabold text-sm">Total Billed Amount</span>
                                        <span className="font-black text-slate-900 text-lg sm:text-xl">
                                            ₹{Number(income.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 gap-3">
                                        <span className="text-slate-600 font-extrabold text-sm">Payments Received (Cash)</span>
                                        <span className="font-black text-emerald-600 text-lg sm:text-xl">
                                            - ₹{Number(income.received_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* Net Outstanding Balance row - Stacks vertically on narrow viewports */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-5 sm:py-5 sm:px-6 bg-rose-50/80 rounded-2xl border-l-4 border-rose-500 border-t border-r border-b border-rose-200 mt-6 shadow-sm gap-2">
                                        <span className="font-black text-rose-950 text-xs uppercase tracking-wider">Net Outstanding Due</span>
                                        <span className="font-black text-rose-700 text-2xl sm:text-3xl">
                                            ₹{Number(income.pending_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>

                                {/* Auditing Dates Timeline */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t-2 border-slate-100">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest block">Payment Date</span>
                                        <span className="text-xs sm:text-sm font-black text-slate-800 mt-1 block">{formatDate(income.payment_date)}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest block">Due Date</span>
                                        <span className="text-xs sm:text-sm font-black text-slate-800 mt-1 block">{formatDate(income.due_date)}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest block">Audited On</span>
                                        <span className="text-xs sm:text-sm font-black text-slate-800 mt-1 block">{formatDate(income.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-5xl bg-white p-12 text-center rounded-2xl text-slate-500 shadow-md border border-pink-200">
                            No details found.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default IncomeView;