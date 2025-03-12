import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthLink() {
  const { data: session } = useSession();

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (session) {
    return (
      <button onClick={handleLogOut} className="text-white pr-4">
        Log out
      </button>
    );
  } else {
    return (
      <Link className="text-white pr-4" href="/login">
        Log in
      </Link>
    );
  }
}
