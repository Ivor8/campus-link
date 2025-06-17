import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import OverviewTab from './OverviewTab';
import EventsTab from './EventsTab';
import MeetingsTab from './MeetingsTab';
import MembersTab from './MembersTab';
import RequestsTab from './MemberRequestsTab';
import './clubAdmin.css';

const ClubAdminDashboard = () => {
  const { clubId } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { name: 'Overview', icon: '📊' },
    { name: 'Events', icon: '🎉' }, 
    { name: 'Meetings', icon: '📅' },
    { name: 'Members', icon: '👥' },
    { name: 'Requests', icon: '📨' }
  ];

  return (
    <div className="admin-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="dashboard-title" style={{ 
        fontSize: '2rem',
        marginBottom: '1.5rem',
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
        }}>👑</span>
        Club Administration
      </h1>
      
      <div className="tab-container">
        <div className="tab-header">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`tab-button ${activeTab === tab.name ? 'active' : ''}`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
        
        <div className="tab-content" style={{ padding: '1.5rem' }}>
          {activeTab === 'Overview' && <OverviewTab clubId={clubId} />}
          {activeTab === 'Events' && <EventsTab clubId={clubId} />}
          {activeTab === 'Meetings' && <MeetingsTab clubId={clubId} />}
          {activeTab === 'Members' && <MembersTab clubId={clubId} />}
          {activeTab === 'Requests' && <RequestsTab clubId={clubId} />}
        </div>
      </div>
    </div>
  );
};

export default ClubAdminDashboard;