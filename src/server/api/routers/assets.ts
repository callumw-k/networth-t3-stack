import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const assetsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ asset_id: z.number() }))
    .query(async ({ input, ctx }) => {
      const assets = await ctx.prisma.asset.findMany({
        where: { userId: input.asset_id },
        include: { values: { orderBy: { createdAt: "desc" }, take: 5 } },
      });
      return assets;
    }),
});
