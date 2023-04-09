import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { NextApiRequest, NextApiResponse } from "next";

const createUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ctx = createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  try {
    const { id } = req.body.data;
    if (!id) return res.status(401).json({ error: "No user_id" });
    const user = await caller.users.createUser({ user_id: id });
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(error);
      return res.status(httpCode).json(error);
    }
  }
};

export default createUserHandler;
