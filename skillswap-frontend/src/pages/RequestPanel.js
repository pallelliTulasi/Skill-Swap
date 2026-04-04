import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RequestPanel.css';

const RequestPanel = ({ isOpen, onClose, recipient, currentUser }) => {
    const [formData, setFormData] = useState({
        skillToLearn: '',
        skillToTeach: '',
        message: '',
        availability: 'Weekdays',
        sessionDuration: '60 minutes'
    });

    useEffect(() => {
        if (recipient) {
            setFormData({
                skillToLearn: recipient.skillName || '',
                skillToTeach: '',
                message: `I want to learn ${recipient.skillName || ''}`,
                availability: 'Weekdays',
                sessionDuration: '60 minutes'
            });
        }
    }, [recipient]);

    if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.id) {
        alert('Please login first');
        return;
    }

    try {
        console.log('Sending request with data:', {
            requesterId: currentUser.id,
            requesterFullName: currentUser.fullName || currentUser.name,
            requesterUsername: currentUser.userName || currentUser.username,
            requesterEmail: currentUser.email,
            receiverId: recipient.id,
            receiverFullName: recipient.fullName || recipient.name,
            receiverUsername: recipient.userName || recipient.username,
            receiverEmail: recipient.userEmail || recipient.email,
            skillRequested: formData.skillToLearn,
            skillOffered: formData.skillToTeach,
            message: formData.message,
            availability: formData.availability,
            sessionDuration: formData.sessionDuration
        });

        const requestData = {
            requesterId: currentUser.id,
            requesterFullName: currentUser.fullName || currentUser.name || currentUser.userName,
            requesterUsername: currentUser.userName || currentUser.username,
            requesterEmail: currentUser.email,
            receiverId: recipient.id,
            receiverFullName: recipient.fullName || recipient.name || recipient.userName,
            receiverUsername: recipient.userName || recipient.username,
            receiverEmail: recipient.userEmail || recipient.email,
            skillRequested: formData.skillToLearn,
            skillOffered: formData.skillToTeach,
            message: formData.message,
            availability: formData.availability,
            sessionDuration: formData.sessionDuration
        };

        const response = await fetch('http://localhost:8081/api/swap-requests/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();
        console.log('Response from server:', result);
        
        if (result.success) {
            alert('Request sent successfully!');
            onClose();
            // Use React Router navigation instead of window.location
            // This will keep your sidebar
            if (typeof window !== 'undefined' && window.navigateTo) {
                window.navigateTo('/chats');
            } else {
                // Fallback - but this might cause sidebar to disappear
                window.location.href = '/chats';
            }
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error details:', error);
        alert('Error sending request: ' + error.message);
    }
};

   const saveRequest = (requestData) => {
    // Save for sender
    const senderKey = `requests_${requestData.senderEmail}`;
    const senderRequests = JSON.parse(localStorage.getItem(senderKey)) || [];
    senderRequests.push({ 
        ...requestData, 
        type: 'sent',
        status: 'PENDING'  // Make sure status is set
    });
    localStorage.setItem(senderKey, JSON.stringify(senderRequests));

    // Save for recipient
    const recipientKey = `requests_${requestData.recipientEmail}`;
    const recipientRequests = JSON.parse(localStorage.getItem(recipientKey)) || [];
    recipientRequests.push({ 
        ...requestData, 
        type: 'received', 
        status: 'PENDING'  // This is correct
    });
    localStorage.setItem(recipientKey, JSON.stringify(recipientRequests));

    // Save globally
    const allRequests = JSON.parse(localStorage.getItem('all_requests')) || [];
    allRequests.push(requestData);
    localStorage.setItem('all_requests', JSON.stringify(allRequests));
};

    return (
        <div className="panel-overlay" onClick={onClose}>
            <div className="request-panel" onClick={e => e.stopPropagation()}>
                <h2>Create Skill Exchange Request</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Skill You Want to Learn</label>
                        <input
                            type="text"
                            value={formData.skillToLearn}
                            onChange={(e) => setFormData({...formData, skillToLearn: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Skill You Can Teach</label>
                        <input
                            type="text"
                            value={formData.skillToTeach}
                            onChange={(e) => setFormData({...formData, skillToTeach: e.target.value})}
                            placeholder="HTML"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Message</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            rows="3"
                            required
                        />
                    </div>

                    <hr />

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Availability</label>
                            <select
                                value={formData.availability}
                                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                            >
                                <option>Weekdays</option>
                                <option>Weekends</option>
                                <option>Both</option>
                                <option>Flexible</option>
                            </select>
                        </div>

                        <div className="form-group half">
                            <label>Session Duration</label>
                            <select
                                value={formData.sessionDuration}
                                onChange={(e) => setFormData({...formData, sessionDuration: e.target.value})}
                            >
                                <option>30 minutes</option>
                                <option>60 minutes</option>
                                <option>90 minutes</option>
                                <option>120 minutes</option>
                            </select>
                        </div>
                    </div>

                    <div className="panel-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="send-btn">
                            Send Request
                        </button>
                    </div>
                </form>

                {recipient && (
                    <div className="recipient-info">
                        <h3>Request Recipient</h3>
                        <p><strong>{recipient.userName || recipient.name}</strong></p>
                        <p className="location">Email: {recipient.userEmail || recipient.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestPanel;