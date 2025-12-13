// import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div 
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/assets/hero-illustration.png')" }}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>
      </div>
      <h1 className="text-center text-6xl text-cyan-400 font-bold">Campus Market</h1>
      <h2 className="text-center text-3xl font-bold">Coming soon</h2>
    </div>
  );
}
