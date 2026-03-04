'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Recipe {
  id: string;
  name: string;
  coverImage: string | null;
  category: string | null;
  createdAt: string;
}

interface UserProfile {
  id: number;
  name: string | null;
  image: string | null;
  recipes: Recipe[];
}

function ProfileSkeleton() {
  return (
    <div className="bg-[#F9F7EB] min-h-screen pb-20">
      <main className="container mx-auto px-4 pt-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile card skeleton */}
          <div className="bg-white rounded-[2rem] shadow-xl p-8 flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-[#637402]/10 animate-pulse" />
            <div className="h-8 w-48 rounded-lg bg-[#637402]/10 animate-pulse" />
            <div className="h-4 w-32 rounded-lg bg-gray-100 animate-pulse" />
          </div>
          {/* Recipe grid skeleton — ความสูงตรงกับ grid จริง กัน CLS */}
          <div className="h-8 w-32 rounded-lg bg-[#637402]/10 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-md h-[280px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, [username]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) return <ProfileSkeleton />;

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7EB]">
        <p className="text-gray-400">ไม่พบผู้ใช้นี้</p>
      </div>
    );

  return (
    <div className="bg-[#F9F7EB] min-h-screen pb-20">
      <main className="container mx-auto px-4 pt-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] shadow-xl p-8 flex flex-col items-center">
            <div className="relative w-32 h-32">
              <Image
                src={profile.image || '/userprofile.png'}
                alt={`รูปโปรไฟล์ ${profile.name}`}
                fill
                sizes="128px"
                className="rounded-full object-cover border-4 border-white shadow-lg"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-[#637402] mt-4">
              {profile.name}
            </h1>
            <p className="text-gray-500">
              @{profile.name?.toLowerCase().replace(/\s/g, '')}
            </p>
            <p className="text-[#FE9F4D] font-medium mt-2">
              {profile.recipes.length} สูตรอาหาร
            </p>
          </div>

          {/* Recipes */}
          <h2 className="text-2xl font-bold text-[#637402] px-2">สูตรอาหาร</h2>
          {profile.recipes.length === 0 ? (
            <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-[#637402]/10">
              <p className="text-gray-400">ยังไม่มีสูตรอาหาร</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.recipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer hover:translate-y-[-5px] duration-300"
                  onClick={() => router.push(`/recipes/${recipe.id}`)}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={recipe.coverImage || '/userprofile.png'}
                      alt={recipe.name ?? 'สูตรอาหาร'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority={index < 2}
                      loading={index < 2 ? undefined : 'lazy'}
                    />
                  </div>
                  <div className="p-5">
                    <div className="inline-block bg-white/90 border border-[#637402]/20 px-3 py-1 rounded-full text-xs font-bold text-[#637402] mb-2">
                      {recipe.category || 'ทั่วไป'}
                    </div>
                    <h3 className="text-xl font-bold text-[#637402] line-clamp-1">
                      {recipe.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(recipe.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
