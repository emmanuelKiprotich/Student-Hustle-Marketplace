// components/MessagingInterface.jsx
import React, { useState } from 'react';

const MessagingInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Wilson', text: 'Hello, I received your baking order for Friday. Any flavor allergies?', time: '1:14 PM' },
        { id: 2, sender: 'You', text: 'Hi! Vanilla or chocolate is perfect. No allergies at all.', time: '1:16 PM' }
    ]);
    const [currentInput, setCurrentInput] = useState('');

    const dispatchMessage = (e) => {
        e.preventDefault();
        if (!currentInput.trim()) return;
        
        setMessages([...messages, { id: Date.now(), sender: 'You', text: currentInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
        setCurrentInput('');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '12px', height: '70vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
            {/* Context Contact Top Bar */}
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', background: '#fcfdff', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h4 style={{ margin: 0, color: '#111' }}>💬 Peer Negotiation Channel</h4>
                <small style={{ color: '#666' }}>Active Thread context: Mutua Wilson</small>
            </div>

            {/* Messages Output Loop Canvas */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#fafafa' }}>
                {messages.map(msg => {
                    const isMe = msg.sender === 'You';
                    return (
                        <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                            <div style={{ background: isMe ? '#0288d1' : '#fff', color: isMe ? 'white' : '#333', padding: '12px 16px', borderRadius: '12px', border: isMe ? 'none' : '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <p style={{ margin: 0, fontSize: '0.95em' }}>{msg.text}</p>
                            </div>
                            <small style={{ color: '#999', fontSize: '0.75em', display: 'block', textAlign: isMe ? 'right' : 'left', marginTop: '4px' }}>{msg.time}</small>
                        </div>
                    );
                })}
            </div>

            {/* Input Action Form Block */}
            <form onSubmit={dispatchMessage} style={{ display: 'flex', padding: '15px', borderTop: '1px solid #eee', background: '#fff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                <input 
                    type="text" 
                    placeholder="Coordinate your fulfillment details or chosen payment execution pathways here..." 
                    style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '6px', outline: 'none', fontSize: '0.95em' }}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                />
                <button type="submit" style={{ background: '#0288d1', color: 'white', border: 'none', padding: '0 20px', marginLeft: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
            </form>
        </div>
    );
};

export default MessagingInterface;