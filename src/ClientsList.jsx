import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function ClientsList({ user, handleLogout }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const companyId = user?.company_id || 1; 

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };
    };

    const getClients = async () => {
        try {
            const response = await axios.get(`https://api.fincapify.com/api/companies/${companyId}/clients`, {
                headers: getHeaders()
            });
            setClients(response.data);
        } catch (err) {
            console.error("Failed to fetch clients", err);
            setError("Could not load clients directory.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getClients();
    }, [companyId]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                await axios.delete(`https://api.fincapify.com/expenses/api/clients/${id}`, {
                    headers: getHeaders()
                });
                alert("Client deleted successfully!");
                getClients();
            } catch (err) {
                console.error("Delete failed", err);
                alert("Failed to delete client.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 flex flex-col md:flex-row">
            <Sidebar user={user} handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />

                <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                    
                    {/* Header Card */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-800">Client Directory</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage and view business clients and their banking details.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/clients/create')}
                            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:opacity-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <i className="fa-solid fa-plus text-xs"></i> Add New Client
                        </button>
                    </div>

                    {error && <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

                    {/* Table Container */}
                    <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-[900px] w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">GST No</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-slate-100">
                                    {loading ? (
                                        [1, 2, 3].map((index) => (
                                            <tr key={index} className="animate-pulse">
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-2/3"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                                                <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                                                <td className="px-6 py-5 text-right"><div className="h-8 bg-slate-200 rounded-lg w-24 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : clients.length > 0 ? (
                                        clients.map((client) => (
                                            <tr key={client.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">
                                                    {client.client_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                                    {client.company_name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 font-mono whitespace-nowrap">
                                                    {client.gst_no || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button 
                                                            onClick={() => navigate(`/admin/clients/view/${client.id}`)}
                                                            className="h-9 w-9 text-slate-600 hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center border border-slate-100 cursor-pointer"
                                                            title="View Details"
                                                        >
                                                            <i className="fa-solid fa-eye text-sm"></i>
                                                        </button>
                                                        <button 
                                                            onClick={() => navigate(`/admin/clients/edit/${client.id}`)}
                                                            className="h-9 w-9 text-pink-600 hover:bg-pink-50 rounded-xl transition-all flex items-center justify-center border border-pink-100 cursor-pointer"
                                                            title="Edit Record"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square text-sm"></i>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(client.id)}
                                                            className="h-9 w-9 text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center border border-rose-100 cursor-pointer"
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
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                                <i className="fa-solid fa-folder-open text-4xl mb-3 text-slate-200 block"></i>
                                                No clients found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ClientsList;