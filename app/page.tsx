'use client'; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      // Check for a user in your custom user table (e.g., via localStorage/session)
      const email = typeof window !== "undefined" ? localStorage.getItem("user_email") : null;
      if (email) {
        router.push("/blog");
      } else {
        router.push("/auth/login");
      }
      setLoading(false);
    };
    checkLogin();
  }, [router]);

  return loading ? null : null;
}
