import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'admin@toursafe.com' && password === 'admin123') {
      navigate('/dashboard');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-purple-900 rounded-2xl p-8 shadow-xl">

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-purple-600 flex items-center justify-center text-3xl">
            🌐
          </div>

          <h1 className="text-3xl font-bold text-white">
            TourSafe
          </h1>

          <p className="text-purple-300 mt-1">
            Safety & Finance
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@toursafe.com"
              className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 text-white outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 text-white outline-none focus:border-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          TourSafe Management System
        </p>
      </div>
    </div>
  );
}