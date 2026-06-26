import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function ClientCreate({ user, handleLogout }) {
    const navigate = useNavigate();
    const companyId = user?.company_id || 1;

    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        company_id: companyId,
        client_name: '',
        company_name: '',
        gst_no: '',
        phone_numbers: [''],
        emails: [''],
        addresses: [{ address_line: '', city: '', state: '', zip: '' }],
        bank_details: [{ bank_name: '', account_no: '', ifsc: '', branch: '' }],
        upi_details: [{ upi_id: '', name: '' }]
    });

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Arrays Dynamic Logic
    const handleArrayChange = (index, value, field) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const addArrayField = (field, schema) => {
        setFormData({ ...formData, [field]: [...formData[field], schema] });
    };

    const removeArrayField = (index, field) => {
        const updated = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updated });
    };

    const handleObjectArrayChange = (index, field, subField, value) => {
        const updated = [...formData[field]];
        updated[index] = { ...updated[index], [subField]: value };
        setFormData({ ...formData, [field]: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cleanedBankDetails = formData.bank_details.filter(
            bank => bank.bank_name?.trim() || bank.account_no?.trim() || bank.ifsc?.trim() || bank.branch?.trim()
        );

        // API payload
        const submissionData = {
            ...formData,
            bank_details: cleanedBankDetails.length > 0 ? cleanedBankDetails : []
        };

        try {
            await axios.post('https://api.fincapify.com/api/clients', submissionData, {
                headers: getHeaders()
            });
            alert("Client created successfully!");
            navigate('/admin/clients');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save client data.');
        }
    };

    return (
        /* BACKGROUND THEME CHANGED TO SLATE/BLUE */
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/40 flex flex-col md:flex-row">
            <Sidebar user={user} handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />

                <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Add New Client</h2>
                        <p className="text-sm text-slate-500 mt-1">Fill basic, contact and banking details.</p>
                    </div>

                    {error && <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Basic Info Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Basic Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600">Client Name*</label>
                                    <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600">Company Name</label>
                                    <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-slate-600">GST Number</label>
                                    <input type="text" name="gst_no" value={formData.gst_no} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Contact Details</h3>
                            
                            {/* Phones */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600">Phone Numbers</label>
                                {formData.phone_numbers.map((phone, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={phone} onChange={(e) => handleArrayChange(i, e.target.value, 'phone_numbers')} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                        {formData.phone_numbers.length > 1 && (
                                            /* REMOVE BUTTON CHANGED TO STANDARD RED/ROSE */
                                            <button type="button" onClick={() => removeArrayField(i, 'phone_numbers')} className="text-red-500 hover:bg-red-50 px-3 rounded-xl border border-red-100 transition-colors">Remove</button>
                                        )}
                                    </div>
                                ))}
                                {/* ADD BUTTON CHANGED TO INDIGO */}
                                <button type="button" onClick={() => addArrayField('phone_numbers', '')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">+ Add Phone</button>
                            </div>
                        </div>

                        {/* Dynamic Addresses */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Addresses</h3>
                            {formData.addresses.map((addr, i) => (
                                <div key={i} className="border border-slate-100 p-4 rounded-xl space-y-3 relative">
                                    <input type="text" placeholder="Address Line*" required value={addr.address_line} onChange={(e) => handleObjectArrayChange(i, 'addresses', 'address_line', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <input type="text" placeholder="City" value={addr.city} onChange={(e) => handleObjectArrayChange(i, 'addresses', 'city', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                        <input type="text" placeholder="State" value={addr.state} onChange={(e) => handleObjectArrayChange(i, 'addresses', 'state', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                        <input type="text" placeholder="Zip" value={addr.zip} onChange={(e) => handleObjectArrayChange(i, 'addresses', 'zip', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    {formData.addresses.length > 1 && (
                                        <button type="button" onClick={() => removeArrayField(i, 'addresses')} className="text-xs text-red-500 hover:text-red-600 font-bold">Remove Address</button>
                                    )}
                                </div>
                            ))}
                            {/* ADD BUTTON CHANGED TO INDIGO */}
                            <button type="button" onClick={() => addArrayField('addresses', { address_line: '', city: '', state: '', zip: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">+ Add Address</button>
                        </div>

                        {/* Bank Details */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Bank Accounts (Optional)</h3>
                            {formData.bank_details.map((bank, i) => (
                                <div key={i} className="border border-slate-100 p-4 rounded-xl space-y-3">
                                   
                                    <input 
                                        type="text" 
                                        placeholder="Bank Name" 
                                        value={bank.bank_name} 
                                        onChange={(e) => handleObjectArrayChange(i, 'bank_details', 'bank_name', e.target.value)} 
                                        className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        
                                        <input 
                                            type="text" 
                                            placeholder="Account No" 
                                            value={bank.account_no} 
                                            onChange={(e) => handleObjectArrayChange(i, 'bank_details', 'account_no', e.target.value)} 
                                            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                                        />
                                        
                                        <input 
                                            type="text" 
                                            placeholder="IFSC Code" 
                                            value={bank.ifsc} 
                                            onChange={(e) => handleObjectArrayChange(i, 'bank_details', 'ifsc', e.target.value)} 
                                            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                                        />
                                    </div>
                                    
                                    <input 
                                        type="text" 
                                        placeholder="Branch Name" 
                                        value={bank.branch} 
                                        onChange={(e) => handleObjectArrayChange(i, 'bank_details', 'branch', e.target.value)} 
                                        className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                                    />
                                    {formData.bank_details.length > 1 && (
                                        <button type="button" onClick={() => removeArrayField(i, 'bank_details')} className="text-xs text-red-500 hover:text-red-600 font-bold">Remove Bank Account</button>
                                    )}
                                </div>
                            ))}
                            {/* ADD BUTTON CHANGED TO INDIGO */}
                            <button type="button" onClick={() => addArrayField('bank_details', { bank_name: '', account_no: '', ifsc: '', branch: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">+ Add Bank Account</button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end">
                            {/* SUBMIT BUTTON CHANGED TO INDIGO-BLUE GRADIENT */}
                            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-md transition-all duration-200 transform active:scale-95">Save Client</button>
                            <button type="button" onClick={() => navigate('/admin/clients')} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border transition-colors">Cancel</button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default ClientCreate;