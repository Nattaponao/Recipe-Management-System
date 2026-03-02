'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  id: string;
  title: string;
  image: string;
  category: string;
  author: string;
  date: string;
  avatar: string;
  showMenu?: boolean;
  onEdit?: () => void;
};

export default function ProfileRecipeCard({
  id,
  title,
  image,
  category,
  author,
  date,
  avatar,
  showMenu = false,
  onEdit,
}: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ปิด menu เมื่อคลิกข้างนอก
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('ลบสูตรนี้จริงไหม? (ย้อนกลับไม่ได้)')) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      if (r.ok) {
        window.location.reload();
      } else {
        alert('ลบไม่สำเร็จ');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-50">
      {/* รูปภาพ */}
      <div className="relative h-48 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || '/GreenCurry.png'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#637402]">
          {category || 'ทั่วไป'}
        </div>
      </div>

      {/* รายละเอียด */}
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold text-[#637402] line-clamp-1">
          {title || 'ชื่อสูตรอาหาร'}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar || '/profilemen.jpg'}
                alt="author"
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-600 font-medium">{author}</span>
          </div>
          <div className="flex items-center gap-2">
            {!onEdit && <span className="text-xs text-gray-400">{date}</span>}

            {/* ... menu */}
            {showMenu && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((v) => !v);
                  }}
                  className="text-gray-400 hover:text-gray-600 px-1 cursor-pointer"
                >
                  •••
                </button>
                {menuOpen && (
                  <div className="absolute right-0 bottom-8 bg-white border border-gray-100 rounded-2xl shadow-lg z-10 w-36 overflow-hidden">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/recipes/${id}/edit`);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#637402] hover:bg-[#F9F7EB] font-medium cursor-pointer"
                    >
                      ✏️ แก้ไข
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-medium disabled:opacity-50 cursor-pointer"
                    >
                      🗑️ {deleting ? 'กำลังลบ...' : 'ลบ'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
