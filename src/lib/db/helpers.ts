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
  const topLevelConditions: SQL<unknown>[] = [];
  
  // First, handle special operators at the top level
  for (const [key, value] of Object.entries(where)) {
    // Handle special operators: OR, AND, NOT
    if (key === 'OR' && Array.isArray(value)) {
      // Recursively build OR conditions
      const orConditions = value
        .map(orClause => buildWhereConditions(table, orClause))
        .filter(Boolean) as SQL<unknown>[];
      if (orConditions.length > 0) {
        topLevelConditions.push(or(...orConditions)!);
      }
      continue;
    }

    if (key === 'AND' && Array.isArray(value)) {
      // Recursively build AND conditions
      const andConditions = value
        .map(andClause => buildWhereConditions(table, andClause))
        .filter(Boolean) as SQL<unknown>[];
      if (andConditions.length > 0) {
        topLevelConditions.push(and(...andConditions)!);
      }
      continue;
    }

    if (key === 'NOT') {
      // Handle NOT clause - recursively process the nested condition
      const notCondition = buildWhereConditions(table, value);
      if (notCondition) {
        topLevelConditions.push(not(notCondition));
      }
      continue;
    }
  }

  // Then, handle regular column conditions
  for (const [key, value] of Object.entries(where)) {
    // Skip special operators (already processed above)
    if (key === 'OR' || key === 'AND' || key === 'NOT') continue;

    // Regular column conditions
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
      if ('not' in value) {
        // Handle NOT operator for column values
        if (typeof value.not === 'object' && !Array.isArray(value.not)) {
          const notCondition = buildWhereConditions(table, { [key]: value.not });
          if (notCondition) {
            conditions.push(not(notCondition));
          }
        } else {
          conditions.push(not(eq(column, value.not)));
        }
      }
      if ('in' in value) conditions.push(inArray(column, value.in));
    } else {
      conditions.push(eq(column, value));
    }
  }

  // Combine all conditions: top-level special operators AND regular conditions
  const allConditions = [...topLevelConditions, ...conditions];
  return allConditions.length > 0 ? and(...allConditions) : undefined;
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

  async findUnique(params: { where: { id?: string; email?: string; phone?: string }; include?: any; select?: any }) {
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
        // Build account query with user ID filter
        const accountConditions: SQL<unknown>[] = [eq(schema.userAccounts.userId, user.id)];
        
        // Add additional filters if specified in include.accounts.where
        if (params.include.accounts.where) {
          const additionalCondition = buildWhereConditions(schema.userAccounts, params.include.accounts.where);
          if (additionalCondition) {
            accountConditions.push(additionalCondition);
          }
        }
        
        included.accounts = await db.select()
          .from(schema.userAccounts)
          .where(and(...accountConditions));
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

    const users = await query;

    // Handle includes
    if (params?.include && users.length > 0) {
      const userIds = users.map(u => u.id);
      const enhancedUsers = await Promise.all(users.map(async (user) => {
        const enhanced: any = { ...user };

        if (params.include.accounts) {
          // Build account query with user ID filter
          const accountConditions: SQL<unknown>[] = [eq(schema.userAccounts.userId, user.id)];
          
          // Add additional filters if specified in include.accounts.where
          if (params.include.accounts.where) {
            const additionalCondition = buildWhereConditions(schema.userAccounts, params.include.accounts.where);
            if (additionalCondition) {
              accountConditions.push(additionalCondition);
            }
          }
          
          enhanced.accounts = await db.select()
            .from(schema.userAccounts)
            .where(and(...accountConditions));
        }

        if (params.include.kycDocuments) {
          let kycQuery = db.select().from(schema.kycDocuments).where(eq(schema.kycDocuments.userId, user.id));
          if (params.include.kycDocuments.orderBy) {
            const orderKey = Object.keys(params.include.kycDocuments.orderBy)[0];
            const orderDir = params.include.kycDocuments.orderBy[orderKey];
            const column = (schema.kycDocuments as any)[orderKey];
            if (column) {
              kycQuery = kycQuery.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
            }
          }
          if (params.include.kycDocuments.take) {
            kycQuery = kycQuery.limit(params.include.kycDocuments.take) as any;
          }
          enhanced.kycDocuments = await kycQuery;
        }

        if (params.include._count) {
          enhanced._count = {} as any;
          if (params.include._count.select?.transactionIntents) {
            const result = await db.select({ count: sql<number>`count(*)` })
              .from(schema.transactionIntents)
              .where(eq(schema.transactionIntents.userId, user.id));
            enhanced._count.transactionIntents = Number(result[0].count);
          }
          if (params.include._count.select?.kycDocuments) {
            const result = await db.select({ count: sql<number>`count(*)` })
              .from(schema.kycDocuments)
              .where(eq(schema.kycDocuments.userId, user.id));
            enhanced._count.kycDocuments = Number(result[0].count);
          }
        }

        return enhanced;
      }));

      return enhancedUsers;
    }

    return users;
  },

  async create(params: { data: any }) {
    const now = new Date();
    const dataWithTimestamps = {
      ...params.data,
      createdAt: params.data.createdAt || now,
      updatedAt: params.data.updatedAt || now
    };
    const results = await db.insert(schema.users).values(dataWithTimestamps).returning();
    return results[0];
  },

  async update(params: { where: { id: string }; data: any; include?: any }) {
    const results = await db.update(schema.users)
      .set({ ...params.data, updatedAt: new Date() })
      .where(eq(schema.users.id, params.where.id))
      .returning();
    
    const user = results[0];
    if (!user) return null;

    // Handle includes
    if (params.include) {
      const enhanced: any = { ...user };

      if (params.include.accounts) {
        enhanced.accounts = await db.select()
          .from(schema.userAccounts)
          .where(eq(schema.userAccounts.userId, user.id));
      }

      if (params.include.kycDocuments) {
        let kycQuery = db.select().from(schema.kycDocuments).where(eq(schema.kycDocuments.userId, user.id));
        if (params.include.kycDocuments.orderBy) {
          const orderKey = Object.keys(params.include.kycDocuments.orderBy)[0];
          const orderDir = params.include.kycDocuments.orderBy[orderKey];
          const column = (schema.kycDocuments as any)[orderKey];
          if (column) {
            kycQuery = kycQuery.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
          }
        }
        enhanced.kycDocuments = await kycQuery;
      }

      if (params.include._count) {
        enhanced._count = {} as any;
        if (params.include._count.select?.transactionIntents) {
          const result = await db.select({ count: sql<number>`count(*)` })
            .from(schema.transactionIntents)
            .where(eq(schema.transactionIntents.userId, user.id));
          enhanced._count.transactionIntents = Number(result[0].count);
        }
        if (params.include._count.select?.kycDocuments) {
          const result = await db.select({ count: sql<number>`count(*)` })
            .from(schema.kycDocuments)
            .where(eq(schema.kycDocuments.userId, user.id));
          enhanced._count.kycDocuments = Number(result[0].count);
        }
      }

      return enhanced;
    }

    return user;
  },

  async delete(params: { where: { id: string } }) {
    await db.delete(schema.users).where(eq(schema.users.id, params.where.id));
  },

  async deleteMany(params: { where: WhereClause }) {
    const condition = buildWhereConditions(schema.users, params.where);
    if (condition) {
      await db.delete(schema.users).where(condition);
    }
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
    if (params?.include) {
      const enhancedAccounts = await Promise.all(accounts.map(async (account) => {
        const enhanced: any = { ...account };

        if (params.include.transactionIntents) {
          const intents = await db.select()
            .from(schema.transactionIntents)
            .where(eq(schema.transactionIntents.accountId, account.id))
            .orderBy(desc(schema.transactionIntents.createdAt))
            .limit(params.include.transactionIntents.take || 5);
          enhanced.transactionIntents = intents;
        }

        if (params.include.user) {
          const users = await db.select()
            .from(schema.users)
            .where(eq(schema.users.id, account.userId))
            .limit(1);
          if (params.include.user.select) {
            const selectKeys = Object.keys(params.include.user.select);
            enhanced.user = selectKeys.reduce((obj: any, key) => {
              obj[key] = (users[0] as any)[key];
              return obj;
            }, {});
          } else {
            enhanced.user = users[0];
          }
        }

        return enhanced;
      }));

      return enhancedAccounts;
    }

    return accounts;
  },

  async create(params: { data: any; include?: any }) {
    const results = await db.insert(schema.userAccounts).values(params.data).returning();
    
    // Handle includes if specified
    const account = results[0];
    if (params.include?.transactionIntents) {
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

    const intent = results[0] || null;
    if (!intent) return null;

    // Handle includes
    if (params.include) {
      const enhanced: any = { ...intent };

      if (params.include.account) {
        const accounts = await db.select()
          .from(schema.userAccounts)
          .where(eq(schema.userAccounts.id, intent.accountId))
          .limit(1);
        if (params.include.account.select) {
          const selectKeys = Object.keys(params.include.account.select);
          enhanced.account = selectKeys.reduce((obj: any, key) => {
            obj[key] = (accounts[0] as any)?.[key];
            return obj;
          }, {});
        } else {
          enhanced.account = accounts[0];
        }
      }

      if (params.include.user) {
        const users = await db.select()
          .from(schema.users)
          .where(eq(schema.users.id, intent.userId))
          .limit(1);
        if (params.include.user.select) {
          const selectKeys = Object.keys(params.include.user.select);
          enhanced.user = selectKeys.reduce((obj: any, key) => {
            obj[key] = (users[0] as any)?.[key];
            return obj;
          }, {});
        } else {
          enhanced.user = users[0];
        }
      }

      return enhanced;
    }

    return intent;
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
    if (params?.include && intents.length > 0) {
      const accountIds = params.include.account ? [...new Set(intents.map(i => i.accountId))] : [];
      const userIds = params.include.user ? [...new Set(intents.map(i => i.userId))] : [];

      const accounts = accountIds.length > 0 ? await db.select()
        .from(schema.userAccounts)
        .where(inArray(schema.userAccounts.id, accountIds)) : [];

      const users = userIds.length > 0 ? await db.select()
        .from(schema.users)
        .where(inArray(schema.users.id, userIds)) : [];

      return intents.map(intent => {
        const enhanced: any = { ...intent };

        if (params.include.account) {
          const account = accounts.find(a => a.id === intent.accountId);
          if (params.include.account.select) {
            const selectKeys = Object.keys(params.include.account.select);
            enhanced.account = selectKeys.reduce((obj: any, key) => {
              obj[key] = (account as any)?.[key];
              return obj;
            }, {});
          } else {
            enhanced.account = account;
          }
        }

        if (params.include.user) {
          const user = users.find(u => u.id === intent.userId);
          if (params.include.user.select) {
            const selectKeys = Object.keys(params.include.user.select);
            enhanced.user = selectKeys.reduce((obj: any, key) => {
              obj[key] = (user as any)?.[key];
              return obj;
            }, {});
          } else {
            enhanced.user = user;
          }
        }

        return enhanced;
      });
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
    const now = new Date();
    const dataWithTimestamps = {
      ...params.data,
      createdAt: params.data.createdAt || now,
      updatedAt: params.data.updatedAt || now
    };
    const results = await db.insert(schema.transactionIntents).values(dataWithTimestamps).returning();
    return results[0];
  },

  async update(params: { where: { id: string }; data: any; include?: any }) {
    const results = await db.update(schema.transactionIntents)
      .set({ ...params.data, updatedAt: new Date() })
      .where(eq(schema.transactionIntents.id, params.where.id))
      .returning();
    
    const intent = results[0];
    if (!intent) return null;

    // Handle includes
    if (params.include) {
      const enhanced: any = { ...intent };

      if (params.include.account) {
        const accounts = await db.select()
          .from(schema.userAccounts)
          .where(eq(schema.userAccounts.id, intent.accountId))
          .limit(1);
        if (params.include.account.select) {
          const selectKeys = Object.keys(params.include.account.select);
          enhanced.account = selectKeys.reduce((obj: any, key) => {
            obj[key] = (accounts[0] as any)?.[key];
            return obj;
          }, {});
        } else {
          enhanced.account = accounts[0];
        }
      }

      if (params.include.user) {
        const users = await db.select()
          .from(schema.users)
          .where(eq(schema.users.id, intent.userId))
          .limit(1);
        if (params.include.user.select) {
          const selectKeys = Object.keys(params.include.user.select);
          enhanced.user = selectKeys.reduce((obj: any, key) => {
            obj[key] = (users[0] as any)?.[key];
            return obj;
          }, {});
        } else {
          enhanced.user = users[0];
        }
      }

      return enhanced;
    }

    return intent;
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
  async findUnique(params: { where: { id: string } }) {
    const results = await db.select()
      .from(schema.registrationSessions)
      .where(eq(schema.registrationSessions.id, params.where.id))
      .limit(1);
    
    return results[0] || null;
  },

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

    const doc = results[0] || null;
    if (!doc) return null;

    // Handle includes
    if (params.include?.user) {
      const users = await db.select()
        .from(schema.users)
        .where(eq(schema.users.id, doc.userId))
        .limit(1);
      if (params.include.user.select) {
        const selectKeys = Object.keys(params.include.user.select);
        (doc as any).user = selectKeys.reduce((obj: any, key) => {
          obj[key] = (users[0] as any)[key];
          return obj;
        }, {});
      } else {
        (doc as any).user = users[0];
      }
    }

    return doc;
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any; include?: any; take?: number; skip?: number; select?: any }) {
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

    if (params?.skip) query = query.offset(params.skip) as any;
    if (params?.take) query = query.limit(params.take) as any;

    const docs = await query;

    // Handle includes
    if (params?.include?.user && docs.length > 0) {
      const userIds = [...new Set(docs.map(d => d.userId))];
      const users = await db.select()
        .from(schema.users)
        .where(inArray(schema.users.id, userIds));

      const enhancedDocs = docs.map(doc => {
        const user = users.find(u => u.id === doc.userId);
        if (params.include.user.select) {
          const selectKeys = Object.keys(params.include.user.select);
          return {
            ...doc,
            user: selectKeys.reduce((obj: any, key) => {
              obj[key] = (user as any)?.[key];
              return obj;
            }, {})
          };
        }
        return { ...doc, user };
      });

      return enhancedDocs;
    }

    return docs;
  },

  async create(params: { data: any }) {
    const results = await db.insert(schema.kycDocuments).values(params.data).returning();
    return results[0];
  },

  async update(params: { where: { id: string }; data: any; include?: any }) {
    const results = await db.update(schema.kycDocuments)
      .set(params.data)
      .where(eq(schema.kycDocuments.id, params.where.id))
      .returning();
    
    const doc = results[0];
    if (!doc) return null;

    // Handle includes
    if (params.include?.user) {
      const users = await db.select()
        .from(schema.users)
        .where(eq(schema.users.id, doc.userId))
        .limit(1);
      if (params.include.user.select) {
        const selectKeys = Object.keys(params.include.user.select);
        (doc as any).user = selectKeys.reduce((obj: any, key) => {
          obj[key] = (users[0] as any)[key];
          return obj;
        }, {});
      } else {
        (doc as any).user = users[0];
      }
    }

    return doc;
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
  async findUnique(params: { where: { id?: string; email?: string }; select?: any }) {
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
  async findFirst(params: { where: WhereClause; orderBy?: any }) {
    const condition = buildWhereConditions(schema.notifications, params.where);
    let query = db.select().from(schema.notifications).where(condition);

    if (params.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.notifications as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    const results = await query.limit(1);
    return results[0] || null;
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any; take?: number; skip?: number; include?: any; select?: any }) {
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

    const notifications = await query;

    // Handle includes
    if (params?.include?.user && notifications.length > 0) {
      const userIds = [...new Set(notifications.map(n => n.userId))];
      const users = await db.select()
        .from(schema.users)
        .where(inArray(schema.users.id, userIds));

      const enhancedNotifications = notifications.map(notification => {
        const user = users.find(u => u.id === notification.userId);
        if (params.include.user.select) {
          const selectKeys = Object.keys(params.include.user.select);
          return {
            ...notification,
            user: selectKeys.reduce((obj: any, key) => {
              obj[key] = (user as any)?.[key];
              return obj;
            }, {})
          };
        }
        return { ...notification, user };
      });

      return enhancedNotifications;
    }

    return notifications;
  },

  async create(params: { data: any }) {
    const now = new Date();
    const dataWithTimestamps = {
      ...params.data,
      createdAt: params.data.createdAt || now,
      updatedAt: params.data.updatedAt || now
    };
    const results = await db.insert(schema.notifications).values(dataWithTimestamps).returning();
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

  async delete(params: { where: { id: string } }) {
    await db.delete(schema.notifications).where(eq(schema.notifications.id, params.where.id));
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

// Prisma-compatible query builder for Admin Audit Logs
export const adminAuditLog = {
  async create(params: { data: any }) {
    const results = await db.insert(schema.adminAuditLogs).values(params.data).returning();
    return results[0];
  },

  async findMany(params?: { where?: WhereClause; orderBy?: any; take?: number; skip?: number; include?: any }) {
    let query = db.select().from(schema.adminAuditLogs);

    if (params?.where) {
      const condition = buildWhereConditions(schema.adminAuditLogs, params.where);
      if (condition) query = query.where(condition) as any;
    }

    if (params?.orderBy) {
      const orderKey = Object.keys(params.orderBy)[0];
      const orderDir = params.orderBy[orderKey];
      const column = (schema.adminAuditLogs as any)[orderKey];
      if (column) {
        query = query.orderBy(orderDir === 'desc' ? desc(column) : asc(column)) as any;
      }
    }

    if (params?.skip) query = query.offset(params.skip) as any;
    if (params?.take) query = query.limit(params.take) as any;

    const logs = await query;

    // Handle includes
    if (params?.include?.admin && logs.length > 0) {
      const adminIds = [...new Set(logs.map(l => l.adminId))];
      const admins = await db.select()
        .from(schema.adminUsers)
        .where(inArray(schema.adminUsers.id, adminIds));

      const enhancedLogs = logs.map(log => {
        const admin = admins.find(a => a.id === log.adminId);
        if (params.include.admin.select) {
          const selectKeys = Object.keys(params.include.admin.select);
          return {
            ...log,
            admin: selectKeys.reduce((obj: any, key) => {
              obj[key] = (admin as any)?.[key];
              return obj;
            }, {})
          };
        }
        return { ...log, admin };
      });

      return enhancedLogs;
    }

    return logs;
  },

  async count(params?: { where?: WhereClause }) {
    const condition = params?.where ? buildWhereConditions(schema.adminAuditLogs, params.where) : undefined;
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.adminAuditLogs)
      .where(condition);
    return Number(result[0].count);
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
  async $transaction(callback: any) {
    // If it's a callback function, execute it with prisma-compatible interface
    if (typeof callback === 'function') {
      // Execute the callback with the prisma-compatible interface
      return await callback(prisma);
    }
    // If it's an array of operations, execute them sequentially
    const results = [];
    for (const op of callback) {
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
  adminAuditLog,
  notification,
  paymentCallbackLog,
  session,
  $transaction: utils.$transaction,
  $disconnect: utils.$disconnect,
};
