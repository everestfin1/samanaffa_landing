// Helper functions to maintain Prisma-like API with Drizzle
import { eq, and, or, gt, lt, gte, lte, not, inArray, desc, asc, sql, SQL } from 'drizzle-orm';
import { db } from './index';
import * as schema from './schema';

// Type helpers
type WhereClause = Record<string, any>;
type OrderByClause = Record<string, 'asc' | 'desc'>;

// Convert Prisma-style where clause to Drizzle conditions
export function buildWhereConditions(table: any, where: WhereClause): SQL<unknown> | undefined {
  if (!where || Object.keys(where).length === 0) return undefined;

  const conditions: SQL<unknown>[] = [];

  for (const [key, value] of Object.entries(where)) {
    const column = table[key];
    if (!column) continue;

    if (value === null) {
      conditions.push(eq(column, null));
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Handle operators like gt, lt, gte, lte, not, in, etc.
      if ('gt' in value) conditions.push(gt(column, value.gt));
      if ('gte' in value) conditions.push(gte(column, value.gte));
      if ('lt' in value) conditions.push(lt(column, value.lt));
      if ('lte' in value) conditions.push(lte(column, value.lte));
      if ('not' in value) conditions.push(not(eq(column, value.not)));
      if ('in' in value) conditions.push(inArray(column, value.in));
    } else {
      conditions.push(eq(column, value));
    }
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

// Prisma-compatible query builder for Users
export const user = {
  async findFirst(params: { where: WhereClause; include?: any }) {
    const condition = buildWhereConditions(schema.users, params.where);
    const results = await db.select()
      .from(schema.users)
      .where(condition)
      .limit(1);
    
    return results[0] || null;
  },

  async findUnique(params: { where: { id?: string; email?: string; phone?: string }; include?: any }) {
    const { where } = params;
    let condition: SQL<unknown> | undefined;

    if (where.id) condition = eq(schema.users.id, where.id);
    else if (where.email) condition = eq(schema.users.email, where.email);
    else if (where.phone) condition = eq(schema.users.phone, where.phone);

    if (!condition) return null;

    const results = await db.select()
      .from(schema.users)
      .where(condition)
      .limit(1);

    // Handle includes if needed
    if (results[0] && params.include) {
      const user = results[0];
      const included: any = { ...user };

      if (params.include.accounts) {
        included.accounts = await db.select()
          .from(schema.userAccounts)
          .where(eq(schema.userAccounts.userId, user.id));
      }

      return included;
    }

    return results[0] || null;
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any; take?: number; skip?: number; include?: any }) {
    let query = db.select().from(schema.users);

    if (params?.where) {
      const condition = buildWhereConditions(schema.users, params.where);
      if (condition) query = query.where(condition) as any;
    }

    if (params?.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.users as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    if (params?.skip) query = query.offset(params.skip) as any;
    if (params?.take) query = query.limit(params.take) as any;

    return await query;
  },

  async create(params: { data: any }) {
    const results = await db.insert(schema.users).values(params.data).returning();
    return results[0];
  },

  async update(params: { where: { id: string }; data: any }) {
    const results = await db.update(schema.users)
      .set({ ...params.data, updatedAt: new Date() })
      .where(eq(schema.users.id, params.where.id))
      .returning();
    return results[0];
  },

  async delete(params: { where: { id: string } }) {
    await db.delete(schema.users).where(eq(schema.users.id, params.where.id));
  },

  async count(params?: { where?: WhereClause }) {
    const condition = params?.where ? buildWhereConditions(schema.users, params.where) : undefined;
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.users)
      .where(condition);
    return Number(result[0].count);
  },
};

// Prisma-compatible query builder for UserAccounts
export const userAccount = {
  async findUnique(params: { where: { id?: string; accountNumber?: string }; include?: any }) {
    const { where } = params;
    let condition: SQL<unknown> | undefined;

    if (where.id) condition = eq(schema.userAccounts.id, where.id);
    else if (where.accountNumber) condition = eq(schema.userAccounts.accountNumber, where.accountNumber);

    if (!condition) return null;

    const results = await db.select()
      .from(schema.userAccounts)
      .where(condition)
      .limit(1);

    return results[0] || null;
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any; take?: number; skip?: number; include?: any; select?: any }) {
    let query = db.select().from(schema.userAccounts);

    if (params?.where) {
      const condition = buildWhereConditions(schema.userAccounts, params.where);
      if (condition) query = query.where(condition) as any;
    }

    if (params?.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.userAccounts as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    if (params?.skip) query = query.offset(params.skip) as any;
    if (params?.take) query = query.limit(params.take) as any;

    const accounts = await query;

    // Handle includes
    if (params?.include?.transactionIntents && accounts.length > 0) {
      const accountIds = accounts.map(a => a.id);
      const intents = await db.select()
        .from(schema.transactionIntents)
        .where(inArray(schema.transactionIntents.accountId, accountIds))
        .orderBy(desc(schema.transactionIntents.createdAt))
        .limit(params.include.transactionIntents.take || 5);

      return accounts.map(account => ({
        ...account,
        transactionIntents: intents.filter(i => i.accountId === account.id),
      }));
    }

    return accounts;
  },

  async create(params: { data: any }) {
    const results = await db.insert(schema.userAccounts).values(params.data).returning();
    
    // Handle includes if specified
    const account = results[0];
    if (params.data.include?.transactionIntents) {
      const intents = await db.select()
        .from(schema.transactionIntents)
        .where(eq(schema.transactionIntents.accountId, account.id))
        .orderBy(desc(schema.transactionIntents.createdAt))
        .limit(5);
      
      return { ...account, transactionIntents: intents };
    }

    return account;
  },

  async update(params: { where: { id: string }; data: any }) {
    const results = await db.update(schema.userAccounts)
      .set(params.data)
      .where(eq(schema.userAccounts.id, params.where.id))
      .returning();
    return results[0];
  },

  async count(params?: { where?: WhereClause }) {
    const condition = params?.where ? buildWhereConditions(schema.userAccounts, params.where) : undefined;
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.userAccounts)
      .where(condition);
    return Number(result[0].count);
  },
};

