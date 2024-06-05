import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createFile = mutation({
  args: { name: v.string() },
  async handler(ctx, args) {
    const identity = ctx.auth.getUserIdentity()

    if (!identity) throw new Error('you must be signed in to upload a file')

    await ctx.db.insert('files', { name: args.name })
  },
})

export const getFiles = query({
  args: {},
  async handler(ctx, args) {
    const identity = ctx.auth.getUserIdentity()

    if (!identity) return []

    return ctx.db.query('files').collect()
  },
})
