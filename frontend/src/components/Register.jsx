// frontend/src/components/Register.jsx
import React, { useState } from 'react';

const Register = ({ setToken }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [statusMessage, setStatusMessage] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    
    // Security 2FA validation parameters
    const [requires2FA, setRequires2FA] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [userIdFor2FA, setUserIdFor2FA] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? 'login' : 'register';

        if (!isLogin && !formData.email.endsWith('strathmore.edu') && !formData.email.endsWith('.edu')) {
            setStatusMessage('Error: Access requires an official institutional profile.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                if (isLogin && data.requires2FA) {
                    setRequires2FA(true);
                    setUserIdFor2FA(data.userId);
                    setStatusMessage(data.message);
                } else if (!isLogin) {
                    setStatusMessage('Account initialized. Switch to login tab.');
                    setIsLogin(true);
                }
            } else {
                setStatusMessage(`Error: ${data.message}`);
            }
        } catch (err) {
            setStatusMessage('Unable to resolve authorization connectivity.');
        }
    };

    const handleVerify2FA = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: userIdFor2FA, // Mapped to your actual state variable
                    tfaCode: twoFactorCode // Mapped to the input field state variable
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard';
            } else {
                // Fixed to use your actual error message state setter
                setStatusMessage(data.message); 
            }
        } catch (err) {
            console.error("Verification failed:", err);
            setStatusMessage("Verification request failed to reach the server.");
        }
    };

    if (requires2FA) {
        return (
            <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
                <h3 style={{ textAlign: 'center', color: '#0288d1' }}>🔒 Enter 2FA Token</h3>
                <p style={{ fontSize: '0.88em', color: '#555', textAlign: 'center' }}>
                    A verification code has been generated. Check your node backend server execution console logs to grab the token vector.
                </p>
                <form onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="6-Digit Code (e.g., 123456)" required maxLength="6"
                           style={{ padding: '12px', textAlign: 'center', fontSize: '1.2em', letterSpacing: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                           onChange={(e) => setTwoFactorCode(e.target.value)} />
                    <button type="submit" style={{ background: '#0288d1', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Confirm Identity Verification
                    </button>
                </form>
                {statusMessage && <p style={{ fontSize: '0.9em', color: 'red', textAlign: 'center' }}>{statusMessage}</p>}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: '#fff' }}>
            <h3 style={{ textAlign: 'center', color: '#0288d1' }}>{isLogin ? 'Welcome Back' : 'Campus Gateway Signup'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLogin && (
                    <input type="text" placeholder="Full Name" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                           onChange={(e) => setFormData({...formData, name: e.target.value})} />
                )}
                <input type="email" placeholder="username@strathmore.edu" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                       onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <input type="password" placeholder="Password Access Field" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                       onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button type="submit" style={{ background: '#0288d1', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isLogin ? 'Request Session 2FA Verification' : 'Verify & Setup Identity'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9em', cursor: 'pointer', color: '#0288d1' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an entry profile? Create one' : 'Already holding an active footprint? Log in'}
            </p>
            {statusMessage && <div style={{ marginTop: '15px', padding: '10px', borderRadius: '4px', textAlign: 'center', background: '#f5f5f5', fontSize: '0.9em', fontWeight: 'bold' }}>{statusMessage}</div>}
        </div>
    );
};

export default Register;