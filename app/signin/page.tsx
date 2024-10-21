// pages/signin.tsx
"use client"
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Head from 'next/head';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  
  // State for Admin login flow
  const [isAdmin, setIsAdmin] = useState(false); // Toggle between user and admin
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [secretKey, setSecretKey] = useState(''); // Admin secret key

  // Handle regular user sign-in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      name,
      age,
      gender,
      redirect: false, // Prevent redirection
    });

    if (res?.error) {
      alert('Invalid credentials');
    } else {
      // Redirect to homepage or wherever you want after successful login
      window.location.href = '/api/hello';
    }
  };

  // Handle admin sign-in
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('admin-credentials', {
      secretKey,
      adminName,
      adminPassword,
      redirect: false,
    });

    if (res?.error) {
      alert('Invalid admin credentials');
    } else {
      // Redirect to admin dashboard or any other page
      window.location.href = '/admin/dashboard';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>{isAdmin ? 'Admin Sign In' : 'Sign In'}</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">{isAdmin ? 'Admin Sign In' : 'Sign In'}</h1>
      
      {/* Toggle for Admin */}
      <div className="mb-4">
        <button 
          onClick={() => setIsAdmin(!isAdmin)} 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          {isAdmin ? 'Sign in as User' : 'Join as Admin'}
        </button>
      </div>

      {/* Regular User Sign In Form */}
      {!isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input
              type="text"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">Nickname</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              id="age"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium mb-2">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Sign In
          </button>
        </form>
      )}

      {/* Admin Sign In Form */}
      {isAdmin && (
        <form onSubmit={handleAdminSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="secretKey" className="block text-sm font-medium mb-2">Secret Key</label>
            <input
              type="password"
              id="secretKey"
              placeholder="Enter secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="adminName" className="block text-sm font-medium mb-2">Admin Name</label>
            <input
              type="text"
              id="adminName"
              placeholder="Enter your admin name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="adminPassword" className="block text-sm font-medium mb-2">Admin Password</label>
            <input
              type="password"
              id="adminPassword"
              placeholder="Enter your admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Admin Sign In
          </button>
        </form>
      )}

      {/* Google Sign-In Button */}
      {!isAdmin && (
        <div className="mt-4">
          <button
            onClick={() => signIn('google')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default SignInPage;