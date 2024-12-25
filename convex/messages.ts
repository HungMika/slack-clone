import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();
  // check if this message is a thread
  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
    name: lastMessageUser?.name,
  };
};

const populateReaction = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};
// just get the info of one member with the id
const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

// get the memeber of a user in a  workspace
const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const updateMessage = mutation({
  args: {
    id: v.id("messages"),
    seenMembers: v.array(v.id("users")),
  },
  handler: async (ctx: MutationCtx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    await ctx.db.patch(args.id, {
      seenMembers: args.seenMembers,
    });
  },
});
export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
  

    let _conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;
            if (!member || !user) {
              return null;
            }
            const reactions = await populateReaction(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });

            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.value === reaction.value
                );
                if (existingReaction) {
                  existingReaction.memberIds = Array.from(
                    new Set([...existingReaction.memberIds, reaction.memberId])
                  );
                } else {
                  acc.push({
                    ...reaction,
                    memberIds: [reaction.memberId],
                  });
                }
                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );

            const reactionWithoutMemberIdProperty = dedupedReactions.map(
              ({ memberId, ...rest }) => rest
            );

            return {
              ...message,
              member,
              user,
              image,
              reactions: reactionWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadName: thread.name,
              threadTimestamp: thread.timestamp,
              seenMembers: message.seenMembers,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message != null
      ),
    };
  },
});

export const getById = query({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const message = await ctx.db.get(args.id);
    if (!message) return null;

    const currentMember = await getMember(ctx, message.workspaceId, userId);
    if (!currentMember) return null;

    const member = await populateMember(ctx, message.memberId);
    if (!member) return null;

    const user = await populateUser(ctx, member.userId);
    if (!user) return null;

    const reactions = await populateReaction(ctx, message._id);
    const reactionsWithCounts = reactions.map((reaction) => {
      return {
        ...reaction,
        count: reactions.filter((r) => r.value === reaction.value).length,
      };
    });

    const dedupedReactions = reactionsWithCounts.reduce(
      (acc, reaction) => {
        const existingReaction = acc.find((r) => r.value === reaction.value);
        if (existingReaction) {
          existingReaction.memberIds = Array.from(
            new Set([...existingReaction.memberIds, reaction.memberId])
          );
        } else {
          acc.push({
            ...reaction,
            memberIds: [reaction.memberId],
          });
        }
        return acc;
      },
      [] as (Doc<"reactions"> & {
        count: number;
        memberIds: Id<"members">[];
      })[]
    );

    const reactionWithoutMemberIdProperty = dedupedReactions.map(
      ({ memberId, ...rest }) => rest
    );

    return {
      ...message,
      image: message.image
        ? await ctx.storage.getUrl(message.image)
        : undefined,
      member,
      user,
      reactions: reactionWithoutMemberIdProperty,
    };
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    //TODO: add conversationId
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Only possible if we are relying in a thread in 1:1 conversations
    let _conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;
    }

    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member) {
      console.log("Member not found");
      throw new Error("Unauthorized");
    }

    const allMembers = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    const uniqueUserIds = [
      ...new Set(
        allMembers
          .map((member) => member.userId)
          .filter((_userId) => _userId !== userId)
      ),
    ];

    // TODO: handle conversationId
    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      conversationId: _conversationId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      seenMembers: uniqueUserIds,
      //TODO: add conversationId
    });

    return messageId;
  },
});

export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || member._id !== message.memberId)
      throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || member._id !== message.memberId)
      throw new Error("Unauthorized");

    await ctx.db.delete(args.id);

    return args.id;
  },
});
export const getAllMessagesByUserId = query({
  args: {
    // userId: v.id("users"),
    // paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((item) => item.workspaceId);
    const workspaceMessagePromises = workspaceIds.map(async (workspaceId) => {
      return await ctx.db
        .query("messages")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
        .collect();
    });

    const allmess = await Promise.all(workspaceMessagePromises);

    let flatMessages = allmess.flat();
    let arrayWithConversationInfo = flatMessages.map(async (item) => {
      if (item.conversationId) {
        const conversationId = item.conversationId as Id<"conversations">;
        let memberOne =null 
        let memberTwo=null 
        const conversations = await ctx.db
          .query("conversations")
          .withIndex("by_id", (q) => q.eq("_id", conversationId))
          .collect();
        if (conversations.length > 0) {
          let [memberIdOne, memberIdTwo] = [
            conversations[0].memberOneId,
            conversations[0].memberTwoId,
          ];
          memberIdOne = memberIdOne as Id<"members">;
          memberIdTwo = memberIdTwo as Id<"members">;
          memberOne = await ctx.db
            .query("members")
            .withIndex("by_id", (q) => q.eq("_id", memberIdOne))
            .collect();
          memberTwo = await ctx.db
            .query("members")
            .withIndex("by_id", (q) => q.eq("_id", memberIdTwo))
            .collect();
        }
        return {
          ...item,
          conversationInfo: {memberOne: memberOne, memberTwo},
        };
      }
      return {...item,conversationInfo:null}
    });

    const allConversationInfo = await Promise.all(arrayWithConversationInfo);
    return { members, allmess, flatMessages,allConversationInfo };
  },
});