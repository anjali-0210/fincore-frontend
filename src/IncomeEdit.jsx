import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function IncomeEdit({ user, handleLogout }) {
    const { id } = useParams(); // URL se income ki dynamic ID nikalne ke liye
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState('');
    const [clientName, setClientName] = useState('');
    const [invoiceNo, setInvoiceNo] = useState('');
    const [projectService, setProjectService] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [receivedAmount, setReceivedAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('UPI');
    const [notes, setNotes] = useState('');

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };
    };

    // Helper: Laravel/Database date format ko standard Input Date format (YYYY-MM-DD) mein badalne ke liye
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        return dateStr.substring(0, 10); // extracts YYYY-MM-DD
    };

    useEffect(() => {
        // 1. Dropdown select ke liye Companies List load karein
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('https://api.fincapify.com/api/companies', {
                    headers: getHeaders()
                });
                if (response.data.status) {
                    setCompanies(response.data.data);
                }
            } catch (err) {
                console.error("Failed to load companies list", err);
            }
        };

        // 2. Is specific Income Transaction ki saari details load karein
        const fetchIncomeDetails = async () => {
            try {
                const response = await axios.get(`https://api.fincapify.com/api/incomes/${id}`, {
                    headers: getHeaders()
                });
                if (response.data.status) {
                    const data = response.data.data;
                    setCompanyId(data.company_id || '');
                    setClientName(data.client_name || '');
                    setInvoiceNo(data.invoice_no || '');
                    setProjectService(data.project_service || '');
                    setTotalAmount(data.total_amount || '');
                    setReceivedAmount(data.received_amount || '');
                    setPaymentDate(formatDateForInput(data.payment_date));
                    setDueDate(formatDateForInput(data.due_date));
                    setPaymentMode(data.payment_mode || 'UPI');
                    setNotes(data.notes || '');
                }
            } catch (err) {
                console.error("Failed to fetch transaction details", err);
                alert("Could not load transaction details.");
                navigate('/admin/incomes');
            }
        };

        fetchCompanies();
        fetchIncomeDetails();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const payload = {
            company_id: companyId,
            client_name: clientName,
            invoice_no: invoiceNo,
            project_service: projectService,
            total_amount: totalAmount,
            received_amount: receivedAmount,
            payment_date: paymentDate || null,
            due_date: dueDate || null,
            payment_mode: paymentMode,
            notes: notes
        };

        try {
            await axios.put(`https://api.fincapify.com/api/incomes/${id}`, payload, {
                headers: getHeaders()
            });
            alert("Transaction details updated successfully!");
            navigate('/admin/incomes');
        } catch (err) {
            console.error("Failed to update transaction", err);
            alert("Update operation failed. Please verify the input values.");
        }
    };

    return (
        // बाहरी बैकग्राउंड को Fincapify थीम के अनुकूल सॉफ्ट ब्लू टोन में बदला गया है
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 flex flex-col md:flex-row">
            
            <Sidebar user={user} handleLogout={handleLogout} />

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} handleLogout={handleLogout} />
                <main className="p-4 sm:p-6 lg:p-8 space-y-6">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 max-w-4xl w-full">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-800">Edit Income Transaction</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Modify logged transaction details or cash payments.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/admin/incomes')}
                            className="w-full sm:w-auto px-4 py-2.5 bg-white text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-arrow-left text-xs"></i> Back to List
                        </button>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 max-w-4xl">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                
                                {/* Select Company */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-building text-slate-400"></i> Company *
                                    </label>
                                    <select 
                                        value={companyId} 
                                        onChange={(e) => setCompanyId(e.target.value)}
                                        required
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm bg-white" // फ़ोकस और बॉर्डर कलर्स को थीम ब्लू किया गया
                                    >
                                        <option value="">-- Choose Company --</option>
                                        {companies.map(comp => (
                                            <option key={comp.id} value={comp.id}>{comp.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Client Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-user text-slate-400"></i> Client Name *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={clientName} 
                                        onChange={(e) => setClientName(e.target.value)} 
                                        required 
                                        placeholder="e.g. John Doe" 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm"
                                    />
                                </div>

                                {/* Invoice Number */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-receipt text-slate-400"></i> Invoice No. (Optional)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={invoiceNo} 
                                        onChange={(e) => setInvoiceNo(e.target.value)} 
                                        placeholder="e.g. INV-2026-001" 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm"
                                    />
                                </div>

                                {/* Project/Service */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-laptop-code text-slate-400"></i> Project / Service *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={projectService} 
                                        onChange={(e) => setProjectService(e.target.value)} 
                                        required 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm"
                                    />
                                </div>

                                {/* Total Amount */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-money-bill-wave text-slate-400"></i> Total Amount *
                                    </label>
                                    <input 
                                        type="number" 
                                        value={totalAmount} 
                                        onChange={(e) => setTotalAmount(e.target.value)} 
                                        required 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm"
                                    />
                                </div>

                                {/* Received Amount */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-circle-check text-slate-400"></i> Received Amount *
                                    </label>
                                    <input 
                                        type="number" 
                                        value={receivedAmount} 
                                        onChange={(e) => setReceivedAmount(e.target.value)} 
                                        required 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm"
                                    />
                                </div>

                                {/* Payment Date */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-calendar-day text-slate-400"></i> Payment Date
                                    </label>
                                    <input 
                                        type="date" 
                                        value={paymentDate} 
                                        onChange={(e) => setPaymentDate(e.target.value)} 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm"
                                    />
                                </div>

                                {/* Due Date */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-calendar-xmark text-slate-400"></i> Due Date
                                    </label>
                                    <input 
                                        type="date" 
                                        value={dueDate} 
                                        onChange={(e) => setDueDate(e.target.value)} 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm"
                                    />
                                </div>

                                {/* Payment Mode */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <i className="fa-solid fa-credit-card text-slate-400"></i> Payment Mode
                                    </label>
                                    <select 
                                        value={paymentMode} 
                                        onChange={(e) => setPaymentMode(e.target.value)} 
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm bg-white"
                                    >
                                        <option value="UPI">UPI / Net Banking</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Cheque">Bank Cheque</option>
                                        <option value="Other">Other Mode</option>
                                    </select>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                    <i className="fa-solid fa-pencil text-slate-400"></i> Notes / Description
                                </label>
                                <textarea 
                                    value={notes} 
                                    onChange={(e) => setNotes(e.target.value)} 
                                    placeholder="Add transaction specific annotations..." 
                                    rows="3"
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2570C2]/20 focus:border-[#2570C2] transition-all text-sm"
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center pt-4 border-t border-slate-100 gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/admin/incomes')}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-1.5"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#2570C2] to-[#11284E] text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-floppy-disk"></i> Update Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default IncomeEdit;