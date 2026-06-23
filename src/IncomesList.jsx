import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function IncomesList({ user, handleLogout }) {
    // Local storage cache use karein taaki instant load ho sake
    const [incomes, setIncomes] = useState(() => {
        try {
            const cached = localStorage.getItem('cached_incomes');
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });

    const [loading, setLoading] = useState(incomes.length === 0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };
    };

    const getIncomes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/incomes', {
                headers: getHeaders()
            });
            if (response.data.status) {
                setIncomes(response.data.data);
                localStorage.setItem('cached_incomes', JSON.stringify(response.data.data));
            }
        } catch (err) {
            console.error("Failed to fetch incomes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getIncomes();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/incomes/${id}`, {
                    headers: getHeaders()
                });
                alert("Transaction deleted successfully!");
                getIncomes();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentIncomes = incomes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(incomes.length / itemsPerPage);

    return (
        /* Outer Layout - stacks vertically on mobile, horizontally on desktop */
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 flex flex-col md:flex-row">
            
            {/* ✅ बिना किसी wrapper div के सीधे Sidebar को रखें */}
            <Sidebar user={user} handleLogout={handleLogout} />

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />

                {/* Responsive main space padding */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                    
                    {/* Header - Title Left, Button Right */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-800">Income Tracker</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Track and audit incoming business revenues.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/incomes/create')}
                            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:opacity-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <i className="fa-solid fa-plus text-xs"></i> Add Income Record
                        </button>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-2xl sm:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-[1000px] w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Client & Project</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice No</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Received</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mode</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-slate-100">
                                    {loading ? (
                                        [1, 2, 3, 4, 5].map((index) => (
                                            <tr key={index} className="animate-pulse">
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-2/3"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/3"></div></td>
                                                <td className="px-6 py-5 text-right"><div className="h-8 bg-slate-200 rounded-lg w-28 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : currentIncomes.length > 0 ? (
                                        currentIncomes.map((income) => (
                                            <tr key={income.id} className="hover:bg-slate-50/55 transition-colors duration-200">
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">
                                                    {income.company?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                                    <div className="font-semibold text-slate-800">{income.client_name}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5">{income.project_service}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 font-mono whitespace-nowrap">
                                                    {income.invoice_no || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-800 font-semibold whitespace-nowrap">
                                                    ₹{Number(income.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-emerald-600 font-semibold whitespace-nowrap">
                                                    ₹{Number(income.received_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        Number(income.pending_amount) > 0 
                                                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                    }`}>
                                                        ₹{Number(income.pending_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap font-medium">
                                                    {income.payment_mode || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* VIEW BUTTON */}
                                                        <button 
                                                            onClick={() => navigate(`/admin/incomes/view/${income.id}`)}
                                                            className="h-9 w-9 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-sm cursor-pointer"
                                                            title="View Details"
                                                        >
                                                            <i className="fa-solid fa-eye text-sm"></i>
                                                        </button>
                                                        {/* EDIT BUTTON */}
                                                        <button 
                                                            onClick={() => navigate(`/admin/incomes/edit/${income.id}`)}
                                                            className="h-9 w-9 text-pink-600 hover:bg-pink-50 hover:text-pink-700 rounded-xl transition-all duration-200 flex items-center justify-center border border-pink-100 hover:border-pink-200 shadow-sm cursor-pointer"
                                                            title="Edit Record"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square text-sm"></i>
                                                        </button>
                                                        {/* DELETE BUTTON */}
                                                        <button 
                                                            onClick={() => handleDelete(income.id)}
                                                            className="h-9 w-9 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-all duration-200 flex items-center justify-center border border-rose-100 hover:border-rose-200 shadow-sm cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <i className="fa-solid fa-trash-can text-sm"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                                                <i className="fa-solid fa-folder-open text-4xl mb-3 text-slate-200 block"></i>
                                                No income transactions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination UI - Responsive Flex Layout */}
                        {!loading && incomes.length > itemsPerPage && (
                            <div className="bg-slate-50 px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                                    Showing <span className="font-semibold text-slate-800">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-slate-800">{Math.min(indexOfLastItem, incomes.length)}</span> of <span className="font-semibold text-slate-800">{incomes.length}</span> records
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="h-9 px-3 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-white rounded-xl border border-slate-200 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-9 w-9 text-xs sm:text-sm font-semibold rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                                                currentPage === page
                                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="h-9 px-3 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-white rounded-xl border border-slate-200 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default IncomesList;