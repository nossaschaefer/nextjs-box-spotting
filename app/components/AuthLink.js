import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthLink() {
  const { data: session } = useSession();

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (session) {
    return (
      <button onClick={handleLogOut} className="text-white">
        Log out
      </button>
    );
  } else {
    return <Link href="/login">Log in</Link>;
  }
}
