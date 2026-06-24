import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard'; 
import Home from './Home'; // 

// Split views imports
import CompaniesList from './CompaniesList';
import CompanyCreate from './CompanyCreate';
import CompanyEdit from './CompanyEdit';
import CompanyView from './CompanyView';

import IncomesList from './IncomesList';
import IncomeCreate from './IncomeCreate';
import IncomeEdit from './IncomeEdit';
import IncomeView from './IncomeView'; 

import axios from 'axios';

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('token');
    });
    
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (err) {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile(token);
        } else {
            setIsLoggedIn(false);
            if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
                navigate('/admin/login');
            }
        }
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get('https://grobee.in/expenses/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setIsLoggedIn(true);
            setLoading(false);

            // यदि यूजर लॉग-इन है और लॉगिन पेज पर जाता है, तो उसे डैशबोर्ड पर भेजें
            if (location.pathname === '/admin/login') {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error("Profile fetch failed, logging out...", err);
            handleLocalLogout();
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.post('https://grobee.in/expenses/api/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (err) {
                console.error("Backend logout failed", err);
            }
        }
        handleLocalLogout();
    };

    const handleLocalLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                fontFamily: 'sans-serif',
                background: '#f3f4f6'
            }}>
                <h3>Verifying Session, Please wait...</h3>
            </div>
        );
    }

    return (
        <Routes>
            {/* 2. मुख्य रूट पर अब सीधे Home कंपोनेंट लोड होगा */}
            <Route path="/" element={<Home />} />

            <Route path="/admin/login" element={
                !isLoggedIn ? (
                    <Login onLoginSuccess={() => {
                        const token = localStorage.getItem('token');
                        fetchUserProfile(token);
                    }} />
                ) : (
                    <Navigate to="/admin/dashboard" replace />
                )
            } />

            <Route path="/admin/dashboard" element={
                isLoggedIn ? (
                    <Dashboard user={user} handleLogout={handleLogout} />
                ) : (
                    <Navigate to="/admin/login" replace />
                )
            } />

            {/* REGISTERED INDIVIDUAL CRUD ROUTINGS */}
            
            {/* 1. Companies List View */}
            <Route path="/admin/companies" element={
                isLoggedIn ? (
                    <CompaniesList user={user} handleLogout={handleLogout} />
                ) : (
                    <Navigate to="/admin/login" replace />
                )
            } />

            {/* 2. Companies Create View */}
            <Route path="/admin/companies/create" element={
                isLoggedIn ? (
                    <CompanyCreate user={user} handleLogout={handleLogout} />
                ) : (
                    <Navigate to="/admin/login" replace />
                )
            } />

            {/* 3. Companies Edit View with Params */}
            <Route path="/admin/companies/edit/:id" element={
                isLoggedIn ? (
                    <CompanyEdit user={user} handleLogout={handleLogout} />
                ) : (
                    <Navigate to="/admin/login" replace />
                )
            } />

            {/* 4. Companies Detail Read-Only View with Params */}
            <Route path="/admin/companies/view/:id" element={
                isLoggedIn ? (
                    <CompanyView user={user} handleLogout={handleLogout} />
                ) : (
                    <Navigate to="/admin/login" replace />
                )
            } />

            {/* INCOME MANAGEMENT ROUTINGS */}
            <Route path="/admin/incomes" element={
                isLoggedIn ? <IncomesList user={user} handleLogout={handleLogout} /> : <Navigate to="/admin/login" replace />
            } />

            <Route path="/admin/incomes/create" element={
                isLoggedIn ? <IncomeCreate user={user} handleLogout={handleLogout} /> : <Navigate to="/admin/login" replace />
            } />

            <Route path="/admin/incomes/edit/:id" element={
                isLoggedIn ? <IncomeEdit user={user} handleLogout={handleLogout} /> : <Navigate to="/admin/login" replace />
            } />

            <Route path="/admin/incomes/view/:id" element={
                isLoggedIn ? <IncomeView user={user} handleLogout={handleLogout} /> : <Navigate to="/admin/login" replace />
            } />

            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;