import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { create } from "domain";

export const usersRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const createdUser = await ctx.prisma.user.create({
        data: {
          id: input.user_id,
        },
      });
      return createdUser;
    }),
});
