import { UserCircle, Mail, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any saved login/session data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Go to login and replace current history
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          My Profile
        </h1>

        <p className="text-sm text-zinc-400 mt-1">
          Manage your TourSafe administrator profile
        </p>
      </div>

      {/* Profile Card */}
      <div className="max-w-3xl bg-zinc-900/70 border border-purple-900/40 rounded-2xl overflow-hidden">

        {/* Profile Header */}
        <div className="p-6 bg-gradient-to-r from-purple-900/40 to-zinc-900">
          <div className="flex items-center gap-5">

            {/* Profile Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <UserCircle
                size={46}
                className="text-white"
              />
            </div>

            {/* User Name */}
            <div>
              <h2 className="text-xl font-bold text-white">
                Administrator
              </h2>

              <p className="text-sm text-purple-300">
                TourSafe Administrator
              </p>
            </div>

          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-4">

          {/* Email */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-zinc-800">

            <Mail
              className="text-purple-400"
              size={20}
            />

            <div>
              <p className="text-xs text-zinc-500">
                Email Address
              </p>

              <p className="text-sm text-white">
                admin@toursafe.com
              </p>
            </div>

          </div>

          {/* Role */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-zinc-800">

            <ShieldCheck
              className="text-purple-400"
              size={20}
            />

            <div>
              <p className="text-xs text-zinc-500">
                Account Role
              </p>

              <p className="text-sm text-white">
                Administrator
              </p>
            </div>

          </div>

        </div>

        {/* Logout Section */}
        <div className="px-6 pb-6">

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 rounded-xl
            bg-red-600 hover:bg-red-700
            active:scale-95
            text-white text-sm font-semibold
            transition-all
            shadow-lg shadow-red-900/20"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}