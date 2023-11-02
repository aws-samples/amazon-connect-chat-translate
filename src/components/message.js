import React from 'react';

// This function creates the HTML to add the chats to the store, controlling the layout
const Message = ({ chat, user }) => (
    <li className={`chat ${user === chat.username ? "right" : "left"}`}>
        {chat.content}
        <li className="translatedMessage">{chat.translatedMessage}</li>
    </li>
);

export default Message;

