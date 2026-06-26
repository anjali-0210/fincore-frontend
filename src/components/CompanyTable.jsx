import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompanyTable() {
  // 1. Shuruat mein cached local storage se instant data load karein
  const [companies, setCompanies] = useState(() => {
    try {
      const cached = localStorage.getItem("cached_companies");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(companies.length === 0);
  const navigate = useNavigate();

  // Authentication Headers helper
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  };

  // Live API data fetch karna
  const getCompanies = async () => {
    try {
      const response = await axios.get("https://grobee.in/expenses/api/companies", {
        headers: getHeaders(),
      });
      if (response.data.status) {
        setCompanies(response.data.data);
        // Cache ko update karein
        localStorage.setItem("cached_companies", JSON.stringify(response.data.data));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard companies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`https://grobee.in/expenses/api/companies/${id}`, {
          headers: getHeaders(),
        });
        alert("Company deleted successfully!");
        getCompanies(); // List ko refresh karein
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    // कंटेनर बॉर्डर और शैडो को थीम के अनुसार सॉफ्ट ब्लू किया गया है
    <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-blue-100 overflow-hidden shadow-[15px_15px_35px_rgba(37,112,194,0.05)]">
      
      {/* Header section with Dynamic Add Button */}
      <div className="p-6 border-b border-blue-50 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-800">Companies</h3>
          <p className="text-sm text-slate-500">Registered organizations</p>
        </div>

        {/* बटन को Fincapify थीम में बदला गया है */}
        <button 
          onClick={() => navigate('/admin/companies/create')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2570C2] to-[#11284E] text-white font-bold shadow-lg shadow-[#2570C2]/15 hover:scale-105 transition cursor-pointer"
        >
          + Add Company
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          {/* हेडर का रंग सॉफ्ट ब्लू किया गया है */}
          <thead className="bg-blue-50/40">
            <tr>
              <th className="text-left p-5 text-sm font-bold text-slate-600">Company</th>
              <th className="text-left p-5 text-sm font-bold text-slate-600">Email</th>
              <th className="text-center p-5 text-sm font-bold text-slate-600">Status</th>
              <th className="text-center p-5 text-sm font-bold text-slate-600">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              // Glowing Skeleton Rows for Loading State
              [1, 2, 3].map((index) => (
                <tr key={index} className="animate-pulse border-t border-slate-100">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-200"></div>
                      <div className="h-4 bg-slate-200 rounded w-28"></div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="h-4 bg-slate-200 rounded w-36"></div>
                  </td>
                  <td className="p-5 text-center">
                    <div className="h-6 bg-slate-200 rounded-full w-16 mx-auto"></div>
                  </td>
                  <td className="p-5 text-center">
                    <div className="h-4 bg-slate-200 rounded w-20 mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : companies.length > 0 ? (
              // Live Data Display
              companies.slice(0, 5).map((company) => ( // dashboard ke liye top 5 companies show karne ke liye slice kiya hai
                <tr
                  key={company.id}
                  className="border-t border-slate-100 hover:bg-blue-50/20 transition duration-200"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      {/* कंपनी के पहले अक्षर का बॉक्स थीम में बदला गया */}
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2570C2] to-[#11284E] text-white flex items-center justify-center font-black">
                        {company.name ? company.name[0].toUpperCase() : "C"}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {company.name}
                      </span>
                    </div>
                  </td>

                  <td className="p-5 text-slate-600">
                    {company.email || "N/A"}
                  </td>

                  <td className="p-5 text-center">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold inline-block ${
                        Number(company.status) === 1
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-500" // इनएक्टिव को लाल ही रखा गया है ताकि कंट्रास्ट बना रहे
                      }`}
                    >
                      {Number(company.status) === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* एक्शन सेल (टेक्स्ट से फॉन्टऑसम आइकॉन में बदला गया) */}
                  <td className="p-5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* एडिट आइकॉन बटन */}
                      <button 
                        onClick={() => navigate(`/admin/companies/edit/${company.id}`)}
                        className="h-9 w-9 text-[#2570C2] hover:bg-blue-50/50 rounded-xl transition-all flex items-center justify-center border border-blue-100 cursor-pointer"
                        title="Edit Company"
                      >
                        <i className="fa-solid fa-pen-to-square text-sm"></i>
                      </button>

                      {/* डिलीट आइकॉन बटन */}
                      <button 
                        onClick={() => handleDelete(company.id)}
                        className="h-9 w-9 text-red-500 hover:bg-red-50/50 rounded-xl transition-all flex items-center justify-center border border-red-100 cursor-pointer"
                        title="Delete Company"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400">
                  <i className="fa-solid fa-folder-open text-3xl mb-2 text-slate-200 block"></i>
                  No registered companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}