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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Sign In</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
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
      <div className="mt-4">
        <button
          onClick={() => signIn('google')}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
