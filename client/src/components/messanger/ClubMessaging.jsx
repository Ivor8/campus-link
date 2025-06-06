import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUserCircle, FaEllipsisV, FaSearch, FaSmile, FaPaperclip } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import './clubMessaging.css'

const ClubMessaging = ({ clubId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeMembers, setActiveMembers] = useState([]);
  const messagesEndRef = useRef(null);

  // Sample data - in a real app this would come from your backend
  const clubMembers = [
    { id: 1, name: 'Alice Johnson', avatar: '', isOnline: true },
    { id: 2, name: 'Bob Smith', avatar: '', isOnline: true },
    { id: 3, name: 'Charlie Brown', avatar: '', isOnline: false },
    { id: 4, name: 'Diana Prince', avatar: '', isOnline: true },
    { id: 5, name: 'Ethan Hunt', avatar: '', isOnline: false },
  ];

  // Sample initial messages
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        sender: 1,
        text: 'Hey everyone! Welcome to the Tech Innovators group chat!',
        timestamp: '2023-06-10T09:30:00Z',
      },
      {
        id: 2,
        sender: 2,
        text: 'Thanks for creating this Alice. Looking forward to collaborating with everyone!',
        timestamp: '2023-06-10T09:35:00Z',
      },
      {
        id: 3,
        sender: 4,
        text: 'When is our next meeting? I want to discuss the upcoming hackathon.',
        timestamp: '2023-06-10T10:15:00Z',
      },
    ];
    setMessages(initialMessages);
    setActiveMembers(clubMembers.filter(member => member.isOnline));
  }, [clubId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: messages.length + 1,
      sender: 3, // In a real app, this would be the current user's ID
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const date = formatDate(message.timestamp);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  return (
    <div className="messaging-container">
      {/* Header */}
      <div className="messaging-header">
        <div className="header-left">
          <h3>Tech Innovators Group Chat</h3>
          <span className="active-members">
            {activeMembers.length} online
          </span>
        </div>
        <div className="header-right">
          <button className="icon-btn">
            <FaSearch />
          </button>
          <button className="icon-btn">
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>

      {/* Members sidebar - visible on larger screens */}
      <div className="members-sidebar">
        <h4>Club Members</h4>
        <div className="member-list">
          {clubMembers.map(member => (
            <div key={member.id} className="member-item">
              <div className="member-avatar">
                <FaUserCircle />
                {member.isOnline && <span className="online-badge"></span>}
              </div>
              <div className="member-info">
                <span className="member-name">{member.name}</span>
                <span className="member-status">
                  {member.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="messages-area">
        <div className="messages-list">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="date-group">
              <div className="date-divider">
                <span>{date}</span>
              </div>
              {dateMessages.map(message => {
                const sender = clubMembers.find(m => m.id === message.sender);
                const isCurrentUser = message.sender === 3; // In real app, compare to logged in user
                
                return (
                  <div 
                    key={message.id} 
                    className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                  >
                    {!isCurrentUser && (
                      <div className="message-avatar">
                        <FaUserCircle />
                      </div>
                    )}
                    <div className="message-content">
                      {!isCurrentUser && (
                        <span className="sender-name">
                          {sender ? sender.name : 'Unknown'}
                        </span>
                      )}
                      <div className="message-bubble">
                        <p>{message.text}</p>
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="message-input-area">
          <button 
            type="button" 
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile />
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <button type="button" className="attachment-btn">
            <FaPaperclip />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="send-btn">
            <IoMdSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClubMessaging;