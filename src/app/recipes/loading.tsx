export default function Loading() {
  return (
    <div className="bg-[#F9F7EB] min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-0">
        
        {/* 1. โครงของหัวข้อ (Title) */}
        <div className="h-[80px] md:h-[105px] w-64 bg-gray-300 rounded-lg animate-pulse mb-8"></div>

        {/* 2. โครงของช่องค้นหา (Search Bar) */}
        <div className="h-12 w-full bg-gray-200 rounded-3xl animate-pulse mb-10"></div>

        {/* 3. โครงของการ์ดสูตรอาหาร (สร้างหลอกๆ ไว้ 8 ใบ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 pb-10">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="rounded-2xl bg-[#FEFEF6] overflow-hidden flex flex-col h-[320px] shadow-sm border border-gray-100"
            >
              {/* ส่วนรูปภาพ */}
              <div className="h-48 bg-gray-300 animate-pulse"></div>
              
              {/* ส่วนเนื้อหา */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* ชื่อเมนู */}
                <div className="h-5 bg-gray-300 rounded animate-pulse w-3/4"></div>
                {/* รายละเอียด */}
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                
                {/* หมวดหมู่ (Tag ด้านล่าง) */}
                <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse mt-auto"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}