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
      const response = await axios.get("http://127.0.0.1:8000/api/companies", {
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
        await axios.delete(`http://127.0.0.1:8000/api/companies/${id}`, {
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
    <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-pink-100 overflow-hidden shadow-[15px_15px_35px_rgba(236,72,153,0.08)]">
      
      {/* Header section with Dynamic Add Button */}
      <div className="p-6 border-b border-pink-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-800">Companies</h3>
          <p className="text-sm text-slate-500">Registered organizations</p>
        </div>

        <button 
          onClick={() => navigate('/admin/companies/create')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg hover:scale-105 transition cursor-pointer"
        >
          + Add Company
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pink-50">
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
                <tr key={index} className="animate-pulse border-t border-pink-50">
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
                  className="border-t border-pink-50 hover:bg-pink-50/50 transition duration-200"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center font-black">
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
                          : "bg-rose-100 text-rose-500"
                      }`}
                    >
                      {Number(company.status) === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-5 text-center space-x-3 whitespace-nowrap">
                    <button 
                      onClick={() => navigate(`/admin/companies/edit/${company.id}`)}
                      className="text-pink-600 hover:text-pink-800 font-bold transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(company.id)}
                      className="text-red-500 hover:text-red-700 font-bold transition cursor-pointer"
                    >
                      Delete
                    </button>
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