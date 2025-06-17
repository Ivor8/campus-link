import React, { useEffect, useState } from 'react';
import { getCombinedMembers, removeClubMember } from '../api/clubAdminApi';

const MembersTab = ({ clubId }) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [clubId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await getCombinedMembers(clubId);
      setMembers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm('Remove this member from the club?')) return;
    try {
      await removeClubMember(clubId, memberId);
      setMembers(members.filter(m => m._id !== memberId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove member');
    }
  };

  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(search.toLowerCase()) ||
    member.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-card">
      <div className="flex items-center gap-4 mb-8">
        <div className="icon-circle bg-primary">
          👥
        </div>
        <h2 className="tab-title">
          Club Members
        </h2>
      </div>

      {error && (
        <div className="error-message animate-shake">
          {error}
        </div>
      )}

      <div className="search-bar mb-6">
        <input
          type="text"
          placeholder="Search members by name or email..."
          className="form-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : filteredMembers.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p>{search ? 'No matching members found' : 'No members in this club yet'}</p>
        </div>
      ) : (
        <div className="members-grid">
          {filteredMembers.map(member => (
            <div key={member._id} className="member-card">
              <div className="member-avatar">
                {member.profilePicture ? (
                  <img src={member.profilePicture} alt={member.name} />
                ) : (
                  <div className="avatar-fallback">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="member-info">
                <h4>{member.name}</h4>
                <p>{member.email}</p>
              </div>
              <button 
                onClick={() => handleRemove(member._id)}
                className="btn-delete"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        
        .member-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .member-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .member-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          background: #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .member-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-fallback {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--primary);
        }
        
        .member-info {
          flex: 1;
        }
        
        .member-info h4 {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .member-info p {
          font-size: 0.85rem;
          color: var(--gray-dark);
        }
        
        .btn-delete {
          padding: 0.5rem 1rem;
          background: rgba(247, 37, 133, 0.1);
          color: var(--warning);
          border: 1px solid rgba(247, 37, 133, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-delete:hover {
          background: rgba(247, 37, 133, 0.2);
        }
        
        @media (max-width: 768px) {
          .members-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MembersTab;