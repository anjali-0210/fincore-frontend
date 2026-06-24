import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    // Color Theme Constants matching your app screenshot
    const themeColor = 'linear-gradient(to right, #ec4899, #f43f5e)'; // Pink to Rose Gradient
    const bgGradient = 'linear-gradient(135deg, #fff5f5 0%, #fff1f2 50%, #fdf4ff 100%)'; // Soft pink background gradient
    const textColor = '#1e293b'; // Slate-800 for headers
    const subTextColor = '#475569'; // Slate-600 for descriptions

    return (
        <div style={{
            minHeight: '100vh',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            background: bgGradient,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '40px 20px',
            boxSizing: 'border-box',
            color: textColor
        }}>
            {/* Top Navigation Logo Area */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                maxWidth: '1100px',
                justifyContent: 'flex-start',
                marginBottom: '40px'
            }}>
                <div style={{
                    background: themeColor,
                    color: '#fff',
                    width: '45px',
                    height: '45px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    boxShadow: '0 8px 20px rgba(244, 63, 94, 0.2)'
                }}>
                    F
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.05em' }}>
                    Fincore <span style={{ fontWeight: '400', fontSize: '0.9rem', color: subTextColor }}>| Finance ERP</span>
                </span>
            </header>

            {/* Main Hero & Content Section */}
            <main style={{
                textAlign: 'center',
                maxWidth: '850px',
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
            }}>
                {/* Small Tag */}
                <span style={{
                    background: 'rgba(236, 72, 153, 0.08)',
                    color: '#db2777',
                    padding: '8px 16px',
                    borderRadius: '99px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    border: '1px solid rgba(236, 72, 153, 0.15)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    Enterprise ERP Solution
                </span>

                <h1 style={{
                    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                    fontWeight: '900',
                    lineHeight: '1.15',
                    margin: '0',
                    letterSpacing: '-0.03em'
                }}>
                    Finance & Expense <br />
                    <span style={{
                        background: themeColor,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Management System</span>
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                    color: subTextColor,
                    lineHeight: '1.6',
                    maxWidth: '650px',
                    margin: '0 auto 10px auto'
                }}>
                    A secure and modern financial ERP platform. Seamlessly track, audit, and manage your business invoices, income records, payments, and pending dues in one centralized dashboard.
                </p>

                {/* Main Action Button */}
                <button 
                    onClick={() => navigate('/admin/login')}
                    style={{
                        padding: '16px 40px',
                        fontSize: '1rem',
                        fontWeight: '800',
                        color: '#fff',
                        background: themeColor,
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(244, 63, 94, 0.3)',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 15px 30px rgba(244, 63, 94, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 10px 25px rgba(244, 63, 94, 0.3)';
                    }}
                >
                    Access Financial System
                </button>

                {/* Static Attractive Feature Grid */}
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '900px',
                    marginTop: '60px'
                }}>
                    {/* Feature 1 */}
                    <div style={cardStyle}>
                        <div style={{...iconWrapperStyle, background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899'}}>
                            📊
                        </div>
                        <h3 style={cardHeaderStyle}>Income Tracking</h3>
                        <p style={cardTextStyle}>Efficiently record invoice numbers, received amounts, and payment statuses in real-time.</p>
                    </div>

                    {/* Feature 2 */}
                    <div style={cardStyle}>
                        <div style={{...iconWrapperStyle, background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e'}}>
                            📁
                        </div>
                        <h3 style={cardHeaderStyle}>Audit & Ledgers</h3>
                        <p style={cardTextStyle}>Monitor company-wide and client-wise financial transactions with detailed audit trails.</p>
                    </div>

                    {/* Feature 3 */}
                    <div style={cardStyle}>
                        <div style={{...iconWrapperStyle, background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7'}}>
                            💳
                        </div>
                        <h3 style={cardHeaderStyle}>Secure Access</h3>
                        <p style={cardTextStyle}>Protect sensitive financial assets with secure token-based authorization and role protection.</p>
                    </div>
                </section>
            </main>

            {/* Footer Area */}
            <footer style={{
                fontSize: '0.85rem',
                color: subTextColor,
                marginTop: '40px'
            }}>
                © {new Date().getFullYear()} Fincore Finance ERP. All rights reserved.
            </footer>
        </div>
    );
}

// Inline Helper Styles
const cardStyle = {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid rgba(244, 63, 94, 0.06)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const iconWrapperStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem'
};

const cardHeaderStyle = {
    fontSize: '1.1rem',
    fontWeight: '800',
    margin: '0',
    color: '#1e293b'
};

const cardTextStyle = {
    fontSize: '0.88rem',
    color: '#64748b',
    margin: '0',
    lineHeight: '1.5'
};