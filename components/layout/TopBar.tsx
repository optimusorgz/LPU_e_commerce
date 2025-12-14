export default function TopBar({ user }: { user: any }) {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Search */}
      <input
        placeholder="Search products..."
        className="border px-4 py-2 rounded-md w-96"
      />

      {/* User */}
      <div className="text-sm font-medium">
        {user.email}
      </div>
    </div>
  );
}
