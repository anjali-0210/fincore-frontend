import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function CompaniesList({ user, handleLogout }) {
    const [companies, setCompanies] = useState(() => {
        try {
            const cached = localStorage.getItem('cached_companies');
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });

    const [loading, setLoading] = useState(companies.length === 0);
    const navigate = useNavigate();

    // --- Pagination States ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };
    };

    const getCompanies = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/companies', {
                headers: getHeaders()
            });
            if (response.data.status) {
                setCompanies(response.data.data);
                localStorage.setItem('cached_companies', JSON.stringify(response.data.data));
            }
        } catch (err) {
            console.error("Failed to fetch companies", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCompanies();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/companies/${id}`, {
                    headers: getHeaders()
                });
                alert("Company deleted successfully!");
                getCompanies();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    // --- Pagination Logic ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(companies.length / itemsPerPage);

    // Agar delete karne ke baad current page khali ho jaye, toh pichle page par automatic shift ho jaye
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [companies.length, totalPages, currentPage]);

    return (
        /* Outer flex container - handles responsive row/column stack */
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 flex flex-col md:flex-row">
            
            {/* ✅ Wrapper div has been removed to allow Sidebar to render on mobile */}
            <Sidebar user={user} handleLogout={handleLogout} />

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />

                {/* Responsive margin/padding */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                    
                    {/* Page Header - Responsive stacking (flex-col sm:flex-row) */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
                                Companies Management
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Manage and view your registered companies.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/admin/companies/create')}
                            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:opacity-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <i className="fa-solid fa-plus"></i> Add New Company
                        </button>
                    </div>

                    {/* Table Card container */}
                    <div className="bg-white rounded-2xl sm:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        
                        {/* Responsive horizontal scroll container */}
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-[900px] lg:min-w-full w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">GST</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-slate-100">
                                    {loading ? (
                                        [1, 2, 3, 4, 5].map((index) => (
                                            <tr key={index} className="animate-pulse">
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-2/3"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                                <td className="px-6 py-5"><div className="h-6 bg-slate-200 rounded-full w-16"></div></td>
                                                <td className="px-6 py-5 text-right"><div className="h-8 bg-slate-200 rounded-lg w-28 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : currentCompanies.length > 0 ? (
                                        currentCompanies.map((company) => (
                                            <tr key={company.id} className="hover:bg-slate-50/55 transition-colors duration-200">
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm border border-pink-100">
                                                            {company.name ? company.name.charAt(0).toUpperCase() : 'C'}
                                                        </div>
                                                        {company.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{company.email || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{company.phone || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap font-mono">{company.gst_number || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                                        Number(company.status) === 1
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${Number(company.status) === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                        {Number(company.status) === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* View Button */}
                                                        <button 
                                                            onClick={() => navigate(`/admin/companies/view/${company.id}`)} 
                                                            className="h-9 w-9 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-sm cursor-pointer"
                                                            title="View Profile"
                                                        >
                                                            <i className="fa-solid fa-eye text-sm"></i>
                                                        </button>

                                                        {/* Edit Button */}
                                                        <button 
                                                            onClick={() => navigate(`/admin/companies/edit/${company.id}`)}
                                                            className="h-9 w-9 text-pink-600 hover:bg-pink-50 hover:text-pink-700 rounded-xl transition-all duration-200 flex items-center justify-center border border-pink-100 hover:border-pink-200 shadow-sm cursor-pointer"
                                                            title="Edit Details"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square text-sm"></i>
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button 
                                                            onClick={() => handleDelete(company.id)}
                                                            className="h-9 w-9 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-all duration-200 flex items-center justify-center border border-rose-100 hover:border-rose-200 shadow-sm cursor-pointer"
                                                            title="Delete Company"
                                                        >
                                                            <i className="fa-solid fa-trash-can text-sm"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                                <i className="fa-solid fa-folder-open text-4xl mb-3 text-slate-200 block"></i>
                                                No companies found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- PAGINATION CONTROLS UI - Responsive flex-col to sm:flex-row --- */}
                        {!loading && companies.length > itemsPerPage && (
                            <div className="bg-slate-50 px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                                    Showing <span className="font-semibold text-slate-800">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-slate-800">{Math.min(indexOfLastItem, companies.length)}</span> of <span className="font-semibold text-slate-800">{companies.length}</span> companies
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="h-9 px-3 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-white rounded-xl border border-slate-200 shadow-sm transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                                    >
                                        <i className="fa-solid fa-chevron-left text-[10px]"></i> Prev
                                    </button>

                                    {/* Page Numbers */}
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

                                    {/* Next Button */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="h-9 px-3 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-white rounded-xl border border-slate-200 shadow-sm transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                                    >
                                        Next <i className="fa-solid fa-chevron-right text-[10px]"></i>
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

export default CompaniesList;