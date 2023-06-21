import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const valuesRouter = createTRPCRouter({
  getAllValuesForAsset: protectedProcedure
    .input(z.object({ assetId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.value.findMany({
        where: { assetId: input.assetId },
      });
    }),
});
