"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
const RecipeMaker = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {

        const token=Cookies.get("token") || "";

        const response = await fetch('http://127.0.0.1:5000/api/user/user-info',
        {   
            method:'GET',
            headers:{
                Authorization:`Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }
        ); // Assuming the API route is defined in /pages/api/getUserInfo.js

        

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Recipe Maker</h1>
      {userInfo ? (
        <div className="bg-gray-200 p-4 rounded-md">
          <p className="text-lg">Hello, {userInfo.username}!</p>
          <p className="text-sm">Email: {userInfo.email}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
      <Image src="/recipe-image.jpg" alt="Recipe" width={300} height={200} className="mt-8" />
    </div>
  );
};

export default RecipeMaker;
