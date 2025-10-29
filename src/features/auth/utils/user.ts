import { authClient } from "@/features/auth/lib/client";

export function User() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  return {
    session,
    isPending,
    error,
    refetch,
  };
}
