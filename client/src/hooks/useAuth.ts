import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { Capacitor } from "@capacitor/core";

export function useAuth() {
  const isNativeApp = Capacitor.isNativePlatform();
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (isNativeApp) {
        return null;
      }
      const fn = getQueryFn<User | null>({ on401: "returnNull" });
      return fn({ queryKey: ["/api/auth/user"], signal: new AbortController().signal, meta: undefined });
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !isNativeApp,
  });

  if (isNativeApp) {
    return {
      user: undefined,
      isLoading: false,
      isAuthenticated: false,
    };
  }

  return {
    user: user ?? undefined,
    isLoading,
    isAuthenticated: !!user,
  };
}
