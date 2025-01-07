import { Id } from "./_generated/dataModel";
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
    image: v.optional(v.string()), // Giữ nguyên kiểu string
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

    // Cập nhật tên nếu có
    if (args.name !== undefined) {
      updates.name = args.name;
    }

    // Xử lý giá trị image
    if (args.image) {
      try {
        // Lấy URL từ Convex storage
        const imageUrl = await ctx.storage.getUrl(args.image as Id<"_storage">);

        if (!imageUrl) {
          throw new Error("Failed to generate image URL");
        }
        updates.image = imageUrl;
      } catch (error) {
        console.error("Image URL error:", error);
        updates.image = undefined; // Gán undefined nếu URL không hợp lệ
      }
    } else {
      updates.image = undefined; // Nếu image không có, gán undefined
    }

    // Nếu không có dữ liệu mới để cập nhật, trả về userId
    if (Object.keys(updates).length === 0) {
      return userId;
    }

    // Cập nhật dữ liệu
    await ctx.db.patch(userId, updates);

    return userId;
  },
});

