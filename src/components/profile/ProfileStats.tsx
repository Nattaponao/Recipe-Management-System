type Props = {
  followers: number;
  following: number;
  likes: number;
};

export default function ProfileStats({ followers, following, likes }: Props) {
  const Item = ({ label, value }: { label: string; value: number }) => (
    <div className="flex-1 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );

  return (
    <div className="flex bg-lime-700 text-white rounded-2xl py-6 mt-6">
      <Item label="Following" value={following} />
      <Item label="Followers" value={followers} />
      <Item label="Likes & Saves" value={likes} />
    </div>
  );
}
