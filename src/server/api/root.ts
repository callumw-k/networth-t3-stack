import { createTRPCRouter } from "@/server/api/trpc";
import { assetsRouter } from "./routers/assets";
import { usersRouter } from "./routers/users";
import { valuesRouter } from "./routers/values";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  assets: assetsRouter,
  users: usersRouter,
  values: valuesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