// Prisma-compatible query builder for TransactionIntents
export const transactionIntent = {
  async findUnique(params: { where: { id?: string; referenceNumber?: string; providerTransactionId?: string }; include?: any }) {
    const { where } = params;
    let condition: SQL<unknown> | undefined;

    if (where.id) condition = eq(schema.transactionIntents.id, where.id);
    else if (where.referenceNumber) condition = eq(schema.transactionIntents.referenceNumber, where.referenceNumber);
    else if (where.providerTransactionId && where.providerTransactionId) 
      condition = eq(schema.transactionIntents.providerTransactionId, where.providerTransactionId);

    if (!condition) return null;

    const results = await db.select()
      .from(schema.transactionIntents)
      .where(condition)
      .limit(1);

    return results[0] || null;
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any; take?: number; skip?: number; include?: any }) {
    let query = db.select().from(schema.transactionIntents);

    if (params?.where) {
      const condition = buildWhereConditions(schema.transactionIntents, params.where);
      if (condition) query = query.where(condition) as any;
    }

    if (params?.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.transactionIntents as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    if (params?.skip) query = query.offset(params.skip) as any;
    if (params?.take) query = query.limit(params.take) as any;

    const intents = await query;

    // Handle includes
    if (params?.include?.account && intents.length > 0) {
      const accountIds = intents.map(i => i.accountId);
      const accounts = await db.select()
        .from(schema.userAccounts)
        .where(inArray(schema.userAccounts.id, accountIds));

      return intents.map(intent => ({
        ...intent,
        account: accounts.find(a => a.id === intent.accountId),
      }));
    }

    return intents;
  },

  async findFirst(params: { where: WhereClause; orderBy?: any }) {
    const condition = buildWhereConditions(schema.transactionIntents, params.where);
    let query = db.select().from(schema.transactionIntents).where(condition);

    if (params.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.transactionIntents as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    const results = await query.limit(1);
    return results[0] || null;
  },

  async create(params: { data: any }) {
    const results = await db.insert(schema.transactionIntents).values(params.data).returning();
    return results[0];
  },

  async update(params: { where: { id: string }; data: any }) {
    const results = await db.update(schema.transactionIntents)
      .set({ ...params.data, updatedAt: new Date() })
      .where(eq(schema.transactionIntents.id, params.where.id))
      .returning();
    return results[0];
  },

  async count(params?: { where?: WhereClause }) {
    const condition = params?.where ? buildWhereConditions(schema.transactionIntents, params.where) : undefined;
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.transactionIntents)
      .where(condition);
    return Number(result[0].count);
  },
};

