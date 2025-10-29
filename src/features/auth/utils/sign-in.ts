import { authClient } from "../lib/client";

export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
  });
};
