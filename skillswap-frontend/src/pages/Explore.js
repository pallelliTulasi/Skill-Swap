import React, { useState, useEffect } from 'react';
import '../styles/Explore.css';
import RequestPanel from './RequestPanel';

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('all');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    
    // ADD THIS - to store current logged in user
    const [currentUser, setCurrentUser] = useState(null);

    const API_URL = 'http://localhost:8081/api/explore';

    // ADD THIS useEffect - to load current user
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setCurrentUser(user);
                console.log('Current user loaded:', user);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [searchTerm, selectedSkill, posts]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/posts`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            console.log('Fetched posts:', data);
            setPosts(data);
            setFilteredPosts(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterPosts = () => {
        let filtered = [...posts];

        if (selectedSkill !== 'all') {
            filtered = filtered.filter(post => post.skillName === selectedSkill);
        }

        if (searchTerm) {
            filtered = filtered.filter(post =>
                post.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.skillName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPosts(filtered);
    };

    const handleView = async (postId) => {
        try {
            await fetch(`${API_URL}/posts/${postId}`);
            setPosts(posts.map(post =>
                post.id === postId
                    ? { ...post, viewCount: (post.viewCount || 0) + 1 }
                    : post
            ));
        } catch (err) {
            console.error('Error updating view:', err);
        }
    };

    const handleRequest = (post) => {
        setSelectedRecipient(post);
        setIsPanelOpen(true);
    };
    
    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedRecipient(null);
    };

    // Get unique skills for filter
    const skills = ['all', ...new Set(posts.map(post => post.skillName).filter(Boolean))];

    if (loading) {
        return (
            <div className="explore-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading achievements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="explore-container">
            <div className="explore-header">
                <h1 className="explore-title">Skills Test Platform</h1>
                <p className="explore-subtitle">Discover users who scored 80% or above</p>
            </div>

            <div className="explore-controls">
                <div className="search-container">
                    <i className="fas fa-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name or skill..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            className="clear-btn"
                            onClick={() => setSearchTerm('')}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                <div className="filter-container">
                    <select 
                        className="filter-select"
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                    >
                        {skills.map(skill => (
                            <option key={skill} value={skill}>
                                {skill === 'all' ? 'All Skills' : skill}
                            </option>
                        ))}
                    </select>
                    <i className="fas fa-chevron-down select-arrow"></i>
                </div>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="no-results">
                    <i className="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>
            ) : (
                <div className="horizontal-scroll-container">
                    <div className="cards-row">
                        {filteredPosts.map(post => (
                            <div key={post.id} className="horizontal-card">
                                <div className="card-header">
                                    <div className="card-avatar">
                                        {post.userName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="card-user-info">
                                        <h3 className="card-user-name">{post.userName || 'Anonymous'}</h3>
                                        <span className="card-skill-tag">{post.skillName}</span>
                                    </div>
                                    <div className="card-score-badge" style={{ backgroundColor: post.score >= 90 ? '#27ae60' : '#f39c12' }}>
                                        {post.score}%
                                    </div>
                                </div>
                                
                                <div className="card-content">
                                    <p className="card-score-text">
                                        Score: <strong>{post.score}%</strong> ({post.correctAnswers}/{post.totalQuestions} correct)
                                    </p>
                                </div>

                                <div className="card-stats">
                                    <div className="card-stat">
                                        <div className="stat-value">{post.score}%</div>
                                        <div className="stat-label">Score</div>
                                    </div>
                                    <div className="card-stat">
                                        <div className="stat-value">{post.viewCount || 0}</div>
                                        <div className="stat-label">Views</div>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button 
                                        className="card-btn view-btn"
                                        onClick={() => handleView(post.id)}
                                    >
                                        <i className="fas fa-eye"></i> View
                                    </button>
                                    <button 
                                        className="card-btn request-btn"
                                        onClick={() => handleRequest(post)}
                                    >
                                        <i className="fas fa-handshake"></i> Request
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Show count of users */}
            <div className="users-count">
                Showing {filteredPosts.length} user{filteredPosts.length !== 1 ? 's' : ''}
            </div>
            
            {/* Request Panel - NOW WITH currentUser PROP */}
            <RequestPanel 
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                recipient={selectedRecipient}
                currentUser={currentUser}  // ← THIS IS THE ONLY LINE YOU NEED TO ADD
            />
            
        </div>
    );
};

export default Explore;