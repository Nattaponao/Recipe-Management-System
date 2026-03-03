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
      {/* Activity */}
      <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6 w-full min-w-0">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[#637402] text-2xl font-semibold">Activity (14 วัน)</h2>
            <p className="text-[#637402]/70 text-sm mt-1">
              จำนวนสูตรที่ถูกเพิ่มในแต่ละวัน{hasUsers ? " และผู้ใช้ใหม่" : ""}
            </p>
          </div>
          <div className="text-[#637402]/60 text-sm">หน่วย: รายการ</div>
        </div>

        <div className="mt-4 w-full min-w-0">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={safeDaily} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DFD3A4" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#637402", fontSize: 12 }}
                interval={1}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "#637402" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: "#637402" }}
                formatter={(value: any) =>
                  value === "recipes" ? "Recipes" : value === "users" ? "Users" : value
                }
              />
              <Bar dataKey="recipes" fill="#637402" radius={[10, 10, 0, 0]} />
              {hasUsers && <Bar dataKey="users" fill="#DFD3A4" radius={[10, 10, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {safeDaily.length === 0 && (
          <div className="mt-4 text-[#637402]/70 text-sm">ยังไม่มีข้อมูลสำหรับกราฟ</div>
        )}
      </div>

      {/* Category */}
      <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6 w-full min-w-0">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[#637402] text-2xl font-semibold">Recipes by Category</h2>
            <p className="text-[#637402]/70 text-sm mt-1">หมวดที่มีสูตรเยอะสุด</p>
          </div>
        </div>

        <div className="mt-4 w-full min-w-0">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={safeByCategory} barCategoryGap={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DFD3A4" />
              <XAxis dataKey="name" tick={{ fill: "#637402", fontSize: 12 }} interval={0} />
              <YAxis tick={{ fill: "#637402" }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#637402" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {safeByCategory.length === 0 && (
          <div className="mt-4 text-[#637402]/70 text-sm">ยังไม่มีข้อมูลสำหรับกราฟ</div>
        )}
      </div>
    </div>
  );
}
