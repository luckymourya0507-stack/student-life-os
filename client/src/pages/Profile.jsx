import React, { useState } from 'react';
import { User, Mail, BookOpen, Calendar, Lock, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUserProfile, changeUserPassword, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    course: user?.course || '',
    year: user?.year || '',
    profileImage: user?.profileImage || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });
  const [passMsg, setPassMsg] = useState({ text: '', isError: false });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', isError: false });
    try {
      setLoadingProfile(true);
      await updateUserProfile(profileData);
      setProfileMsg({ text: 'Profile updated successfully!', isError: false });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Failed to update profile', isError: true });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg({ text: '', isError: false });
    try {
      setLoadingPass(true);
      await changeUserPassword(passwordData);
      setPassMsg({ text: 'Password changed successfully!', isError: false });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPassMsg({ text: err.response?.data?.message || 'Failed to change password', isError: true });
    } finally {
      setLoadingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Profile Summary Card */}
      <div className="card-soft p-6 sm:p-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-950 border-4 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-extrabold text-3xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
          )}
        </div>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{user?.name}</h2>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              🎓 {user?.course || 'Computer Science'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              📅 {user?.year || '3rd Year'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-all flex items-center space-x-2 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Edit Profile Form */}
        <div className="card-soft p-6 space-y-5">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
            Edit Profile Details
          </h3>

          {profileMsg.text && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${profileMsg.isError ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {profileMsg.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Course / Major
              </label>
              <input
                type="text"
                value={profileData.course}
                onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={profileData.year}
                onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Profile Avatar URL
              </label>
              <input
                type="url"
                value={profileData.profileImage}
                onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {loadingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="card-soft p-6 space-y-5">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
            Change Password
          </h3>

          {passMsg.text && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${passMsg.isError ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {passMsg.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPass}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm shadow-md transition-all disabled:opacity-50 mt-6"
            >
              {loadingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
