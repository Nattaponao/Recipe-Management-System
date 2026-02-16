type Props = {
  followers: number;
  following: number;
  likes: number;
};

export default function ProfileStats({ followers, following, likes }: Props) {
  const statClass = 'flex flex-col items-center px-6';
  const labelClass =
    'text-gray-400 text-sm font-medium uppercase tracking-wider';
  const valueClass = 'text-2xl font-bold text-[#637402]'; //

  return (
    <div className="flex justify-center items-center divide-x divide-gray-100 w-full">
      <div className={statClass}>
        <span className={valueClass}>{followers}</span>
        <span className={labelClass}>Followers</span>
      </div>
      <div className={statClass}>
        <span className={valueClass}>{following}</span>
        <span className={labelClass}>Following</span>
      </div>
      <div className={statClass}>
        <span className={valueClass}>{likes}</span>
        <span className={labelClass}>Likes</span>
      </div>
    </div>
  );
}
