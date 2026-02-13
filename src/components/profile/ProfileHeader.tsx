import Image from 'next/image';

type Props = {
  name: string;
  username: string;
  avatar: string;
};

export default function ProfileHeader({ name, username, avatar }: Props) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={avatar}
        alt="avatar"
        width={80}
        height={80}
        className="rounded-full object-cover"
      />

      <div>
        <h2 className="text-3xl font-bold text-lime-800">{name}</h2>
        <p className="text-gray-500">{username}</p>
      </div>
    </div>
  );
}