// Prisma-compatible query builder for OTP Codes
export const otpCode = {
  async findFirst(params: { where: WhereClause }) {
    const condition = buildWhereConditions(schema.otpCodes, params.where);
    const results = await db.select()
      .from(schema.otpCodes)
      .where(condition)
      .limit(1);
    
    return results[0] || null;
  },

  async create(params: { data: any }) {
    const results = await db.insert(schema.otpCodes).values(params.data).returning();
    return results[0];
  },

  async update(params: { where: { id: string }; data: any }) {
    const results = await db.update(schema.otpCodes)
      .set(params.data)
      .where(eq(schema.otpCodes.id, params.where.id))
      .returning();
    return results[0];
  },

  async deleteMany(params: { where: WhereClause }) {
    const condition = buildWhereConditions(schema.otpCodes, params.where);
    if (condition) {
      await db.delete(schema.otpCodes).where(condition);
    }
  },
};

// Prisma-compatible query builder for Registration Sessions
export const registrationSession = {
  async create(params: { data: any }) {
    const results = await db.insert(schema.registrationSessions).values(params.data).returning();
    return results[0];
  },

  async delete(params: { where: { id: string } }) {
    await db.delete(schema.registrationSessions).where(eq(schema.registrationSessions.id, params.where.id));
  },

  async findFirst(params: { where: WhereClause }) {
    const condition = buildWhereConditions(schema.registrationSessions, params.where);
    const results = await db.select()
      .from(schema.registrationSessions)
      .where(condition)
      .limit(1);
    
    return results[0] || null;
  },
};

// Prisma-compatible query builder for KYC Documents
export const kycDocument = {
  async findUnique(params: { where: { id: string }; include?: any; select?: any }) {
    const results = await db.select()
      .from(schema.kycDocuments)
      .where(eq(schema.kycDocuments.id, params.where.id))
      .limit(1);

    return results[0] || null;
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any; include?: any; take?: number; select?: any }) {
    let query = db.select().from(schema.kycDocuments);

    if (params?.where) {
      const condition = buildWhereConditions(schema.kycDocuments, params.where);
      if (condition) query = query.where(condition) as any;
    }

    if (params?.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.kycDocuments as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    return await query;
  },

  async create(params: { data: any }) {
    const results = await db.insert(schema.kycDocuments).values(params.data).returning();
    return results[0];
  },

  async update(params: { where: { id: string }; data: any }) {
    const results = await db.update(schema.kycDocuments)
      .set(params.data)
      .where(eq(schema.kycDocuments.id, params.where.id))
      .returning();
    return results[0];
  },

  async delete(params: { where: { id: string } }) {
    await db.delete(schema.kycDocuments).where(eq(schema.kycDocuments.id, params.where.id));
  },

  async count(params?: { where?: WhereClause }) {
    const condition = params?.where ? buildWhereConditions(schema.kycDocuments, params.where) : undefined;
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.kycDocuments)
      .where(condition);
    return Number(result[0].count);
  },
};

