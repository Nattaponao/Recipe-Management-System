"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type DailyPoint = { day: string; recipes: number; users?: number };
type CategoryPoint = { name: string; count: number };

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const recipes = payload.find((p: any) => p.dataKey === "recipes")?.value ?? 0;
  const users = payload.find((p: any) => p.dataKey === "users")?.value ?? 0;
  const hasUsers = payload.some((p: any) => p.dataKey === "users");

  return (
    <div className="rounded-2xl border border-[#637402]/20 bg-white px-4 py-3 shadow-sm">
      <div className="text-[#637402] font-semibold">{label}</div>
      <div className="mt-1 text-sm text-[#637402]/80">
        Recipes: <span className="font-semibold">{recipes}</span>
      </div>
      {hasUsers && (
        <div className="text-sm text-[#637402]/80">
          Users: <span className="font-semibold">{users}</span>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardClientCharts({
  daily,
  byCategory,
}: {
  daily: DailyPoint[];
  byCategory: CategoryPoint[];
}) {
  const hasUsers = daily?.some((d) => (d.users ?? 0) > 0) ?? false;
  const safeDaily = Array.isArray(daily) ? daily : [];
  const safeByCategory = Array.isArray(byCategory) ? byCategory : [];

  return (
    <div className="w-full min-w-0 flex flex-col gap-6">
      {/* 1. Activity Chart */}
      <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6 w-full">
        <div className="flex items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="text-[#637402] text-2xl font-semibold">Activity (14 วัน)</h2>
            <p className="text-[#637402]/70 text-sm mt-1">จำนวนสูตรที่ถูกเพิ่มในแต่ละวัน</p>
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeDaily} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DFD3A4" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#637402", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: "#637402", fontSize: 11 }} 
                axisLine={false} 
                tickLine={false}
                allowDecimals={false} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#637402', opacity: 0.05 }} />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar 
                dataKey="recipes" 
                fill="#637402" 
                radius={[6, 6, 0, 0]} 
                isAnimationActive={false} // 🌟 ปิด animation เพื่อความลื่น
              />
              {hasUsers && (
                <Bar 
                  dataKey="users" 
                  fill="#DFD3A4" 
                  radius={[6, 6, 0, 0]} 
                  isAnimationActive={false} 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Category Chart */}
      <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6 w-full">
        <h2 className="text-[#637402] text-2xl font-semibold mb-6">Recipes by Category</h2>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DFD3A4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#637402", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#637402", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#637402', opacity: 0.05 }} />
              <Bar dataKey="count" fill="#637402" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}