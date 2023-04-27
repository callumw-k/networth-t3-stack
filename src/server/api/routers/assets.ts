import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
  updateAsset: protectedProcedure
    .input(
      z.object({
        assetId: z.number(),
        newValue: z.number(),
        newName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const [newAssetValue, updatedAssetName] = await ctx.prisma.$transaction(
          [
            ctx.prisma.value.create({
              data: {
                value: input.newValue,
                user: { connect: { id: ctx.auth.userId } },
                asset: { connect: { id: input.assetId } },
              },
            }),
            ctx.prisma.asset.update({
              where: { id: input.assetId },
              data: { name: input.newName },
            }),
          ]
        );
        return { asset: updatedAssetName, newValue: newAssetValue };
      } catch (error) {
        if (error instanceof Error)
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
      }
    }),
  createAsset: protectedProcedure
    .input(
      z.object({
        assetName: z.string(),
        assetValue: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.prisma.asset.create({
          data: {
            name: input.assetName,
            user: { connect: { id: ctx.auth.userId } },
            values: {
              create: {
                value: input.assetValue,
                user: { connect: { id: ctx.auth.userId } },
              },
            },
          },
          include: { values: true },
        });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),
  deleteAsset: protectedProcedure
    .input(z.object({ assetId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.asset.delete({ where: { id: input.assetId } });
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (e as Error).message,
        });
      }
    }),
});
