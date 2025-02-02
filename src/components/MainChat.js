'use client'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const MainChat = () => {
  const [chat, setChat] = useState(null);
  const [user2, setUser2] = useState(null);
  const [user, setUser] = useState(null);
  const [id2, setId2] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState(null);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [user2Copied, setuser2Copied] = useState(false);
  const [chatMessages, setChatMessages] = useState(null);


  const handleCopyUsername = async () => {
    if (user && user.username) {
      await navigator.clipboard.writeText(user.username);
      toast.success('Username copied to clipboard');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyUser2Name = async (username) => {
    await navigator.clipboard.writeText(username);
    toast.success('Username copied to clipboard');
    setuser2Copied(true);
    setTimeout(() => setuser2Copied(false), 2000);
  };

  const handleCreateChat = async (e) => {
   
    e.preventDefault();
    const token = localStorage.getItem('Token');
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/getUserId`, { username }, {
        headers: { "Content-Type": 'application/json', "Authorization": `Bearer ${token}` }
      });
      const {userId} = response.data;
      setId2(userId);
      if (userId === user?.id) {
        alert("You cannot create a chat with yourself!");
        return;
      }
      setIsLoading(true);
    


    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/createchat`, { id2: userId }, {
        headers: { "Content-Type": 'application/json', "Authorization": `Bearer ${token}` }
      });
      const { chat, user2 } = response.data;
      console.log({ chat });
      console.log({ user2 });
      setChat(chat);
      setUser2(user2);
      setId2('');
      setUsername('');
      toast.success('Chat created successfully!');
    }
    catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || 'Failed to create chat');
    } finally {
      setId2('');
      setUsername('');
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }
    const token = localStorage.getItem('Token');
    const formData = new FormData();
    formData.append('chatId', chat.id);
    formData.append('content', content);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/messages/new`, formData, {
        headers: { "Content-Type": 'application/json', "Authorization": `Bearer ${token}` }
      });
      setContent('')

    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const getAllMessages = async () => {
    const token = localStorage.getItem('Token');
    const formData = new FormData();
    if (chat) {
      formData.append('chatId', chat.id);
      if (token) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/messages`, formData, {
          headers: { "Content-Type": 'application/json', "Authorization": `Bearer ${token}` }
        });
        setChatMessages(response.data.messages);
      }
    }

  };

  const handleChatClick = async (e, chat) => {
    e.preventDefault();
    setChat(chat);
    if (chat.userTwo.username !== user.username) {

      setUser2(chat.userTwo);
    }
    else {
      setUser2(chat.userOne);

    }
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current.focus();
    }, 200);
  }

  const getLastMessage = async (id) => {
    const token = localStorage.getItem('Token');
    const formData = new FormData();
    formData.append('chatId', id);
    if (token) {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/lastMessage`, formData, {
        headers: { "Content-Type": 'application/json', "Authorization": `Bearer ${token}` }
      });
      return response.data.message;
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('Token');
      if (token) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/user`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        setUser(response.data.user);
      }
    };

    fetchUser();
  }, []);



  // chats fetch
  useEffect(() => {
    const fetchchats = async () => {
      const token = localStorage.getItem('Token');
      if (token) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/chats`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        setChats(response.data.chats);


      }
    };
    fetchchats();

  }, [user2]);

  //  messages fetch

  useEffect(() => {
    getAllMessages();
    const polling = setInterval(() => {
      getAllMessages();
    }, 3000);
    return () => clearInterval(polling);
  }, [chat, handleSendMessage]);



  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);



  return (
    <div className="flex h-screen bg-background-light">
      {/* Sidebar */}
      <div className="w-1/4 bg-secondary p-6 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-primary tracking-wider">ChatterBox</h2>

        {/* User Profile Card */}
        {user && (
          <div className="bg-surface-dark p-4 rounded-2xl shadow-lg border-2 border-primary">
            <p className="text-text-light text-lg font-medium mb-3">
              Welcome, {user.username}!
            </p>
            <div className="flex items-center justify-between w-full bg-secondary p-3 rounded-xl">
              <p className="text-text-light text-sm truncate">{user.username}</p>
              <button
                onClick={handleCopyUsername}
                className="p-2 hover:bg-secondary-hover rounded-lg transition-all"
              >
                {copied ? <ClipboardCheck className="text-primary" /> : <Clipboard className="text-text-light" />}
              </button>
            </div>
            <p className="text-text-light/60 text-sm mt-2">Share username to connect!</p>
          </div>
        )}

        {/* New Chat Form */}
        <form onSubmit={handleCreateChat} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Friend's username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-surface-dark text-text-light px-4 py-3 rounded-2xl placeholder:text-text-light/60 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary outline-none transition-all border border-surface-light/20"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-hover active:scale-95 text-text-light py-3 px-6 rounded-2xl font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '...' : 'Chat'}
            </button>
          </div>
        </form>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {chats?.map((chat, index) => (
            <div
              key={index}
              onClick={(e) => handleChatClick(e, chat)}
              className="bg-surface-dark hover:bg-secondary-hover p-4 rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-primary/20"
            >
              <span className="text-text-light text-lg font-medium">
                {chat.userTwo.username === user?.username ? chat.userOne.username : chat.userTwo.username}
              </span>
              {/* <div>{(async()=>{return await getLastMessage(chat.id)})()}</div> */}
            </div>
          ))}
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-primary px-6 py-4 flex justify-between items-center">
          <span className="text-text-light text-lg font-medium">
            {chat ? ((user2.username)) : 'Select a chat'}
          </span>
          {user2 && (
            <button
              onClick={() => handleCopyUser2Name(user2.username)}
              className="flex items-center gap-2 text-text-light hover:bg-primary-hover px-4 py-2 rounded-lg transition-all"
            >
              <span>Copy username</span>
              {user2Copied ? <ClipboardCheck className="text-primary" /> : <Clipboard className="text-text-light" />}
            </button>
          )}
        </div>
        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {chatMessages?.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${msg.senderId === user?.id
                  ? 'bg-primary text-text-light rounded-tr-none'
                  : 'bg-surface-light text-text-dark rounded-tl-none'
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-surface-light border-t border-background-dark/10">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-background-light px-6 py-3 rounded-full focus:ring-2 focus:ring-primary outline-none transition-all text-text-dark"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-text-light px-6 py-3 rounded-full font-medium transition-all"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; export default MainChat;
