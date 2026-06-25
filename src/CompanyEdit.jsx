import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function CompanyEdit({ user, handleLogout }) {
    const { id } = useParams();
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

    useEffect(() => {
        const getCompanyDetails = async () => {
            try {
                const response = await axios.get(`https://api.fincapify.com/api/companies/${id}`, {
                    headers: getHeaders()
                });
                if (response.data.status) {
                    const company = response.data.data;
                    setName(company.name || '');
                    setEmail(company.email || '');
                    setPhone(company.phone || '');
                    setAddress(company.address || '');
                    setGstNumber(company.gst_number || '');
                    setStatus(String(company.status));
                }
            } catch (err) {
                console.error("Failed to load company details", err);
                alert("Could not load company details.");
                navigate('/admin/companies');
            }
        };
        getCompanyDetails();
    }, [id]);

    const handleUpdate = async (e) => {
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
            await axios.put(`https://api.fincapify.com/api/companies/${id}`, companyData, {
                headers: getHeaders()
            });
            alert("Company updated successfully!");
            navigate('/admin/companies');
        } catch (err) {
            console.error("Update failed", err);
            alert("Update operation failed.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 flex flex-col md:flex-row">
            
           
            <Sidebar user={user} handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />
                <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
                    
                    {/* Top Action Header - Title Left, Button Right */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-4xl w-full">
                        <div>
                            <h1 className="text-2xl font-black text-slate-800">Edit Company</h1>
                            <p className="text-sm text-slate-500 mt-0.5">Modify the selected company profile parameters.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/admin/companies')}
                            className="px-4 py-2.5 bg-white text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-sm cursor-pointer flex items-center gap-2 self-stretch sm:self-auto justify-center"
                        >
                            <i className="fa-solid fa-arrow-left text-xs"></i> Back to List
                        </button>
                    </div>

                    {/* Styled Form Container */}
                    <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 max-w-4xl">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            
                            {/* Form Input Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                {/* Company Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-building text-slate-400"></i> Company Name *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        required 
                                        placeholder="e.g. Webplex Technologies"
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm"
                                    />
                                </div>

                                {/* Email Address */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-envelope text-slate-400"></i> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="contact@webplex.com"
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-phone text-slate-400"></i> Phone Number
                                    </label>
                                    <input 
                                        type="text" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)} 
                                        placeholder="8875987756"
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm"
                                    />
                                </div>

                                {/* GST Number */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-receipt text-slate-400"></i> GST Number
                                    </label>
                                    <input 
                                        type="text" 
                                        value={gstNumber} 
                                        onChange={(e) => setGstNumber(e.target.value)} 
                                        placeholder="e.g. 07AAAAA1111A1Z1"
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Address Textarea */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                    <i className="fa-solid fa-location-dot text-slate-400"></i> Address
                                </label>
                                <textarea 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    placeholder="Full office location coordinates..."
                                    rows="3"
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm"
                                />
                            </div>

                            {/* Status Selector */}
                            <div className="flex flex-col gap-1.5 w-full md:w-1/2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                    <i className="fa-solid fa-circle-info text-slate-400"></i> Status
                                </label>
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)} 
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm bg-white"
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>

                            {/* Bottom Footer Action Buttons - Stacked on mobile, Row layout on small screens up */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center pt-4 border-t border-slate-100 gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/admin/companies')}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-1.5"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-floppy-disk"></i> Update Details
                                </button>
                            </div>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default CompanyEdit;