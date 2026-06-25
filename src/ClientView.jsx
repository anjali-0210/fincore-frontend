import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function ClientView({ user, handleLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClient = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`https://api.fincapify.com/api/clients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClient(response.data);
            } catch (err) {
                setError('Failed to load client profile details.');
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [id]);

    if (loading) return <p className="p-8 text-center text-sm">Loading details...</p>;
    if (error) return <p className="p-8 text-red-500 text-center">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 flex flex-col md:flex-row">
            <Sidebar user={user} handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />

                <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
                    
                    {/* Header bar */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Client Profile View</h2>
                            <p className="text-xs text-slate-500 mt-1">Read-only profile info and banking list.</p>
                        </div>
                        <button onClick={() => navigate('/admin/clients')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border text-xs sm:text-sm">
                            ← Back
                        </button>
                    </div>

                    {/* Basic Info Table Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                        <h3 className="text-base font-bold text-slate-800 border-b pb-2">Profile Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <span className="text-slate-400 font-medium">Client Name:</span>
                                <p className="font-bold text-slate-800 mt-0.5">{client.client_name}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">Company Name:</span>
                                <p className="font-bold text-slate-800 mt-0.5">{client.company_name || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">GST Number:</span>
                                <p className="font-mono font-bold text-slate-800 mt-0.5">{client.gst_no || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">Phones:</span>
                                <p className="font-bold text-slate-800 mt-0.5">{client.phone_numbers?.join(', ') || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Addresses Cards */}
                    <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                        <h3 className="text-base font-bold text-slate-800 border-b pb-2">Addresses ({client.addresses?.length || 0})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {client.addresses?.map((addr, i) => (
                                <div key={i} className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                                    <span className="text-xs font-bold text-pink-500">Address {i + 1}</span>
                                    <p className="text-sm font-semibold text-slate-700 mt-1">{addr.address_line}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{addr.city || 'N/A'}, {addr.state || 'N/A'} - {addr.zip || 'N/A'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bank Accounts Cards */}
                    <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                        <h3 className="text-base font-bold text-slate-800 border-b pb-2">Linked Bank Accounts ({client.bank_details?.length || 0})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {client.bank_details?.map((bank, i) => (
                                <div key={i} className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 space-y-2">
                                    <div>
                                        <span className="text-xs font-bold text-pink-500">Bank Details {i + 1}</span>
                                        <h4 className="text-sm font-bold text-slate-800 mt-1">{bank.bank_name}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 text-xs gap-2">
                                        <div>
                                            <span className="text-slate-400">Account No:</span>
                                            <p className="font-semibold text-slate-800">{bank.account_no}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">IFSC Code:</span>
                                            <p className="font-mono font-semibold text-slate-800">{bank.ifsc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default ClientView;