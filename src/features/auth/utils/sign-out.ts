import { authClient } from "../lib/client";

export const signOut = async () => {
  await authClient.signOut();
};
