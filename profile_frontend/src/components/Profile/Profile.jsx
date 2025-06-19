import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import CreateProfileForm from './CreateProfileForm';
import EditProfileForm from './EditProfileForm';
import { FaEllipsisV } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/profile`, {
        headers: { authorization: `Bearer ${token}` },
        timeout: 5000 // Add timeout
      });
      
      // Handle both array and object responses
      const profileData = Array.isArray(res.data?.profile) 
        ? res.data.profile[0]
        : res.data?.profile;
        
      setProfile(profileData || null);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <BeatLoader size={15} color="#36d7b7" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h3>{profile?.fullname || 'Profile'}</h3>
        <div className="menu">
          <FaEllipsisV onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && (
            <div className="dropdown">
              <button onClick={() => {
                setMenuOpen(false);
                setShowForm(true);
              }}>
                {profile ? 'Edit Profile' : 'Create Profile'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-body">
        {profile?.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt="Profile"
            className="profile-image"
            loading="lazy" // Lazy loading
          />
        ) : (
          <div className="profile-image-placeholder" />
        )}
        <h2>{profile?.fullname || 'Full Name'}</h2>
        <p>{profile?.bio || 'Bio goes here...'}</p>
      </div>

      {showForm && (
        profile ? (
          <EditProfileForm
            profile={profile}
            onClose={() => {
              setShowForm(false);
              fetchProfile();
            }}
          />
        ) : (
          <CreateProfileForm
            onClose={() => {
              setShowForm(false);
              fetchProfile();
            }}
          />
        )
      )}
    </div>
  );
};

export default Profile;