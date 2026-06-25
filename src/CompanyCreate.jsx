import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function CompanyCreate({ user, handleLogout }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [status, setStatus] = useState('1');
    const navigate = useNavigate();

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const companyData = {
            name,
            email,
            phone,
            address,
            gst_number: gstNumber,
            status: Number(status)
        };

        try {
            await axios.post('https://api.fincapify.com/api/companies', companyData, {
                headers: getHeaders()
            });
            alert("Company created successfully!");
            navigate('/admin/companies');
        } catch (err) {
            console.error("Create failed", err);
            alert("Error: Please verify all required fields.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 flex flex-col md:flex-row">
            
            {/* ✅ बिना किसी wrapper div के सीधे Sidebar को रखें */}
            <Sidebar user={user} handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />
                <main className="p-4 sm:p-6 lg:p-8 space-y-6">
                    
                    {/* Top Action Header - Stacked on mobile, side-by-side on small screens up */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 max-w-4xl w-full">
                        <h1 className="text-xl font-bold text-slate-800">Add New Company</h1>
                        <button 
                            onClick={() => navigate('/admin/companies')}
                            className="w-full sm:w-auto px-4 py-2 bg-white text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-sm cursor-pointer text-center"
                        >
                            ← Back to List
                        </button>
                    </div>

                    {/* Styled Form Container */}
                    <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 max-w-4xl">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Company Name *</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="e.g. Webplex Technologies" 
                                        required 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="e.g. contact@webplex.com" 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)} 
                                        placeholder="e.g. 8875987756" 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">GST Number</label>
                                    <input 
                                        type="text" 
                                        value={gstNumber} 
                                        onChange={(e) => setGstNumber(e.target.value)} 
                                        placeholder="e.g. GST12345" 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                                <textarea 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    placeholder="Full office address..." 
                                    rows="3"
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 w-full md:w-1/2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)} 
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm bg-white"
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>

                            {/* Action Buttons - Stacked on mobile, Row layout on small screens up */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/admin/companies')}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all text-sm text-center"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:opacity-95 transition-all text-sm cursor-pointer text-center"
                                >
                                    Save Company
                                </button>
                            </div>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default CompanyCreate;