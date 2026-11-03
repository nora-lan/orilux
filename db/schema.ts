import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const comments = sqliteTable('community_comments', {
  id: text('id').primaryKey(),
  articleId: text('article_id').notNull(),
  ownerHash: text('owner_hash').notNull(),
  nickname: text('nickname').notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at').notNull(),
}, table => [index('comments_article_created').on(table.articleId, table.createdAt, table.id)])

export const submissions = sqliteTable('comment_submissions', {
  id: text('id').primaryKey(),
  ownerHash: text('owner_hash').notNull(),
  clientRequestId: text('client_request_id').notNull(),
  ipHash: text('ip_hash').notNull(),
  createdAt: integer('created_at').notNull(),
}, table => [
  uniqueIndex('submissions_owner_request').on(table.ownerHash, table.clientRequestId),
  index('submissions_owner_created').on(table.ownerHash, table.createdAt),
  index('submissions_ip_created').on(table.ipHash, table.createdAt),
  index('submissions_created').on(table.createdAt),
])
