import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatar: string;
}

export default function ProfileHeader({
  name,
  username,
  avatar,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        <Image
          src={avatar || '/profilemen.jpg'} //
          alt="Profile Avatar"
          fill
          className="rounded-full border-4 border-white shadow-lg object-cover"
        />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#637402]">{name}</h1> {/* */}
        <p className="text-gray-500 font-medium">{username}</p>
      </div>
    </div>
  );
}
