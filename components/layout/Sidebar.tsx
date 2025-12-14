import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="p-4 space-y-4">
      <Link href="/dashboard">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/wishlist">Wishlist</Link>
      <Link href="/cart">Cart</Link>
      <Link href="/profile">Profile</Link>
    </nav>
  );
}
