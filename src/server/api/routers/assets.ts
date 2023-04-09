import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const assetsRouter = createTRPCRouter({
  getAllAssetsForUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No user_id on auth object",
      });
    }
    const assets = await ctx.prisma.asset.findMany({
      where: { userId: ctx.auth.userId },
      include: { values: { orderBy: { createdAt: "desc" }, take: 5 } },
    });
    return assets;
  }),
});
