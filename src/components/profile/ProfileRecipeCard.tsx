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
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-50">
      {/* ส่วนรูปภาพอาหาร */}
      <div className="relative h-48 w-full">
        <Image
          src={image || '/GreenCurry.png'} //
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#637402]">
          {category || 'ทั่วไป'}
        </div>
      </div>

      {/* ส่วนรายละเอียดข้อมูล */}
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold text-[#637402] line-clamp-1">
          {title || 'ชื่อสูตรอาหาร'}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src={avatar || '/profilemen.jpg'}
                alt="author"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-600 font-medium">{author}</span>
          </div>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
      </div>
    </div>
  );
}
