import Image from 'next/image';

type Props = {
  title: string;
  image: string;
  category: string;
  author: string;
  date: string;
  avatar: string;
};

export default function ProfileRecipeCard({
  title,
  image,
  category,
  author,
  date,
  avatar,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-md">
      <Image
        src={image}
        alt={title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>

        <span className="text-xs border px-2 py-1 rounded-full">
          {category}
        </span>

        <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Image
              src={avatar}
              alt="author"
              width={20}
              height={20}
              className="rounded-full"
            />
            <span>{author}</span>
          </div>

          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
