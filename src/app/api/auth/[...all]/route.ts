import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/features/auth/lib/main";

export const { POST, GET } = toNextJsHandler(auth);
