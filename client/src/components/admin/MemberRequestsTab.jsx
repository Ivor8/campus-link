import React, { useEffect, useState } from 'react';
import { 
  getJoinRequests, 
  approveJoinRequest, 
  rejectJoinRequest 
} from '../api/clubAdminApi';

const MemberRequestsTab = ({ clubId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [clubId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getJoinRequests(clubId);
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await approveJoinRequest(requestId);
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectJoinRequest(requestId);
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject request');
    }
  };

  return (
    <div className="admin-card">
      <div className="tab-header" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          color: 'var(--dark)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            background: 'var(--primary)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
          }}>📨</span>
          Membership Requests
        </h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner"></div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>No pending membership requests</p>
        </div>
      ) : (
        <ul className="admin-list">
          {requests.map(request => (
            <li key={request._id} className="list-item">
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.3rem' }}>
                  {request.user?.name}
                </h4>
                <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>
                  {request.user?.email}
                </p>
              </div>
              <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleApprove(request._id)}
                  className="btn btn-success"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemberRequestsTab;