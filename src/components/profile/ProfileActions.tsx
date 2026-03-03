'use client';

interface Props {
  onEditProfile: () => void;
  username: string;
}

export default function ProfileActions({ onEditProfile, username }: Props) {
  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${username}`;
    if (navigator.share) {
      await navigator.share({ title: `${username}'s Profile`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('คัดลอกลิงก์แล้ว!');
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={onEditProfile}
        className="flex-1 border border-lime-700 text-lime-800 py-2 rounded-xl hover:bg-lime-50 transition cursor-pointer"
      >
        Edit Profile
      </button>
      <button
        onClick={handleShare}
        className="flex-1 border border-lime-700 text-lime-800 py-2 rounded-xl hover:bg-lime-50 transition cursor-pointer"
      >
        Share Profile
      </button>
    </div>
  );
}
