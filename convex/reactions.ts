import { mutation } from "./_generated/server";
import { getMember } from "./utils";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.messageId);

    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member) throw new Error("Unauthorized");

    const existingMeaasgeReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value),
        ),
      )
      .first();


    if (existingMeaasgeReactionFromUser) {
        await ctx.db.delete(existingMeaasgeReactionFromUser._id);
      } else {
        await ctx.db.insert("reactions", {
          messageId: message._id,
          memberId: member._id,
          value: args.value,
          workspaceId: message.workspaceId,
        });
      }
      
  },
});
