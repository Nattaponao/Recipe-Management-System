'use client';

import axios from 'axios';

export default function LogoutButton() {
  const logout = async () => {
    await axios.post('/api/auth/logout');
    window.location.href = '/login';
  };

  return (
    <button
      onClick={logout}
      className="inline-block bg-red-800 text-[#E4D7AA] font-extralight text-[16px] py-2 px-5 mt-5 mb-3 rounded-3xl cursor-pointer"
    >
      Logout
    </button>
  );
}