// Prisma-compatible query builder for Admin Users
export const adminUser = {
  async findUnique(params: { where: { id?: string; email?: string } }) {
    const { where } = params;
    let condition: SQL<unknown> | undefined;

    if (where.id) condition = eq(schema.adminUsers.id, where.id);
    else if (where.email) condition = eq(schema.adminUsers.email, where.email);

    if (!condition) return null;

    const results = await db.select()
      .from(schema.adminUsers)
      .where(condition)
      .limit(1);

    return results[0] || null;
  },

  async update(params: { where: { id: string }; data: any }) {
    const results = await db.update(schema.adminUsers)
      .set({ ...params.data, updatedAt: new Date() })
      .where(eq(schema.adminUsers.id, params.where.id))
      .returning();
    return results[0];
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any }) {
    let query = db.select().from(schema.adminUsers);

    if (params?.where) {
      const condition = buildWhereConditions(schema.adminUsers, params.where);
      if (condition) query = query.where(condition) as any;
    }

    if (params?.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.adminUsers as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    return await query;
  },
};

// Prisma-compatible query builder for Notifications
export const notification = {
  async findMany(params?: { where?: WhereClause; orderBy?: any; take?: number; skip?: number }) {
    let query = db.select().from(schema.notifications);

    if (params?.where) {
      const condition = buildWhereConditions(schema.notifications, params.where);
      if (condition) query = query.where(condition) as any;
    }

    if (params?.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.notifications as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    if (params?.skip) query = query.offset(params.skip) as any;
    if (params?.take) query = query.limit(params.take) as any;

    return await query;
  },

  async create(params: { data: any }) {
    const results = await db.insert(schema.notifications).values(params.data).returning();
    return results[0];
  },

  async update(params: { where: { id: string }; data: any }) {
    const results = await db.update(schema.notifications)
      .set({ ...params.data, updatedAt: new Date() })
      .where(eq(schema.notifications.id, params.where.id))
      .returning();
    return results[0];
  },

  async updateMany(params: { where: WhereClause; data: any }) {
    const condition = buildWhereConditions(schema.notifications, params.where);
    if (condition) {
      await db.update(schema.notifications)
        .set({ ...params.data, updatedAt: new Date() })
        .where(condition);
    }
  },

  async count(params?: { where?: WhereClause }) {
    const condition = params?.where ? buildWhereConditions(schema.notifications, params.where) : undefined;
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.notifications)
      .where(condition);
    return Number(result[0].count);
  },
};

// Prisma-compatible query builder for Payment Callback Logs
export const paymentCallbackLog = {
  async create(params: { data: any }) {
    const results = await db.insert(schema.paymentCallbackLogs).values(params.data).returning();
    return results[0];
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any }) {
    let query = db.select().from(schema.paymentCallbackLogs);

    if (params?.where) {
      const condition = buildWhereConditions(schema.paymentCallbackLogs, params.where);
      if (condition) query = query.where(condition) as any;
    }

    if (params?.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.paymentCallbackLogs as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    return await query;
  },
};

// Session helpers
export const session = {
  async findUnique(params: { where: { sessionToken: string } }) {
    const results = await db.select()
      .from(schema.sessions)
      .where(eq(schema.sessions.sessionToken, params.where.sessionToken))
      .limit(1);
    
    return results[0] || null;
  },

  async create(params: { data: any }) {
    const results = await db.insert(schema.sessions).values(params.data).returning();
    return results[0];
  },

  async update(params: { where: { sessionToken: string }; data: any }) {
    const results = await db.update(schema.sessions)
      .set(params.data)
      .where(eq(schema.sessions.sessionToken, params.where.sessionToken))
      .returning();
    return results[0];
  },

  async delete(params: { where: { sessionToken: string } }) {
    await db.delete(schema.sessions).where(eq(schema.sessions.sessionToken, params.where.sessionToken));
  },
};

// Utility methods for Prisma compatibility
const utils = {
  async $transaction(operations: any[]) {
    // Drizzle doesn't have the same transaction API
    // Execute operations sequentially for now
    const results = [];
    for (const op of operations) {
      results.push(await op);
    }
    return results;
  },
  async $disconnect() {
    // Not needed with Drizzle's connection pooling
    return;
  },
};

// Export Prisma-compatible interface
export const prisma = {
  user,
  userAccount,
  transactionIntent,
  otpCode,
  registrationSession,
  kycDocument,
  adminUser,
  notification,
  paymentCallbackLog,
  session,
  $transaction: utils.$transaction,
  $disconnect: utils.$disconnect,
};

