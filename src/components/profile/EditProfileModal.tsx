'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string | null;
  email: string;
  image?: string | null;
}

interface Props {
  user: User;
  onClose: () => void;
  onUpdated: (updated: User) => void;
}

export default function EditProfileModal({ user, onClose, onUpdated }: Props) {
  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState<string | null>(user.image ?? null);
  const [saving, setSaving] = useState(false);

  // ปิด modal เมื่อกด ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword && password !== confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    if (currentPassword && !password) {
      alert('กรุณาใส่รหัสผ่านใหม่');
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, string> = { name, email };
      if (currentPassword) body.currentPassword = currentPassword;
      if (password) body.password = password;
      if (image) body.image = image;

      const r = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await r.json();
      if (!r.ok) {
        alert(data.message ?? 'เกิดข้อผิดพลาด');
        return;
      }

      onUpdated(data.user);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative mb-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 text-red-500 text-3xl font-bold leading-none hover:opacity-70 cursor-pointer"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-[#6B8E23] text-center">
            Edit Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* รูปโปรไฟล์ */}
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image || '/userprofile.png'}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <label className="cursor-pointer border-2 border-[#6B8E23] text-[#6B8E23] rounded-full px-6 py-1.5 text-sm font-semibold hover:bg-[#6B8E23] hover:text-white transition">
              เปลี่ยนรูป
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* ชื่อ */}
          <div>
            <label className="block text-[#6B8E23] font-bold mb-1 text-sm">
              ชื่อ
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6B8E23]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#6B8E23] font-bold mb-1 text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6B8E23]"
            />
          </div>

          {/* รหัสผ่านเก่า */}
          <div>
            <label className="block text-[#6B8E23] font-bold mb-1 text-sm">
              รหัสผ่านเก่า
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="ใส่รหัสผ่านปัจจุบัน"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6B8E23]"
            />
          </div>

          {/* รหัสผ่านใหม่ */}
          {currentPassword && (
            <div>
              <label className="block text-[#6B8E23] font-bold mb-1 text-sm">
                รหัสผ่านใหม่
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่านใหม่"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6B8E23]"
              />
            </div>
          )}

          {/* ยืนยันรหัสผ่านใหม่ */}
          {currentPassword && password && (
            <div>
              <label className="block text-[#6B8E23] font-bold mb-1 text-sm">
                ยืนยันรหัสผ่านใหม่
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่านใหม่"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6B8E23]"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-500 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#6B8E23] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
