export default function ProfileActions() {
  return (
    <div className="flex gap-4 mt-6">
      <button className="flex-1 border border-lime-700 text-lime-800 py-2 rounded-xl hover:bg-lime-50 transition">
        Edit Profile
      </button>

      <button className="flex-1 border border-lime-700 text-lime-800 py-2 rounded-xl hover:bg-lime-50 transition">
        Share Profile
      </button>
    </div>
  );
}
