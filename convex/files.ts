import { ConvexError, v } from 'convex/values'

import { MutationCtx, QueryCtx, mutation, query } from './_generated/server'
import { getUser } from './users'

const hassAccessToOrg = async (ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) => {
  const user = await getUser(ctx, tokenIdentifier)

  const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

  return hasAccess
}

export const createFile = mutation({
  args: { name: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) throw new Error('you must be signed in to upload a file')

    const hasAccess = await hassAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)

    if (!hasAccess) throw new ConvexError('unauthorized')

    await ctx.db.insert('files', args)
  },
})

export const getFiles = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) return []

    const hasAccess = await hassAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)

    if (!hasAccess) return []

    return ctx.db
      .query('files')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect()
  },
})
