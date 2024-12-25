import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()), 
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const userDoc = await ctx.db.get(userId);
    if (!userDoc) {
      throw new Error("User not found");
    }

    const updates: { name?: string; image?: string } = {};

    if (args.name !== undefined) {
      updates.name = args.name;
    }

    // Kiểm tra giá trị của image
    if (args.image) {
      // Nếu image không rỗng hoặc undefined
      const imageUrl = await ctx.storage.getUrl(args.image);
      if (!imageUrl) {
        throw new Error("Failed to generate image URL");
      }
      updates.image = imageUrl;
    } else {
      // Chuyển image thành undefined nếu không có giá trị
      updates.image = undefined;
    }
    
    if (Object.keys(updates).length === 0) {
      return userId; 
    }

    await ctx.db.patch(userId, updates);

    return userId;
  },
});
