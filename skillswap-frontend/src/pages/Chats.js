import React, { useState, useEffect } from 'react';
import '../styles/Chats.css';

const API_URL = 'http://localhost:8081/api';

const Chats = () => {
    const [activeTab, setActiveTab] = useState('swapRequests');
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [acceptedChats, setAcceptedChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load user data on component mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                console.log('Current user from localStorage:', user);
                setCurrentUser(user);
                loadUserRequests(user.id);
            } catch (e) {
                console.error('Error parsing user data:', e);
                setError('Invalid user data');
            }
        } else {
            console.log('No user found in localStorage');
            setError('Please login first');
        }
    }, []);

    // Load messages when chat is selected
    useEffect(() => {
        if (currentUser && selectedChat) {
            loadMessages(selectedChat);
            
            // Poll for new messages every 3 seconds
            const interval = setInterval(() => {
                loadMessages(selectedChat);
            }, 3000);
            
            return () => clearInterval(interval);
        }
    }, [selectedChat, currentUser]);

    // Load all swap requests for current user
    const loadUserRequests = async (userId) => {
        setLoading(true);
        setError('');
        try {
            console.log('Loading requests for user:', userId);
            // ✅ FIX: Use the correct endpoint
            const response = await fetch(`${API_URL}/swap-requests/user/${userId}`);
            const result = await response.json();
            
            console.log('API Response:', result);
            
            if (result.success) {
                const requests = result.data || [];
                console.log('Requests loaded:', requests);
                
                // Process each request to add outgoing flag
                const processedRequests = requests.map(req => ({
                    ...req,
                    outgoing: req.requesterId === userId
                }));
                
                const incoming = processedRequests.filter(req => !req.outgoing && req.status === 'PENDING');
                const outgoing = processedRequests.filter(req => req.outgoing && req.status === 'PENDING');
                const accepted = processedRequests.filter(req => req.status === 'ACCEPTED');
                
                console.log('Incoming:', incoming);
                console.log('Outgoing:', outgoing);
                console.log('Accepted:', accepted);
                
                setIncomingRequests(incoming);
                setOutgoingRequests(outgoing);
                setAcceptedChats(accepted);
            } else {
                setError(result.message || 'Failed to load requests');
            }
            
        } catch (error) {
            console.error('Error loading requests:', error);
            setError('Network error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle accept request
    const handleAcceptRequest = async (request) => {
        if (!currentUser) return;
        
        try {
            console.log('Accepting request:', request);
            const response = await fetch(`${API_URL}/swap-requests/${request.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'ACCEPTED',
                    userId: currentUser.id
                })
            });
            
            const result = await response.json();
            console.log('Accept response:', result);
            
            if (result.success) {
                // Reload requests
                loadUserRequests(currentUser.id);
                alert('Request accepted!');
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Error accepting request: ' + error.message);
        }
    };

    // Handle reject request
    const handleRejectRequest = async (request) => {
        if (!currentUser) return;
        
        try {
            console.log('Rejecting request:', request);
            const response = await fetch(`${API_URL}/swap-requests/${request.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'REJECTED',
                    userId: currentUser.id
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                loadUserRequests(currentUser.id);
                alert('Request rejected');
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Error rejecting request: ' + error.message);
        }
    };

    // Open chat with selected user
    const openChat = (chat) => {
        console.log('Opening chat:', chat);
        setSelectedChat(chat);
    };

    // Load messages for selected chat
    const loadMessages = async (chat) => {
        if (!currentUser) return;
        
        const otherUserId = chat.outgoing ? chat.receiverId : chat.requesterId;
        
        try {
            console.log('Loading messages between', currentUser.id, 'and', otherUserId);
            const response = await fetch(`${API_URL}/messages/conversation/${currentUser.id}/${otherUserId}`);
            const result = await response.json();
            
            console.log('Messages response:', result);
            
            if (result.success) {
                setMessages(result.data || []);
                
                // Auto scroll to bottom
                setTimeout(() => {
                    const messagesArea = document.querySelector('.messages-area');
                    if (messagesArea) {
                        messagesArea.scrollTop = messagesArea.scrollHeight;
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    // Send new message
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat || !currentUser) return;

        const receiverId = selectedChat.outgoing ? 
            selectedChat.receiverId : 
            selectedChat.requesterId;
            
        const receiverName = selectedChat.outgoing ?
            selectedChat.receiverFullName :
            selectedChat.requesterFullName;
            
        const receiverUsername = selectedChat.outgoing ?
            selectedChat.receiverUsername :
            selectedChat.requesterUsername;

        try {
            const messageData = {
                senderId: currentUser.id,
                senderUsername: currentUser.username || currentUser.userName,
                senderFullName: currentUser.fullName || currentUser.name,
                receiverId: receiverId,
                receiverUsername: receiverUsername,
                receiverFullName: receiverName,
                content: newMessage,
                swapRequestId: selectedChat.id
            };
            
            console.log('Sending message:', messageData);
            
            const response = await fetch(`${API_URL}/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            });
            
            const result = await response.json();
            console.log('Send message response:', result);
            
            if (result.success) {
                setMessages([...messages, result.data]);
                setNewMessage('');
                
                // Scroll to bottom
                setTimeout(() => {
                    const messagesArea = document.querySelector('.messages-area');
                    if (messagesArea) {
                        messagesArea.scrollTop = messagesArea.scrollHeight;
                    }
                }, 100);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message: ' + error.message);
        }
    };

    // Close chat and go back to list
    const closeChat = () => {
        setSelectedChat(null);
        setMessages([]);
    };

    // Format time
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const totalRequests = incomingRequests.length + outgoingRequests.length;

    // Show error if any
    if (error) {
        return (
            <div className="chats-container">
                <h1>Swap Requests</h1>
                <div className="error-message" style={{color: 'red', padding: '20px', textAlign: 'center'}}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="chats-container">
            <h1>Swap Requests {totalRequests > 0 && `(${totalRequests})`}</h1>

            {/* Tabs */}
            <div className="chats-tabs">
                <button 
                    className={activeTab === 'swapRequests' ? 'active' : ''}
                    onClick={() => {
                        setActiveTab('swapRequests');
                        setSelectedChat(null);
                    }}
                >
                    Swap Requests
                    {totalRequests > 0 && (
                        <span className="badge">{totalRequests}</span>
                    )}
                </button>
                <button 
                    className={activeTab === 'messages' ? 'active' : ''}
                    onClick={() => {
                        setActiveTab('messages');
                        setSelectedChat(null);
                    }}
                >
                    Messages
                    {acceptedChats.length > 0 && (
                        <span className="badge">{acceptedChats.length}</span>
                    )}
                </button>
            </div>

            <div className="chats-content">
                {loading ? (
                    <div className="loading" style={{textAlign: 'center', padding: '50px'}}>Loading...</div>
                ) : (
                    <>
                        {!selectedChat ? (
                            <>
                                {activeTab === 'swapRequests' ? (
                                    <div className="requests-container">
                                        {/* INCOMING REQUESTS */}
                                        {incomingRequests.length > 0 && (
                                            <div className="request-section">
                                                <h2>INCOMING REQUESTS ({incomingRequests.length})</h2>
                                                {incomingRequests.map(request => (
                                                    <div key={request.id} className="request-card incoming">
                                                        <div className="request-header">
                                                            <div className="user-info">
                                                                <div className="avatar">
                                                                    {request.requesterFullName?.charAt(0) || 'U'}
                                                                </div>
                                                                <div>
                                                                    <h3>{request.requesterFullName || request.requesterUsername}</h3>
                                                                    <p className="email">{request.requesterEmail}</p>
                                                                    <p className="time">
                                                                        Received {formatTime(request.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="request-details">
                                                            <p><strong>Wants to learn:</strong> {request.skillRequested}</p>
                                                            <p><strong>Offers to teach:</strong> {request.skillOffered}</p>
                                                            <p className="message-text">"{request.message}"</p>
                                                        </div>
                                                        
                                                        <div className="request-footer">
                                                            <span className="status pending">Pending</span>
                                                            <div className="request-actions">
                                                                <button 
                                                                    className="accept-btn"
                                                                    onClick={() => handleAcceptRequest(request)}
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button 
                                                                    className="reject-btn"
                                                                    onClick={() => handleRejectRequest(request)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* OUTGOING REQUESTS */}
                                        {outgoingRequests.length > 0 && (
                                            <div className="request-section">
                                                <h2>OUTGOING REQUESTS ({outgoingRequests.length})</h2>
                                                {outgoingRequests.map(request => (
                                                    <div key={request.id} className="request-card outgoing">
                                                        <div className="request-header">
                                                            <div className="user-info">
                                                                <div className="avatar">
                                                                    {request.receiverFullName?.charAt(0) || 'U'}
                                                                </div>
                                                                <div>
                                                                    <h3>{request.receiverFullName || request.receiverUsername}</h3>
                                                                    <p className="email">{request.receiverEmail}</p>
                                                                    <p className="time">
                                                                        Sent {formatTime(request.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="request-details">
                                                            <p><strong>You want to learn:</strong> {request.skillRequested}</p>
                                                            <p><strong>You offer to teach:</strong> {request.skillOffered}</p>
                                                            <p className="message-text">"{request.message}"</p>
                                                        </div>
                                                        
                                                        <div className="request-footer">
                                                            <span className="status pending">Pending</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {incomingRequests.length === 0 && outgoingRequests.length === 0 && (
                                            <div className="empty-state" style={{textAlign: 'center', padding: '50px'}}>
                                                <p>No swap requests</p>
                                                <small>Go to Explore page to send requests</small>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="messages-container">
                                        <h2>ACTIVE CHATS ({acceptedChats.length})</h2>
                                        
                                        {acceptedChats.map(chat => {
                                            const otherUser = chat.outgoing ? {
                                                name: chat.receiverFullName || chat.receiverUsername,
                                                email: chat.receiverEmail,
                                                id: chat.receiverId
                                            } : {
                                                name: chat.requesterFullName || chat.requesterUsername,
                                                email: chat.requesterEmail,
                                                id: chat.requesterId
                                            };
                                            
                                            return (
                                                <div 
                                                    key={chat.id} 
                                                    className="chat-card"
                                                    onClick={() => openChat(chat)}
                                                    style={{cursor: 'pointer', border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '8px'}}
                                                >
                                                    <div className="chat-user" style={{display: 'flex', alignItems: 'center'}}>
                                                        <div className="avatar large" style={{width: '50px', height: '50px', borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px'}}>
                                                            {otherUser.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="chat-info">
                                                            <h3 style={{margin: '0 0 5px 0'}}>{otherUser.name}</h3>
                                                            <p className="chat-skill" style={{margin: '0 0 5px 0', color: '#666'}}>
                                                                {chat.skillRequested} ↔ {chat.skillOffered}
                                                            </p>
                                                            <span className="status accepted" style={{color: 'green'}}>Accepted</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {acceptedChats.length === 0 && (
                                            <div className="empty-state" style={{textAlign: 'center', padding: '50px'}}>
                                                <p>No active chats</p>
                                                <small>Accept requests to start chatting</small>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="chat-view">
                                <div className="chat-header" style={{display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #ddd'}}>
                                    <button className="back-btn" onClick={closeChat} style={{marginRight: '15px'}}>← Back</button>
                                    <div className="chat-user-info" style={{display: 'flex', alignItems: 'center'}}>
                                        <div className="avatar large" style={{width: '40px', height: '40px', borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px'}}>
                                            {selectedChat.outgoing 
                                                ? selectedChat.receiverFullName?.charAt(0)
                                                : selectedChat.requesterFullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 style={{margin: '0'}}>
                                                {selectedChat.outgoing 
                                                    ? selectedChat.receiverFullName || selectedChat.receiverUsername
                                                    : selectedChat.requesterFullName || selectedChat.requesterUsername}
                                            </h2>
                                            <p style={{margin: '5px 0 0 0', color: '#666'}}>{selectedChat.outgoing ? selectedChat.receiverEmail : selectedChat.requesterEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="date-separator" style={{textAlign: 'center', padding: '10px', color: '#999'}}>
                                    {formatDate(selectedChat.createdAt)}
                                </div>

                                <div className="skill-request-card" style={{padding: '15px', margin: '15px', background: '#f5f5f5', borderRadius: '8px'}}>
                                    <h3 style={{margin: '0 0 10px 0'}}>Skill Request:</h3>
                                    <p style={{margin: '5px 0'}}>
                                        I would like to learn {selectedChat.skillRequested} and can offer {selectedChat.skillOffered} in exchange.
                                    </p>
                                    <p style={{margin: '5px 0'}}><strong>Message:</strong> {selectedChat.message}</p>
                                    <div className="request-details" style={{marginTop: '10px'}}>
                                        <span style={{display: 'block'}}>Availability: {selectedChat.availability || 'weekdays'}</span>
                                        <span style={{display: 'block'}}>Session Duration: {selectedChat.sessionDuration || 60} minutes</span>
                                    </div>
                                </div>

                                <div className="messages-area" style={{height: '300px', overflowY: 'auto', padding: '15px'}}>
                                    {messages.length > 0 ? (
                                        messages.map((msg, index) => (
                                            <div 
                                                key={index}
                                                className={`message ${msg.senderId === currentUser?.id ? 'sent' : 'received'}`}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: msg.senderId === currentUser?.id ? 'flex-end' : 'flex-start',
                                                    margin: '10px 0'
                                                }}
                                            >
                                                <div className="message-bubble" style={{
                                                    maxWidth: '70%',
                                                    padding: '10px',
                                                    borderRadius: '10px',
                                                    background: msg.senderId === currentUser?.id ? '#007bff' : '#e9ecef',
                                                    color: msg.senderId === currentUser?.id ? 'white' : 'black'
                                                }}>
                                                    <p style={{margin: '0 0 5px 0'}}>{msg.content}</p>
                                                    <span className="message-time" style={{fontSize: '0.8em', opacity: '0.7'}}>
                                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{textAlign: 'center', color: '#999', padding: '50px'}}>
                                            No messages yet. Start the conversation!
                                        </div>
                                    )}
                                </div>

                                <div className="message-input-area" style={{display: 'flex', padding: '15px', borderTop: '1px solid #ddd'}}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        style={{flex: '1', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginRight: '10px'}}
                                    />
                                    <button 
                                        onClick={sendMessage} 
                                        disabled={!newMessage.trim()}
                                        style={{
                                            padding: '10px 20px',
                                            background: !newMessage.trim() ? '#ccc' : '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: !newMessage.trim() ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Chats;