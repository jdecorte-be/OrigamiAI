import React, { useState } from 'react';
import './chat.css'; // Assuming you have a Chat.css file for styling

function Chat() {
  const [messages, setMessages] = useState([
    'Hello! Welcome to Origami AI. Start the first step and make an thump up when you are ready!',
  ]); // Holds the list of messages
  const [inputValue, setInputValue] = useState(''); // Holds the current value of the input field

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      const updatedMessages = [...messages, inputValue].slice(-5); // Garde uniquement les 5 derniers messages
      setMessages(updatedMessages);
      setInputValue('');
    }
  };
  
  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="message-sender">{"GPT > "}</span>
            <span className="message-text">{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
} export default Chat;