import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const App = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const userName = prompt('Please enter your name:');
    setName(userName);

    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const data = { name, message };
      socket.emit('sendMessage', data); // Send the message to the backend
      setMessage(''); // Clear the input field
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1>FlyTalker</h1>
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.name === name ? 'own-message' : 'other-message'
              }`}
            >
              <strong>{msg.name === name ? 'You' : msg.name}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="input-box">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
