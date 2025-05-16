'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import  useAuth  from './useAuth'; 

export const useAdminAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      setAuthenticated(true); // Redirect non-admins
    }
  }, [user, loading, router]);

  return { user, loading };
};
