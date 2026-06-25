import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function CompanyView({ user, handleLogout }) {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };
    };

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const response = await axios.get(`https://api.fincapify.com/api/companies/${id}`, {
                    headers: getHeaders()
                });
                if (response.data.status) {
                    setCompany(response.data.data);
                }
            } catch (err) {
                console.error("Failed to load details", err);
                alert("Unable to fetch details.");
                navigate('/admin/companies');
            }
        };
        fetchCompanyDetails();
    }, [id]);

    if (!company) {
        return <div className="text-center p-8 text-slate-500 font-semibold">Loading details...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 flex flex-col md:flex-row">
            
           
            <Sidebar user={user} handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />
                <main className="p-4 sm:p-6 lg:p-8 space-y-6">
                    
                    {/* Header Action Row */}
                    <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:gap-4 max-w-4xl w-full">
                        <button 
                            onClick={() => navigate('/admin/companies')}
                            className="w-full sm:w-auto px-4 py-2 bg-white text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-sm cursor-pointer text-center"
                        >
                            ← Back to List
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">Company Details</h1>
                    </div>

                    {/* Detailed Information Card */}
                    <div className="bg-white rounded-2xl sm:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 max-w-4xl p-5 sm:p-8 space-y-6 sm:space-y-8">
                        
                        {/* Title block */}
                        <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 leading-tight">{company.name}</h2>
                                <p className="text-slate-400 text-sm mt-1">ID: #{company.id}</p>
                            </div>
                            <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full ${
                                Number(company.status) === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {Number(company.status) === 1 ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        {/* Grid Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Info</h3>
                                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-sm">
                                        <span className="font-bold text-slate-500 block sm:inline">Email:</span>{' '}
                                        <span className="text-slate-800 break-all">{company.email || 'N/A'}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold text-slate-500 block sm:inline">Phone:</span>{' '}
                                        <span className="text-slate-800">{company.phone || 'N/A'}</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tax Identity</h3>
                                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-sm">
                                        <span className="font-bold text-slate-500 block sm:inline">GST Number:</span>{' '}
                                        <span className="text-slate-800 break-all">{company.gst_number || 'N/A'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address Block */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Office Address</h3>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-h-[80px]">
                                <p className="text-sm text-slate-800 leading-relaxed">{company.address || 'Address detail not provided.'}</p>
                            </div>
                        </div>

                        {/* Footer Action Edit Button */}
                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button 
                                onClick={() => navigate(`/admin/companies/edit/${company.id}`)}
                                className="w-full sm:w-auto text-center px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition-all text-sm cursor-pointer"
                            >
                                Edit This Company
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default CompanyView;