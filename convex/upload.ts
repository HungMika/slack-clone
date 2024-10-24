import { mutation } from "./_generated/server";

export const genergrateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
