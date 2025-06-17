import React, { useEffect, useState } from 'react';
import { getClubOverview } from '../api/clubAdminApi';

const OverviewTab = ({ clubId }) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverview();
  }, [clubId]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await getClubOverview(clubId);
      setOverview(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch overview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="tab-header" style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: 'var(--primary)',
          color: 'white',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem'
        }}>📊</div>
        <h2 style={{ 
          fontSize: '1.5rem',
          color: 'var(--dark)',
          margin: 0
        }}>Club Overview</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon">🎉</div>
            <div className="stat-value">{overview.eventCount}</div>
            <div className="stat-label">Total Events</div>
          </div>
          
          <div className="stat-card" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon">📅</div>
            <div className="stat-value">{overview.meetingCount}</div>
            <div className="stat-label">Meetings</div>
          </div>
          
          <div className="stat-card" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon">👥</div>
            <div className="stat-value">{overview.memberCount}</div>
            <div className="stat-label">Members</div>
          </div>
          
          <div className="stat-card" style={{ animationDelay: '0.4s' }}>
            <div className="stat-icon">📨</div>
            <div className="stat-value">{overview.requestCount}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .stat-card {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
        .stat-icon {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }
        .error-message {
          background: rgba(247, 37, 133, 0.1);
          color: var(--warning);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default OverviewTab;