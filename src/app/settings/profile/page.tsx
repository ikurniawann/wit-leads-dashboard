'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { User, Mail, Phone, Building, Save, Upload, Camera } from 'lucide-react';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState('/wit-logo.png');

  const [profile, setProfile] = useState({
    fullName: 'Ilham Kurniawan',
    email: 'ikurniawann@gmail.com',
    phone: '+62 812-3456-7890',
    position: 'Managing Director',
    department: 'Executive',
    bio: 'Managing Director at PT Wahana Informasi dan Teknologi',
  });

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to Supabase
    setTimeout(() => {
      setSaving(false);
      alert('Profile saved successfully!');
    }, 1000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header - Mobile Responsive */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-wit-muted mb-2">
              <span>Settings</span>
              <span>/</span>
              <span className="text-wit-text">Profile</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Profile Settings</h1>
            <p className="text-sm md:text-base text-wit-muted">Manage your personal information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="glass border border-wit-border rounded-xl p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-wit-red">
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-wit-red rounded-full cursor-pointer hover:bg-wit-red/80 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <h2 className="text-xl font-bold text-wit-text mb-1">{profile.fullName}</h2>
                  <p className="text-wit-muted mb-4">{profile.position}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2 text-wit-muted">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-wit-muted">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="glass border border-wit-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-wit-text mb-6">Personal Information</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-wit-muted mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wit-muted" />
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          className="input-dark w-full pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-wit-muted mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wit-muted" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="input-dark w-full pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-wit-muted mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wit-muted" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="input-dark w-full pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-wit-muted mb-2">
                        Position
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wit-muted" />
                        <input
                          type="text"
                          value={profile.position}
                          onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                          className="input-dark w-full pl-10"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-wit-muted mb-2">
                        Department
                      </label>
                      <select
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="input-dark w-full"
                      >
                        <option value="Executive">Executive</option>
                        <option value="Technology">Technology</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-wit-muted mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="input-dark w-full"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end space-x-3 pt-6 border-t border-wit-border">
                    <button
                      type="button"
                      onClick={() => router.push('/settings')}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center space-x-2"
                      disabled={saving}
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
