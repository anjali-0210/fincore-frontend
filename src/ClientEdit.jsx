import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function ClientEdit({ user, handleLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(null);

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
    };

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const response = await axios.get(`https://api.fincapify.com/api/clients/${id}`, {
                    headers: getHeaders()
                });
                const data = response.data;
                setFormData({
                    client_name: data.client_name || '',
                    company_name: data.company_name || '',
                    gst_no: data.gst_no || '',
                    phone_numbers: data.phone_numbers?.length ? data.phone_numbers : [''],
                    emails: data.emails?.length ? data.emails : [''],
                    addresses: data.addresses?.length ? data.addresses : [{ address_line: '', city: '', state: '', zip: '' }],
                    bank_details: data.bank_details?.length ? data.bank_details : [{ bank_name: '', account_no: '', ifsc: '', branch: '' }],
                    upi_details: data.upi_details?.length ? data.upi_details : [{ upi_id: '', name: '' }]
                });
            } catch (err) {
                setError('Failed to load client profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchClientData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
        try {
            await axios.put(`https://api.fincapify.com/api/clients/${id}`, formData, {
                headers: getHeaders()
            });
            alert("Client details updated successfully!");
            navigate('/admin/clients');
        } catch (err) {
            setError('Error updating client profiles.');
        }
    };

    if (loading) return <p className="p-8 text-center text-sm">Loading client data...</p>;
    if (error) return <p className="p-8 text-red-500 text-center">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 flex flex-col md:flex-row">
            <Sidebar user={user} handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />

                <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Edit Client</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Copy identical layout fields structure from ClientCreate.jsx for matching dynamic inputs */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Basic Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600">Client Name*</label>
                                    <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600">Company Name</label>
                                    <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Contact Details</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600">Phone Numbers</label>
                                {formData.phone_numbers.map((phone, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={phone} onChange={(e) => handleArrayChange(i, e.target.value, 'phone_numbers')} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                                        {formData.phone_numbers.length > 1 && (
                                            <button type="button" onClick={() => removeArrayField(i, 'phone_numbers')} className="text-rose-500 hover:bg-rose-50 px-3 rounded-xl">Remove</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayField('phone_numbers', '')} className="text-xs font-bold text-pink-600">+ Add Phone</button>
                            </div>
                        </div>

                        {/* Dynamic Addresses */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Addresses</h3>
                            {formData.addresses.map((addr, i) => (
                                <div key={i} className="border border-slate-100 p-4 rounded-xl space-y-3">
                                    <input type="text" placeholder="Address Line*" required value={addr.address_line} onChange={(e) => handleObjectArrayChange(i, 'addresses', 'address_line', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <input type="text" placeholder="City" value={addr.city || ''} onChange={(e) => handleObjectArrayChange(i, 'addresses', 'city', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs" />
                                        <input type="text" placeholder="State" value={addr.state || ''} onChange={(e) => handleObjectArrayChange(i, 'addresses', 'state', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs" />
                                        <input type="text" placeholder="Zip" value={addr.zip || ''} onChange={(e) => handleObjectArrayChange(i, 'addresses', 'zip', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs" />
                                    </div>
                                    {formData.addresses.length > 1 && (
                                        <button type="button" onClick={() => removeArrayField(i, 'addresses')} className="text-xs text-rose-500 font-bold">Remove Address</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayField('addresses', { address_line: '', city: '', state: '', zip: '' })} className="text-xs font-bold text-pink-600">+ Add Address</button>
                        </div>

                        {/* Dynamic Bank Accounts */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] border border-slate-100 space-y-4">
                            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Bank Accounts</h3>
                            {formData.bank_details.map((bank, i) => (
                                <div key={i} className="border border-slate-100 p-4 rounded-xl space-y-3">
                                    <input type="text" placeholder="Bank Name*" required value={bank.bank_name} onChange={(e) => handleObjectArrayChange(i, 'bank_details', 'bank_name', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="text" placeholder="Account No*" required value={bank.account_no} onChange={(e) => handleObjectArrayChange(i, 'bank_details', 'account_no', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs" />
                                        <input type="text" placeholder="IFSC Code*" required value={bank.ifsc} onChange={(e) => handleObjectArrayChange(i, 'bank_details', 'ifsc', e.target.value)} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs" />
                                    </div>
                                    {formData.bank_details.length > 1 && (
                                        <button type="button" onClick={() => removeArrayField(i, 'bank_details')} className="text-xs text-rose-500 font-bold">Remove Bank Account</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayField('bank_details', { bank_name: '', account_no: '', ifsc: '', branch: '' })} className="text-xs font-bold text-pink-600">+ Add Bank Account</button>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-md">Update Client</button>
                            <button type="button" onClick={() => navigate('/admin/clients')} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl border">Cancel</button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default ClientEdit;