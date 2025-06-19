import React, { useState } from 'react';
import axios from 'axios';
import "./Profile.css"
import { compressImage, isImageValid } from '../../imageUtils';
import { BeatLoader } from 'react-spinners';

const EditProfileForm = ({ profile, onClose }) => {
  const [formData, setFormData] = useState({
    fullname: profile?.fullname || '',
    bio: profile?.bio || '',
    profileImage: null
  });
  const [preview, setPreview] = useState(profile?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isImageValid(file)) {
      setError('Only JPG/PNG images allowed (max 1MB)');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const compressedFile = await compressImage(file);

      const previewUrl = URL.createObjectURL(compressedFile);
      setPreview(previewUrl);

      setFormData(prev => ({
        ...prev,
        profileImage: compressedFile
      }));
    } catch (err) {
      setError('Image processing failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.bio) {
      setError('Fullname and bio are required!');
      return;
    }

    const payload = new FormData();
    payload.append('fullname', formData.fullname);
    payload.append('bio', formData.bio);
    if (formData.profileImage) {
      payload.append('profileImage', formData.profileImage);
    }

    setLoading(true);
    try {
      await axios.post(`${backendUrl}/profile/save`, payload, {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {preview && (
        <img 
          src={preview} 
          alt="Preview" 
          className="preview-image"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      )}

      <input
        name="fullname"
        placeholder="Full Name"
        value={formData.fullname}
        onChange={handleChange}
        required
      />

      <textarea
        name="bio"
        placeholder="Your bio"
        value={formData.bio}
        onChange={handleChange}
        required
      />

      <input 
        type="file"
        name="profileImage"
        accept="image/*"
        onChange={handleImageChange}
        disabled={loading}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? <BeatLoader size={8} color="#fff" /> : 'Update Profile'}
        </button>
        <button type="button" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
