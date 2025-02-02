'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainChat from '@/components/MainChat';
import SignInUp from '@/components/SignInUp';
import { Toaster,toast } from 'react-hot-toast';

const page = () => {
  const [isUser, setIsUser] = useState(false);
  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_URL);
    const fetchUser = async () => {
      const token = localStorage.getItem('Token');
      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/user`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if(response.data.user){
            setIsUser(true);
            toast.success('Welcome back! You are logged in.');
          }
        } 
        catch (error) {
          toast.error('Failed to fetch user data. Please try again later!');
        }
      }
      else{
        toast.error('No token found. Please log in to continue.');
      }
    };  
    fetchUser();
  }, []);

  return (
    <>
      {isUser?<MainChat/>:<SignInUp/>}
      <Toaster position="bottom-right" />
    </>
  )
}

export default page
