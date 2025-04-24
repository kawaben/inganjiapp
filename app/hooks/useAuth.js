import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth(redirectTo = "/login") {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push(redirectTo);
    } else {
      setAuthenticated(true);
    }

    setLoading(false);
  }, [redirectTo, router]);

  return { authenticated, loading };
}
