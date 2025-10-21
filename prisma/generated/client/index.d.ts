
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model OtpCode
 * 
 */
export type OtpCode = $Result.DefaultSelection<Prisma.$OtpCodePayload>
/**
 * Model UserAccount
 * 
 */
export type UserAccount = $Result.DefaultSelection<Prisma.$UserAccountPayload>
/**
 * Model TransactionIntent
 * 
 */
export type TransactionIntent = $Result.DefaultSelection<Prisma.$TransactionIntentPayload>
/**
 * Model PaymentCallbackLog
 * 
 */
export type PaymentCallbackLog = $Result.DefaultSelection<Prisma.$PaymentCallbackLogPayload>
/**
 * Model KycDocument
 * 
 */
export type KycDocument = $Result.DefaultSelection<Prisma.$KycDocumentPayload>
/**
 * Model AdminUser
 * 
 */
export type AdminUser = $Result.DefaultSelection<Prisma.$AdminUserPayload>
/**
 * Model RegistrationSession
 * 
 */
export type RegistrationSession = $Result.DefaultSelection<Prisma.$RegistrationSessionPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const KycStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus]


export const OtpType: {
  EMAIL: 'EMAIL',
  SMS: 'SMS'
};

export type OtpType = (typeof OtpType)[keyof typeof OtpType]


export const AccountType: {
  SAMA_NAFFA: 'SAMA_NAFFA',
  APE_INVESTMENT: 'APE_INVESTMENT'
};

export type AccountType = (typeof AccountType)[keyof typeof AccountType]


export const AccountStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED'
};

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus]


export const IntentType: {
  DEPOSIT: 'DEPOSIT',
  INVESTMENT: 'INVESTMENT',
  WITHDRAWAL: 'WITHDRAWAL'
};

export type IntentType = (typeof IntentType)[keyof typeof IntentType]


export const TransactionStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED'
};

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]


export const VerificationStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus]


export const AdminRole: {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SUPPORT: 'SUPPORT'
};

export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole]


export const SessionType: {
  REGISTRATION: 'REGISTRATION',
  LOGIN: 'LOGIN'
};

export type SessionType = (typeof SessionType)[keyof typeof SessionType]


export const NotificationType: {
  KYC_STATUS: 'KYC_STATUS',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  TRANSACTION: 'TRANSACTION',
  SECURITY: 'SECURITY'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]


export const NotificationPriority: {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

export type NotificationPriority = (typeof NotificationPriority)[keyof typeof NotificationPriority]

}

export type KycStatus = $Enums.KycStatus

export const KycStatus: typeof $Enums.KycStatus

export type OtpType = $Enums.OtpType

export const OtpType: typeof $Enums.OtpType

export type AccountType = $Enums.AccountType

export const AccountType: typeof $Enums.AccountType

export type AccountStatus = $Enums.AccountStatus

export const AccountStatus: typeof $Enums.AccountStatus

export type IntentType = $Enums.IntentType

export const IntentType: typeof $Enums.IntentType

export type TransactionStatus = $Enums.TransactionStatus

export const TransactionStatus: typeof $Enums.TransactionStatus

export type VerificationStatus = $Enums.VerificationStatus

export const VerificationStatus: typeof $Enums.VerificationStatus

export type AdminRole = $Enums.AdminRole

export const AdminRole: typeof $Enums.AdminRole

export type SessionType = $Enums.SessionType

export const SessionType: typeof $Enums.SessionType

export type NotificationType = $Enums.NotificationType

export const NotificationType: typeof $Enums.NotificationType

export type NotificationPriority = $Enums.NotificationPriority

export const NotificationPriority: typeof $Enums.NotificationPriority

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.otpCode`: Exposes CRUD operations for the **OtpCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OtpCodes
    * const otpCodes = await prisma.otpCode.findMany()
    * ```
    */
  get otpCode(): Prisma.OtpCodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userAccount`: Exposes CRUD operations for the **UserAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAccounts
    * const userAccounts = await prisma.userAccount.findMany()
    * ```
    */
  get userAccount(): Prisma.UserAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transactionIntent`: Exposes CRUD operations for the **TransactionIntent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TransactionIntents
    * const transactionIntents = await prisma.transactionIntent.findMany()
    * ```
    */
  get transactionIntent(): Prisma.TransactionIntentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paymentCallbackLog`: Exposes CRUD operations for the **PaymentCallbackLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentCallbackLogs
    * const paymentCallbackLogs = await prisma.paymentCallbackLog.findMany()
    * ```
    */
  get paymentCallbackLog(): Prisma.PaymentCallbackLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kycDocument`: Exposes CRUD operations for the **KycDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KycDocuments
    * const kycDocuments = await prisma.kycDocument.findMany()
    * ```
    */
  get kycDocument(): Prisma.KycDocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.adminUser`: Exposes CRUD operations for the **AdminUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminUsers
    * const adminUsers = await prisma.adminUser.findMany()
    * ```
    */
  get adminUser(): Prisma.AdminUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.registrationSession`: Exposes CRUD operations for the **RegistrationSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RegistrationSessions
    * const registrationSessions = await prisma.registrationSession.findMany()
    * ```
    */
  get registrationSession(): Prisma.RegistrationSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    OtpCode: 'OtpCode',
    UserAccount: 'UserAccount',
    TransactionIntent: 'TransactionIntent',
    PaymentCallbackLog: 'PaymentCallbackLog',
    KycDocument: 'KycDocument',
    AdminUser: 'AdminUser',
    RegistrationSession: 'RegistrationSession',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "otpCode" | "userAccount" | "transactionIntent" | "paymentCallbackLog" | "kycDocument" | "adminUser" | "registrationSession" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      OtpCode: {
        payload: Prisma.$OtpCodePayload<ExtArgs>
        fields: Prisma.OtpCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OtpCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OtpCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>
          }
          findFirst: {
            args: Prisma.OtpCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OtpCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>
          }
          findMany: {
            args: Prisma.OtpCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>[]
          }
          create: {
            args: Prisma.OtpCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>
          }
          createMany: {
            args: Prisma.OtpCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OtpCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>[]
          }
          delete: {
            args: Prisma.OtpCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>
          }
          update: {
            args: Prisma.OtpCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>
          }
          deleteMany: {
            args: Prisma.OtpCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OtpCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OtpCodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>[]
          }
          upsert: {
            args: Prisma.OtpCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpCodePayload>
          }
          aggregate: {
            args: Prisma.OtpCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOtpCode>
          }
          groupBy: {
            args: Prisma.OtpCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<OtpCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.OtpCodeCountArgs<ExtArgs>
            result: $Utils.Optional<OtpCodeCountAggregateOutputType> | number
          }
        }
      }
      UserAccount: {
        payload: Prisma.$UserAccountPayload<ExtArgs>
        fields: Prisma.UserAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          findFirst: {
            args: Prisma.UserAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          findMany: {
            args: Prisma.UserAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>[]
          }
          create: {
            args: Prisma.UserAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          createMany: {
            args: Prisma.UserAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>[]
          }
          delete: {
            args: Prisma.UserAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          update: {
            args: Prisma.UserAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          deleteMany: {
            args: Prisma.UserAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>[]
          }
          upsert: {
            args: Prisma.UserAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          aggregate: {
            args: Prisma.UserAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAccount>
          }
          groupBy: {
            args: Prisma.UserAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAccountCountArgs<ExtArgs>
            result: $Utils.Optional<UserAccountCountAggregateOutputType> | number
          }
        }
      }
      TransactionIntent: {
        payload: Prisma.$TransactionIntentPayload<ExtArgs>
        fields: Prisma.TransactionIntentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionIntentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionIntentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>
          }
          findFirst: {
            args: Prisma.TransactionIntentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionIntentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>
          }
          findMany: {
            args: Prisma.TransactionIntentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>[]
          }
          create: {
            args: Prisma.TransactionIntentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>
          }
          createMany: {
            args: Prisma.TransactionIntentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionIntentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>[]
          }
          delete: {
            args: Prisma.TransactionIntentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>
          }
          update: {
            args: Prisma.TransactionIntentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>
          }
          deleteMany: {
            args: Prisma.TransactionIntentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionIntentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionIntentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>[]
          }
          upsert: {
            args: Prisma.TransactionIntentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionIntentPayload>
          }
          aggregate: {
            args: Prisma.TransactionIntentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransactionIntent>
          }
          groupBy: {
            args: Prisma.TransactionIntentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionIntentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionIntentCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionIntentCountAggregateOutputType> | number
          }
        }
      }
      PaymentCallbackLog: {
        payload: Prisma.$PaymentCallbackLogPayload<ExtArgs>
        fields: Prisma.PaymentCallbackLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentCallbackLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentCallbackLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>
          }
          findFirst: {
            args: Prisma.PaymentCallbackLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentCallbackLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>
          }
          findMany: {
            args: Prisma.PaymentCallbackLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>[]
          }
          create: {
            args: Prisma.PaymentCallbackLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>
          }
          createMany: {
            args: Prisma.PaymentCallbackLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCallbackLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>[]
          }
          delete: {
            args: Prisma.PaymentCallbackLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>
          }
          update: {
            args: Prisma.PaymentCallbackLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>
          }
          deleteMany: {
            args: Prisma.PaymentCallbackLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentCallbackLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentCallbackLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>[]
          }
          upsert: {
            args: Prisma.PaymentCallbackLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCallbackLogPayload>
          }
          aggregate: {
            args: Prisma.PaymentCallbackLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentCallbackLog>
          }
          groupBy: {
            args: Prisma.PaymentCallbackLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentCallbackLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCallbackLogCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCallbackLogCountAggregateOutputType> | number
          }
        }
      }
      KycDocument: {
        payload: Prisma.$KycDocumentPayload<ExtArgs>
        fields: Prisma.KycDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KycDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KycDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>
          }
          findFirst: {
            args: Prisma.KycDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KycDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>
          }
          findMany: {
            args: Prisma.KycDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>[]
          }
          create: {
            args: Prisma.KycDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>
          }
          createMany: {
            args: Prisma.KycDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KycDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>[]
          }
          delete: {
            args: Prisma.KycDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>
          }
          update: {
            args: Prisma.KycDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>
          }
          deleteMany: {
            args: Prisma.KycDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KycDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KycDocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>[]
          }
          upsert: {
            args: Prisma.KycDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycDocumentPayload>
          }
          aggregate: {
            args: Prisma.KycDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKycDocument>
          }
          groupBy: {
            args: Prisma.KycDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<KycDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.KycDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<KycDocumentCountAggregateOutputType> | number
          }
        }
      }
      AdminUser: {
        payload: Prisma.$AdminUserPayload<ExtArgs>
        fields: Prisma.AdminUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          findFirst: {
            args: Prisma.AdminUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          findMany: {
            args: Prisma.AdminUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          create: {
            args: Prisma.AdminUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          createMany: {
            args: Prisma.AdminUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          delete: {
            args: Prisma.AdminUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          update: {
            args: Prisma.AdminUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          deleteMany: {
            args: Prisma.AdminUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          upsert: {
            args: Prisma.AdminUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          aggregate: {
            args: Prisma.AdminUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminUser>
          }
          groupBy: {
            args: Prisma.AdminUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminUserCountArgs<ExtArgs>
            result: $Utils.Optional<AdminUserCountAggregateOutputType> | number
          }
        }
      }
      RegistrationSession: {
        payload: Prisma.$RegistrationSessionPayload<ExtArgs>
        fields: Prisma.RegistrationSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RegistrationSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RegistrationSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>
          }
          findFirst: {
            args: Prisma.RegistrationSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RegistrationSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>
          }
          findMany: {
            args: Prisma.RegistrationSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>[]
          }
          create: {
            args: Prisma.RegistrationSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>
          }
          createMany: {
            args: Prisma.RegistrationSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RegistrationSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>[]
          }
          delete: {
            args: Prisma.RegistrationSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>
          }
          update: {
            args: Prisma.RegistrationSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>
          }
          deleteMany: {
            args: Prisma.RegistrationSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RegistrationSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RegistrationSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>[]
          }
          upsert: {
            args: Prisma.RegistrationSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationSessionPayload>
          }
          aggregate: {
            args: Prisma.RegistrationSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRegistrationSession>
          }
          groupBy: {
            args: Prisma.RegistrationSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RegistrationSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RegistrationSessionCountArgs<ExtArgs>
            result: $Utils.Optional<RegistrationSessionCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    otpCode?: OtpCodeOmit
    userAccount?: UserAccountOmit
    transactionIntent?: TransactionIntentOmit
    paymentCallbackLog?: PaymentCallbackLogOmit
    kycDocument?: KycDocumentOmit
    adminUser?: AdminUserOmit
    registrationSession?: RegistrationSessionOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    kycDocuments: number
    otpCodes: number
    sessions: number
    transactionIntents: number
    accounts: number
    notifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kycDocuments?: boolean | UserCountOutputTypeCountKycDocumentsArgs
    otpCodes?: boolean | UserCountOutputTypeCountOtpCodesArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    transactionIntents?: boolean | UserCountOutputTypeCountTransactionIntentsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountKycDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KycDocumentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOtpCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OtpCodeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionIntentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionIntentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type UserAccountCountOutputType
   */

  export type UserAccountCountOutputType = {
    transactionIntents: number
  }

  export type UserAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactionIntents?: boolean | UserAccountCountOutputTypeCountTransactionIntentsArgs
  }

  // Custom InputTypes
  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccountCountOutputType
     */
    select?: UserAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountTransactionIntentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionIntentWhereInput
  }


  /**
   * Count Type TransactionIntentCountOutputType
   */

  export type TransactionIntentCountOutputType = {
    paymentCallbacks: number
  }

  export type TransactionIntentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paymentCallbacks?: boolean | TransactionIntentCountOutputTypeCountPaymentCallbacksArgs
  }

  // Custom InputTypes
  /**
   * TransactionIntentCountOutputType without action
   */
  export type TransactionIntentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntentCountOutputType
     */
    select?: TransactionIntentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TransactionIntentCountOutputType without action
   */
  export type TransactionIntentCountOutputTypeCountPaymentCallbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentCallbackLogWhereInput
  }


  /**
   * Count Type RegistrationSessionCountOutputType
   */

  export type RegistrationSessionCountOutputType = {
    otpCodes: number
  }

  export type RegistrationSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    otpCodes?: boolean | RegistrationSessionCountOutputTypeCountOtpCodesArgs
  }

  // Custom InputTypes
  /**
   * RegistrationSessionCountOutputType without action
   */
  export type RegistrationSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSessionCountOutputType
     */
    select?: RegistrationSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RegistrationSessionCountOutputType without action
   */
  export type RegistrationSessionCountOutputTypeCountOtpCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OtpCodeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    dateOfBirth: Date | null
    nationality: string | null
    address: string | null
    city: string | null
    preferredLanguage: string | null
    emailVerified: boolean | null
    phoneVerified: boolean | null
    otpVerifiedAt: Date | null
    kycStatus: $Enums.KycStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    civilite: string | null
    country: string | null
    region: string | null
    department: string | null
    arrondissement: string | null
    district: string | null
    domaineActivite: string | null
    idExpiryDate: Date | null
    idIssueDate: Date | null
    idNumber: string | null
    idType: string | null
    marketingAccepted: boolean | null
    metiers: string | null
    placeOfBirth: string | null
    privacyAccepted: boolean | null
    signature: string | null
    statutEmploi: string | null
    termsAccepted: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    dateOfBirth: Date | null
    nationality: string | null
    address: string | null
    city: string | null
    preferredLanguage: string | null
    emailVerified: boolean | null
    phoneVerified: boolean | null
    otpVerifiedAt: Date | null
    kycStatus: $Enums.KycStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    civilite: string | null
    country: string | null
    region: string | null
    department: string | null
    arrondissement: string | null
    district: string | null
    domaineActivite: string | null
    idExpiryDate: Date | null
    idIssueDate: Date | null
    idNumber: string | null
    idType: string | null
    marketingAccepted: boolean | null
    metiers: string | null
    placeOfBirth: string | null
    privacyAccepted: boolean | null
    signature: string | null
    statutEmploi: string | null
    termsAccepted: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    phone: number
    passwordHash: number
    firstName: number
    lastName: number
    dateOfBirth: number
    nationality: number
    address: number
    city: number
    preferredLanguage: number
    emailVerified: number
    phoneVerified: number
    otpVerifiedAt: number
    kycStatus: number
    createdAt: number
    updatedAt: number
    civilite: number
    country: number
    region: number
    department: number
    arrondissement: number
    district: number
    domaineActivite: number
    idExpiryDate: number
    idIssueDate: number
    idNumber: number
    idType: number
    marketingAccepted: number
    metiers: number
    placeOfBirth: number
    privacyAccepted: number
    signature: number
    statutEmploi: number
    termsAccepted: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    dateOfBirth?: true
    nationality?: true
    address?: true
    city?: true
    preferredLanguage?: true
    emailVerified?: true
    phoneVerified?: true
    otpVerifiedAt?: true
    kycStatus?: true
    createdAt?: true
    updatedAt?: true
    civilite?: true
    country?: true
    region?: true
    department?: true
    arrondissement?: true
    district?: true
    domaineActivite?: true
    idExpiryDate?: true
    idIssueDate?: true
    idNumber?: true
    idType?: true
    marketingAccepted?: true
    metiers?: true
    placeOfBirth?: true
    privacyAccepted?: true
    signature?: true
    statutEmploi?: true
    termsAccepted?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    dateOfBirth?: true
    nationality?: true
    address?: true
    city?: true
    preferredLanguage?: true
    emailVerified?: true
    phoneVerified?: true
    otpVerifiedAt?: true
    kycStatus?: true
    createdAt?: true
    updatedAt?: true
    civilite?: true
    country?: true
    region?: true
    department?: true
    arrondissement?: true
    district?: true
    domaineActivite?: true
    idExpiryDate?: true
    idIssueDate?: true
    idNumber?: true
    idType?: true
    marketingAccepted?: true
    metiers?: true
    placeOfBirth?: true
    privacyAccepted?: true
    signature?: true
    statutEmploi?: true
    termsAccepted?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    dateOfBirth?: true
    nationality?: true
    address?: true
    city?: true
    preferredLanguage?: true
    emailVerified?: true
    phoneVerified?: true
    otpVerifiedAt?: true
    kycStatus?: true
    createdAt?: true
    updatedAt?: true
    civilite?: true
    country?: true
    region?: true
    department?: true
    arrondissement?: true
    district?: true
    domaineActivite?: true
    idExpiryDate?: true
    idIssueDate?: true
    idNumber?: true
    idType?: true
    marketingAccepted?: true
    metiers?: true
    placeOfBirth?: true
    privacyAccepted?: true
    signature?: true
    statutEmploi?: true
    termsAccepted?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    phone: string
    passwordHash: string | null
    firstName: string
    lastName: string
    dateOfBirth: Date | null
    nationality: string | null
    address: string | null
    city: string | null
    preferredLanguage: string
    emailVerified: boolean
    phoneVerified: boolean
    otpVerifiedAt: Date | null
    kycStatus: $Enums.KycStatus
    createdAt: Date
    updatedAt: Date
    civilite: string | null
    country: string | null
    region: string | null
    department: string | null
    arrondissement: string | null
    district: string | null
    domaineActivite: string | null
    idExpiryDate: Date | null
    idIssueDate: Date | null
    idNumber: string | null
    idType: string | null
    marketingAccepted: boolean
    metiers: string | null
    placeOfBirth: string | null
    privacyAccepted: boolean
    signature: string | null
    statutEmploi: string | null
    termsAccepted: boolean
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    address?: boolean
    city?: boolean
    preferredLanguage?: boolean
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: boolean
    kycStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    civilite?: boolean
    country?: boolean
    region?: boolean
    department?: boolean
    arrondissement?: boolean
    district?: boolean
    domaineActivite?: boolean
    idExpiryDate?: boolean
    idIssueDate?: boolean
    idNumber?: boolean
    idType?: boolean
    marketingAccepted?: boolean
    metiers?: boolean
    placeOfBirth?: boolean
    privacyAccepted?: boolean
    signature?: boolean
    statutEmploi?: boolean
    termsAccepted?: boolean
    kycDocuments?: boolean | User$kycDocumentsArgs<ExtArgs>
    otpCodes?: boolean | User$otpCodesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    transactionIntents?: boolean | User$transactionIntentsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    address?: boolean
    city?: boolean
    preferredLanguage?: boolean
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: boolean
    kycStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    civilite?: boolean
    country?: boolean
    region?: boolean
    department?: boolean
    arrondissement?: boolean
    district?: boolean
    domaineActivite?: boolean
    idExpiryDate?: boolean
    idIssueDate?: boolean
    idNumber?: boolean
    idType?: boolean
    marketingAccepted?: boolean
    metiers?: boolean
    placeOfBirth?: boolean
    privacyAccepted?: boolean
    signature?: boolean
    statutEmploi?: boolean
    termsAccepted?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    address?: boolean
    city?: boolean
    preferredLanguage?: boolean
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: boolean
    kycStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    civilite?: boolean
    country?: boolean
    region?: boolean
    department?: boolean
    arrondissement?: boolean
    district?: boolean
    domaineActivite?: boolean
    idExpiryDate?: boolean
    idIssueDate?: boolean
    idNumber?: boolean
    idType?: boolean
    marketingAccepted?: boolean
    metiers?: boolean
    placeOfBirth?: boolean
    privacyAccepted?: boolean
    signature?: boolean
    statutEmploi?: boolean
    termsAccepted?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    address?: boolean
    city?: boolean
    preferredLanguage?: boolean
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: boolean
    kycStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    civilite?: boolean
    country?: boolean
    region?: boolean
    department?: boolean
    arrondissement?: boolean
    district?: boolean
    domaineActivite?: boolean
    idExpiryDate?: boolean
    idIssueDate?: boolean
    idNumber?: boolean
    idType?: boolean
    marketingAccepted?: boolean
    metiers?: boolean
    placeOfBirth?: boolean
    privacyAccepted?: boolean
    signature?: boolean
    statutEmploi?: boolean
    termsAccepted?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "phone" | "passwordHash" | "firstName" | "lastName" | "dateOfBirth" | "nationality" | "address" | "city" | "preferredLanguage" | "emailVerified" | "phoneVerified" | "otpVerifiedAt" | "kycStatus" | "createdAt" | "updatedAt" | "civilite" | "country" | "region" | "department" | "arrondissement" | "district" | "domaineActivite" | "idExpiryDate" | "idIssueDate" | "idNumber" | "idType" | "marketingAccepted" | "metiers" | "placeOfBirth" | "privacyAccepted" | "signature" | "statutEmploi" | "termsAccepted", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kycDocuments?: boolean | User$kycDocumentsArgs<ExtArgs>
    otpCodes?: boolean | User$otpCodesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    transactionIntents?: boolean | User$transactionIntentsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      kycDocuments: Prisma.$KycDocumentPayload<ExtArgs>[]
      otpCodes: Prisma.$OtpCodePayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      transactionIntents: Prisma.$TransactionIntentPayload<ExtArgs>[]
      accounts: Prisma.$UserAccountPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      phone: string
      passwordHash: string | null
      firstName: string
      lastName: string
      dateOfBirth: Date | null
      nationality: string | null
      address: string | null
      city: string | null
      preferredLanguage: string
      emailVerified: boolean
      phoneVerified: boolean
      otpVerifiedAt: Date | null
      kycStatus: $Enums.KycStatus
      createdAt: Date
      updatedAt: Date
      civilite: string | null
      country: string | null
      region: string | null
      department: string | null
      arrondissement: string | null
      district: string | null
      domaineActivite: string | null
      idExpiryDate: Date | null
      idIssueDate: Date | null
      idNumber: string | null
      idType: string | null
      marketingAccepted: boolean
      metiers: string | null
      placeOfBirth: string | null
      privacyAccepted: boolean
      signature: string | null
      statutEmploi: string | null
      termsAccepted: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kycDocuments<T extends User$kycDocumentsArgs<ExtArgs> = {}>(args?: Subset<T, User$kycDocumentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    otpCodes<T extends User$otpCodesArgs<ExtArgs> = {}>(args?: Subset<T, User$otpCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionIntents<T extends User$transactionIntentsArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionIntentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly dateOfBirth: FieldRef<"User", 'DateTime'>
    readonly nationality: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly city: FieldRef<"User", 'String'>
    readonly preferredLanguage: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly phoneVerified: FieldRef<"User", 'Boolean'>
    readonly otpVerifiedAt: FieldRef<"User", 'DateTime'>
    readonly kycStatus: FieldRef<"User", 'KycStatus'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly civilite: FieldRef<"User", 'String'>
    readonly country: FieldRef<"User", 'String'>
    readonly region: FieldRef<"User", 'String'>
    readonly department: FieldRef<"User", 'String'>
    readonly arrondissement: FieldRef<"User", 'String'>
    readonly district: FieldRef<"User", 'String'>
    readonly domaineActivite: FieldRef<"User", 'String'>
    readonly idExpiryDate: FieldRef<"User", 'DateTime'>
    readonly idIssueDate: FieldRef<"User", 'DateTime'>
    readonly idNumber: FieldRef<"User", 'String'>
    readonly idType: FieldRef<"User", 'String'>
    readonly marketingAccepted: FieldRef<"User", 'Boolean'>
    readonly metiers: FieldRef<"User", 'String'>
    readonly placeOfBirth: FieldRef<"User", 'String'>
    readonly privacyAccepted: FieldRef<"User", 'Boolean'>
    readonly signature: FieldRef<"User", 'String'>
    readonly statutEmploi: FieldRef<"User", 'String'>
    readonly termsAccepted: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.kycDocuments
   */
  export type User$kycDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    where?: KycDocumentWhereInput
    orderBy?: KycDocumentOrderByWithRelationInput | KycDocumentOrderByWithRelationInput[]
    cursor?: KycDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KycDocumentScalarFieldEnum | KycDocumentScalarFieldEnum[]
  }

  /**
   * User.otpCodes
   */
  export type User$otpCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    where?: OtpCodeWhereInput
    orderBy?: OtpCodeOrderByWithRelationInput | OtpCodeOrderByWithRelationInput[]
    cursor?: OtpCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OtpCodeScalarFieldEnum | OtpCodeScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.transactionIntents
   */
  export type User$transactionIntentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    where?: TransactionIntentWhereInput
    orderBy?: TransactionIntentOrderByWithRelationInput | TransactionIntentOrderByWithRelationInput[]
    cursor?: TransactionIntentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionIntentScalarFieldEnum | TransactionIntentScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    where?: UserAccountWhereInput
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    cursor?: UserAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    createdAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    createdAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires" | "createdAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
      createdAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model OtpCode
   */

  export type AggregateOtpCode = {
    _count: OtpCodeCountAggregateOutputType | null
    _min: OtpCodeMinAggregateOutputType | null
    _max: OtpCodeMaxAggregateOutputType | null
  }

  export type OtpCodeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    registrationSessionId: string | null
    code: string | null
    type: $Enums.OtpType | null
    expiresAt: Date | null
    used: boolean | null
    createdAt: Date | null
  }

  export type OtpCodeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    registrationSessionId: string | null
    code: string | null
    type: $Enums.OtpType | null
    expiresAt: Date | null
    used: boolean | null
    createdAt: Date | null
  }

  export type OtpCodeCountAggregateOutputType = {
    id: number
    userId: number
    registrationSessionId: number
    code: number
    type: number
    expiresAt: number
    used: number
    createdAt: number
    _all: number
  }


  export type OtpCodeMinAggregateInputType = {
    id?: true
    userId?: true
    registrationSessionId?: true
    code?: true
    type?: true
    expiresAt?: true
    used?: true
    createdAt?: true
  }

  export type OtpCodeMaxAggregateInputType = {
    id?: true
    userId?: true
    registrationSessionId?: true
    code?: true
    type?: true
    expiresAt?: true
    used?: true
    createdAt?: true
  }

  export type OtpCodeCountAggregateInputType = {
    id?: true
    userId?: true
    registrationSessionId?: true
    code?: true
    type?: true
    expiresAt?: true
    used?: true
    createdAt?: true
    _all?: true
  }

  export type OtpCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OtpCode to aggregate.
     */
    where?: OtpCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OtpCodes to fetch.
     */
    orderBy?: OtpCodeOrderByWithRelationInput | OtpCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OtpCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OtpCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OtpCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OtpCodes
    **/
    _count?: true | OtpCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OtpCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OtpCodeMaxAggregateInputType
  }

  export type GetOtpCodeAggregateType<T extends OtpCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateOtpCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOtpCode[P]>
      : GetScalarType<T[P], AggregateOtpCode[P]>
  }




  export type OtpCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OtpCodeWhereInput
    orderBy?: OtpCodeOrderByWithAggregationInput | OtpCodeOrderByWithAggregationInput[]
    by: OtpCodeScalarFieldEnum[] | OtpCodeScalarFieldEnum
    having?: OtpCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OtpCodeCountAggregateInputType | true
    _min?: OtpCodeMinAggregateInputType
    _max?: OtpCodeMaxAggregateInputType
  }

  export type OtpCodeGroupByOutputType = {
    id: string
    userId: string | null
    registrationSessionId: string | null
    code: string
    type: $Enums.OtpType
    expiresAt: Date
    used: boolean
    createdAt: Date
    _count: OtpCodeCountAggregateOutputType | null
    _min: OtpCodeMinAggregateOutputType | null
    _max: OtpCodeMaxAggregateOutputType | null
  }

  type GetOtpCodeGroupByPayload<T extends OtpCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OtpCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OtpCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OtpCodeGroupByOutputType[P]>
            : GetScalarType<T[P], OtpCodeGroupByOutputType[P]>
        }
      >
    >


  export type OtpCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    registrationSessionId?: boolean
    code?: boolean
    type?: boolean
    expiresAt?: boolean
    used?: boolean
    createdAt?: boolean
    user?: boolean | OtpCode$userArgs<ExtArgs>
    registrationSession?: boolean | OtpCode$registrationSessionArgs<ExtArgs>
  }, ExtArgs["result"]["otpCode"]>

  export type OtpCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    registrationSessionId?: boolean
    code?: boolean
    type?: boolean
    expiresAt?: boolean
    used?: boolean
    createdAt?: boolean
    user?: boolean | OtpCode$userArgs<ExtArgs>
    registrationSession?: boolean | OtpCode$registrationSessionArgs<ExtArgs>
  }, ExtArgs["result"]["otpCode"]>

  export type OtpCodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    registrationSessionId?: boolean
    code?: boolean
    type?: boolean
    expiresAt?: boolean
    used?: boolean
    createdAt?: boolean
    user?: boolean | OtpCode$userArgs<ExtArgs>
    registrationSession?: boolean | OtpCode$registrationSessionArgs<ExtArgs>
  }, ExtArgs["result"]["otpCode"]>

  export type OtpCodeSelectScalar = {
    id?: boolean
    userId?: boolean
    registrationSessionId?: boolean
    code?: boolean
    type?: boolean
    expiresAt?: boolean
    used?: boolean
    createdAt?: boolean
  }

  export type OtpCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "registrationSessionId" | "code" | "type" | "expiresAt" | "used" | "createdAt", ExtArgs["result"]["otpCode"]>
  export type OtpCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | OtpCode$userArgs<ExtArgs>
    registrationSession?: boolean | OtpCode$registrationSessionArgs<ExtArgs>
  }
  export type OtpCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | OtpCode$userArgs<ExtArgs>
    registrationSession?: boolean | OtpCode$registrationSessionArgs<ExtArgs>
  }
  export type OtpCodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | OtpCode$userArgs<ExtArgs>
    registrationSession?: boolean | OtpCode$registrationSessionArgs<ExtArgs>
  }

  export type $OtpCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OtpCode"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      registrationSession: Prisma.$RegistrationSessionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      registrationSessionId: string | null
      code: string
      type: $Enums.OtpType
      expiresAt: Date
      used: boolean
      createdAt: Date
    }, ExtArgs["result"]["otpCode"]>
    composites: {}
  }

  type OtpCodeGetPayload<S extends boolean | null | undefined | OtpCodeDefaultArgs> = $Result.GetResult<Prisma.$OtpCodePayload, S>

  type OtpCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OtpCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OtpCodeCountAggregateInputType | true
    }

  export interface OtpCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OtpCode'], meta: { name: 'OtpCode' } }
    /**
     * Find zero or one OtpCode that matches the filter.
     * @param {OtpCodeFindUniqueArgs} args - Arguments to find a OtpCode
     * @example
     * // Get one OtpCode
     * const otpCode = await prisma.otpCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OtpCodeFindUniqueArgs>(args: SelectSubset<T, OtpCodeFindUniqueArgs<ExtArgs>>): Prisma__OtpCodeClient<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OtpCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OtpCodeFindUniqueOrThrowArgs} args - Arguments to find a OtpCode
     * @example
     * // Get one OtpCode
     * const otpCode = await prisma.otpCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OtpCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, OtpCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OtpCodeClient<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OtpCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpCodeFindFirstArgs} args - Arguments to find a OtpCode
     * @example
     * // Get one OtpCode
     * const otpCode = await prisma.otpCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OtpCodeFindFirstArgs>(args?: SelectSubset<T, OtpCodeFindFirstArgs<ExtArgs>>): Prisma__OtpCodeClient<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OtpCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpCodeFindFirstOrThrowArgs} args - Arguments to find a OtpCode
     * @example
     * // Get one OtpCode
     * const otpCode = await prisma.otpCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OtpCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, OtpCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__OtpCodeClient<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OtpCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OtpCodes
     * const otpCodes = await prisma.otpCode.findMany()
     * 
     * // Get first 10 OtpCodes
     * const otpCodes = await prisma.otpCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const otpCodeWithIdOnly = await prisma.otpCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OtpCodeFindManyArgs>(args?: SelectSubset<T, OtpCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OtpCode.
     * @param {OtpCodeCreateArgs} args - Arguments to create a OtpCode.
     * @example
     * // Create one OtpCode
     * const OtpCode = await prisma.otpCode.create({
     *   data: {
     *     // ... data to create a OtpCode
     *   }
     * })
     * 
     */
    create<T extends OtpCodeCreateArgs>(args: SelectSubset<T, OtpCodeCreateArgs<ExtArgs>>): Prisma__OtpCodeClient<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OtpCodes.
     * @param {OtpCodeCreateManyArgs} args - Arguments to create many OtpCodes.
     * @example
     * // Create many OtpCodes
     * const otpCode = await prisma.otpCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OtpCodeCreateManyArgs>(args?: SelectSubset<T, OtpCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OtpCodes and returns the data saved in the database.
     * @param {OtpCodeCreateManyAndReturnArgs} args - Arguments to create many OtpCodes.
     * @example
     * // Create many OtpCodes
     * const otpCode = await prisma.otpCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OtpCodes and only return the `id`
     * const otpCodeWithIdOnly = await prisma.otpCode.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OtpCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, OtpCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OtpCode.
     * @param {OtpCodeDeleteArgs} args - Arguments to delete one OtpCode.
     * @example
     * // Delete one OtpCode
     * const OtpCode = await prisma.otpCode.delete({
     *   where: {
     *     // ... filter to delete one OtpCode
     *   }
     * })
     * 
     */
    delete<T extends OtpCodeDeleteArgs>(args: SelectSubset<T, OtpCodeDeleteArgs<ExtArgs>>): Prisma__OtpCodeClient<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OtpCode.
     * @param {OtpCodeUpdateArgs} args - Arguments to update one OtpCode.
     * @example
     * // Update one OtpCode
     * const otpCode = await prisma.otpCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OtpCodeUpdateArgs>(args: SelectSubset<T, OtpCodeUpdateArgs<ExtArgs>>): Prisma__OtpCodeClient<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OtpCodes.
     * @param {OtpCodeDeleteManyArgs} args - Arguments to filter OtpCodes to delete.
     * @example
     * // Delete a few OtpCodes
     * const { count } = await prisma.otpCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OtpCodeDeleteManyArgs>(args?: SelectSubset<T, OtpCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OtpCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OtpCodes
     * const otpCode = await prisma.otpCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OtpCodeUpdateManyArgs>(args: SelectSubset<T, OtpCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OtpCodes and returns the data updated in the database.
     * @param {OtpCodeUpdateManyAndReturnArgs} args - Arguments to update many OtpCodes.
     * @example
     * // Update many OtpCodes
     * const otpCode = await prisma.otpCode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OtpCodes and only return the `id`
     * const otpCodeWithIdOnly = await prisma.otpCode.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OtpCodeUpdateManyAndReturnArgs>(args: SelectSubset<T, OtpCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OtpCode.
     * @param {OtpCodeUpsertArgs} args - Arguments to update or create a OtpCode.
     * @example
     * // Update or create a OtpCode
     * const otpCode = await prisma.otpCode.upsert({
     *   create: {
     *     // ... data to create a OtpCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OtpCode we want to update
     *   }
     * })
     */
    upsert<T extends OtpCodeUpsertArgs>(args: SelectSubset<T, OtpCodeUpsertArgs<ExtArgs>>): Prisma__OtpCodeClient<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OtpCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpCodeCountArgs} args - Arguments to filter OtpCodes to count.
     * @example
     * // Count the number of OtpCodes
     * const count = await prisma.otpCode.count({
     *   where: {
     *     // ... the filter for the OtpCodes we want to count
     *   }
     * })
    **/
    count<T extends OtpCodeCountArgs>(
      args?: Subset<T, OtpCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OtpCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OtpCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OtpCodeAggregateArgs>(args: Subset<T, OtpCodeAggregateArgs>): Prisma.PrismaPromise<GetOtpCodeAggregateType<T>>

    /**
     * Group by OtpCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OtpCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OtpCodeGroupByArgs['orderBy'] }
        : { orderBy?: OtpCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OtpCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOtpCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OtpCode model
   */
  readonly fields: OtpCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OtpCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OtpCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends OtpCode$userArgs<ExtArgs> = {}>(args?: Subset<T, OtpCode$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    registrationSession<T extends OtpCode$registrationSessionArgs<ExtArgs> = {}>(args?: Subset<T, OtpCode$registrationSessionArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OtpCode model
   */
  interface OtpCodeFieldRefs {
    readonly id: FieldRef<"OtpCode", 'String'>
    readonly userId: FieldRef<"OtpCode", 'String'>
    readonly registrationSessionId: FieldRef<"OtpCode", 'String'>
    readonly code: FieldRef<"OtpCode", 'String'>
    readonly type: FieldRef<"OtpCode", 'OtpType'>
    readonly expiresAt: FieldRef<"OtpCode", 'DateTime'>
    readonly used: FieldRef<"OtpCode", 'Boolean'>
    readonly createdAt: FieldRef<"OtpCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OtpCode findUnique
   */
  export type OtpCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * Filter, which OtpCode to fetch.
     */
    where: OtpCodeWhereUniqueInput
  }

  /**
   * OtpCode findUniqueOrThrow
   */
  export type OtpCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * Filter, which OtpCode to fetch.
     */
    where: OtpCodeWhereUniqueInput
  }

  /**
   * OtpCode findFirst
   */
  export type OtpCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * Filter, which OtpCode to fetch.
     */
    where?: OtpCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OtpCodes to fetch.
     */
    orderBy?: OtpCodeOrderByWithRelationInput | OtpCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OtpCodes.
     */
    cursor?: OtpCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OtpCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OtpCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OtpCodes.
     */
    distinct?: OtpCodeScalarFieldEnum | OtpCodeScalarFieldEnum[]
  }

  /**
   * OtpCode findFirstOrThrow
   */
  export type OtpCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * Filter, which OtpCode to fetch.
     */
    where?: OtpCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OtpCodes to fetch.
     */
    orderBy?: OtpCodeOrderByWithRelationInput | OtpCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OtpCodes.
     */
    cursor?: OtpCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OtpCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OtpCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OtpCodes.
     */
    distinct?: OtpCodeScalarFieldEnum | OtpCodeScalarFieldEnum[]
  }

  /**
   * OtpCode findMany
   */
  export type OtpCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * Filter, which OtpCodes to fetch.
     */
    where?: OtpCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OtpCodes to fetch.
     */
    orderBy?: OtpCodeOrderByWithRelationInput | OtpCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OtpCodes.
     */
    cursor?: OtpCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OtpCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OtpCodes.
     */
    skip?: number
    distinct?: OtpCodeScalarFieldEnum | OtpCodeScalarFieldEnum[]
  }

  /**
   * OtpCode create
   */
  export type OtpCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a OtpCode.
     */
    data: XOR<OtpCodeCreateInput, OtpCodeUncheckedCreateInput>
  }

  /**
   * OtpCode createMany
   */
  export type OtpCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OtpCodes.
     */
    data: OtpCodeCreateManyInput | OtpCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OtpCode createManyAndReturn
   */
  export type OtpCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * The data used to create many OtpCodes.
     */
    data: OtpCodeCreateManyInput | OtpCodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OtpCode update
   */
  export type OtpCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a OtpCode.
     */
    data: XOR<OtpCodeUpdateInput, OtpCodeUncheckedUpdateInput>
    /**
     * Choose, which OtpCode to update.
     */
    where: OtpCodeWhereUniqueInput
  }

  /**
   * OtpCode updateMany
   */
  export type OtpCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OtpCodes.
     */
    data: XOR<OtpCodeUpdateManyMutationInput, OtpCodeUncheckedUpdateManyInput>
    /**
     * Filter which OtpCodes to update
     */
    where?: OtpCodeWhereInput
    /**
     * Limit how many OtpCodes to update.
     */
    limit?: number
  }

  /**
   * OtpCode updateManyAndReturn
   */
  export type OtpCodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * The data used to update OtpCodes.
     */
    data: XOR<OtpCodeUpdateManyMutationInput, OtpCodeUncheckedUpdateManyInput>
    /**
     * Filter which OtpCodes to update
     */
    where?: OtpCodeWhereInput
    /**
     * Limit how many OtpCodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OtpCode upsert
   */
  export type OtpCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the OtpCode to update in case it exists.
     */
    where: OtpCodeWhereUniqueInput
    /**
     * In case the OtpCode found by the `where` argument doesn't exist, create a new OtpCode with this data.
     */
    create: XOR<OtpCodeCreateInput, OtpCodeUncheckedCreateInput>
    /**
     * In case the OtpCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OtpCodeUpdateInput, OtpCodeUncheckedUpdateInput>
  }

  /**
   * OtpCode delete
   */
  export type OtpCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    /**
     * Filter which OtpCode to delete.
     */
    where: OtpCodeWhereUniqueInput
  }

  /**
   * OtpCode deleteMany
   */
  export type OtpCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OtpCodes to delete
     */
    where?: OtpCodeWhereInput
    /**
     * Limit how many OtpCodes to delete.
     */
    limit?: number
  }

  /**
   * OtpCode.user
   */
  export type OtpCode$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * OtpCode.registrationSession
   */
  export type OtpCode$registrationSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    where?: RegistrationSessionWhereInput
  }

  /**
   * OtpCode without action
   */
  export type OtpCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
  }


  /**
   * Model UserAccount
   */

  export type AggregateUserAccount = {
    _count: UserAccountCountAggregateOutputType | null
    _avg: UserAccountAvgAggregateOutputType | null
    _sum: UserAccountSumAggregateOutputType | null
    _min: UserAccountMinAggregateOutputType | null
    _max: UserAccountMaxAggregateOutputType | null
  }

  export type UserAccountAvgAggregateOutputType = {
    interestRate: Decimal | null
    lockPeriodMonths: number | null
    balance: Decimal | null
  }

  export type UserAccountSumAggregateOutputType = {
    interestRate: Decimal | null
    lockPeriodMonths: number | null
    balance: Decimal | null
  }

  export type UserAccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    accountType: $Enums.AccountType | null
    accountNumber: string | null
    productCode: string | null
    productName: string | null
    interestRate: Decimal | null
    lockPeriodMonths: number | null
    lockedUntil: Date | null
    allowAdditionalDeposits: boolean | null
    balance: Decimal | null
    status: $Enums.AccountStatus | null
    createdAt: Date | null
  }

  export type UserAccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    accountType: $Enums.AccountType | null
    accountNumber: string | null
    productCode: string | null
    productName: string | null
    interestRate: Decimal | null
    lockPeriodMonths: number | null
    lockedUntil: Date | null
    allowAdditionalDeposits: boolean | null
    balance: Decimal | null
    status: $Enums.AccountStatus | null
    createdAt: Date | null
  }

  export type UserAccountCountAggregateOutputType = {
    id: number
    userId: number
    accountType: number
    accountNumber: number
    productCode: number
    productName: number
    interestRate: number
    lockPeriodMonths: number
    lockedUntil: number
    allowAdditionalDeposits: number
    metadata: number
    balance: number
    status: number
    createdAt: number
    _all: number
  }


  export type UserAccountAvgAggregateInputType = {
    interestRate?: true
    lockPeriodMonths?: true
    balance?: true
  }

  export type UserAccountSumAggregateInputType = {
    interestRate?: true
    lockPeriodMonths?: true
    balance?: true
  }

  export type UserAccountMinAggregateInputType = {
    id?: true
    userId?: true
    accountType?: true
    accountNumber?: true
    productCode?: true
    productName?: true
    interestRate?: true
    lockPeriodMonths?: true
    lockedUntil?: true
    allowAdditionalDeposits?: true
    balance?: true
    status?: true
    createdAt?: true
  }

  export type UserAccountMaxAggregateInputType = {
    id?: true
    userId?: true
    accountType?: true
    accountNumber?: true
    productCode?: true
    productName?: true
    interestRate?: true
    lockPeriodMonths?: true
    lockedUntil?: true
    allowAdditionalDeposits?: true
    balance?: true
    status?: true
    createdAt?: true
  }

  export type UserAccountCountAggregateInputType = {
    id?: true
    userId?: true
    accountType?: true
    accountNumber?: true
    productCode?: true
    productName?: true
    interestRate?: true
    lockPeriodMonths?: true
    lockedUntil?: true
    allowAdditionalDeposits?: true
    metadata?: true
    balance?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type UserAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAccount to aggregate.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAccounts
    **/
    _count?: true | UserAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAccountMaxAggregateInputType
  }

  export type GetUserAccountAggregateType<T extends UserAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAccount[P]>
      : GetScalarType<T[P], AggregateUserAccount[P]>
  }




  export type UserAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAccountWhereInput
    orderBy?: UserAccountOrderByWithAggregationInput | UserAccountOrderByWithAggregationInput[]
    by: UserAccountScalarFieldEnum[] | UserAccountScalarFieldEnum
    having?: UserAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAccountCountAggregateInputType | true
    _avg?: UserAccountAvgAggregateInputType
    _sum?: UserAccountSumAggregateInputType
    _min?: UserAccountMinAggregateInputType
    _max?: UserAccountMaxAggregateInputType
  }

  export type UserAccountGroupByOutputType = {
    id: string
    userId: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode: string | null
    productName: string | null
    interestRate: Decimal | null
    lockPeriodMonths: number | null
    lockedUntil: Date | null
    allowAdditionalDeposits: boolean
    metadata: JsonValue | null
    balance: Decimal
    status: $Enums.AccountStatus
    createdAt: Date
    _count: UserAccountCountAggregateOutputType | null
    _avg: UserAccountAvgAggregateOutputType | null
    _sum: UserAccountSumAggregateOutputType | null
    _min: UserAccountMinAggregateOutputType | null
    _max: UserAccountMaxAggregateOutputType | null
  }

  type GetUserAccountGroupByPayload<T extends UserAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAccountGroupByOutputType[P]>
            : GetScalarType<T[P], UserAccountGroupByOutputType[P]>
        }
      >
    >


  export type UserAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accountType?: boolean
    accountNumber?: boolean
    productCode?: boolean
    productName?: boolean
    interestRate?: boolean
    lockPeriodMonths?: boolean
    lockedUntil?: boolean
    allowAdditionalDeposits?: boolean
    metadata?: boolean
    balance?: boolean
    status?: boolean
    createdAt?: boolean
    transactionIntents?: boolean | UserAccount$transactionIntentsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | UserAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accountType?: boolean
    accountNumber?: boolean
    productCode?: boolean
    productName?: boolean
    interestRate?: boolean
    lockPeriodMonths?: boolean
    lockedUntil?: boolean
    allowAdditionalDeposits?: boolean
    metadata?: boolean
    balance?: boolean
    status?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accountType?: boolean
    accountNumber?: boolean
    productCode?: boolean
    productName?: boolean
    interestRate?: boolean
    lockPeriodMonths?: boolean
    lockedUntil?: boolean
    allowAdditionalDeposits?: boolean
    metadata?: boolean
    balance?: boolean
    status?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectScalar = {
    id?: boolean
    userId?: boolean
    accountType?: boolean
    accountNumber?: boolean
    productCode?: boolean
    productName?: boolean
    interestRate?: boolean
    lockPeriodMonths?: boolean
    lockedUntil?: boolean
    allowAdditionalDeposits?: boolean
    metadata?: boolean
    balance?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type UserAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "accountType" | "accountNumber" | "productCode" | "productName" | "interestRate" | "lockPeriodMonths" | "lockedUntil" | "allowAdditionalDeposits" | "metadata" | "balance" | "status" | "createdAt", ExtArgs["result"]["userAccount"]>
  export type UserAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactionIntents?: boolean | UserAccount$transactionIntentsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | UserAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAccount"
    objects: {
      transactionIntents: Prisma.$TransactionIntentPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      accountType: $Enums.AccountType
      accountNumber: string
      productCode: string | null
      productName: string | null
      interestRate: Prisma.Decimal | null
      lockPeriodMonths: number | null
      lockedUntil: Date | null
      allowAdditionalDeposits: boolean
      metadata: Prisma.JsonValue | null
      balance: Prisma.Decimal
      status: $Enums.AccountStatus
      createdAt: Date
    }, ExtArgs["result"]["userAccount"]>
    composites: {}
  }

  type UserAccountGetPayload<S extends boolean | null | undefined | UserAccountDefaultArgs> = $Result.GetResult<Prisma.$UserAccountPayload, S>

  type UserAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserAccountCountAggregateInputType | true
    }

  export interface UserAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAccount'], meta: { name: 'UserAccount' } }
    /**
     * Find zero or one UserAccount that matches the filter.
     * @param {UserAccountFindUniqueArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAccountFindUniqueArgs>(args: SelectSubset<T, UserAccountFindUniqueArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAccountFindUniqueOrThrowArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindFirstArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAccountFindFirstArgs>(args?: SelectSubset<T, UserAccountFindFirstArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindFirstOrThrowArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAccounts
     * const userAccounts = await prisma.userAccount.findMany()
     * 
     * // Get first 10 UserAccounts
     * const userAccounts = await prisma.userAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userAccountWithIdOnly = await prisma.userAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserAccountFindManyArgs>(args?: SelectSubset<T, UserAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserAccount.
     * @param {UserAccountCreateArgs} args - Arguments to create a UserAccount.
     * @example
     * // Create one UserAccount
     * const UserAccount = await prisma.userAccount.create({
     *   data: {
     *     // ... data to create a UserAccount
     *   }
     * })
     * 
     */
    create<T extends UserAccountCreateArgs>(args: SelectSubset<T, UserAccountCreateArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserAccounts.
     * @param {UserAccountCreateManyArgs} args - Arguments to create many UserAccounts.
     * @example
     * // Create many UserAccounts
     * const userAccount = await prisma.userAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAccountCreateManyArgs>(args?: SelectSubset<T, UserAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAccounts and returns the data saved in the database.
     * @param {UserAccountCreateManyAndReturnArgs} args - Arguments to create many UserAccounts.
     * @example
     * // Create many UserAccounts
     * const userAccount = await prisma.userAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAccounts and only return the `id`
     * const userAccountWithIdOnly = await prisma.userAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserAccount.
     * @param {UserAccountDeleteArgs} args - Arguments to delete one UserAccount.
     * @example
     * // Delete one UserAccount
     * const UserAccount = await prisma.userAccount.delete({
     *   where: {
     *     // ... filter to delete one UserAccount
     *   }
     * })
     * 
     */
    delete<T extends UserAccountDeleteArgs>(args: SelectSubset<T, UserAccountDeleteArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserAccount.
     * @param {UserAccountUpdateArgs} args - Arguments to update one UserAccount.
     * @example
     * // Update one UserAccount
     * const userAccount = await prisma.userAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAccountUpdateArgs>(args: SelectSubset<T, UserAccountUpdateArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserAccounts.
     * @param {UserAccountDeleteManyArgs} args - Arguments to filter UserAccounts to delete.
     * @example
     * // Delete a few UserAccounts
     * const { count } = await prisma.userAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAccountDeleteManyArgs>(args?: SelectSubset<T, UserAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAccounts
     * const userAccount = await prisma.userAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAccountUpdateManyArgs>(args: SelectSubset<T, UserAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAccounts and returns the data updated in the database.
     * @param {UserAccountUpdateManyAndReturnArgs} args - Arguments to update many UserAccounts.
     * @example
     * // Update many UserAccounts
     * const userAccount = await prisma.userAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserAccounts and only return the `id`
     * const userAccountWithIdOnly = await prisma.userAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, UserAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserAccount.
     * @param {UserAccountUpsertArgs} args - Arguments to update or create a UserAccount.
     * @example
     * // Update or create a UserAccount
     * const userAccount = await prisma.userAccount.upsert({
     *   create: {
     *     // ... data to create a UserAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAccount we want to update
     *   }
     * })
     */
    upsert<T extends UserAccountUpsertArgs>(args: SelectSubset<T, UserAccountUpsertArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountCountArgs} args - Arguments to filter UserAccounts to count.
     * @example
     * // Count the number of UserAccounts
     * const count = await prisma.userAccount.count({
     *   where: {
     *     // ... the filter for the UserAccounts we want to count
     *   }
     * })
    **/
    count<T extends UserAccountCountArgs>(
      args?: Subset<T, UserAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAccountAggregateArgs>(args: Subset<T, UserAccountAggregateArgs>): Prisma.PrismaPromise<GetUserAccountAggregateType<T>>

    /**
     * Group by UserAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAccountGroupByArgs['orderBy'] }
        : { orderBy?: UserAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAccount model
   */
  readonly fields: UserAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transactionIntents<T extends UserAccount$transactionIntentsArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$transactionIntentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserAccount model
   */
  interface UserAccountFieldRefs {
    readonly id: FieldRef<"UserAccount", 'String'>
    readonly userId: FieldRef<"UserAccount", 'String'>
    readonly accountType: FieldRef<"UserAccount", 'AccountType'>
    readonly accountNumber: FieldRef<"UserAccount", 'String'>
    readonly productCode: FieldRef<"UserAccount", 'String'>
    readonly productName: FieldRef<"UserAccount", 'String'>
    readonly interestRate: FieldRef<"UserAccount", 'Decimal'>
    readonly lockPeriodMonths: FieldRef<"UserAccount", 'Int'>
    readonly lockedUntil: FieldRef<"UserAccount", 'DateTime'>
    readonly allowAdditionalDeposits: FieldRef<"UserAccount", 'Boolean'>
    readonly metadata: FieldRef<"UserAccount", 'Json'>
    readonly balance: FieldRef<"UserAccount", 'Decimal'>
    readonly status: FieldRef<"UserAccount", 'AccountStatus'>
    readonly createdAt: FieldRef<"UserAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserAccount findUnique
   */
  export type UserAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount findUniqueOrThrow
   */
  export type UserAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount findFirst
   */
  export type UserAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAccounts.
     */
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount findFirstOrThrow
   */
  export type UserAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAccounts.
     */
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount findMany
   */
  export type UserAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccounts to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount create
   */
  export type UserAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a UserAccount.
     */
    data: XOR<UserAccountCreateInput, UserAccountUncheckedCreateInput>
  }

  /**
   * UserAccount createMany
   */
  export type UserAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAccounts.
     */
    data: UserAccountCreateManyInput | UserAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAccount createManyAndReturn
   */
  export type UserAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * The data used to create many UserAccounts.
     */
    data: UserAccountCreateManyInput | UserAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAccount update
   */
  export type UserAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a UserAccount.
     */
    data: XOR<UserAccountUpdateInput, UserAccountUncheckedUpdateInput>
    /**
     * Choose, which UserAccount to update.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount updateMany
   */
  export type UserAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAccounts.
     */
    data: XOR<UserAccountUpdateManyMutationInput, UserAccountUncheckedUpdateManyInput>
    /**
     * Filter which UserAccounts to update
     */
    where?: UserAccountWhereInput
    /**
     * Limit how many UserAccounts to update.
     */
    limit?: number
  }

  /**
   * UserAccount updateManyAndReturn
   */
  export type UserAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * The data used to update UserAccounts.
     */
    data: XOR<UserAccountUpdateManyMutationInput, UserAccountUncheckedUpdateManyInput>
    /**
     * Filter which UserAccounts to update
     */
    where?: UserAccountWhereInput
    /**
     * Limit how many UserAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAccount upsert
   */
  export type UserAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the UserAccount to update in case it exists.
     */
    where: UserAccountWhereUniqueInput
    /**
     * In case the UserAccount found by the `where` argument doesn't exist, create a new UserAccount with this data.
     */
    create: XOR<UserAccountCreateInput, UserAccountUncheckedCreateInput>
    /**
     * In case the UserAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAccountUpdateInput, UserAccountUncheckedUpdateInput>
  }

  /**
   * UserAccount delete
   */
  export type UserAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter which UserAccount to delete.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount deleteMany
   */
  export type UserAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAccounts to delete
     */
    where?: UserAccountWhereInput
    /**
     * Limit how many UserAccounts to delete.
     */
    limit?: number
  }

  /**
   * UserAccount.transactionIntents
   */
  export type UserAccount$transactionIntentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    where?: TransactionIntentWhereInput
    orderBy?: TransactionIntentOrderByWithRelationInput | TransactionIntentOrderByWithRelationInput[]
    cursor?: TransactionIntentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionIntentScalarFieldEnum | TransactionIntentScalarFieldEnum[]
  }

  /**
   * UserAccount without action
   */
  export type UserAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccount
     */
    omit?: UserAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
  }


  /**
   * Model TransactionIntent
   */

  export type AggregateTransactionIntent = {
    _count: TransactionIntentCountAggregateOutputType | null
    _avg: TransactionIntentAvgAggregateOutputType | null
    _sum: TransactionIntentSumAggregateOutputType | null
    _min: TransactionIntentMinAggregateOutputType | null
    _max: TransactionIntentMaxAggregateOutputType | null
  }

  export type TransactionIntentAvgAggregateOutputType = {
    amount: Decimal | null
    investmentTerm: number | null
  }

  export type TransactionIntentSumAggregateOutputType = {
    amount: Decimal | null
    investmentTerm: number | null
  }

  export type TransactionIntentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    accountId: string | null
    accountType: $Enums.AccountType | null
    intentType: $Enums.IntentType | null
    amount: Decimal | null
    paymentMethod: string | null
    investmentTranche: string | null
    investmentTerm: number | null
    userNotes: string | null
    adminNotes: string | null
    status: $Enums.TransactionStatus | null
    referenceNumber: string | null
    providerTransactionId: string | null
    providerStatus: string | null
    lastCallbackAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionIntentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    accountId: string | null
    accountType: $Enums.AccountType | null
    intentType: $Enums.IntentType | null
    amount: Decimal | null
    paymentMethod: string | null
    investmentTranche: string | null
    investmentTerm: number | null
    userNotes: string | null
    adminNotes: string | null
    status: $Enums.TransactionStatus | null
    referenceNumber: string | null
    providerTransactionId: string | null
    providerStatus: string | null
    lastCallbackAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionIntentCountAggregateOutputType = {
    id: number
    userId: number
    accountId: number
    accountType: number
    intentType: number
    amount: number
    paymentMethod: number
    investmentTranche: number
    investmentTerm: number
    userNotes: number
    adminNotes: number
    status: number
    referenceNumber: number
    providerTransactionId: number
    providerStatus: number
    lastCallbackAt: number
    lastCallbackPayload: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionIntentAvgAggregateInputType = {
    amount?: true
    investmentTerm?: true
  }

  export type TransactionIntentSumAggregateInputType = {
    amount?: true
    investmentTerm?: true
  }

  export type TransactionIntentMinAggregateInputType = {
    id?: true
    userId?: true
    accountId?: true
    accountType?: true
    intentType?: true
    amount?: true
    paymentMethod?: true
    investmentTranche?: true
    investmentTerm?: true
    userNotes?: true
    adminNotes?: true
    status?: true
    referenceNumber?: true
    providerTransactionId?: true
    providerStatus?: true
    lastCallbackAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionIntentMaxAggregateInputType = {
    id?: true
    userId?: true
    accountId?: true
    accountType?: true
    intentType?: true
    amount?: true
    paymentMethod?: true
    investmentTranche?: true
    investmentTerm?: true
    userNotes?: true
    adminNotes?: true
    status?: true
    referenceNumber?: true
    providerTransactionId?: true
    providerStatus?: true
    lastCallbackAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionIntentCountAggregateInputType = {
    id?: true
    userId?: true
    accountId?: true
    accountType?: true
    intentType?: true
    amount?: true
    paymentMethod?: true
    investmentTranche?: true
    investmentTerm?: true
    userNotes?: true
    adminNotes?: true
    status?: true
    referenceNumber?: true
    providerTransactionId?: true
    providerStatus?: true
    lastCallbackAt?: true
    lastCallbackPayload?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionIntentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransactionIntent to aggregate.
     */
    where?: TransactionIntentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionIntents to fetch.
     */
    orderBy?: TransactionIntentOrderByWithRelationInput | TransactionIntentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionIntentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionIntents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionIntents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TransactionIntents
    **/
    _count?: true | TransactionIntentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionIntentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionIntentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionIntentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionIntentMaxAggregateInputType
  }

  export type GetTransactionIntentAggregateType<T extends TransactionIntentAggregateArgs> = {
        [P in keyof T & keyof AggregateTransactionIntent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransactionIntent[P]>
      : GetScalarType<T[P], AggregateTransactionIntent[P]>
  }




  export type TransactionIntentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionIntentWhereInput
    orderBy?: TransactionIntentOrderByWithAggregationInput | TransactionIntentOrderByWithAggregationInput[]
    by: TransactionIntentScalarFieldEnum[] | TransactionIntentScalarFieldEnum
    having?: TransactionIntentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionIntentCountAggregateInputType | true
    _avg?: TransactionIntentAvgAggregateInputType
    _sum?: TransactionIntentSumAggregateInputType
    _min?: TransactionIntentMinAggregateInputType
    _max?: TransactionIntentMaxAggregateInputType
  }

  export type TransactionIntentGroupByOutputType = {
    id: string
    userId: string
    accountId: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal
    paymentMethod: string
    investmentTranche: string | null
    investmentTerm: number | null
    userNotes: string | null
    adminNotes: string | null
    status: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId: string | null
    providerStatus: string | null
    lastCallbackAt: Date | null
    lastCallbackPayload: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: TransactionIntentCountAggregateOutputType | null
    _avg: TransactionIntentAvgAggregateOutputType | null
    _sum: TransactionIntentSumAggregateOutputType | null
    _min: TransactionIntentMinAggregateOutputType | null
    _max: TransactionIntentMaxAggregateOutputType | null
  }

  type GetTransactionIntentGroupByPayload<T extends TransactionIntentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionIntentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionIntentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionIntentGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionIntentGroupByOutputType[P]>
        }
      >
    >


  export type TransactionIntentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accountId?: boolean
    accountType?: boolean
    intentType?: boolean
    amount?: boolean
    paymentMethod?: boolean
    investmentTranche?: boolean
    investmentTerm?: boolean
    userNotes?: boolean
    adminNotes?: boolean
    status?: boolean
    referenceNumber?: boolean
    providerTransactionId?: boolean
    providerStatus?: boolean
    lastCallbackAt?: boolean
    lastCallbackPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | UserAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    paymentCallbacks?: boolean | TransactionIntent$paymentCallbacksArgs<ExtArgs>
    _count?: boolean | TransactionIntentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transactionIntent"]>

  export type TransactionIntentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accountId?: boolean
    accountType?: boolean
    intentType?: boolean
    amount?: boolean
    paymentMethod?: boolean
    investmentTranche?: boolean
    investmentTerm?: boolean
    userNotes?: boolean
    adminNotes?: boolean
    status?: boolean
    referenceNumber?: boolean
    providerTransactionId?: boolean
    providerStatus?: boolean
    lastCallbackAt?: boolean
    lastCallbackPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | UserAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transactionIntent"]>

  export type TransactionIntentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accountId?: boolean
    accountType?: boolean
    intentType?: boolean
    amount?: boolean
    paymentMethod?: boolean
    investmentTranche?: boolean
    investmentTerm?: boolean
    userNotes?: boolean
    adminNotes?: boolean
    status?: boolean
    referenceNumber?: boolean
    providerTransactionId?: boolean
    providerStatus?: boolean
    lastCallbackAt?: boolean
    lastCallbackPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | UserAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transactionIntent"]>

  export type TransactionIntentSelectScalar = {
    id?: boolean
    userId?: boolean
    accountId?: boolean
    accountType?: boolean
    intentType?: boolean
    amount?: boolean
    paymentMethod?: boolean
    investmentTranche?: boolean
    investmentTerm?: boolean
    userNotes?: boolean
    adminNotes?: boolean
    status?: boolean
    referenceNumber?: boolean
    providerTransactionId?: boolean
    providerStatus?: boolean
    lastCallbackAt?: boolean
    lastCallbackPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionIntentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "accountId" | "accountType" | "intentType" | "amount" | "paymentMethod" | "investmentTranche" | "investmentTerm" | "userNotes" | "adminNotes" | "status" | "referenceNumber" | "providerTransactionId" | "providerStatus" | "lastCallbackAt" | "lastCallbackPayload" | "createdAt" | "updatedAt", ExtArgs["result"]["transactionIntent"]>
  export type TransactionIntentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | UserAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    paymentCallbacks?: boolean | TransactionIntent$paymentCallbacksArgs<ExtArgs>
    _count?: boolean | TransactionIntentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TransactionIntentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | UserAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TransactionIntentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | UserAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TransactionIntentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TransactionIntent"
    objects: {
      account: Prisma.$UserAccountPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      paymentCallbacks: Prisma.$PaymentCallbackLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      accountId: string
      accountType: $Enums.AccountType
      intentType: $Enums.IntentType
      amount: Prisma.Decimal
      paymentMethod: string
      investmentTranche: string | null
      investmentTerm: number | null
      userNotes: string | null
      adminNotes: string | null
      status: $Enums.TransactionStatus
      referenceNumber: string
      providerTransactionId: string | null
      providerStatus: string | null
      lastCallbackAt: Date | null
      lastCallbackPayload: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transactionIntent"]>
    composites: {}
  }

  type TransactionIntentGetPayload<S extends boolean | null | undefined | TransactionIntentDefaultArgs> = $Result.GetResult<Prisma.$TransactionIntentPayload, S>

  type TransactionIntentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionIntentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionIntentCountAggregateInputType | true
    }

  export interface TransactionIntentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TransactionIntent'], meta: { name: 'TransactionIntent' } }
    /**
     * Find zero or one TransactionIntent that matches the filter.
     * @param {TransactionIntentFindUniqueArgs} args - Arguments to find a TransactionIntent
     * @example
     * // Get one TransactionIntent
     * const transactionIntent = await prisma.transactionIntent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionIntentFindUniqueArgs>(args: SelectSubset<T, TransactionIntentFindUniqueArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TransactionIntent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionIntentFindUniqueOrThrowArgs} args - Arguments to find a TransactionIntent
     * @example
     * // Get one TransactionIntent
     * const transactionIntent = await prisma.transactionIntent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionIntentFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionIntentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TransactionIntent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionIntentFindFirstArgs} args - Arguments to find a TransactionIntent
     * @example
     * // Get one TransactionIntent
     * const transactionIntent = await prisma.transactionIntent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionIntentFindFirstArgs>(args?: SelectSubset<T, TransactionIntentFindFirstArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TransactionIntent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionIntentFindFirstOrThrowArgs} args - Arguments to find a TransactionIntent
     * @example
     * // Get one TransactionIntent
     * const transactionIntent = await prisma.transactionIntent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionIntentFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionIntentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TransactionIntents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionIntentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TransactionIntents
     * const transactionIntents = await prisma.transactionIntent.findMany()
     * 
     * // Get first 10 TransactionIntents
     * const transactionIntents = await prisma.transactionIntent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionIntentWithIdOnly = await prisma.transactionIntent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionIntentFindManyArgs>(args?: SelectSubset<T, TransactionIntentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TransactionIntent.
     * @param {TransactionIntentCreateArgs} args - Arguments to create a TransactionIntent.
     * @example
     * // Create one TransactionIntent
     * const TransactionIntent = await prisma.transactionIntent.create({
     *   data: {
     *     // ... data to create a TransactionIntent
     *   }
     * })
     * 
     */
    create<T extends TransactionIntentCreateArgs>(args: SelectSubset<T, TransactionIntentCreateArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TransactionIntents.
     * @param {TransactionIntentCreateManyArgs} args - Arguments to create many TransactionIntents.
     * @example
     * // Create many TransactionIntents
     * const transactionIntent = await prisma.transactionIntent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionIntentCreateManyArgs>(args?: SelectSubset<T, TransactionIntentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TransactionIntents and returns the data saved in the database.
     * @param {TransactionIntentCreateManyAndReturnArgs} args - Arguments to create many TransactionIntents.
     * @example
     * // Create many TransactionIntents
     * const transactionIntent = await prisma.transactionIntent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TransactionIntents and only return the `id`
     * const transactionIntentWithIdOnly = await prisma.transactionIntent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionIntentCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionIntentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TransactionIntent.
     * @param {TransactionIntentDeleteArgs} args - Arguments to delete one TransactionIntent.
     * @example
     * // Delete one TransactionIntent
     * const TransactionIntent = await prisma.transactionIntent.delete({
     *   where: {
     *     // ... filter to delete one TransactionIntent
     *   }
     * })
     * 
     */
    delete<T extends TransactionIntentDeleteArgs>(args: SelectSubset<T, TransactionIntentDeleteArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TransactionIntent.
     * @param {TransactionIntentUpdateArgs} args - Arguments to update one TransactionIntent.
     * @example
     * // Update one TransactionIntent
     * const transactionIntent = await prisma.transactionIntent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionIntentUpdateArgs>(args: SelectSubset<T, TransactionIntentUpdateArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TransactionIntents.
     * @param {TransactionIntentDeleteManyArgs} args - Arguments to filter TransactionIntents to delete.
     * @example
     * // Delete a few TransactionIntents
     * const { count } = await prisma.transactionIntent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionIntentDeleteManyArgs>(args?: SelectSubset<T, TransactionIntentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransactionIntents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionIntentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TransactionIntents
     * const transactionIntent = await prisma.transactionIntent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionIntentUpdateManyArgs>(args: SelectSubset<T, TransactionIntentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransactionIntents and returns the data updated in the database.
     * @param {TransactionIntentUpdateManyAndReturnArgs} args - Arguments to update many TransactionIntents.
     * @example
     * // Update many TransactionIntents
     * const transactionIntent = await prisma.transactionIntent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TransactionIntents and only return the `id`
     * const transactionIntentWithIdOnly = await prisma.transactionIntent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionIntentUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionIntentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TransactionIntent.
     * @param {TransactionIntentUpsertArgs} args - Arguments to update or create a TransactionIntent.
     * @example
     * // Update or create a TransactionIntent
     * const transactionIntent = await prisma.transactionIntent.upsert({
     *   create: {
     *     // ... data to create a TransactionIntent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TransactionIntent we want to update
     *   }
     * })
     */
    upsert<T extends TransactionIntentUpsertArgs>(args: SelectSubset<T, TransactionIntentUpsertArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TransactionIntents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionIntentCountArgs} args - Arguments to filter TransactionIntents to count.
     * @example
     * // Count the number of TransactionIntents
     * const count = await prisma.transactionIntent.count({
     *   where: {
     *     // ... the filter for the TransactionIntents we want to count
     *   }
     * })
    **/
    count<T extends TransactionIntentCountArgs>(
      args?: Subset<T, TransactionIntentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionIntentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TransactionIntent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionIntentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionIntentAggregateArgs>(args: Subset<T, TransactionIntentAggregateArgs>): Prisma.PrismaPromise<GetTransactionIntentAggregateType<T>>

    /**
     * Group by TransactionIntent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionIntentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionIntentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionIntentGroupByArgs['orderBy'] }
        : { orderBy?: TransactionIntentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionIntentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionIntentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TransactionIntent model
   */
  readonly fields: TransactionIntentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TransactionIntent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionIntentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    paymentCallbacks<T extends TransactionIntent$paymentCallbacksArgs<ExtArgs> = {}>(args?: Subset<T, TransactionIntent$paymentCallbacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TransactionIntent model
   */
  interface TransactionIntentFieldRefs {
    readonly id: FieldRef<"TransactionIntent", 'String'>
    readonly userId: FieldRef<"TransactionIntent", 'String'>
    readonly accountId: FieldRef<"TransactionIntent", 'String'>
    readonly accountType: FieldRef<"TransactionIntent", 'AccountType'>
    readonly intentType: FieldRef<"TransactionIntent", 'IntentType'>
    readonly amount: FieldRef<"TransactionIntent", 'Decimal'>
    readonly paymentMethod: FieldRef<"TransactionIntent", 'String'>
    readonly investmentTranche: FieldRef<"TransactionIntent", 'String'>
    readonly investmentTerm: FieldRef<"TransactionIntent", 'Int'>
    readonly userNotes: FieldRef<"TransactionIntent", 'String'>
    readonly adminNotes: FieldRef<"TransactionIntent", 'String'>
    readonly status: FieldRef<"TransactionIntent", 'TransactionStatus'>
    readonly referenceNumber: FieldRef<"TransactionIntent", 'String'>
    readonly providerTransactionId: FieldRef<"TransactionIntent", 'String'>
    readonly providerStatus: FieldRef<"TransactionIntent", 'String'>
    readonly lastCallbackAt: FieldRef<"TransactionIntent", 'DateTime'>
    readonly lastCallbackPayload: FieldRef<"TransactionIntent", 'Json'>
    readonly createdAt: FieldRef<"TransactionIntent", 'DateTime'>
    readonly updatedAt: FieldRef<"TransactionIntent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TransactionIntent findUnique
   */
  export type TransactionIntentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * Filter, which TransactionIntent to fetch.
     */
    where: TransactionIntentWhereUniqueInput
  }

  /**
   * TransactionIntent findUniqueOrThrow
   */
  export type TransactionIntentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * Filter, which TransactionIntent to fetch.
     */
    where: TransactionIntentWhereUniqueInput
  }

  /**
   * TransactionIntent findFirst
   */
  export type TransactionIntentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * Filter, which TransactionIntent to fetch.
     */
    where?: TransactionIntentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionIntents to fetch.
     */
    orderBy?: TransactionIntentOrderByWithRelationInput | TransactionIntentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransactionIntents.
     */
    cursor?: TransactionIntentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionIntents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionIntents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransactionIntents.
     */
    distinct?: TransactionIntentScalarFieldEnum | TransactionIntentScalarFieldEnum[]
  }

  /**
   * TransactionIntent findFirstOrThrow
   */
  export type TransactionIntentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * Filter, which TransactionIntent to fetch.
     */
    where?: TransactionIntentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionIntents to fetch.
     */
    orderBy?: TransactionIntentOrderByWithRelationInput | TransactionIntentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransactionIntents.
     */
    cursor?: TransactionIntentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionIntents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionIntents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransactionIntents.
     */
    distinct?: TransactionIntentScalarFieldEnum | TransactionIntentScalarFieldEnum[]
  }

  /**
   * TransactionIntent findMany
   */
  export type TransactionIntentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * Filter, which TransactionIntents to fetch.
     */
    where?: TransactionIntentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionIntents to fetch.
     */
    orderBy?: TransactionIntentOrderByWithRelationInput | TransactionIntentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TransactionIntents.
     */
    cursor?: TransactionIntentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionIntents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionIntents.
     */
    skip?: number
    distinct?: TransactionIntentScalarFieldEnum | TransactionIntentScalarFieldEnum[]
  }

  /**
   * TransactionIntent create
   */
  export type TransactionIntentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * The data needed to create a TransactionIntent.
     */
    data: XOR<TransactionIntentCreateInput, TransactionIntentUncheckedCreateInput>
  }

  /**
   * TransactionIntent createMany
   */
  export type TransactionIntentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TransactionIntents.
     */
    data: TransactionIntentCreateManyInput | TransactionIntentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TransactionIntent createManyAndReturn
   */
  export type TransactionIntentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * The data used to create many TransactionIntents.
     */
    data: TransactionIntentCreateManyInput | TransactionIntentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TransactionIntent update
   */
  export type TransactionIntentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * The data needed to update a TransactionIntent.
     */
    data: XOR<TransactionIntentUpdateInput, TransactionIntentUncheckedUpdateInput>
    /**
     * Choose, which TransactionIntent to update.
     */
    where: TransactionIntentWhereUniqueInput
  }

  /**
   * TransactionIntent updateMany
   */
  export type TransactionIntentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TransactionIntents.
     */
    data: XOR<TransactionIntentUpdateManyMutationInput, TransactionIntentUncheckedUpdateManyInput>
    /**
     * Filter which TransactionIntents to update
     */
    where?: TransactionIntentWhereInput
    /**
     * Limit how many TransactionIntents to update.
     */
    limit?: number
  }

  /**
   * TransactionIntent updateManyAndReturn
   */
  export type TransactionIntentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * The data used to update TransactionIntents.
     */
    data: XOR<TransactionIntentUpdateManyMutationInput, TransactionIntentUncheckedUpdateManyInput>
    /**
     * Filter which TransactionIntents to update
     */
    where?: TransactionIntentWhereInput
    /**
     * Limit how many TransactionIntents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TransactionIntent upsert
   */
  export type TransactionIntentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * The filter to search for the TransactionIntent to update in case it exists.
     */
    where: TransactionIntentWhereUniqueInput
    /**
     * In case the TransactionIntent found by the `where` argument doesn't exist, create a new TransactionIntent with this data.
     */
    create: XOR<TransactionIntentCreateInput, TransactionIntentUncheckedCreateInput>
    /**
     * In case the TransactionIntent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionIntentUpdateInput, TransactionIntentUncheckedUpdateInput>
  }

  /**
   * TransactionIntent delete
   */
  export type TransactionIntentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
    /**
     * Filter which TransactionIntent to delete.
     */
    where: TransactionIntentWhereUniqueInput
  }

  /**
   * TransactionIntent deleteMany
   */
  export type TransactionIntentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransactionIntents to delete
     */
    where?: TransactionIntentWhereInput
    /**
     * Limit how many TransactionIntents to delete.
     */
    limit?: number
  }

  /**
   * TransactionIntent.paymentCallbacks
   */
  export type TransactionIntent$paymentCallbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    where?: PaymentCallbackLogWhereInput
    orderBy?: PaymentCallbackLogOrderByWithRelationInput | PaymentCallbackLogOrderByWithRelationInput[]
    cursor?: PaymentCallbackLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentCallbackLogScalarFieldEnum | PaymentCallbackLogScalarFieldEnum[]
  }

  /**
   * TransactionIntent without action
   */
  export type TransactionIntentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionIntent
     */
    select?: TransactionIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionIntent
     */
    omit?: TransactionIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIntentInclude<ExtArgs> | null
  }


  /**
   * Model PaymentCallbackLog
   */

  export type AggregatePaymentCallbackLog = {
    _count: PaymentCallbackLogCountAggregateOutputType | null
    _min: PaymentCallbackLogMinAggregateOutputType | null
    _max: PaymentCallbackLogMaxAggregateOutputType | null
  }

  export type PaymentCallbackLogMinAggregateOutputType = {
    id: string | null
    transactionIntentId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PaymentCallbackLogMaxAggregateOutputType = {
    id: string | null
    transactionIntentId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PaymentCallbackLogCountAggregateOutputType = {
    id: number
    transactionIntentId: number
    status: number
    payload: number
    createdAt: number
    _all: number
  }


  export type PaymentCallbackLogMinAggregateInputType = {
    id?: true
    transactionIntentId?: true
    status?: true
    createdAt?: true
  }

  export type PaymentCallbackLogMaxAggregateInputType = {
    id?: true
    transactionIntentId?: true
    status?: true
    createdAt?: true
  }

  export type PaymentCallbackLogCountAggregateInputType = {
    id?: true
    transactionIntentId?: true
    status?: true
    payload?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentCallbackLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentCallbackLog to aggregate.
     */
    where?: PaymentCallbackLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentCallbackLogs to fetch.
     */
    orderBy?: PaymentCallbackLogOrderByWithRelationInput | PaymentCallbackLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentCallbackLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentCallbackLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentCallbackLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentCallbackLogs
    **/
    _count?: true | PaymentCallbackLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentCallbackLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentCallbackLogMaxAggregateInputType
  }

  export type GetPaymentCallbackLogAggregateType<T extends PaymentCallbackLogAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentCallbackLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentCallbackLog[P]>
      : GetScalarType<T[P], AggregatePaymentCallbackLog[P]>
  }




  export type PaymentCallbackLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentCallbackLogWhereInput
    orderBy?: PaymentCallbackLogOrderByWithAggregationInput | PaymentCallbackLogOrderByWithAggregationInput[]
    by: PaymentCallbackLogScalarFieldEnum[] | PaymentCallbackLogScalarFieldEnum
    having?: PaymentCallbackLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCallbackLogCountAggregateInputType | true
    _min?: PaymentCallbackLogMinAggregateInputType
    _max?: PaymentCallbackLogMaxAggregateInputType
  }

  export type PaymentCallbackLogGroupByOutputType = {
    id: string
    transactionIntentId: string
    status: string
    payload: JsonValue
    createdAt: Date
    _count: PaymentCallbackLogCountAggregateOutputType | null
    _min: PaymentCallbackLogMinAggregateOutputType | null
    _max: PaymentCallbackLogMaxAggregateOutputType | null
  }

  type GetPaymentCallbackLogGroupByPayload<T extends PaymentCallbackLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentCallbackLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentCallbackLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentCallbackLogGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentCallbackLogGroupByOutputType[P]>
        }
      >
    >


  export type PaymentCallbackLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionIntentId?: boolean
    status?: boolean
    payload?: boolean
    createdAt?: boolean
    transactionIntent?: boolean | TransactionIntentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentCallbackLog"]>

  export type PaymentCallbackLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionIntentId?: boolean
    status?: boolean
    payload?: boolean
    createdAt?: boolean
    transactionIntent?: boolean | TransactionIntentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentCallbackLog"]>

  export type PaymentCallbackLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionIntentId?: boolean
    status?: boolean
    payload?: boolean
    createdAt?: boolean
    transactionIntent?: boolean | TransactionIntentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentCallbackLog"]>

  export type PaymentCallbackLogSelectScalar = {
    id?: boolean
    transactionIntentId?: boolean
    status?: boolean
    payload?: boolean
    createdAt?: boolean
  }

  export type PaymentCallbackLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionIntentId" | "status" | "payload" | "createdAt", ExtArgs["result"]["paymentCallbackLog"]>
  export type PaymentCallbackLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactionIntent?: boolean | TransactionIntentDefaultArgs<ExtArgs>
  }
  export type PaymentCallbackLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactionIntent?: boolean | TransactionIntentDefaultArgs<ExtArgs>
  }
  export type PaymentCallbackLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactionIntent?: boolean | TransactionIntentDefaultArgs<ExtArgs>
  }

  export type $PaymentCallbackLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentCallbackLog"
    objects: {
      transactionIntent: Prisma.$TransactionIntentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionIntentId: string
      status: string
      payload: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["paymentCallbackLog"]>
    composites: {}
  }

  type PaymentCallbackLogGetPayload<S extends boolean | null | undefined | PaymentCallbackLogDefaultArgs> = $Result.GetResult<Prisma.$PaymentCallbackLogPayload, S>

  type PaymentCallbackLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentCallbackLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCallbackLogCountAggregateInputType | true
    }

  export interface PaymentCallbackLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentCallbackLog'], meta: { name: 'PaymentCallbackLog' } }
    /**
     * Find zero or one PaymentCallbackLog that matches the filter.
     * @param {PaymentCallbackLogFindUniqueArgs} args - Arguments to find a PaymentCallbackLog
     * @example
     * // Get one PaymentCallbackLog
     * const paymentCallbackLog = await prisma.paymentCallbackLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentCallbackLogFindUniqueArgs>(args: SelectSubset<T, PaymentCallbackLogFindUniqueArgs<ExtArgs>>): Prisma__PaymentCallbackLogClient<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PaymentCallbackLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentCallbackLogFindUniqueOrThrowArgs} args - Arguments to find a PaymentCallbackLog
     * @example
     * // Get one PaymentCallbackLog
     * const paymentCallbackLog = await prisma.paymentCallbackLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentCallbackLogFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentCallbackLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentCallbackLogClient<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentCallbackLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCallbackLogFindFirstArgs} args - Arguments to find a PaymentCallbackLog
     * @example
     * // Get one PaymentCallbackLog
     * const paymentCallbackLog = await prisma.paymentCallbackLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentCallbackLogFindFirstArgs>(args?: SelectSubset<T, PaymentCallbackLogFindFirstArgs<ExtArgs>>): Prisma__PaymentCallbackLogClient<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentCallbackLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCallbackLogFindFirstOrThrowArgs} args - Arguments to find a PaymentCallbackLog
     * @example
     * // Get one PaymentCallbackLog
     * const paymentCallbackLog = await prisma.paymentCallbackLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentCallbackLogFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentCallbackLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentCallbackLogClient<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PaymentCallbackLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCallbackLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentCallbackLogs
     * const paymentCallbackLogs = await prisma.paymentCallbackLog.findMany()
     * 
     * // Get first 10 PaymentCallbackLogs
     * const paymentCallbackLogs = await prisma.paymentCallbackLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentCallbackLogWithIdOnly = await prisma.paymentCallbackLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentCallbackLogFindManyArgs>(args?: SelectSubset<T, PaymentCallbackLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PaymentCallbackLog.
     * @param {PaymentCallbackLogCreateArgs} args - Arguments to create a PaymentCallbackLog.
     * @example
     * // Create one PaymentCallbackLog
     * const PaymentCallbackLog = await prisma.paymentCallbackLog.create({
     *   data: {
     *     // ... data to create a PaymentCallbackLog
     *   }
     * })
     * 
     */
    create<T extends PaymentCallbackLogCreateArgs>(args: SelectSubset<T, PaymentCallbackLogCreateArgs<ExtArgs>>): Prisma__PaymentCallbackLogClient<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PaymentCallbackLogs.
     * @param {PaymentCallbackLogCreateManyArgs} args - Arguments to create many PaymentCallbackLogs.
     * @example
     * // Create many PaymentCallbackLogs
     * const paymentCallbackLog = await prisma.paymentCallbackLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCallbackLogCreateManyArgs>(args?: SelectSubset<T, PaymentCallbackLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentCallbackLogs and returns the data saved in the database.
     * @param {PaymentCallbackLogCreateManyAndReturnArgs} args - Arguments to create many PaymentCallbackLogs.
     * @example
     * // Create many PaymentCallbackLogs
     * const paymentCallbackLog = await prisma.paymentCallbackLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentCallbackLogs and only return the `id`
     * const paymentCallbackLogWithIdOnly = await prisma.paymentCallbackLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCallbackLogCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCallbackLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PaymentCallbackLog.
     * @param {PaymentCallbackLogDeleteArgs} args - Arguments to delete one PaymentCallbackLog.
     * @example
     * // Delete one PaymentCallbackLog
     * const PaymentCallbackLog = await prisma.paymentCallbackLog.delete({
     *   where: {
     *     // ... filter to delete one PaymentCallbackLog
     *   }
     * })
     * 
     */
    delete<T extends PaymentCallbackLogDeleteArgs>(args: SelectSubset<T, PaymentCallbackLogDeleteArgs<ExtArgs>>): Prisma__PaymentCallbackLogClient<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PaymentCallbackLog.
     * @param {PaymentCallbackLogUpdateArgs} args - Arguments to update one PaymentCallbackLog.
     * @example
     * // Update one PaymentCallbackLog
     * const paymentCallbackLog = await prisma.paymentCallbackLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentCallbackLogUpdateArgs>(args: SelectSubset<T, PaymentCallbackLogUpdateArgs<ExtArgs>>): Prisma__PaymentCallbackLogClient<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PaymentCallbackLogs.
     * @param {PaymentCallbackLogDeleteManyArgs} args - Arguments to filter PaymentCallbackLogs to delete.
     * @example
     * // Delete a few PaymentCallbackLogs
     * const { count } = await prisma.paymentCallbackLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentCallbackLogDeleteManyArgs>(args?: SelectSubset<T, PaymentCallbackLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentCallbackLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCallbackLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentCallbackLogs
     * const paymentCallbackLog = await prisma.paymentCallbackLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentCallbackLogUpdateManyArgs>(args: SelectSubset<T, PaymentCallbackLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentCallbackLogs and returns the data updated in the database.
     * @param {PaymentCallbackLogUpdateManyAndReturnArgs} args - Arguments to update many PaymentCallbackLogs.
     * @example
     * // Update many PaymentCallbackLogs
     * const paymentCallbackLog = await prisma.paymentCallbackLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PaymentCallbackLogs and only return the `id`
     * const paymentCallbackLogWithIdOnly = await prisma.paymentCallbackLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentCallbackLogUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentCallbackLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PaymentCallbackLog.
     * @param {PaymentCallbackLogUpsertArgs} args - Arguments to update or create a PaymentCallbackLog.
     * @example
     * // Update or create a PaymentCallbackLog
     * const paymentCallbackLog = await prisma.paymentCallbackLog.upsert({
     *   create: {
     *     // ... data to create a PaymentCallbackLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentCallbackLog we want to update
     *   }
     * })
     */
    upsert<T extends PaymentCallbackLogUpsertArgs>(args: SelectSubset<T, PaymentCallbackLogUpsertArgs<ExtArgs>>): Prisma__PaymentCallbackLogClient<$Result.GetResult<Prisma.$PaymentCallbackLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PaymentCallbackLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCallbackLogCountArgs} args - Arguments to filter PaymentCallbackLogs to count.
     * @example
     * // Count the number of PaymentCallbackLogs
     * const count = await prisma.paymentCallbackLog.count({
     *   where: {
     *     // ... the filter for the PaymentCallbackLogs we want to count
     *   }
     * })
    **/
    count<T extends PaymentCallbackLogCountArgs>(
      args?: Subset<T, PaymentCallbackLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCallbackLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentCallbackLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCallbackLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentCallbackLogAggregateArgs>(args: Subset<T, PaymentCallbackLogAggregateArgs>): Prisma.PrismaPromise<GetPaymentCallbackLogAggregateType<T>>

    /**
     * Group by PaymentCallbackLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCallbackLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentCallbackLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentCallbackLogGroupByArgs['orderBy'] }
        : { orderBy?: PaymentCallbackLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentCallbackLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentCallbackLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentCallbackLog model
   */
  readonly fields: PaymentCallbackLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentCallbackLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentCallbackLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transactionIntent<T extends TransactionIntentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransactionIntentDefaultArgs<ExtArgs>>): Prisma__TransactionIntentClient<$Result.GetResult<Prisma.$TransactionIntentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaymentCallbackLog model
   */
  interface PaymentCallbackLogFieldRefs {
    readonly id: FieldRef<"PaymentCallbackLog", 'String'>
    readonly transactionIntentId: FieldRef<"PaymentCallbackLog", 'String'>
    readonly status: FieldRef<"PaymentCallbackLog", 'String'>
    readonly payload: FieldRef<"PaymentCallbackLog", 'Json'>
    readonly createdAt: FieldRef<"PaymentCallbackLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentCallbackLog findUnique
   */
  export type PaymentCallbackLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCallbackLog to fetch.
     */
    where: PaymentCallbackLogWhereUniqueInput
  }

  /**
   * PaymentCallbackLog findUniqueOrThrow
   */
  export type PaymentCallbackLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCallbackLog to fetch.
     */
    where: PaymentCallbackLogWhereUniqueInput
  }

  /**
   * PaymentCallbackLog findFirst
   */
  export type PaymentCallbackLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCallbackLog to fetch.
     */
    where?: PaymentCallbackLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentCallbackLogs to fetch.
     */
    orderBy?: PaymentCallbackLogOrderByWithRelationInput | PaymentCallbackLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentCallbackLogs.
     */
    cursor?: PaymentCallbackLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentCallbackLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentCallbackLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentCallbackLogs.
     */
    distinct?: PaymentCallbackLogScalarFieldEnum | PaymentCallbackLogScalarFieldEnum[]
  }

  /**
   * PaymentCallbackLog findFirstOrThrow
   */
  export type PaymentCallbackLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCallbackLog to fetch.
     */
    where?: PaymentCallbackLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentCallbackLogs to fetch.
     */
    orderBy?: PaymentCallbackLogOrderByWithRelationInput | PaymentCallbackLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentCallbackLogs.
     */
    cursor?: PaymentCallbackLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentCallbackLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentCallbackLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentCallbackLogs.
     */
    distinct?: PaymentCallbackLogScalarFieldEnum | PaymentCallbackLogScalarFieldEnum[]
  }

  /**
   * PaymentCallbackLog findMany
   */
  export type PaymentCallbackLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCallbackLogs to fetch.
     */
    where?: PaymentCallbackLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentCallbackLogs to fetch.
     */
    orderBy?: PaymentCallbackLogOrderByWithRelationInput | PaymentCallbackLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentCallbackLogs.
     */
    cursor?: PaymentCallbackLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentCallbackLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentCallbackLogs.
     */
    skip?: number
    distinct?: PaymentCallbackLogScalarFieldEnum | PaymentCallbackLogScalarFieldEnum[]
  }

  /**
   * PaymentCallbackLog create
   */
  export type PaymentCallbackLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentCallbackLog.
     */
    data: XOR<PaymentCallbackLogCreateInput, PaymentCallbackLogUncheckedCreateInput>
  }

  /**
   * PaymentCallbackLog createMany
   */
  export type PaymentCallbackLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentCallbackLogs.
     */
    data: PaymentCallbackLogCreateManyInput | PaymentCallbackLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentCallbackLog createManyAndReturn
   */
  export type PaymentCallbackLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * The data used to create many PaymentCallbackLogs.
     */
    data: PaymentCallbackLogCreateManyInput | PaymentCallbackLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentCallbackLog update
   */
  export type PaymentCallbackLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentCallbackLog.
     */
    data: XOR<PaymentCallbackLogUpdateInput, PaymentCallbackLogUncheckedUpdateInput>
    /**
     * Choose, which PaymentCallbackLog to update.
     */
    where: PaymentCallbackLogWhereUniqueInput
  }

  /**
   * PaymentCallbackLog updateMany
   */
  export type PaymentCallbackLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentCallbackLogs.
     */
    data: XOR<PaymentCallbackLogUpdateManyMutationInput, PaymentCallbackLogUncheckedUpdateManyInput>
    /**
     * Filter which PaymentCallbackLogs to update
     */
    where?: PaymentCallbackLogWhereInput
    /**
     * Limit how many PaymentCallbackLogs to update.
     */
    limit?: number
  }

  /**
   * PaymentCallbackLog updateManyAndReturn
   */
  export type PaymentCallbackLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * The data used to update PaymentCallbackLogs.
     */
    data: XOR<PaymentCallbackLogUpdateManyMutationInput, PaymentCallbackLogUncheckedUpdateManyInput>
    /**
     * Filter which PaymentCallbackLogs to update
     */
    where?: PaymentCallbackLogWhereInput
    /**
     * Limit how many PaymentCallbackLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentCallbackLog upsert
   */
  export type PaymentCallbackLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentCallbackLog to update in case it exists.
     */
    where: PaymentCallbackLogWhereUniqueInput
    /**
     * In case the PaymentCallbackLog found by the `where` argument doesn't exist, create a new PaymentCallbackLog with this data.
     */
    create: XOR<PaymentCallbackLogCreateInput, PaymentCallbackLogUncheckedCreateInput>
    /**
     * In case the PaymentCallbackLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentCallbackLogUpdateInput, PaymentCallbackLogUncheckedUpdateInput>
  }

  /**
   * PaymentCallbackLog delete
   */
  export type PaymentCallbackLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
    /**
     * Filter which PaymentCallbackLog to delete.
     */
    where: PaymentCallbackLogWhereUniqueInput
  }

  /**
   * PaymentCallbackLog deleteMany
   */
  export type PaymentCallbackLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentCallbackLogs to delete
     */
    where?: PaymentCallbackLogWhereInput
    /**
     * Limit how many PaymentCallbackLogs to delete.
     */
    limit?: number
  }

  /**
   * PaymentCallbackLog without action
   */
  export type PaymentCallbackLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCallbackLog
     */
    select?: PaymentCallbackLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCallbackLog
     */
    omit?: PaymentCallbackLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCallbackLogInclude<ExtArgs> | null
  }


  /**
   * Model KycDocument
   */

  export type AggregateKycDocument = {
    _count: KycDocumentCountAggregateOutputType | null
    _min: KycDocumentMinAggregateOutputType | null
    _max: KycDocumentMaxAggregateOutputType | null
  }

  export type KycDocumentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    documentType: string | null
    fileUrl: string | null
    fileName: string | null
    uploadDate: Date | null
    verificationStatus: $Enums.VerificationStatus | null
    adminNotes: string | null
  }

  export type KycDocumentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    documentType: string | null
    fileUrl: string | null
    fileName: string | null
    uploadDate: Date | null
    verificationStatus: $Enums.VerificationStatus | null
    adminNotes: string | null
  }

  export type KycDocumentCountAggregateOutputType = {
    id: number
    userId: number
    documentType: number
    fileUrl: number
    fileName: number
    uploadDate: number
    verificationStatus: number
    adminNotes: number
    _all: number
  }


  export type KycDocumentMinAggregateInputType = {
    id?: true
    userId?: true
    documentType?: true
    fileUrl?: true
    fileName?: true
    uploadDate?: true
    verificationStatus?: true
    adminNotes?: true
  }

  export type KycDocumentMaxAggregateInputType = {
    id?: true
    userId?: true
    documentType?: true
    fileUrl?: true
    fileName?: true
    uploadDate?: true
    verificationStatus?: true
    adminNotes?: true
  }

  export type KycDocumentCountAggregateInputType = {
    id?: true
    userId?: true
    documentType?: true
    fileUrl?: true
    fileName?: true
    uploadDate?: true
    verificationStatus?: true
    adminNotes?: true
    _all?: true
  }

  export type KycDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KycDocument to aggregate.
     */
    where?: KycDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KycDocuments to fetch.
     */
    orderBy?: KycDocumentOrderByWithRelationInput | KycDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KycDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KycDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KycDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KycDocuments
    **/
    _count?: true | KycDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KycDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KycDocumentMaxAggregateInputType
  }

  export type GetKycDocumentAggregateType<T extends KycDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateKycDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKycDocument[P]>
      : GetScalarType<T[P], AggregateKycDocument[P]>
  }




  export type KycDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KycDocumentWhereInput
    orderBy?: KycDocumentOrderByWithAggregationInput | KycDocumentOrderByWithAggregationInput[]
    by: KycDocumentScalarFieldEnum[] | KycDocumentScalarFieldEnum
    having?: KycDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KycDocumentCountAggregateInputType | true
    _min?: KycDocumentMinAggregateInputType
    _max?: KycDocumentMaxAggregateInputType
  }

  export type KycDocumentGroupByOutputType = {
    id: string
    userId: string
    documentType: string
    fileUrl: string
    fileName: string
    uploadDate: Date
    verificationStatus: $Enums.VerificationStatus
    adminNotes: string | null
    _count: KycDocumentCountAggregateOutputType | null
    _min: KycDocumentMinAggregateOutputType | null
    _max: KycDocumentMaxAggregateOutputType | null
  }

  type GetKycDocumentGroupByPayload<T extends KycDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KycDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KycDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KycDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], KycDocumentGroupByOutputType[P]>
        }
      >
    >


  export type KycDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentType?: boolean
    fileUrl?: boolean
    fileName?: boolean
    uploadDate?: boolean
    verificationStatus?: boolean
    adminNotes?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kycDocument"]>

  export type KycDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentType?: boolean
    fileUrl?: boolean
    fileName?: boolean
    uploadDate?: boolean
    verificationStatus?: boolean
    adminNotes?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kycDocument"]>

  export type KycDocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentType?: boolean
    fileUrl?: boolean
    fileName?: boolean
    uploadDate?: boolean
    verificationStatus?: boolean
    adminNotes?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kycDocument"]>

  export type KycDocumentSelectScalar = {
    id?: boolean
    userId?: boolean
    documentType?: boolean
    fileUrl?: boolean
    fileName?: boolean
    uploadDate?: boolean
    verificationStatus?: boolean
    adminNotes?: boolean
  }

  export type KycDocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "documentType" | "fileUrl" | "fileName" | "uploadDate" | "verificationStatus" | "adminNotes", ExtArgs["result"]["kycDocument"]>
  export type KycDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type KycDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type KycDocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $KycDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KycDocument"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      documentType: string
      fileUrl: string
      fileName: string
      uploadDate: Date
      verificationStatus: $Enums.VerificationStatus
      adminNotes: string | null
    }, ExtArgs["result"]["kycDocument"]>
    composites: {}
  }

  type KycDocumentGetPayload<S extends boolean | null | undefined | KycDocumentDefaultArgs> = $Result.GetResult<Prisma.$KycDocumentPayload, S>

  type KycDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KycDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KycDocumentCountAggregateInputType | true
    }

  export interface KycDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KycDocument'], meta: { name: 'KycDocument' } }
    /**
     * Find zero or one KycDocument that matches the filter.
     * @param {KycDocumentFindUniqueArgs} args - Arguments to find a KycDocument
     * @example
     * // Get one KycDocument
     * const kycDocument = await prisma.kycDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KycDocumentFindUniqueArgs>(args: SelectSubset<T, KycDocumentFindUniqueArgs<ExtArgs>>): Prisma__KycDocumentClient<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KycDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KycDocumentFindUniqueOrThrowArgs} args - Arguments to find a KycDocument
     * @example
     * // Get one KycDocument
     * const kycDocument = await prisma.kycDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KycDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, KycDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KycDocumentClient<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KycDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycDocumentFindFirstArgs} args - Arguments to find a KycDocument
     * @example
     * // Get one KycDocument
     * const kycDocument = await prisma.kycDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KycDocumentFindFirstArgs>(args?: SelectSubset<T, KycDocumentFindFirstArgs<ExtArgs>>): Prisma__KycDocumentClient<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KycDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycDocumentFindFirstOrThrowArgs} args - Arguments to find a KycDocument
     * @example
     * // Get one KycDocument
     * const kycDocument = await prisma.kycDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KycDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, KycDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__KycDocumentClient<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KycDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KycDocuments
     * const kycDocuments = await prisma.kycDocument.findMany()
     * 
     * // Get first 10 KycDocuments
     * const kycDocuments = await prisma.kycDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kycDocumentWithIdOnly = await prisma.kycDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KycDocumentFindManyArgs>(args?: SelectSubset<T, KycDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KycDocument.
     * @param {KycDocumentCreateArgs} args - Arguments to create a KycDocument.
     * @example
     * // Create one KycDocument
     * const KycDocument = await prisma.kycDocument.create({
     *   data: {
     *     // ... data to create a KycDocument
     *   }
     * })
     * 
     */
    create<T extends KycDocumentCreateArgs>(args: SelectSubset<T, KycDocumentCreateArgs<ExtArgs>>): Prisma__KycDocumentClient<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KycDocuments.
     * @param {KycDocumentCreateManyArgs} args - Arguments to create many KycDocuments.
     * @example
     * // Create many KycDocuments
     * const kycDocument = await prisma.kycDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KycDocumentCreateManyArgs>(args?: SelectSubset<T, KycDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KycDocuments and returns the data saved in the database.
     * @param {KycDocumentCreateManyAndReturnArgs} args - Arguments to create many KycDocuments.
     * @example
     * // Create many KycDocuments
     * const kycDocument = await prisma.kycDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KycDocuments and only return the `id`
     * const kycDocumentWithIdOnly = await prisma.kycDocument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KycDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, KycDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KycDocument.
     * @param {KycDocumentDeleteArgs} args - Arguments to delete one KycDocument.
     * @example
     * // Delete one KycDocument
     * const KycDocument = await prisma.kycDocument.delete({
     *   where: {
     *     // ... filter to delete one KycDocument
     *   }
     * })
     * 
     */
    delete<T extends KycDocumentDeleteArgs>(args: SelectSubset<T, KycDocumentDeleteArgs<ExtArgs>>): Prisma__KycDocumentClient<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KycDocument.
     * @param {KycDocumentUpdateArgs} args - Arguments to update one KycDocument.
     * @example
     * // Update one KycDocument
     * const kycDocument = await prisma.kycDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KycDocumentUpdateArgs>(args: SelectSubset<T, KycDocumentUpdateArgs<ExtArgs>>): Prisma__KycDocumentClient<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KycDocuments.
     * @param {KycDocumentDeleteManyArgs} args - Arguments to filter KycDocuments to delete.
     * @example
     * // Delete a few KycDocuments
     * const { count } = await prisma.kycDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KycDocumentDeleteManyArgs>(args?: SelectSubset<T, KycDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KycDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KycDocuments
     * const kycDocument = await prisma.kycDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KycDocumentUpdateManyArgs>(args: SelectSubset<T, KycDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KycDocuments and returns the data updated in the database.
     * @param {KycDocumentUpdateManyAndReturnArgs} args - Arguments to update many KycDocuments.
     * @example
     * // Update many KycDocuments
     * const kycDocument = await prisma.kycDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KycDocuments and only return the `id`
     * const kycDocumentWithIdOnly = await prisma.kycDocument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KycDocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, KycDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KycDocument.
     * @param {KycDocumentUpsertArgs} args - Arguments to update or create a KycDocument.
     * @example
     * // Update or create a KycDocument
     * const kycDocument = await prisma.kycDocument.upsert({
     *   create: {
     *     // ... data to create a KycDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KycDocument we want to update
     *   }
     * })
     */
    upsert<T extends KycDocumentUpsertArgs>(args: SelectSubset<T, KycDocumentUpsertArgs<ExtArgs>>): Prisma__KycDocumentClient<$Result.GetResult<Prisma.$KycDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KycDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycDocumentCountArgs} args - Arguments to filter KycDocuments to count.
     * @example
     * // Count the number of KycDocuments
     * const count = await prisma.kycDocument.count({
     *   where: {
     *     // ... the filter for the KycDocuments we want to count
     *   }
     * })
    **/
    count<T extends KycDocumentCountArgs>(
      args?: Subset<T, KycDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KycDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KycDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KycDocumentAggregateArgs>(args: Subset<T, KycDocumentAggregateArgs>): Prisma.PrismaPromise<GetKycDocumentAggregateType<T>>

    /**
     * Group by KycDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KycDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KycDocumentGroupByArgs['orderBy'] }
        : { orderBy?: KycDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KycDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKycDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KycDocument model
   */
  readonly fields: KycDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KycDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KycDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KycDocument model
   */
  interface KycDocumentFieldRefs {
    readonly id: FieldRef<"KycDocument", 'String'>
    readonly userId: FieldRef<"KycDocument", 'String'>
    readonly documentType: FieldRef<"KycDocument", 'String'>
    readonly fileUrl: FieldRef<"KycDocument", 'String'>
    readonly fileName: FieldRef<"KycDocument", 'String'>
    readonly uploadDate: FieldRef<"KycDocument", 'DateTime'>
    readonly verificationStatus: FieldRef<"KycDocument", 'VerificationStatus'>
    readonly adminNotes: FieldRef<"KycDocument", 'String'>
  }
    

  // Custom InputTypes
  /**
   * KycDocument findUnique
   */
  export type KycDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * Filter, which KycDocument to fetch.
     */
    where: KycDocumentWhereUniqueInput
  }

  /**
   * KycDocument findUniqueOrThrow
   */
  export type KycDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * Filter, which KycDocument to fetch.
     */
    where: KycDocumentWhereUniqueInput
  }

  /**
   * KycDocument findFirst
   */
  export type KycDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * Filter, which KycDocument to fetch.
     */
    where?: KycDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KycDocuments to fetch.
     */
    orderBy?: KycDocumentOrderByWithRelationInput | KycDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KycDocuments.
     */
    cursor?: KycDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KycDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KycDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KycDocuments.
     */
    distinct?: KycDocumentScalarFieldEnum | KycDocumentScalarFieldEnum[]
  }

  /**
   * KycDocument findFirstOrThrow
   */
  export type KycDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * Filter, which KycDocument to fetch.
     */
    where?: KycDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KycDocuments to fetch.
     */
    orderBy?: KycDocumentOrderByWithRelationInput | KycDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KycDocuments.
     */
    cursor?: KycDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KycDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KycDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KycDocuments.
     */
    distinct?: KycDocumentScalarFieldEnum | KycDocumentScalarFieldEnum[]
  }

  /**
   * KycDocument findMany
   */
  export type KycDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * Filter, which KycDocuments to fetch.
     */
    where?: KycDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KycDocuments to fetch.
     */
    orderBy?: KycDocumentOrderByWithRelationInput | KycDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KycDocuments.
     */
    cursor?: KycDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KycDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KycDocuments.
     */
    skip?: number
    distinct?: KycDocumentScalarFieldEnum | KycDocumentScalarFieldEnum[]
  }

  /**
   * KycDocument create
   */
  export type KycDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a KycDocument.
     */
    data: XOR<KycDocumentCreateInput, KycDocumentUncheckedCreateInput>
  }

  /**
   * KycDocument createMany
   */
  export type KycDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KycDocuments.
     */
    data: KycDocumentCreateManyInput | KycDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KycDocument createManyAndReturn
   */
  export type KycDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * The data used to create many KycDocuments.
     */
    data: KycDocumentCreateManyInput | KycDocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KycDocument update
   */
  export type KycDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a KycDocument.
     */
    data: XOR<KycDocumentUpdateInput, KycDocumentUncheckedUpdateInput>
    /**
     * Choose, which KycDocument to update.
     */
    where: KycDocumentWhereUniqueInput
  }

  /**
   * KycDocument updateMany
   */
  export type KycDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KycDocuments.
     */
    data: XOR<KycDocumentUpdateManyMutationInput, KycDocumentUncheckedUpdateManyInput>
    /**
     * Filter which KycDocuments to update
     */
    where?: KycDocumentWhereInput
    /**
     * Limit how many KycDocuments to update.
     */
    limit?: number
  }

  /**
   * KycDocument updateManyAndReturn
   */
  export type KycDocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * The data used to update KycDocuments.
     */
    data: XOR<KycDocumentUpdateManyMutationInput, KycDocumentUncheckedUpdateManyInput>
    /**
     * Filter which KycDocuments to update
     */
    where?: KycDocumentWhereInput
    /**
     * Limit how many KycDocuments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KycDocument upsert
   */
  export type KycDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the KycDocument to update in case it exists.
     */
    where: KycDocumentWhereUniqueInput
    /**
     * In case the KycDocument found by the `where` argument doesn't exist, create a new KycDocument with this data.
     */
    create: XOR<KycDocumentCreateInput, KycDocumentUncheckedCreateInput>
    /**
     * In case the KycDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KycDocumentUpdateInput, KycDocumentUncheckedUpdateInput>
  }

  /**
   * KycDocument delete
   */
  export type KycDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
    /**
     * Filter which KycDocument to delete.
     */
    where: KycDocumentWhereUniqueInput
  }

  /**
   * KycDocument deleteMany
   */
  export type KycDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KycDocuments to delete
     */
    where?: KycDocumentWhereInput
    /**
     * Limit how many KycDocuments to delete.
     */
    limit?: number
  }

  /**
   * KycDocument without action
   */
  export type KycDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KycDocument
     */
    select?: KycDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KycDocument
     */
    omit?: KycDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycDocumentInclude<ExtArgs> | null
  }


  /**
   * Model AdminUser
   */

  export type AggregateAdminUser = {
    _count: AdminUserCountAggregateOutputType | null
    _avg: AdminUserAvgAggregateOutputType | null
    _sum: AdminUserSumAggregateOutputType | null
    _min: AdminUserMinAggregateOutputType | null
    _max: AdminUserMaxAggregateOutputType | null
  }

  export type AdminUserAvgAggregateOutputType = {
    failedAttempts: number | null
  }

  export type AdminUserSumAggregateOutputType = {
    failedAttempts: number | null
  }

  export type AdminUserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.AdminRole | null
    lastLogin: Date | null
    createdAt: Date | null
    failedAttempts: number | null
    isActive: boolean | null
    lockedUntil: Date | null
    updatedAt: Date | null
  }

  export type AdminUserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.AdminRole | null
    lastLogin: Date | null
    createdAt: Date | null
    failedAttempts: number | null
    isActive: boolean | null
    lockedUntil: Date | null
    updatedAt: Date | null
  }

  export type AdminUserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    name: number
    role: number
    lastLogin: number
    createdAt: number
    failedAttempts: number
    isActive: number
    lockedUntil: number
    updatedAt: number
    _all: number
  }


  export type AdminUserAvgAggregateInputType = {
    failedAttempts?: true
  }

  export type AdminUserSumAggregateInputType = {
    failedAttempts?: true
  }

  export type AdminUserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    lastLogin?: true
    createdAt?: true
    failedAttempts?: true
    isActive?: true
    lockedUntil?: true
    updatedAt?: true
  }

  export type AdminUserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    lastLogin?: true
    createdAt?: true
    failedAttempts?: true
    isActive?: true
    lockedUntil?: true
    updatedAt?: true
  }

  export type AdminUserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    lastLogin?: true
    createdAt?: true
    failedAttempts?: true
    isActive?: true
    lockedUntil?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminUser to aggregate.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminUsers
    **/
    _count?: true | AdminUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminUserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminUserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminUserMaxAggregateInputType
  }

  export type GetAdminUserAggregateType<T extends AdminUserAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminUser[P]>
      : GetScalarType<T[P], AggregateAdminUser[P]>
  }




  export type AdminUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminUserWhereInput
    orderBy?: AdminUserOrderByWithAggregationInput | AdminUserOrderByWithAggregationInput[]
    by: AdminUserScalarFieldEnum[] | AdminUserScalarFieldEnum
    having?: AdminUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminUserCountAggregateInputType | true
    _avg?: AdminUserAvgAggregateInputType
    _sum?: AdminUserSumAggregateInputType
    _min?: AdminUserMinAggregateInputType
    _max?: AdminUserMaxAggregateInputType
  }

  export type AdminUserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    name: string
    role: $Enums.AdminRole
    lastLogin: Date | null
    createdAt: Date
    failedAttempts: number
    isActive: boolean
    lockedUntil: Date | null
    updatedAt: Date
    _count: AdminUserCountAggregateOutputType | null
    _avg: AdminUserAvgAggregateOutputType | null
    _sum: AdminUserSumAggregateOutputType | null
    _min: AdminUserMinAggregateOutputType | null
    _max: AdminUserMaxAggregateOutputType | null
  }

  type GetAdminUserGroupByPayload<T extends AdminUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminUserGroupByOutputType[P]>
            : GetScalarType<T[P], AdminUserGroupByOutputType[P]>
        }
      >
    >


  export type AdminUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    lastLogin?: boolean
    createdAt?: boolean
    failedAttempts?: boolean
    isActive?: boolean
    lockedUntil?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    lastLogin?: boolean
    createdAt?: boolean
    failedAttempts?: boolean
    isActive?: boolean
    lockedUntil?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    lastLogin?: boolean
    createdAt?: boolean
    failedAttempts?: boolean
    isActive?: boolean
    lockedUntil?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    lastLogin?: boolean
    createdAt?: boolean
    failedAttempts?: boolean
    isActive?: boolean
    lockedUntil?: boolean
    updatedAt?: boolean
  }

  export type AdminUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "name" | "role" | "lastLogin" | "createdAt" | "failedAttempts" | "isActive" | "lockedUntil" | "updatedAt", ExtArgs["result"]["adminUser"]>

  export type $AdminUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      name: string
      role: $Enums.AdminRole
      lastLogin: Date | null
      createdAt: Date
      failedAttempts: number
      isActive: boolean
      lockedUntil: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["adminUser"]>
    composites: {}
  }

  type AdminUserGetPayload<S extends boolean | null | undefined | AdminUserDefaultArgs> = $Result.GetResult<Prisma.$AdminUserPayload, S>

  type AdminUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminUserCountAggregateInputType | true
    }

  export interface AdminUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminUser'], meta: { name: 'AdminUser' } }
    /**
     * Find zero or one AdminUser that matches the filter.
     * @param {AdminUserFindUniqueArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminUserFindUniqueArgs>(args: SelectSubset<T, AdminUserFindUniqueArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdminUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminUserFindUniqueOrThrowArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminUserFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindFirstArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminUserFindFirstArgs>(args?: SelectSubset<T, AdminUserFindFirstArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindFirstOrThrowArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminUserFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminUsers
     * const adminUsers = await prisma.adminUser.findMany()
     * 
     * // Get first 10 AdminUsers
     * const adminUsers = await prisma.adminUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminUserFindManyArgs>(args?: SelectSubset<T, AdminUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdminUser.
     * @param {AdminUserCreateArgs} args - Arguments to create a AdminUser.
     * @example
     * // Create one AdminUser
     * const AdminUser = await prisma.adminUser.create({
     *   data: {
     *     // ... data to create a AdminUser
     *   }
     * })
     * 
     */
    create<T extends AdminUserCreateArgs>(args: SelectSubset<T, AdminUserCreateArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdminUsers.
     * @param {AdminUserCreateManyArgs} args - Arguments to create many AdminUsers.
     * @example
     * // Create many AdminUsers
     * const adminUser = await prisma.adminUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminUserCreateManyArgs>(args?: SelectSubset<T, AdminUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminUsers and returns the data saved in the database.
     * @param {AdminUserCreateManyAndReturnArgs} args - Arguments to create many AdminUsers.
     * @example
     * // Create many AdminUsers
     * const adminUser = await prisma.adminUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminUsers and only return the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminUserCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AdminUser.
     * @param {AdminUserDeleteArgs} args - Arguments to delete one AdminUser.
     * @example
     * // Delete one AdminUser
     * const AdminUser = await prisma.adminUser.delete({
     *   where: {
     *     // ... filter to delete one AdminUser
     *   }
     * })
     * 
     */
    delete<T extends AdminUserDeleteArgs>(args: SelectSubset<T, AdminUserDeleteArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdminUser.
     * @param {AdminUserUpdateArgs} args - Arguments to update one AdminUser.
     * @example
     * // Update one AdminUser
     * const adminUser = await prisma.adminUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUserUpdateArgs>(args: SelectSubset<T, AdminUserUpdateArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdminUsers.
     * @param {AdminUserDeleteManyArgs} args - Arguments to filter AdminUsers to delete.
     * @example
     * // Delete a few AdminUsers
     * const { count } = await prisma.adminUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminUserDeleteManyArgs>(args?: SelectSubset<T, AdminUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminUsers
     * const adminUser = await prisma.adminUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUserUpdateManyArgs>(args: SelectSubset<T, AdminUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminUsers and returns the data updated in the database.
     * @param {AdminUserUpdateManyAndReturnArgs} args - Arguments to update many AdminUsers.
     * @example
     * // Update many AdminUsers
     * const adminUser = await prisma.adminUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AdminUsers and only return the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminUserUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AdminUser.
     * @param {AdminUserUpsertArgs} args - Arguments to update or create a AdminUser.
     * @example
     * // Update or create a AdminUser
     * const adminUser = await prisma.adminUser.upsert({
     *   create: {
     *     // ... data to create a AdminUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminUser we want to update
     *   }
     * })
     */
    upsert<T extends AdminUserUpsertArgs>(args: SelectSubset<T, AdminUserUpsertArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserCountArgs} args - Arguments to filter AdminUsers to count.
     * @example
     * // Count the number of AdminUsers
     * const count = await prisma.adminUser.count({
     *   where: {
     *     // ... the filter for the AdminUsers we want to count
     *   }
     * })
    **/
    count<T extends AdminUserCountArgs>(
      args?: Subset<T, AdminUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminUserAggregateArgs>(args: Subset<T, AdminUserAggregateArgs>): Prisma.PrismaPromise<GetAdminUserAggregateType<T>>

    /**
     * Group by AdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminUserGroupByArgs['orderBy'] }
        : { orderBy?: AdminUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminUser model
   */
  readonly fields: AdminUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminUser model
   */
  interface AdminUserFieldRefs {
    readonly id: FieldRef<"AdminUser", 'String'>
    readonly email: FieldRef<"AdminUser", 'String'>
    readonly passwordHash: FieldRef<"AdminUser", 'String'>
    readonly name: FieldRef<"AdminUser", 'String'>
    readonly role: FieldRef<"AdminUser", 'AdminRole'>
    readonly lastLogin: FieldRef<"AdminUser", 'DateTime'>
    readonly createdAt: FieldRef<"AdminUser", 'DateTime'>
    readonly failedAttempts: FieldRef<"AdminUser", 'Int'>
    readonly isActive: FieldRef<"AdminUser", 'Boolean'>
    readonly lockedUntil: FieldRef<"AdminUser", 'DateTime'>
    readonly updatedAt: FieldRef<"AdminUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminUser findUnique
   */
  export type AdminUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser findUniqueOrThrow
   */
  export type AdminUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser findFirst
   */
  export type AdminUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser findFirstOrThrow
   */
  export type AdminUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser findMany
   */
  export type AdminUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUsers to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser create
   */
  export type AdminUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data needed to create a AdminUser.
     */
    data: XOR<AdminUserCreateInput, AdminUserUncheckedCreateInput>
  }

  /**
   * AdminUser createMany
   */
  export type AdminUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminUsers.
     */
    data: AdminUserCreateManyInput | AdminUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminUser createManyAndReturn
   */
  export type AdminUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data used to create many AdminUsers.
     */
    data: AdminUserCreateManyInput | AdminUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminUser update
   */
  export type AdminUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data needed to update a AdminUser.
     */
    data: XOR<AdminUserUpdateInput, AdminUserUncheckedUpdateInput>
    /**
     * Choose, which AdminUser to update.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser updateMany
   */
  export type AdminUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminUsers.
     */
    data: XOR<AdminUserUpdateManyMutationInput, AdminUserUncheckedUpdateManyInput>
    /**
     * Filter which AdminUsers to update
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to update.
     */
    limit?: number
  }

  /**
   * AdminUser updateManyAndReturn
   */
  export type AdminUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data used to update AdminUsers.
     */
    data: XOR<AdminUserUpdateManyMutationInput, AdminUserUncheckedUpdateManyInput>
    /**
     * Filter which AdminUsers to update
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to update.
     */
    limit?: number
  }

  /**
   * AdminUser upsert
   */
  export type AdminUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The filter to search for the AdminUser to update in case it exists.
     */
    where: AdminUserWhereUniqueInput
    /**
     * In case the AdminUser found by the `where` argument doesn't exist, create a new AdminUser with this data.
     */
    create: XOR<AdminUserCreateInput, AdminUserUncheckedCreateInput>
    /**
     * In case the AdminUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUserUpdateInput, AdminUserUncheckedUpdateInput>
  }

  /**
   * AdminUser delete
   */
  export type AdminUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter which AdminUser to delete.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser deleteMany
   */
  export type AdminUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminUsers to delete
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to delete.
     */
    limit?: number
  }

  /**
   * AdminUser without action
   */
  export type AdminUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
  }


  /**
   * Model RegistrationSession
   */

  export type AggregateRegistrationSession = {
    _count: RegistrationSessionCountAggregateOutputType | null
    _min: RegistrationSessionMinAggregateOutputType | null
    _max: RegistrationSessionMaxAggregateOutputType | null
  }

  export type RegistrationSessionMinAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    data: string | null
    type: $Enums.SessionType | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RegistrationSessionMaxAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    data: string | null
    type: $Enums.SessionType | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RegistrationSessionCountAggregateOutputType = {
    id: number
    email: number
    phone: number
    data: number
    type: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type RegistrationSessionMinAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    data?: true
    type?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RegistrationSessionMaxAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    data?: true
    type?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RegistrationSessionCountAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    data?: true
    type?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type RegistrationSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationSession to aggregate.
     */
    where?: RegistrationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationSessions to fetch.
     */
    orderBy?: RegistrationSessionOrderByWithRelationInput | RegistrationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RegistrationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RegistrationSessions
    **/
    _count?: true | RegistrationSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RegistrationSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RegistrationSessionMaxAggregateInputType
  }

  export type GetRegistrationSessionAggregateType<T extends RegistrationSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateRegistrationSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRegistrationSession[P]>
      : GetScalarType<T[P], AggregateRegistrationSession[P]>
  }




  export type RegistrationSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegistrationSessionWhereInput
    orderBy?: RegistrationSessionOrderByWithAggregationInput | RegistrationSessionOrderByWithAggregationInput[]
    by: RegistrationSessionScalarFieldEnum[] | RegistrationSessionScalarFieldEnum
    having?: RegistrationSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RegistrationSessionCountAggregateInputType | true
    _min?: RegistrationSessionMinAggregateInputType
    _max?: RegistrationSessionMaxAggregateInputType
  }

  export type RegistrationSessionGroupByOutputType = {
    id: string
    email: string
    phone: string
    data: string
    type: $Enums.SessionType
    expiresAt: Date
    createdAt: Date
    _count: RegistrationSessionCountAggregateOutputType | null
    _min: RegistrationSessionMinAggregateOutputType | null
    _max: RegistrationSessionMaxAggregateOutputType | null
  }

  type GetRegistrationSessionGroupByPayload<T extends RegistrationSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RegistrationSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RegistrationSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RegistrationSessionGroupByOutputType[P]>
            : GetScalarType<T[P], RegistrationSessionGroupByOutputType[P]>
        }
      >
    >


  export type RegistrationSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    data?: boolean
    type?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    otpCodes?: boolean | RegistrationSession$otpCodesArgs<ExtArgs>
    _count?: boolean | RegistrationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registrationSession"]>

  export type RegistrationSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    data?: boolean
    type?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["registrationSession"]>

  export type RegistrationSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    data?: boolean
    type?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["registrationSession"]>

  export type RegistrationSessionSelectScalar = {
    id?: boolean
    email?: boolean
    phone?: boolean
    data?: boolean
    type?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type RegistrationSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "phone" | "data" | "type" | "expiresAt" | "createdAt", ExtArgs["result"]["registrationSession"]>
  export type RegistrationSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    otpCodes?: boolean | RegistrationSession$otpCodesArgs<ExtArgs>
    _count?: boolean | RegistrationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RegistrationSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RegistrationSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RegistrationSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RegistrationSession"
    objects: {
      otpCodes: Prisma.$OtpCodePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      phone: string
      data: string
      type: $Enums.SessionType
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["registrationSession"]>
    composites: {}
  }

  type RegistrationSessionGetPayload<S extends boolean | null | undefined | RegistrationSessionDefaultArgs> = $Result.GetResult<Prisma.$RegistrationSessionPayload, S>

  type RegistrationSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RegistrationSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RegistrationSessionCountAggregateInputType | true
    }

  export interface RegistrationSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RegistrationSession'], meta: { name: 'RegistrationSession' } }
    /**
     * Find zero or one RegistrationSession that matches the filter.
     * @param {RegistrationSessionFindUniqueArgs} args - Arguments to find a RegistrationSession
     * @example
     * // Get one RegistrationSession
     * const registrationSession = await prisma.registrationSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegistrationSessionFindUniqueArgs>(args: SelectSubset<T, RegistrationSessionFindUniqueArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RegistrationSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegistrationSessionFindUniqueOrThrowArgs} args - Arguments to find a RegistrationSession
     * @example
     * // Get one RegistrationSession
     * const registrationSession = await prisma.registrationSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegistrationSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, RegistrationSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegistrationSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationSessionFindFirstArgs} args - Arguments to find a RegistrationSession
     * @example
     * // Get one RegistrationSession
     * const registrationSession = await prisma.registrationSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegistrationSessionFindFirstArgs>(args?: SelectSubset<T, RegistrationSessionFindFirstArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegistrationSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationSessionFindFirstOrThrowArgs} args - Arguments to find a RegistrationSession
     * @example
     * // Get one RegistrationSession
     * const registrationSession = await prisma.registrationSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegistrationSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, RegistrationSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RegistrationSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegistrationSessions
     * const registrationSessions = await prisma.registrationSession.findMany()
     * 
     * // Get first 10 RegistrationSessions
     * const registrationSessions = await prisma.registrationSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const registrationSessionWithIdOnly = await prisma.registrationSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RegistrationSessionFindManyArgs>(args?: SelectSubset<T, RegistrationSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RegistrationSession.
     * @param {RegistrationSessionCreateArgs} args - Arguments to create a RegistrationSession.
     * @example
     * // Create one RegistrationSession
     * const RegistrationSession = await prisma.registrationSession.create({
     *   data: {
     *     // ... data to create a RegistrationSession
     *   }
     * })
     * 
     */
    create<T extends RegistrationSessionCreateArgs>(args: SelectSubset<T, RegistrationSessionCreateArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RegistrationSessions.
     * @param {RegistrationSessionCreateManyArgs} args - Arguments to create many RegistrationSessions.
     * @example
     * // Create many RegistrationSessions
     * const registrationSession = await prisma.registrationSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RegistrationSessionCreateManyArgs>(args?: SelectSubset<T, RegistrationSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RegistrationSessions and returns the data saved in the database.
     * @param {RegistrationSessionCreateManyAndReturnArgs} args - Arguments to create many RegistrationSessions.
     * @example
     * // Create many RegistrationSessions
     * const registrationSession = await prisma.registrationSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RegistrationSessions and only return the `id`
     * const registrationSessionWithIdOnly = await prisma.registrationSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RegistrationSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, RegistrationSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RegistrationSession.
     * @param {RegistrationSessionDeleteArgs} args - Arguments to delete one RegistrationSession.
     * @example
     * // Delete one RegistrationSession
     * const RegistrationSession = await prisma.registrationSession.delete({
     *   where: {
     *     // ... filter to delete one RegistrationSession
     *   }
     * })
     * 
     */
    delete<T extends RegistrationSessionDeleteArgs>(args: SelectSubset<T, RegistrationSessionDeleteArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RegistrationSession.
     * @param {RegistrationSessionUpdateArgs} args - Arguments to update one RegistrationSession.
     * @example
     * // Update one RegistrationSession
     * const registrationSession = await prisma.registrationSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RegistrationSessionUpdateArgs>(args: SelectSubset<T, RegistrationSessionUpdateArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RegistrationSessions.
     * @param {RegistrationSessionDeleteManyArgs} args - Arguments to filter RegistrationSessions to delete.
     * @example
     * // Delete a few RegistrationSessions
     * const { count } = await prisma.registrationSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RegistrationSessionDeleteManyArgs>(args?: SelectSubset<T, RegistrationSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegistrationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegistrationSessions
     * const registrationSession = await prisma.registrationSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RegistrationSessionUpdateManyArgs>(args: SelectSubset<T, RegistrationSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegistrationSessions and returns the data updated in the database.
     * @param {RegistrationSessionUpdateManyAndReturnArgs} args - Arguments to update many RegistrationSessions.
     * @example
     * // Update many RegistrationSessions
     * const registrationSession = await prisma.registrationSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RegistrationSessions and only return the `id`
     * const registrationSessionWithIdOnly = await prisma.registrationSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RegistrationSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, RegistrationSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RegistrationSession.
     * @param {RegistrationSessionUpsertArgs} args - Arguments to update or create a RegistrationSession.
     * @example
     * // Update or create a RegistrationSession
     * const registrationSession = await prisma.registrationSession.upsert({
     *   create: {
     *     // ... data to create a RegistrationSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegistrationSession we want to update
     *   }
     * })
     */
    upsert<T extends RegistrationSessionUpsertArgs>(args: SelectSubset<T, RegistrationSessionUpsertArgs<ExtArgs>>): Prisma__RegistrationSessionClient<$Result.GetResult<Prisma.$RegistrationSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RegistrationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationSessionCountArgs} args - Arguments to filter RegistrationSessions to count.
     * @example
     * // Count the number of RegistrationSessions
     * const count = await prisma.registrationSession.count({
     *   where: {
     *     // ... the filter for the RegistrationSessions we want to count
     *   }
     * })
    **/
    count<T extends RegistrationSessionCountArgs>(
      args?: Subset<T, RegistrationSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RegistrationSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RegistrationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RegistrationSessionAggregateArgs>(args: Subset<T, RegistrationSessionAggregateArgs>): Prisma.PrismaPromise<GetRegistrationSessionAggregateType<T>>

    /**
     * Group by RegistrationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RegistrationSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RegistrationSessionGroupByArgs['orderBy'] }
        : { orderBy?: RegistrationSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RegistrationSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegistrationSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RegistrationSession model
   */
  readonly fields: RegistrationSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RegistrationSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RegistrationSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    otpCodes<T extends RegistrationSession$otpCodesArgs<ExtArgs> = {}>(args?: Subset<T, RegistrationSession$otpCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RegistrationSession model
   */
  interface RegistrationSessionFieldRefs {
    readonly id: FieldRef<"RegistrationSession", 'String'>
    readonly email: FieldRef<"RegistrationSession", 'String'>
    readonly phone: FieldRef<"RegistrationSession", 'String'>
    readonly data: FieldRef<"RegistrationSession", 'String'>
    readonly type: FieldRef<"RegistrationSession", 'SessionType'>
    readonly expiresAt: FieldRef<"RegistrationSession", 'DateTime'>
    readonly createdAt: FieldRef<"RegistrationSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RegistrationSession findUnique
   */
  export type RegistrationSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationSession to fetch.
     */
    where: RegistrationSessionWhereUniqueInput
  }

  /**
   * RegistrationSession findUniqueOrThrow
   */
  export type RegistrationSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationSession to fetch.
     */
    where: RegistrationSessionWhereUniqueInput
  }

  /**
   * RegistrationSession findFirst
   */
  export type RegistrationSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationSession to fetch.
     */
    where?: RegistrationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationSessions to fetch.
     */
    orderBy?: RegistrationSessionOrderByWithRelationInput | RegistrationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegistrationSessions.
     */
    cursor?: RegistrationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegistrationSessions.
     */
    distinct?: RegistrationSessionScalarFieldEnum | RegistrationSessionScalarFieldEnum[]
  }

  /**
   * RegistrationSession findFirstOrThrow
   */
  export type RegistrationSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationSession to fetch.
     */
    where?: RegistrationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationSessions to fetch.
     */
    orderBy?: RegistrationSessionOrderByWithRelationInput | RegistrationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegistrationSessions.
     */
    cursor?: RegistrationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegistrationSessions.
     */
    distinct?: RegistrationSessionScalarFieldEnum | RegistrationSessionScalarFieldEnum[]
  }

  /**
   * RegistrationSession findMany
   */
  export type RegistrationSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationSessions to fetch.
     */
    where?: RegistrationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationSessions to fetch.
     */
    orderBy?: RegistrationSessionOrderByWithRelationInput | RegistrationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RegistrationSessions.
     */
    cursor?: RegistrationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationSessions.
     */
    skip?: number
    distinct?: RegistrationSessionScalarFieldEnum | RegistrationSessionScalarFieldEnum[]
  }

  /**
   * RegistrationSession create
   */
  export type RegistrationSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a RegistrationSession.
     */
    data: XOR<RegistrationSessionCreateInput, RegistrationSessionUncheckedCreateInput>
  }

  /**
   * RegistrationSession createMany
   */
  export type RegistrationSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RegistrationSessions.
     */
    data: RegistrationSessionCreateManyInput | RegistrationSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RegistrationSession createManyAndReturn
   */
  export type RegistrationSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * The data used to create many RegistrationSessions.
     */
    data: RegistrationSessionCreateManyInput | RegistrationSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RegistrationSession update
   */
  export type RegistrationSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a RegistrationSession.
     */
    data: XOR<RegistrationSessionUpdateInput, RegistrationSessionUncheckedUpdateInput>
    /**
     * Choose, which RegistrationSession to update.
     */
    where: RegistrationSessionWhereUniqueInput
  }

  /**
   * RegistrationSession updateMany
   */
  export type RegistrationSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RegistrationSessions.
     */
    data: XOR<RegistrationSessionUpdateManyMutationInput, RegistrationSessionUncheckedUpdateManyInput>
    /**
     * Filter which RegistrationSessions to update
     */
    where?: RegistrationSessionWhereInput
    /**
     * Limit how many RegistrationSessions to update.
     */
    limit?: number
  }

  /**
   * RegistrationSession updateManyAndReturn
   */
  export type RegistrationSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * The data used to update RegistrationSessions.
     */
    data: XOR<RegistrationSessionUpdateManyMutationInput, RegistrationSessionUncheckedUpdateManyInput>
    /**
     * Filter which RegistrationSessions to update
     */
    where?: RegistrationSessionWhereInput
    /**
     * Limit how many RegistrationSessions to update.
     */
    limit?: number
  }

  /**
   * RegistrationSession upsert
   */
  export type RegistrationSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the RegistrationSession to update in case it exists.
     */
    where: RegistrationSessionWhereUniqueInput
    /**
     * In case the RegistrationSession found by the `where` argument doesn't exist, create a new RegistrationSession with this data.
     */
    create: XOR<RegistrationSessionCreateInput, RegistrationSessionUncheckedCreateInput>
    /**
     * In case the RegistrationSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RegistrationSessionUpdateInput, RegistrationSessionUncheckedUpdateInput>
  }

  /**
   * RegistrationSession delete
   */
  export type RegistrationSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
    /**
     * Filter which RegistrationSession to delete.
     */
    where: RegistrationSessionWhereUniqueInput
  }

  /**
   * RegistrationSession deleteMany
   */
  export type RegistrationSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationSessions to delete
     */
    where?: RegistrationSessionWhereInput
    /**
     * Limit how many RegistrationSessions to delete.
     */
    limit?: number
  }

  /**
   * RegistrationSession.otpCodes
   */
  export type RegistrationSession$otpCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpCode
     */
    select?: OtpCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpCode
     */
    omit?: OtpCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OtpCodeInclude<ExtArgs> | null
    where?: OtpCodeWhereInput
    orderBy?: OtpCodeOrderByWithRelationInput | OtpCodeOrderByWithRelationInput[]
    cursor?: OtpCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OtpCodeScalarFieldEnum | OtpCodeScalarFieldEnum[]
  }

  /**
   * RegistrationSession without action
   */
  export type RegistrationSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationSession
     */
    select?: RegistrationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationSession
     */
    omit?: RegistrationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationSessionInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    message: string | null
    type: $Enums.NotificationType | null
    priority: $Enums.NotificationPriority | null
    isRead: boolean | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    message: string | null
    type: $Enums.NotificationType | null
    priority: $Enums.NotificationPriority | null
    isRead: boolean | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    message: number
    type: number
    priority: number
    isRead: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    priority?: true
    isRead?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    priority?: true
    isRead?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    priority?: true
    isRead?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    title: string
    message: string
    type: $Enums.NotificationType
    priority: $Enums.NotificationPriority
    isRead: boolean
    metadata: string | null
    createdAt: Date
    updatedAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    priority?: boolean
    isRead?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    priority?: boolean
    isRead?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    priority?: boolean
    isRead?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    priority?: boolean
    isRead?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "message" | "type" | "priority" | "isRead" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      message: string
      type: $Enums.NotificationType
      priority: $Enums.NotificationPriority
      isRead: boolean
      metadata: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'NotificationType'>
    readonly priority: FieldRef<"Notification", 'NotificationPriority'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly metadata: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
    readonly updatedAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    phone: 'phone',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    dateOfBirth: 'dateOfBirth',
    nationality: 'nationality',
    address: 'address',
    city: 'city',
    preferredLanguage: 'preferredLanguage',
    emailVerified: 'emailVerified',
    phoneVerified: 'phoneVerified',
    otpVerifiedAt: 'otpVerifiedAt',
    kycStatus: 'kycStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    civilite: 'civilite',
    country: 'country',
    region: 'region',
    department: 'department',
    arrondissement: 'arrondissement',
    district: 'district',
    domaineActivite: 'domaineActivite',
    idExpiryDate: 'idExpiryDate',
    idIssueDate: 'idIssueDate',
    idNumber: 'idNumber',
    idType: 'idType',
    marketingAccepted: 'marketingAccepted',
    metiers: 'metiers',
    placeOfBirth: 'placeOfBirth',
    privacyAccepted: 'privacyAccepted',
    signature: 'signature',
    statutEmploi: 'statutEmploi',
    termsAccepted: 'termsAccepted'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires',
    createdAt: 'createdAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const OtpCodeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    registrationSessionId: 'registrationSessionId',
    code: 'code',
    type: 'type',
    expiresAt: 'expiresAt',
    used: 'used',
    createdAt: 'createdAt'
  };

  export type OtpCodeScalarFieldEnum = (typeof OtpCodeScalarFieldEnum)[keyof typeof OtpCodeScalarFieldEnum]


  export const UserAccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    accountType: 'accountType',
    accountNumber: 'accountNumber',
    productCode: 'productCode',
    productName: 'productName',
    interestRate: 'interestRate',
    lockPeriodMonths: 'lockPeriodMonths',
    lockedUntil: 'lockedUntil',
    allowAdditionalDeposits: 'allowAdditionalDeposits',
    metadata: 'metadata',
    balance: 'balance',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type UserAccountScalarFieldEnum = (typeof UserAccountScalarFieldEnum)[keyof typeof UserAccountScalarFieldEnum]


  export const TransactionIntentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    accountId: 'accountId',
    accountType: 'accountType',
    intentType: 'intentType',
    amount: 'amount',
    paymentMethod: 'paymentMethod',
    investmentTranche: 'investmentTranche',
    investmentTerm: 'investmentTerm',
    userNotes: 'userNotes',
    adminNotes: 'adminNotes',
    status: 'status',
    referenceNumber: 'referenceNumber',
    providerTransactionId: 'providerTransactionId',
    providerStatus: 'providerStatus',
    lastCallbackAt: 'lastCallbackAt',
    lastCallbackPayload: 'lastCallbackPayload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionIntentScalarFieldEnum = (typeof TransactionIntentScalarFieldEnum)[keyof typeof TransactionIntentScalarFieldEnum]


  export const PaymentCallbackLogScalarFieldEnum: {
    id: 'id',
    transactionIntentId: 'transactionIntentId',
    status: 'status',
    payload: 'payload',
    createdAt: 'createdAt'
  };

  export type PaymentCallbackLogScalarFieldEnum = (typeof PaymentCallbackLogScalarFieldEnum)[keyof typeof PaymentCallbackLogScalarFieldEnum]


  export const KycDocumentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    documentType: 'documentType',
    fileUrl: 'fileUrl',
    fileName: 'fileName',
    uploadDate: 'uploadDate',
    verificationStatus: 'verificationStatus',
    adminNotes: 'adminNotes'
  };

  export type KycDocumentScalarFieldEnum = (typeof KycDocumentScalarFieldEnum)[keyof typeof KycDocumentScalarFieldEnum]


  export const AdminUserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    role: 'role',
    lastLogin: 'lastLogin',
    createdAt: 'createdAt',
    failedAttempts: 'failedAttempts',
    isActive: 'isActive',
    lockedUntil: 'lockedUntil',
    updatedAt: 'updatedAt'
  };

  export type AdminUserScalarFieldEnum = (typeof AdminUserScalarFieldEnum)[keyof typeof AdminUserScalarFieldEnum]


  export const RegistrationSessionScalarFieldEnum: {
    id: 'id',
    email: 'email',
    phone: 'phone',
    data: 'data',
    type: 'type',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type RegistrationSessionScalarFieldEnum = (typeof RegistrationSessionScalarFieldEnum)[keyof typeof RegistrationSessionScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    message: 'message',
    type: 'type',
    priority: 'priority',
    isRead: 'isRead',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'KycStatus'
   */
  export type EnumKycStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KycStatus'>
    


  /**
   * Reference to a field of type 'KycStatus[]'
   */
  export type ListEnumKycStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KycStatus[]'>
    


  /**
   * Reference to a field of type 'OtpType'
   */
  export type EnumOtpTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OtpType'>
    


  /**
   * Reference to a field of type 'OtpType[]'
   */
  export type ListEnumOtpTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OtpType[]'>
    


  /**
   * Reference to a field of type 'AccountType'
   */
  export type EnumAccountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountType'>
    


  /**
   * Reference to a field of type 'AccountType[]'
   */
  export type ListEnumAccountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountType[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'AccountStatus'
   */
  export type EnumAccountStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountStatus'>
    


  /**
   * Reference to a field of type 'AccountStatus[]'
   */
  export type ListEnumAccountStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountStatus[]'>
    


  /**
   * Reference to a field of type 'IntentType'
   */
  export type EnumIntentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntentType'>
    


  /**
   * Reference to a field of type 'IntentType[]'
   */
  export type ListEnumIntentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntentType[]'>
    


  /**
   * Reference to a field of type 'TransactionStatus'
   */
  export type EnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus'>
    


  /**
   * Reference to a field of type 'TransactionStatus[]'
   */
  export type ListEnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus[]'>
    


  /**
   * Reference to a field of type 'VerificationStatus'
   */
  export type EnumVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationStatus'>
    


  /**
   * Reference to a field of type 'VerificationStatus[]'
   */
  export type ListEnumVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationStatus[]'>
    


  /**
   * Reference to a field of type 'AdminRole'
   */
  export type EnumAdminRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdminRole'>
    


  /**
   * Reference to a field of type 'AdminRole[]'
   */
  export type ListEnumAdminRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdminRole[]'>
    


  /**
   * Reference to a field of type 'SessionType'
   */
  export type EnumSessionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionType'>
    


  /**
   * Reference to a field of type 'SessionType[]'
   */
  export type ListEnumSessionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionType[]'>
    


  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>
    


  /**
   * Reference to a field of type 'NotificationType[]'
   */
  export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>
    


  /**
   * Reference to a field of type 'NotificationPriority'
   */
  export type EnumNotificationPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationPriority'>
    


  /**
   * Reference to a field of type 'NotificationPriority[]'
   */
  export type ListEnumNotificationPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationPriority[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    dateOfBirth?: DateTimeNullableFilter<"User"> | Date | string | null
    nationality?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    preferredLanguage?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    phoneVerified?: BoolFilter<"User"> | boolean
    otpVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    kycStatus?: EnumKycStatusFilter<"User"> | $Enums.KycStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    civilite?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    region?: StringNullableFilter<"User"> | string | null
    department?: StringNullableFilter<"User"> | string | null
    arrondissement?: StringNullableFilter<"User"> | string | null
    district?: StringNullableFilter<"User"> | string | null
    domaineActivite?: StringNullableFilter<"User"> | string | null
    idExpiryDate?: DateTimeNullableFilter<"User"> | Date | string | null
    idIssueDate?: DateTimeNullableFilter<"User"> | Date | string | null
    idNumber?: StringNullableFilter<"User"> | string | null
    idType?: StringNullableFilter<"User"> | string | null
    marketingAccepted?: BoolFilter<"User"> | boolean
    metiers?: StringNullableFilter<"User"> | string | null
    placeOfBirth?: StringNullableFilter<"User"> | string | null
    privacyAccepted?: BoolFilter<"User"> | boolean
    signature?: StringNullableFilter<"User"> | string | null
    statutEmploi?: StringNullableFilter<"User"> | string | null
    termsAccepted?: BoolFilter<"User"> | boolean
    kycDocuments?: KycDocumentListRelationFilter
    otpCodes?: OtpCodeListRelationFilter
    sessions?: SessionListRelationFilter
    transactionIntents?: TransactionIntentListRelationFilter
    accounts?: UserAccountListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    preferredLanguage?: SortOrder
    emailVerified?: SortOrder
    phoneVerified?: SortOrder
    otpVerifiedAt?: SortOrderInput | SortOrder
    kycStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    civilite?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    arrondissement?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    domaineActivite?: SortOrderInput | SortOrder
    idExpiryDate?: SortOrderInput | SortOrder
    idIssueDate?: SortOrderInput | SortOrder
    idNumber?: SortOrderInput | SortOrder
    idType?: SortOrderInput | SortOrder
    marketingAccepted?: SortOrder
    metiers?: SortOrderInput | SortOrder
    placeOfBirth?: SortOrderInput | SortOrder
    privacyAccepted?: SortOrder
    signature?: SortOrderInput | SortOrder
    statutEmploi?: SortOrderInput | SortOrder
    termsAccepted?: SortOrder
    kycDocuments?: KycDocumentOrderByRelationAggregateInput
    otpCodes?: OtpCodeOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    transactionIntents?: TransactionIntentOrderByRelationAggregateInput
    accounts?: UserAccountOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringNullableFilter<"User"> | string | null
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    dateOfBirth?: DateTimeNullableFilter<"User"> | Date | string | null
    nationality?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    preferredLanguage?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    phoneVerified?: BoolFilter<"User"> | boolean
    otpVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    kycStatus?: EnumKycStatusFilter<"User"> | $Enums.KycStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    civilite?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    region?: StringNullableFilter<"User"> | string | null
    department?: StringNullableFilter<"User"> | string | null
    arrondissement?: StringNullableFilter<"User"> | string | null
    district?: StringNullableFilter<"User"> | string | null
    domaineActivite?: StringNullableFilter<"User"> | string | null
    idExpiryDate?: DateTimeNullableFilter<"User"> | Date | string | null
    idIssueDate?: DateTimeNullableFilter<"User"> | Date | string | null
    idNumber?: StringNullableFilter<"User"> | string | null
    idType?: StringNullableFilter<"User"> | string | null
    marketingAccepted?: BoolFilter<"User"> | boolean
    metiers?: StringNullableFilter<"User"> | string | null
    placeOfBirth?: StringNullableFilter<"User"> | string | null
    privacyAccepted?: BoolFilter<"User"> | boolean
    signature?: StringNullableFilter<"User"> | string | null
    statutEmploi?: StringNullableFilter<"User"> | string | null
    termsAccepted?: BoolFilter<"User"> | boolean
    kycDocuments?: KycDocumentListRelationFilter
    otpCodes?: OtpCodeListRelationFilter
    sessions?: SessionListRelationFilter
    transactionIntents?: TransactionIntentListRelationFilter
    accounts?: UserAccountListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    preferredLanguage?: SortOrder
    emailVerified?: SortOrder
    phoneVerified?: SortOrder
    otpVerifiedAt?: SortOrderInput | SortOrder
    kycStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    civilite?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    arrondissement?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    domaineActivite?: SortOrderInput | SortOrder
    idExpiryDate?: SortOrderInput | SortOrder
    idIssueDate?: SortOrderInput | SortOrder
    idNumber?: SortOrderInput | SortOrder
    idType?: SortOrderInput | SortOrder
    marketingAccepted?: SortOrder
    metiers?: SortOrderInput | SortOrder
    placeOfBirth?: SortOrderInput | SortOrder
    privacyAccepted?: SortOrder
    signature?: SortOrderInput | SortOrder
    statutEmploi?: SortOrderInput | SortOrder
    termsAccepted?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    dateOfBirth?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    nationality?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    city?: StringNullableWithAggregatesFilter<"User"> | string | null
    preferredLanguage?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    phoneVerified?: BoolWithAggregatesFilter<"User"> | boolean
    otpVerifiedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    kycStatus?: EnumKycStatusWithAggregatesFilter<"User"> | $Enums.KycStatus
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    civilite?: StringNullableWithAggregatesFilter<"User"> | string | null
    country?: StringNullableWithAggregatesFilter<"User"> | string | null
    region?: StringNullableWithAggregatesFilter<"User"> | string | null
    department?: StringNullableWithAggregatesFilter<"User"> | string | null
    arrondissement?: StringNullableWithAggregatesFilter<"User"> | string | null
    district?: StringNullableWithAggregatesFilter<"User"> | string | null
    domaineActivite?: StringNullableWithAggregatesFilter<"User"> | string | null
    idExpiryDate?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    idIssueDate?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    idNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
    idType?: StringNullableWithAggregatesFilter<"User"> | string | null
    marketingAccepted?: BoolWithAggregatesFilter<"User"> | boolean
    metiers?: StringNullableWithAggregatesFilter<"User"> | string | null
    placeOfBirth?: StringNullableWithAggregatesFilter<"User"> | string | null
    privacyAccepted?: BoolWithAggregatesFilter<"User"> | boolean
    signature?: StringNullableWithAggregatesFilter<"User"> | string | null
    statutEmploi?: StringNullableWithAggregatesFilter<"User"> | string | null
    termsAccepted?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type OtpCodeWhereInput = {
    AND?: OtpCodeWhereInput | OtpCodeWhereInput[]
    OR?: OtpCodeWhereInput[]
    NOT?: OtpCodeWhereInput | OtpCodeWhereInput[]
    id?: StringFilter<"OtpCode"> | string
    userId?: StringNullableFilter<"OtpCode"> | string | null
    registrationSessionId?: StringNullableFilter<"OtpCode"> | string | null
    code?: StringFilter<"OtpCode"> | string
    type?: EnumOtpTypeFilter<"OtpCode"> | $Enums.OtpType
    expiresAt?: DateTimeFilter<"OtpCode"> | Date | string
    used?: BoolFilter<"OtpCode"> | boolean
    createdAt?: DateTimeFilter<"OtpCode"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    registrationSession?: XOR<RegistrationSessionNullableScalarRelationFilter, RegistrationSessionWhereInput> | null
  }

  export type OtpCodeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    registrationSessionId?: SortOrderInput | SortOrder
    code?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    registrationSession?: RegistrationSessionOrderByWithRelationInput
  }

  export type OtpCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OtpCodeWhereInput | OtpCodeWhereInput[]
    OR?: OtpCodeWhereInput[]
    NOT?: OtpCodeWhereInput | OtpCodeWhereInput[]
    userId?: StringNullableFilter<"OtpCode"> | string | null
    registrationSessionId?: StringNullableFilter<"OtpCode"> | string | null
    code?: StringFilter<"OtpCode"> | string
    type?: EnumOtpTypeFilter<"OtpCode"> | $Enums.OtpType
    expiresAt?: DateTimeFilter<"OtpCode"> | Date | string
    used?: BoolFilter<"OtpCode"> | boolean
    createdAt?: DateTimeFilter<"OtpCode"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    registrationSession?: XOR<RegistrationSessionNullableScalarRelationFilter, RegistrationSessionWhereInput> | null
  }, "id">

  export type OtpCodeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    registrationSessionId?: SortOrderInput | SortOrder
    code?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    _count?: OtpCodeCountOrderByAggregateInput
    _max?: OtpCodeMaxOrderByAggregateInput
    _min?: OtpCodeMinOrderByAggregateInput
  }

  export type OtpCodeScalarWhereWithAggregatesInput = {
    AND?: OtpCodeScalarWhereWithAggregatesInput | OtpCodeScalarWhereWithAggregatesInput[]
    OR?: OtpCodeScalarWhereWithAggregatesInput[]
    NOT?: OtpCodeScalarWhereWithAggregatesInput | OtpCodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OtpCode"> | string
    userId?: StringNullableWithAggregatesFilter<"OtpCode"> | string | null
    registrationSessionId?: StringNullableWithAggregatesFilter<"OtpCode"> | string | null
    code?: StringWithAggregatesFilter<"OtpCode"> | string
    type?: EnumOtpTypeWithAggregatesFilter<"OtpCode"> | $Enums.OtpType
    expiresAt?: DateTimeWithAggregatesFilter<"OtpCode"> | Date | string
    used?: BoolWithAggregatesFilter<"OtpCode"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OtpCode"> | Date | string
  }

  export type UserAccountWhereInput = {
    AND?: UserAccountWhereInput | UserAccountWhereInput[]
    OR?: UserAccountWhereInput[]
    NOT?: UserAccountWhereInput | UserAccountWhereInput[]
    id?: StringFilter<"UserAccount"> | string
    userId?: StringFilter<"UserAccount"> | string
    accountType?: EnumAccountTypeFilter<"UserAccount"> | $Enums.AccountType
    accountNumber?: StringFilter<"UserAccount"> | string
    productCode?: StringNullableFilter<"UserAccount"> | string | null
    productName?: StringNullableFilter<"UserAccount"> | string | null
    interestRate?: DecimalNullableFilter<"UserAccount"> | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: IntNullableFilter<"UserAccount"> | number | null
    lockedUntil?: DateTimeNullableFilter<"UserAccount"> | Date | string | null
    allowAdditionalDeposits?: BoolFilter<"UserAccount"> | boolean
    metadata?: JsonNullableFilter<"UserAccount">
    balance?: DecimalFilter<"UserAccount"> | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFilter<"UserAccount"> | $Enums.AccountStatus
    createdAt?: DateTimeFilter<"UserAccount"> | Date | string
    transactionIntents?: TransactionIntentListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserAccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    accountType?: SortOrder
    accountNumber?: SortOrder
    productCode?: SortOrderInput | SortOrder
    productName?: SortOrderInput | SortOrder
    interestRate?: SortOrderInput | SortOrder
    lockPeriodMonths?: SortOrderInput | SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    allowAdditionalDeposits?: SortOrder
    metadata?: SortOrderInput | SortOrder
    balance?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    transactionIntents?: TransactionIntentOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type UserAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accountNumber?: string
    AND?: UserAccountWhereInput | UserAccountWhereInput[]
    OR?: UserAccountWhereInput[]
    NOT?: UserAccountWhereInput | UserAccountWhereInput[]
    userId?: StringFilter<"UserAccount"> | string
    accountType?: EnumAccountTypeFilter<"UserAccount"> | $Enums.AccountType
    productCode?: StringNullableFilter<"UserAccount"> | string | null
    productName?: StringNullableFilter<"UserAccount"> | string | null
    interestRate?: DecimalNullableFilter<"UserAccount"> | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: IntNullableFilter<"UserAccount"> | number | null
    lockedUntil?: DateTimeNullableFilter<"UserAccount"> | Date | string | null
    allowAdditionalDeposits?: BoolFilter<"UserAccount"> | boolean
    metadata?: JsonNullableFilter<"UserAccount">
    balance?: DecimalFilter<"UserAccount"> | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFilter<"UserAccount"> | $Enums.AccountStatus
    createdAt?: DateTimeFilter<"UserAccount"> | Date | string
    transactionIntents?: TransactionIntentListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "accountNumber">

  export type UserAccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    accountType?: SortOrder
    accountNumber?: SortOrder
    productCode?: SortOrderInput | SortOrder
    productName?: SortOrderInput | SortOrder
    interestRate?: SortOrderInput | SortOrder
    lockPeriodMonths?: SortOrderInput | SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    allowAdditionalDeposits?: SortOrder
    metadata?: SortOrderInput | SortOrder
    balance?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: UserAccountCountOrderByAggregateInput
    _avg?: UserAccountAvgOrderByAggregateInput
    _max?: UserAccountMaxOrderByAggregateInput
    _min?: UserAccountMinOrderByAggregateInput
    _sum?: UserAccountSumOrderByAggregateInput
  }

  export type UserAccountScalarWhereWithAggregatesInput = {
    AND?: UserAccountScalarWhereWithAggregatesInput | UserAccountScalarWhereWithAggregatesInput[]
    OR?: UserAccountScalarWhereWithAggregatesInput[]
    NOT?: UserAccountScalarWhereWithAggregatesInput | UserAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserAccount"> | string
    userId?: StringWithAggregatesFilter<"UserAccount"> | string
    accountType?: EnumAccountTypeWithAggregatesFilter<"UserAccount"> | $Enums.AccountType
    accountNumber?: StringWithAggregatesFilter<"UserAccount"> | string
    productCode?: StringNullableWithAggregatesFilter<"UserAccount"> | string | null
    productName?: StringNullableWithAggregatesFilter<"UserAccount"> | string | null
    interestRate?: DecimalNullableWithAggregatesFilter<"UserAccount"> | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: IntNullableWithAggregatesFilter<"UserAccount"> | number | null
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"UserAccount"> | Date | string | null
    allowAdditionalDeposits?: BoolWithAggregatesFilter<"UserAccount"> | boolean
    metadata?: JsonNullableWithAggregatesFilter<"UserAccount">
    balance?: DecimalWithAggregatesFilter<"UserAccount"> | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusWithAggregatesFilter<"UserAccount"> | $Enums.AccountStatus
    createdAt?: DateTimeWithAggregatesFilter<"UserAccount"> | Date | string
  }

  export type TransactionIntentWhereInput = {
    AND?: TransactionIntentWhereInput | TransactionIntentWhereInput[]
    OR?: TransactionIntentWhereInput[]
    NOT?: TransactionIntentWhereInput | TransactionIntentWhereInput[]
    id?: StringFilter<"TransactionIntent"> | string
    userId?: StringFilter<"TransactionIntent"> | string
    accountId?: StringFilter<"TransactionIntent"> | string
    accountType?: EnumAccountTypeFilter<"TransactionIntent"> | $Enums.AccountType
    intentType?: EnumIntentTypeFilter<"TransactionIntent"> | $Enums.IntentType
    amount?: DecimalFilter<"TransactionIntent"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"TransactionIntent"> | string
    investmentTranche?: StringNullableFilter<"TransactionIntent"> | string | null
    investmentTerm?: IntNullableFilter<"TransactionIntent"> | number | null
    userNotes?: StringNullableFilter<"TransactionIntent"> | string | null
    adminNotes?: StringNullableFilter<"TransactionIntent"> | string | null
    status?: EnumTransactionStatusFilter<"TransactionIntent"> | $Enums.TransactionStatus
    referenceNumber?: StringFilter<"TransactionIntent"> | string
    providerTransactionId?: StringNullableFilter<"TransactionIntent"> | string | null
    providerStatus?: StringNullableFilter<"TransactionIntent"> | string | null
    lastCallbackAt?: DateTimeNullableFilter<"TransactionIntent"> | Date | string | null
    lastCallbackPayload?: JsonNullableFilter<"TransactionIntent">
    createdAt?: DateTimeFilter<"TransactionIntent"> | Date | string
    updatedAt?: DateTimeFilter<"TransactionIntent"> | Date | string
    account?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    paymentCallbacks?: PaymentCallbackLogListRelationFilter
  }

  export type TransactionIntentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    accountId?: SortOrder
    accountType?: SortOrder
    intentType?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    investmentTranche?: SortOrderInput | SortOrder
    investmentTerm?: SortOrderInput | SortOrder
    userNotes?: SortOrderInput | SortOrder
    adminNotes?: SortOrderInput | SortOrder
    status?: SortOrder
    referenceNumber?: SortOrder
    providerTransactionId?: SortOrderInput | SortOrder
    providerStatus?: SortOrderInput | SortOrder
    lastCallbackAt?: SortOrderInput | SortOrder
    lastCallbackPayload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: UserAccountOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    paymentCallbacks?: PaymentCallbackLogOrderByRelationAggregateInput
  }

  export type TransactionIntentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    referenceNumber?: string
    providerTransactionId?: string
    AND?: TransactionIntentWhereInput | TransactionIntentWhereInput[]
    OR?: TransactionIntentWhereInput[]
    NOT?: TransactionIntentWhereInput | TransactionIntentWhereInput[]
    userId?: StringFilter<"TransactionIntent"> | string
    accountId?: StringFilter<"TransactionIntent"> | string
    accountType?: EnumAccountTypeFilter<"TransactionIntent"> | $Enums.AccountType
    intentType?: EnumIntentTypeFilter<"TransactionIntent"> | $Enums.IntentType
    amount?: DecimalFilter<"TransactionIntent"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"TransactionIntent"> | string
    investmentTranche?: StringNullableFilter<"TransactionIntent"> | string | null
    investmentTerm?: IntNullableFilter<"TransactionIntent"> | number | null
    userNotes?: StringNullableFilter<"TransactionIntent"> | string | null
    adminNotes?: StringNullableFilter<"TransactionIntent"> | string | null
    status?: EnumTransactionStatusFilter<"TransactionIntent"> | $Enums.TransactionStatus
    providerStatus?: StringNullableFilter<"TransactionIntent"> | string | null
    lastCallbackAt?: DateTimeNullableFilter<"TransactionIntent"> | Date | string | null
    lastCallbackPayload?: JsonNullableFilter<"TransactionIntent">
    createdAt?: DateTimeFilter<"TransactionIntent"> | Date | string
    updatedAt?: DateTimeFilter<"TransactionIntent"> | Date | string
    account?: XOR<UserAccountScalarRelationFilter, UserAccountWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    paymentCallbacks?: PaymentCallbackLogListRelationFilter
  }, "id" | "referenceNumber" | "providerTransactionId">

  export type TransactionIntentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    accountId?: SortOrder
    accountType?: SortOrder
    intentType?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    investmentTranche?: SortOrderInput | SortOrder
    investmentTerm?: SortOrderInput | SortOrder
    userNotes?: SortOrderInput | SortOrder
    adminNotes?: SortOrderInput | SortOrder
    status?: SortOrder
    referenceNumber?: SortOrder
    providerTransactionId?: SortOrderInput | SortOrder
    providerStatus?: SortOrderInput | SortOrder
    lastCallbackAt?: SortOrderInput | SortOrder
    lastCallbackPayload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionIntentCountOrderByAggregateInput
    _avg?: TransactionIntentAvgOrderByAggregateInput
    _max?: TransactionIntentMaxOrderByAggregateInput
    _min?: TransactionIntentMinOrderByAggregateInput
    _sum?: TransactionIntentSumOrderByAggregateInput
  }

  export type TransactionIntentScalarWhereWithAggregatesInput = {
    AND?: TransactionIntentScalarWhereWithAggregatesInput | TransactionIntentScalarWhereWithAggregatesInput[]
    OR?: TransactionIntentScalarWhereWithAggregatesInput[]
    NOT?: TransactionIntentScalarWhereWithAggregatesInput | TransactionIntentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TransactionIntent"> | string
    userId?: StringWithAggregatesFilter<"TransactionIntent"> | string
    accountId?: StringWithAggregatesFilter<"TransactionIntent"> | string
    accountType?: EnumAccountTypeWithAggregatesFilter<"TransactionIntent"> | $Enums.AccountType
    intentType?: EnumIntentTypeWithAggregatesFilter<"TransactionIntent"> | $Enums.IntentType
    amount?: DecimalWithAggregatesFilter<"TransactionIntent"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringWithAggregatesFilter<"TransactionIntent"> | string
    investmentTranche?: StringNullableWithAggregatesFilter<"TransactionIntent"> | string | null
    investmentTerm?: IntNullableWithAggregatesFilter<"TransactionIntent"> | number | null
    userNotes?: StringNullableWithAggregatesFilter<"TransactionIntent"> | string | null
    adminNotes?: StringNullableWithAggregatesFilter<"TransactionIntent"> | string | null
    status?: EnumTransactionStatusWithAggregatesFilter<"TransactionIntent"> | $Enums.TransactionStatus
    referenceNumber?: StringWithAggregatesFilter<"TransactionIntent"> | string
    providerTransactionId?: StringNullableWithAggregatesFilter<"TransactionIntent"> | string | null
    providerStatus?: StringNullableWithAggregatesFilter<"TransactionIntent"> | string | null
    lastCallbackAt?: DateTimeNullableWithAggregatesFilter<"TransactionIntent"> | Date | string | null
    lastCallbackPayload?: JsonNullableWithAggregatesFilter<"TransactionIntent">
    createdAt?: DateTimeWithAggregatesFilter<"TransactionIntent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TransactionIntent"> | Date | string
  }

  export type PaymentCallbackLogWhereInput = {
    AND?: PaymentCallbackLogWhereInput | PaymentCallbackLogWhereInput[]
    OR?: PaymentCallbackLogWhereInput[]
    NOT?: PaymentCallbackLogWhereInput | PaymentCallbackLogWhereInput[]
    id?: StringFilter<"PaymentCallbackLog"> | string
    transactionIntentId?: StringFilter<"PaymentCallbackLog"> | string
    status?: StringFilter<"PaymentCallbackLog"> | string
    payload?: JsonFilter<"PaymentCallbackLog">
    createdAt?: DateTimeFilter<"PaymentCallbackLog"> | Date | string
    transactionIntent?: XOR<TransactionIntentScalarRelationFilter, TransactionIntentWhereInput>
  }

  export type PaymentCallbackLogOrderByWithRelationInput = {
    id?: SortOrder
    transactionIntentId?: SortOrder
    status?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    transactionIntent?: TransactionIntentOrderByWithRelationInput
  }

  export type PaymentCallbackLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentCallbackLogWhereInput | PaymentCallbackLogWhereInput[]
    OR?: PaymentCallbackLogWhereInput[]
    NOT?: PaymentCallbackLogWhereInput | PaymentCallbackLogWhereInput[]
    transactionIntentId?: StringFilter<"PaymentCallbackLog"> | string
    status?: StringFilter<"PaymentCallbackLog"> | string
    payload?: JsonFilter<"PaymentCallbackLog">
    createdAt?: DateTimeFilter<"PaymentCallbackLog"> | Date | string
    transactionIntent?: XOR<TransactionIntentScalarRelationFilter, TransactionIntentWhereInput>
  }, "id">

  export type PaymentCallbackLogOrderByWithAggregationInput = {
    id?: SortOrder
    transactionIntentId?: SortOrder
    status?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    _count?: PaymentCallbackLogCountOrderByAggregateInput
    _max?: PaymentCallbackLogMaxOrderByAggregateInput
    _min?: PaymentCallbackLogMinOrderByAggregateInput
  }

  export type PaymentCallbackLogScalarWhereWithAggregatesInput = {
    AND?: PaymentCallbackLogScalarWhereWithAggregatesInput | PaymentCallbackLogScalarWhereWithAggregatesInput[]
    OR?: PaymentCallbackLogScalarWhereWithAggregatesInput[]
    NOT?: PaymentCallbackLogScalarWhereWithAggregatesInput | PaymentCallbackLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentCallbackLog"> | string
    transactionIntentId?: StringWithAggregatesFilter<"PaymentCallbackLog"> | string
    status?: StringWithAggregatesFilter<"PaymentCallbackLog"> | string
    payload?: JsonWithAggregatesFilter<"PaymentCallbackLog">
    createdAt?: DateTimeWithAggregatesFilter<"PaymentCallbackLog"> | Date | string
  }

  export type KycDocumentWhereInput = {
    AND?: KycDocumentWhereInput | KycDocumentWhereInput[]
    OR?: KycDocumentWhereInput[]
    NOT?: KycDocumentWhereInput | KycDocumentWhereInput[]
    id?: StringFilter<"KycDocument"> | string
    userId?: StringFilter<"KycDocument"> | string
    documentType?: StringFilter<"KycDocument"> | string
    fileUrl?: StringFilter<"KycDocument"> | string
    fileName?: StringFilter<"KycDocument"> | string
    uploadDate?: DateTimeFilter<"KycDocument"> | Date | string
    verificationStatus?: EnumVerificationStatusFilter<"KycDocument"> | $Enums.VerificationStatus
    adminNotes?: StringNullableFilter<"KycDocument"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type KycDocumentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    documentType?: SortOrder
    fileUrl?: SortOrder
    fileName?: SortOrder
    uploadDate?: SortOrder
    verificationStatus?: SortOrder
    adminNotes?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type KycDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: KycDocumentWhereInput | KycDocumentWhereInput[]
    OR?: KycDocumentWhereInput[]
    NOT?: KycDocumentWhereInput | KycDocumentWhereInput[]
    userId?: StringFilter<"KycDocument"> | string
    documentType?: StringFilter<"KycDocument"> | string
    fileUrl?: StringFilter<"KycDocument"> | string
    fileName?: StringFilter<"KycDocument"> | string
    uploadDate?: DateTimeFilter<"KycDocument"> | Date | string
    verificationStatus?: EnumVerificationStatusFilter<"KycDocument"> | $Enums.VerificationStatus
    adminNotes?: StringNullableFilter<"KycDocument"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type KycDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    documentType?: SortOrder
    fileUrl?: SortOrder
    fileName?: SortOrder
    uploadDate?: SortOrder
    verificationStatus?: SortOrder
    adminNotes?: SortOrderInput | SortOrder
    _count?: KycDocumentCountOrderByAggregateInput
    _max?: KycDocumentMaxOrderByAggregateInput
    _min?: KycDocumentMinOrderByAggregateInput
  }

  export type KycDocumentScalarWhereWithAggregatesInput = {
    AND?: KycDocumentScalarWhereWithAggregatesInput | KycDocumentScalarWhereWithAggregatesInput[]
    OR?: KycDocumentScalarWhereWithAggregatesInput[]
    NOT?: KycDocumentScalarWhereWithAggregatesInput | KycDocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KycDocument"> | string
    userId?: StringWithAggregatesFilter<"KycDocument"> | string
    documentType?: StringWithAggregatesFilter<"KycDocument"> | string
    fileUrl?: StringWithAggregatesFilter<"KycDocument"> | string
    fileName?: StringWithAggregatesFilter<"KycDocument"> | string
    uploadDate?: DateTimeWithAggregatesFilter<"KycDocument"> | Date | string
    verificationStatus?: EnumVerificationStatusWithAggregatesFilter<"KycDocument"> | $Enums.VerificationStatus
    adminNotes?: StringNullableWithAggregatesFilter<"KycDocument"> | string | null
  }

  export type AdminUserWhereInput = {
    AND?: AdminUserWhereInput | AdminUserWhereInput[]
    OR?: AdminUserWhereInput[]
    NOT?: AdminUserWhereInput | AdminUserWhereInput[]
    id?: StringFilter<"AdminUser"> | string
    email?: StringFilter<"AdminUser"> | string
    passwordHash?: StringFilter<"AdminUser"> | string
    name?: StringFilter<"AdminUser"> | string
    role?: EnumAdminRoleFilter<"AdminUser"> | $Enums.AdminRole
    lastLogin?: DateTimeNullableFilter<"AdminUser"> | Date | string | null
    createdAt?: DateTimeFilter<"AdminUser"> | Date | string
    failedAttempts?: IntFilter<"AdminUser"> | number
    isActive?: BoolFilter<"AdminUser"> | boolean
    lockedUntil?: DateTimeNullableFilter<"AdminUser"> | Date | string | null
    updatedAt?: DateTimeFilter<"AdminUser"> | Date | string
  }

  export type AdminUserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    failedAttempts?: SortOrder
    isActive?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AdminUserWhereInput | AdminUserWhereInput[]
    OR?: AdminUserWhereInput[]
    NOT?: AdminUserWhereInput | AdminUserWhereInput[]
    passwordHash?: StringFilter<"AdminUser"> | string
    name?: StringFilter<"AdminUser"> | string
    role?: EnumAdminRoleFilter<"AdminUser"> | $Enums.AdminRole
    lastLogin?: DateTimeNullableFilter<"AdminUser"> | Date | string | null
    createdAt?: DateTimeFilter<"AdminUser"> | Date | string
    failedAttempts?: IntFilter<"AdminUser"> | number
    isActive?: BoolFilter<"AdminUser"> | boolean
    lockedUntil?: DateTimeNullableFilter<"AdminUser"> | Date | string | null
    updatedAt?: DateTimeFilter<"AdminUser"> | Date | string
  }, "id" | "email">

  export type AdminUserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    failedAttempts?: SortOrder
    isActive?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: AdminUserCountOrderByAggregateInput
    _avg?: AdminUserAvgOrderByAggregateInput
    _max?: AdminUserMaxOrderByAggregateInput
    _min?: AdminUserMinOrderByAggregateInput
    _sum?: AdminUserSumOrderByAggregateInput
  }

  export type AdminUserScalarWhereWithAggregatesInput = {
    AND?: AdminUserScalarWhereWithAggregatesInput | AdminUserScalarWhereWithAggregatesInput[]
    OR?: AdminUserScalarWhereWithAggregatesInput[]
    NOT?: AdminUserScalarWhereWithAggregatesInput | AdminUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminUser"> | string
    email?: StringWithAggregatesFilter<"AdminUser"> | string
    passwordHash?: StringWithAggregatesFilter<"AdminUser"> | string
    name?: StringWithAggregatesFilter<"AdminUser"> | string
    role?: EnumAdminRoleWithAggregatesFilter<"AdminUser"> | $Enums.AdminRole
    lastLogin?: DateTimeNullableWithAggregatesFilter<"AdminUser"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AdminUser"> | Date | string
    failedAttempts?: IntWithAggregatesFilter<"AdminUser"> | number
    isActive?: BoolWithAggregatesFilter<"AdminUser"> | boolean
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"AdminUser"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"AdminUser"> | Date | string
  }

  export type RegistrationSessionWhereInput = {
    AND?: RegistrationSessionWhereInput | RegistrationSessionWhereInput[]
    OR?: RegistrationSessionWhereInput[]
    NOT?: RegistrationSessionWhereInput | RegistrationSessionWhereInput[]
    id?: StringFilter<"RegistrationSession"> | string
    email?: StringFilter<"RegistrationSession"> | string
    phone?: StringFilter<"RegistrationSession"> | string
    data?: StringFilter<"RegistrationSession"> | string
    type?: EnumSessionTypeFilter<"RegistrationSession"> | $Enums.SessionType
    expiresAt?: DateTimeFilter<"RegistrationSession"> | Date | string
    createdAt?: DateTimeFilter<"RegistrationSession"> | Date | string
    otpCodes?: OtpCodeListRelationFilter
  }

  export type RegistrationSessionOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    data?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    otpCodes?: OtpCodeOrderByRelationAggregateInput
  }

  export type RegistrationSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RegistrationSessionWhereInput | RegistrationSessionWhereInput[]
    OR?: RegistrationSessionWhereInput[]
    NOT?: RegistrationSessionWhereInput | RegistrationSessionWhereInput[]
    email?: StringFilter<"RegistrationSession"> | string
    phone?: StringFilter<"RegistrationSession"> | string
    data?: StringFilter<"RegistrationSession"> | string
    type?: EnumSessionTypeFilter<"RegistrationSession"> | $Enums.SessionType
    expiresAt?: DateTimeFilter<"RegistrationSession"> | Date | string
    createdAt?: DateTimeFilter<"RegistrationSession"> | Date | string
    otpCodes?: OtpCodeListRelationFilter
  }, "id">

  export type RegistrationSessionOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    data?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: RegistrationSessionCountOrderByAggregateInput
    _max?: RegistrationSessionMaxOrderByAggregateInput
    _min?: RegistrationSessionMinOrderByAggregateInput
  }

  export type RegistrationSessionScalarWhereWithAggregatesInput = {
    AND?: RegistrationSessionScalarWhereWithAggregatesInput | RegistrationSessionScalarWhereWithAggregatesInput[]
    OR?: RegistrationSessionScalarWhereWithAggregatesInput[]
    NOT?: RegistrationSessionScalarWhereWithAggregatesInput | RegistrationSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RegistrationSession"> | string
    email?: StringWithAggregatesFilter<"RegistrationSession"> | string
    phone?: StringWithAggregatesFilter<"RegistrationSession"> | string
    data?: StringWithAggregatesFilter<"RegistrationSession"> | string
    type?: EnumSessionTypeWithAggregatesFilter<"RegistrationSession"> | $Enums.SessionType
    expiresAt?: DateTimeWithAggregatesFilter<"RegistrationSession"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"RegistrationSession"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    priority?: EnumNotificationPriorityFilter<"Notification"> | $Enums.NotificationPriority
    isRead?: BoolFilter<"Notification"> | boolean
    metadata?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    priority?: EnumNotificationPriorityFilter<"Notification"> | $Enums.NotificationPriority
    isRead?: BoolFilter<"Notification"> | boolean
    metadata?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    type?: EnumNotificationTypeWithAggregatesFilter<"Notification"> | $Enums.NotificationType
    priority?: EnumNotificationPriorityWithAggregatesFilter<"Notification"> | $Enums.NotificationPriority
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    metadata?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentCreateNestedManyWithoutUserInput
    accounts?: UserAccountCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentUncheckedCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentUncheckedCreateNestedManyWithoutUserInput
    accounts?: UserAccountUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUncheckedUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUncheckedUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpCodeCreateInput = {
    id?: string
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutOtpCodesInput
    registrationSession?: RegistrationSessionCreateNestedOneWithoutOtpCodesInput
  }

  export type OtpCodeUncheckedCreateInput = {
    id?: string
    userId?: string | null
    registrationSessionId?: string | null
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
  }

  export type OtpCodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutOtpCodesNestedInput
    registrationSession?: RegistrationSessionUpdateOneWithoutOtpCodesNestedInput
  }

  export type OtpCodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    registrationSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpCodeCreateManyInput = {
    id?: string
    userId?: string | null
    registrationSessionId?: string | null
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
  }

  export type OtpCodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpCodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    registrationSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAccountCreateInput = {
    id?: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode?: string | null
    productName?: string | null
    interestRate?: Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: number | null
    lockedUntil?: Date | string | null
    allowAdditionalDeposits?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    transactionIntents?: TransactionIntentCreateNestedManyWithoutAccountInput
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type UserAccountUncheckedCreateInput = {
    id?: string
    userId: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode?: string | null
    productName?: string | null
    interestRate?: Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: number | null
    lockedUntil?: Date | string | null
    allowAdditionalDeposits?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    transactionIntents?: TransactionIntentUncheckedCreateNestedManyWithoutAccountInput
  }

  export type UserAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionIntents?: TransactionIntentUpdateManyWithoutAccountNestedInput
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type UserAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionIntents?: TransactionIntentUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type UserAccountCreateManyInput = {
    id?: string
    userId: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode?: string | null
    productName?: string | null
    interestRate?: Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: number | null
    lockedUntil?: Date | string | null
    allowAdditionalDeposits?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.AccountStatus
    createdAt?: Date | string
  }

  export type UserAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionIntentCreateInput = {
    id?: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    account: UserAccountCreateNestedOneWithoutTransactionIntentsInput
    user: UserCreateNestedOneWithoutTransactionIntentsInput
    paymentCallbacks?: PaymentCallbackLogCreateNestedManyWithoutTransactionIntentInput
  }

  export type TransactionIntentUncheckedCreateInput = {
    id?: string
    userId: string
    accountId: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paymentCallbacks?: PaymentCallbackLogUncheckedCreateNestedManyWithoutTransactionIntentInput
  }

  export type TransactionIntentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: UserAccountUpdateOneRequiredWithoutTransactionIntentsNestedInput
    user?: UserUpdateOneRequiredWithoutTransactionIntentsNestedInput
    paymentCallbacks?: PaymentCallbackLogUpdateManyWithoutTransactionIntentNestedInput
  }

  export type TransactionIntentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentCallbacks?: PaymentCallbackLogUncheckedUpdateManyWithoutTransactionIntentNestedInput
  }

  export type TransactionIntentCreateManyInput = {
    id?: string
    userId: string
    accountId: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionIntentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionIntentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCallbackLogCreateInput = {
    id?: string
    status: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    transactionIntent: TransactionIntentCreateNestedOneWithoutPaymentCallbacksInput
  }

  export type PaymentCallbackLogUncheckedCreateInput = {
    id?: string
    transactionIntentId: string
    status: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentCallbackLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionIntent?: TransactionIntentUpdateOneRequiredWithoutPaymentCallbacksNestedInput
  }

  export type PaymentCallbackLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCallbackLogCreateManyInput = {
    id?: string
    transactionIntentId: string
    status: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentCallbackLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCallbackLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KycDocumentCreateInput = {
    id?: string
    documentType: string
    fileUrl: string
    fileName: string
    uploadDate?: Date | string
    verificationStatus?: $Enums.VerificationStatus
    adminNotes?: string | null
    user: UserCreateNestedOneWithoutKycDocumentsInput
  }

  export type KycDocumentUncheckedCreateInput = {
    id?: string
    userId: string
    documentType: string
    fileUrl: string
    fileName: string
    uploadDate?: Date | string
    verificationStatus?: $Enums.VerificationStatus
    adminNotes?: string | null
  }

  export type KycDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    uploadDate?: DateTimeFieldUpdateOperationsInput | Date | string
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutKycDocumentsNestedInput
  }

  export type KycDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    uploadDate?: DateTimeFieldUpdateOperationsInput | Date | string
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KycDocumentCreateManyInput = {
    id?: string
    userId: string
    documentType: string
    fileUrl: string
    fileName: string
    uploadDate?: Date | string
    verificationStatus?: $Enums.VerificationStatus
    adminNotes?: string | null
  }

  export type KycDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    uploadDate?: DateTimeFieldUpdateOperationsInput | Date | string
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KycDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    uploadDate?: DateTimeFieldUpdateOperationsInput | Date | string
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AdminUserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: $Enums.AdminRole
    lastLogin?: Date | string | null
    createdAt?: Date | string
    failedAttempts?: number
    isActive?: boolean
    lockedUntil?: Date | string | null
    updatedAt?: Date | string
  }

  export type AdminUserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: $Enums.AdminRole
    lastLogin?: Date | string | null
    createdAt?: Date | string
    failedAttempts?: number
    isActive?: boolean
    lockedUntil?: Date | string | null
    updatedAt?: Date | string
  }

  export type AdminUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumAdminRoleFieldUpdateOperationsInput | $Enums.AdminRole
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumAdminRoleFieldUpdateOperationsInput | $Enums.AdminRole
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: $Enums.AdminRole
    lastLogin?: Date | string | null
    createdAt?: Date | string
    failedAttempts?: number
    isActive?: boolean
    lockedUntil?: Date | string | null
    updatedAt?: Date | string
  }

  export type AdminUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumAdminRoleFieldUpdateOperationsInput | $Enums.AdminRole
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumAdminRoleFieldUpdateOperationsInput | $Enums.AdminRole
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationSessionCreateInput = {
    id?: string
    email: string
    phone: string
    data: string
    type?: $Enums.SessionType
    expiresAt: Date | string
    createdAt?: Date | string
    otpCodes?: OtpCodeCreateNestedManyWithoutRegistrationSessionInput
  }

  export type RegistrationSessionUncheckedCreateInput = {
    id?: string
    email: string
    phone: string
    data: string
    type?: $Enums.SessionType
    expiresAt: Date | string
    createdAt?: Date | string
    otpCodes?: OtpCodeUncheckedCreateNestedManyWithoutRegistrationSessionInput
  }

  export type RegistrationSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpCodes?: OtpCodeUpdateManyWithoutRegistrationSessionNestedInput
  }

  export type RegistrationSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpCodes?: OtpCodeUncheckedUpdateManyWithoutRegistrationSessionNestedInput
  }

  export type RegistrationSessionCreateManyInput = {
    id?: string
    email: string
    phone: string
    data: string
    type?: $Enums.SessionType
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RegistrationSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    priority: $Enums.NotificationPriority
    isRead?: boolean
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    message: string
    type: $Enums.NotificationType
    priority: $Enums.NotificationPriority
    isRead?: boolean
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    title: string
    message: string
    type: $Enums.NotificationType
    priority: $Enums.NotificationPriority
    isRead?: boolean
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumKycStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KycStatus | EnumKycStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKycStatusFilter<$PrismaModel> | $Enums.KycStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type KycDocumentListRelationFilter = {
    every?: KycDocumentWhereInput
    some?: KycDocumentWhereInput
    none?: KycDocumentWhereInput
  }

  export type OtpCodeListRelationFilter = {
    every?: OtpCodeWhereInput
    some?: OtpCodeWhereInput
    none?: OtpCodeWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type TransactionIntentListRelationFilter = {
    every?: TransactionIntentWhereInput
    some?: TransactionIntentWhereInput
    none?: TransactionIntentWhereInput
  }

  export type UserAccountListRelationFilter = {
    every?: UserAccountWhereInput
    some?: UserAccountWhereInput
    none?: UserAccountWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type KycDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OtpCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionIntentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    address?: SortOrder
    city?: SortOrder
    preferredLanguage?: SortOrder
    emailVerified?: SortOrder
    phoneVerified?: SortOrder
    otpVerifiedAt?: SortOrder
    kycStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    civilite?: SortOrder
    country?: SortOrder
    region?: SortOrder
    department?: SortOrder
    arrondissement?: SortOrder
    district?: SortOrder
    domaineActivite?: SortOrder
    idExpiryDate?: SortOrder
    idIssueDate?: SortOrder
    idNumber?: SortOrder
    idType?: SortOrder
    marketingAccepted?: SortOrder
    metiers?: SortOrder
    placeOfBirth?: SortOrder
    privacyAccepted?: SortOrder
    signature?: SortOrder
    statutEmploi?: SortOrder
    termsAccepted?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    address?: SortOrder
    city?: SortOrder
    preferredLanguage?: SortOrder
    emailVerified?: SortOrder
    phoneVerified?: SortOrder
    otpVerifiedAt?: SortOrder
    kycStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    civilite?: SortOrder
    country?: SortOrder
    region?: SortOrder
    department?: SortOrder
    arrondissement?: SortOrder
    district?: SortOrder
    domaineActivite?: SortOrder
    idExpiryDate?: SortOrder
    idIssueDate?: SortOrder
    idNumber?: SortOrder
    idType?: SortOrder
    marketingAccepted?: SortOrder
    metiers?: SortOrder
    placeOfBirth?: SortOrder
    privacyAccepted?: SortOrder
    signature?: SortOrder
    statutEmploi?: SortOrder
    termsAccepted?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    address?: SortOrder
    city?: SortOrder
    preferredLanguage?: SortOrder
    emailVerified?: SortOrder
    phoneVerified?: SortOrder
    otpVerifiedAt?: SortOrder
    kycStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    civilite?: SortOrder
    country?: SortOrder
    region?: SortOrder
    department?: SortOrder
    arrondissement?: SortOrder
    district?: SortOrder
    domaineActivite?: SortOrder
    idExpiryDate?: SortOrder
    idIssueDate?: SortOrder
    idNumber?: SortOrder
    idType?: SortOrder
    marketingAccepted?: SortOrder
    metiers?: SortOrder
    placeOfBirth?: SortOrder
    privacyAccepted?: SortOrder
    signature?: SortOrder
    statutEmploi?: SortOrder
    termsAccepted?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumKycStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KycStatus | EnumKycStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKycStatusWithAggregatesFilter<$PrismaModel> | $Enums.KycStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKycStatusFilter<$PrismaModel>
    _max?: NestedEnumKycStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumOtpTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OtpType | EnumOtpTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OtpType[] | ListEnumOtpTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OtpType[] | ListEnumOtpTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOtpTypeFilter<$PrismaModel> | $Enums.OtpType
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type RegistrationSessionNullableScalarRelationFilter = {
    is?: RegistrationSessionWhereInput | null
    isNot?: RegistrationSessionWhereInput | null
  }

  export type OtpCodeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    registrationSessionId?: SortOrder
    code?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
  }

  export type OtpCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    registrationSessionId?: SortOrder
    code?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
  }

  export type OtpCodeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    registrationSessionId?: SortOrder
    code?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumOtpTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OtpType | EnumOtpTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OtpType[] | ListEnumOtpTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OtpType[] | ListEnumOtpTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOtpTypeWithAggregatesFilter<$PrismaModel> | $Enums.OtpType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOtpTypeFilter<$PrismaModel>
    _max?: NestedEnumOtpTypeFilter<$PrismaModel>
  }

  export type EnumAccountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountTypeFilter<$PrismaModel> | $Enums.AccountType
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumAccountStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountStatus | EnumAccountStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStatusFilter<$PrismaModel> | $Enums.AccountStatus
  }

  export type UserAccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accountType?: SortOrder
    accountNumber?: SortOrder
    productCode?: SortOrder
    productName?: SortOrder
    interestRate?: SortOrder
    lockPeriodMonths?: SortOrder
    lockedUntil?: SortOrder
    allowAdditionalDeposits?: SortOrder
    metadata?: SortOrder
    balance?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAccountAvgOrderByAggregateInput = {
    interestRate?: SortOrder
    lockPeriodMonths?: SortOrder
    balance?: SortOrder
  }

  export type UserAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accountType?: SortOrder
    accountNumber?: SortOrder
    productCode?: SortOrder
    productName?: SortOrder
    interestRate?: SortOrder
    lockPeriodMonths?: SortOrder
    lockedUntil?: SortOrder
    allowAdditionalDeposits?: SortOrder
    balance?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accountType?: SortOrder
    accountNumber?: SortOrder
    productCode?: SortOrder
    productName?: SortOrder
    interestRate?: SortOrder
    lockPeriodMonths?: SortOrder
    lockedUntil?: SortOrder
    allowAdditionalDeposits?: SortOrder
    balance?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAccountSumOrderByAggregateInput = {
    interestRate?: SortOrder
    lockPeriodMonths?: SortOrder
    balance?: SortOrder
  }

  export type EnumAccountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountTypeFilter<$PrismaModel>
    _max?: NestedEnumAccountTypeFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumAccountStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountStatus | EnumAccountStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStatusWithAggregatesFilter<$PrismaModel> | $Enums.AccountStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountStatusFilter<$PrismaModel>
    _max?: NestedEnumAccountStatusFilter<$PrismaModel>
  }

  export type EnumIntentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.IntentType | EnumIntentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.IntentType[] | ListEnumIntentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntentType[] | ListEnumIntentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumIntentTypeFilter<$PrismaModel> | $Enums.IntentType
  }

  export type EnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type UserAccountScalarRelationFilter = {
    is?: UserAccountWhereInput
    isNot?: UserAccountWhereInput
  }

  export type PaymentCallbackLogListRelationFilter = {
    every?: PaymentCallbackLogWhereInput
    some?: PaymentCallbackLogWhereInput
    none?: PaymentCallbackLogWhereInput
  }

  export type PaymentCallbackLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionIntentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accountId?: SortOrder
    accountType?: SortOrder
    intentType?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    investmentTranche?: SortOrder
    investmentTerm?: SortOrder
    userNotes?: SortOrder
    adminNotes?: SortOrder
    status?: SortOrder
    referenceNumber?: SortOrder
    providerTransactionId?: SortOrder
    providerStatus?: SortOrder
    lastCallbackAt?: SortOrder
    lastCallbackPayload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionIntentAvgOrderByAggregateInput = {
    amount?: SortOrder
    investmentTerm?: SortOrder
  }

  export type TransactionIntentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accountId?: SortOrder
    accountType?: SortOrder
    intentType?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    investmentTranche?: SortOrder
    investmentTerm?: SortOrder
    userNotes?: SortOrder
    adminNotes?: SortOrder
    status?: SortOrder
    referenceNumber?: SortOrder
    providerTransactionId?: SortOrder
    providerStatus?: SortOrder
    lastCallbackAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionIntentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accountId?: SortOrder
    accountType?: SortOrder
    intentType?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    investmentTranche?: SortOrder
    investmentTerm?: SortOrder
    userNotes?: SortOrder
    adminNotes?: SortOrder
    status?: SortOrder
    referenceNumber?: SortOrder
    providerTransactionId?: SortOrder
    providerStatus?: SortOrder
    lastCallbackAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionIntentSumOrderByAggregateInput = {
    amount?: SortOrder
    investmentTerm?: SortOrder
  }

  export type EnumIntentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntentType | EnumIntentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.IntentType[] | ListEnumIntentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntentType[] | ListEnumIntentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumIntentTypeWithAggregatesFilter<$PrismaModel> | $Enums.IntentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntentTypeFilter<$PrismaModel>
    _max?: NestedEnumIntentTypeFilter<$PrismaModel>
  }

  export type EnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TransactionIntentScalarRelationFilter = {
    is?: TransactionIntentWhereInput
    isNot?: TransactionIntentWhereInput
  }

  export type PaymentCallbackLogCountOrderByAggregateInput = {
    id?: SortOrder
    transactionIntentId?: SortOrder
    status?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentCallbackLogMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionIntentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentCallbackLogMinOrderByAggregateInput = {
    id?: SortOrder
    transactionIntentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusFilter<$PrismaModel> | $Enums.VerificationStatus
  }

  export type KycDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentType?: SortOrder
    fileUrl?: SortOrder
    fileName?: SortOrder
    uploadDate?: SortOrder
    verificationStatus?: SortOrder
    adminNotes?: SortOrder
  }

  export type KycDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentType?: SortOrder
    fileUrl?: SortOrder
    fileName?: SortOrder
    uploadDate?: SortOrder
    verificationStatus?: SortOrder
    adminNotes?: SortOrder
  }

  export type KycDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentType?: SortOrder
    fileUrl?: SortOrder
    fileName?: SortOrder
    uploadDate?: SortOrder
    verificationStatus?: SortOrder
    adminNotes?: SortOrder
  }

  export type EnumVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVerificationStatusFilter<$PrismaModel>
    _max?: NestedEnumVerificationStatusFilter<$PrismaModel>
  }

  export type EnumAdminRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminRole | EnumAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminRoleFilter<$PrismaModel> | $Enums.AdminRole
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AdminUserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    lastLogin?: SortOrder
    createdAt?: SortOrder
    failedAttempts?: SortOrder
    isActive?: SortOrder
    lockedUntil?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserAvgOrderByAggregateInput = {
    failedAttempts?: SortOrder
  }

  export type AdminUserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    lastLogin?: SortOrder
    createdAt?: SortOrder
    failedAttempts?: SortOrder
    isActive?: SortOrder
    lockedUntil?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    lastLogin?: SortOrder
    createdAt?: SortOrder
    failedAttempts?: SortOrder
    isActive?: SortOrder
    lockedUntil?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserSumOrderByAggregateInput = {
    failedAttempts?: SortOrder
  }

  export type EnumAdminRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminRole | EnumAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminRoleWithAggregatesFilter<$PrismaModel> | $Enums.AdminRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAdminRoleFilter<$PrismaModel>
    _max?: NestedEnumAdminRoleFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumSessionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeFilter<$PrismaModel> | $Enums.SessionType
  }

  export type RegistrationSessionCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    data?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RegistrationSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    data?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RegistrationSessionMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    data?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumSessionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SessionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionTypeFilter<$PrismaModel>
    _max?: NestedEnumSessionTypeFilter<$PrismaModel>
  }

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type EnumNotificationPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityFilter<$PrismaModel> | $Enums.NotificationPriority
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type EnumNotificationPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel> | $Enums.NotificationPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationPriorityFilter<$PrismaModel>
    _max?: NestedEnumNotificationPriorityFilter<$PrismaModel>
  }

  export type KycDocumentCreateNestedManyWithoutUserInput = {
    create?: XOR<KycDocumentCreateWithoutUserInput, KycDocumentUncheckedCreateWithoutUserInput> | KycDocumentCreateWithoutUserInput[] | KycDocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KycDocumentCreateOrConnectWithoutUserInput | KycDocumentCreateOrConnectWithoutUserInput[]
    createMany?: KycDocumentCreateManyUserInputEnvelope
    connect?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
  }

  export type OtpCodeCreateNestedManyWithoutUserInput = {
    create?: XOR<OtpCodeCreateWithoutUserInput, OtpCodeUncheckedCreateWithoutUserInput> | OtpCodeCreateWithoutUserInput[] | OtpCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OtpCodeCreateOrConnectWithoutUserInput | OtpCodeCreateOrConnectWithoutUserInput[]
    createMany?: OtpCodeCreateManyUserInputEnvelope
    connect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type TransactionIntentCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionIntentCreateWithoutUserInput, TransactionIntentUncheckedCreateWithoutUserInput> | TransactionIntentCreateWithoutUserInput[] | TransactionIntentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutUserInput | TransactionIntentCreateOrConnectWithoutUserInput[]
    createMany?: TransactionIntentCreateManyUserInputEnvelope
    connect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
  }

  export type UserAccountCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAccountCreateWithoutUserInput, UserAccountUncheckedCreateWithoutUserInput> | UserAccountCreateWithoutUserInput[] | UserAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAccountCreateOrConnectWithoutUserInput | UserAccountCreateOrConnectWithoutUserInput[]
    createMany?: UserAccountCreateManyUserInputEnvelope
    connect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type KycDocumentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<KycDocumentCreateWithoutUserInput, KycDocumentUncheckedCreateWithoutUserInput> | KycDocumentCreateWithoutUserInput[] | KycDocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KycDocumentCreateOrConnectWithoutUserInput | KycDocumentCreateOrConnectWithoutUserInput[]
    createMany?: KycDocumentCreateManyUserInputEnvelope
    connect?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
  }

  export type OtpCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OtpCodeCreateWithoutUserInput, OtpCodeUncheckedCreateWithoutUserInput> | OtpCodeCreateWithoutUserInput[] | OtpCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OtpCodeCreateOrConnectWithoutUserInput | OtpCodeCreateOrConnectWithoutUserInput[]
    createMany?: OtpCodeCreateManyUserInputEnvelope
    connect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type TransactionIntentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionIntentCreateWithoutUserInput, TransactionIntentUncheckedCreateWithoutUserInput> | TransactionIntentCreateWithoutUserInput[] | TransactionIntentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutUserInput | TransactionIntentCreateOrConnectWithoutUserInput[]
    createMany?: TransactionIntentCreateManyUserInputEnvelope
    connect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
  }

  export type UserAccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAccountCreateWithoutUserInput, UserAccountUncheckedCreateWithoutUserInput> | UserAccountCreateWithoutUserInput[] | UserAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAccountCreateOrConnectWithoutUserInput | UserAccountCreateOrConnectWithoutUserInput[]
    createMany?: UserAccountCreateManyUserInputEnvelope
    connect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumKycStatusFieldUpdateOperationsInput = {
    set?: $Enums.KycStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type KycDocumentUpdateManyWithoutUserNestedInput = {
    create?: XOR<KycDocumentCreateWithoutUserInput, KycDocumentUncheckedCreateWithoutUserInput> | KycDocumentCreateWithoutUserInput[] | KycDocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KycDocumentCreateOrConnectWithoutUserInput | KycDocumentCreateOrConnectWithoutUserInput[]
    upsert?: KycDocumentUpsertWithWhereUniqueWithoutUserInput | KycDocumentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: KycDocumentCreateManyUserInputEnvelope
    set?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
    disconnect?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
    delete?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
    connect?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
    update?: KycDocumentUpdateWithWhereUniqueWithoutUserInput | KycDocumentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: KycDocumentUpdateManyWithWhereWithoutUserInput | KycDocumentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: KycDocumentScalarWhereInput | KycDocumentScalarWhereInput[]
  }

  export type OtpCodeUpdateManyWithoutUserNestedInput = {
    create?: XOR<OtpCodeCreateWithoutUserInput, OtpCodeUncheckedCreateWithoutUserInput> | OtpCodeCreateWithoutUserInput[] | OtpCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OtpCodeCreateOrConnectWithoutUserInput | OtpCodeCreateOrConnectWithoutUserInput[]
    upsert?: OtpCodeUpsertWithWhereUniqueWithoutUserInput | OtpCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OtpCodeCreateManyUserInputEnvelope
    set?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    disconnect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    delete?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    connect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    update?: OtpCodeUpdateWithWhereUniqueWithoutUserInput | OtpCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OtpCodeUpdateManyWithWhereWithoutUserInput | OtpCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OtpCodeScalarWhereInput | OtpCodeScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type TransactionIntentUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionIntentCreateWithoutUserInput, TransactionIntentUncheckedCreateWithoutUserInput> | TransactionIntentCreateWithoutUserInput[] | TransactionIntentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutUserInput | TransactionIntentCreateOrConnectWithoutUserInput[]
    upsert?: TransactionIntentUpsertWithWhereUniqueWithoutUserInput | TransactionIntentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionIntentCreateManyUserInputEnvelope
    set?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    disconnect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    delete?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    connect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    update?: TransactionIntentUpdateWithWhereUniqueWithoutUserInput | TransactionIntentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionIntentUpdateManyWithWhereWithoutUserInput | TransactionIntentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionIntentScalarWhereInput | TransactionIntentScalarWhereInput[]
  }

  export type UserAccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAccountCreateWithoutUserInput, UserAccountUncheckedCreateWithoutUserInput> | UserAccountCreateWithoutUserInput[] | UserAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAccountCreateOrConnectWithoutUserInput | UserAccountCreateOrConnectWithoutUserInput[]
    upsert?: UserAccountUpsertWithWhereUniqueWithoutUserInput | UserAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAccountCreateManyUserInputEnvelope
    set?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    disconnect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    delete?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    connect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    update?: UserAccountUpdateWithWhereUniqueWithoutUserInput | UserAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAccountUpdateManyWithWhereWithoutUserInput | UserAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAccountScalarWhereInput | UserAccountScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type KycDocumentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<KycDocumentCreateWithoutUserInput, KycDocumentUncheckedCreateWithoutUserInput> | KycDocumentCreateWithoutUserInput[] | KycDocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KycDocumentCreateOrConnectWithoutUserInput | KycDocumentCreateOrConnectWithoutUserInput[]
    upsert?: KycDocumentUpsertWithWhereUniqueWithoutUserInput | KycDocumentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: KycDocumentCreateManyUserInputEnvelope
    set?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
    disconnect?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
    delete?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
    connect?: KycDocumentWhereUniqueInput | KycDocumentWhereUniqueInput[]
    update?: KycDocumentUpdateWithWhereUniqueWithoutUserInput | KycDocumentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: KycDocumentUpdateManyWithWhereWithoutUserInput | KycDocumentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: KycDocumentScalarWhereInput | KycDocumentScalarWhereInput[]
  }

  export type OtpCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OtpCodeCreateWithoutUserInput, OtpCodeUncheckedCreateWithoutUserInput> | OtpCodeCreateWithoutUserInput[] | OtpCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OtpCodeCreateOrConnectWithoutUserInput | OtpCodeCreateOrConnectWithoutUserInput[]
    upsert?: OtpCodeUpsertWithWhereUniqueWithoutUserInput | OtpCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OtpCodeCreateManyUserInputEnvelope
    set?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    disconnect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    delete?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    connect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    update?: OtpCodeUpdateWithWhereUniqueWithoutUserInput | OtpCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OtpCodeUpdateManyWithWhereWithoutUserInput | OtpCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OtpCodeScalarWhereInput | OtpCodeScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type TransactionIntentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionIntentCreateWithoutUserInput, TransactionIntentUncheckedCreateWithoutUserInput> | TransactionIntentCreateWithoutUserInput[] | TransactionIntentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutUserInput | TransactionIntentCreateOrConnectWithoutUserInput[]
    upsert?: TransactionIntentUpsertWithWhereUniqueWithoutUserInput | TransactionIntentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionIntentCreateManyUserInputEnvelope
    set?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    disconnect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    delete?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    connect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    update?: TransactionIntentUpdateWithWhereUniqueWithoutUserInput | TransactionIntentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionIntentUpdateManyWithWhereWithoutUserInput | TransactionIntentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionIntentScalarWhereInput | TransactionIntentScalarWhereInput[]
  }

  export type UserAccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAccountCreateWithoutUserInput, UserAccountUncheckedCreateWithoutUserInput> | UserAccountCreateWithoutUserInput[] | UserAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAccountCreateOrConnectWithoutUserInput | UserAccountCreateOrConnectWithoutUserInput[]
    upsert?: UserAccountUpsertWithWhereUniqueWithoutUserInput | UserAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAccountCreateManyUserInputEnvelope
    set?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    disconnect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    delete?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    connect?: UserAccountWhereUniqueInput | UserAccountWhereUniqueInput[]
    update?: UserAccountUpdateWithWhereUniqueWithoutUserInput | UserAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAccountUpdateManyWithWhereWithoutUserInput | UserAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAccountScalarWhereInput | UserAccountScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutOtpCodesInput = {
    create?: XOR<UserCreateWithoutOtpCodesInput, UserUncheckedCreateWithoutOtpCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutOtpCodesInput
    connect?: UserWhereUniqueInput
  }

  export type RegistrationSessionCreateNestedOneWithoutOtpCodesInput = {
    create?: XOR<RegistrationSessionCreateWithoutOtpCodesInput, RegistrationSessionUncheckedCreateWithoutOtpCodesInput>
    connectOrCreate?: RegistrationSessionCreateOrConnectWithoutOtpCodesInput
    connect?: RegistrationSessionWhereUniqueInput
  }

  export type EnumOtpTypeFieldUpdateOperationsInput = {
    set?: $Enums.OtpType
  }

  export type UserUpdateOneWithoutOtpCodesNestedInput = {
    create?: XOR<UserCreateWithoutOtpCodesInput, UserUncheckedCreateWithoutOtpCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutOtpCodesInput
    upsert?: UserUpsertWithoutOtpCodesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOtpCodesInput, UserUpdateWithoutOtpCodesInput>, UserUncheckedUpdateWithoutOtpCodesInput>
  }

  export type RegistrationSessionUpdateOneWithoutOtpCodesNestedInput = {
    create?: XOR<RegistrationSessionCreateWithoutOtpCodesInput, RegistrationSessionUncheckedCreateWithoutOtpCodesInput>
    connectOrCreate?: RegistrationSessionCreateOrConnectWithoutOtpCodesInput
    upsert?: RegistrationSessionUpsertWithoutOtpCodesInput
    disconnect?: RegistrationSessionWhereInput | boolean
    delete?: RegistrationSessionWhereInput | boolean
    connect?: RegistrationSessionWhereUniqueInput
    update?: XOR<XOR<RegistrationSessionUpdateToOneWithWhereWithoutOtpCodesInput, RegistrationSessionUpdateWithoutOtpCodesInput>, RegistrationSessionUncheckedUpdateWithoutOtpCodesInput>
  }

  export type TransactionIntentCreateNestedManyWithoutAccountInput = {
    create?: XOR<TransactionIntentCreateWithoutAccountInput, TransactionIntentUncheckedCreateWithoutAccountInput> | TransactionIntentCreateWithoutAccountInput[] | TransactionIntentUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutAccountInput | TransactionIntentCreateOrConnectWithoutAccountInput[]
    createMany?: TransactionIntentCreateManyAccountInputEnvelope
    connect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type TransactionIntentUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<TransactionIntentCreateWithoutAccountInput, TransactionIntentUncheckedCreateWithoutAccountInput> | TransactionIntentCreateWithoutAccountInput[] | TransactionIntentUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutAccountInput | TransactionIntentCreateOrConnectWithoutAccountInput[]
    createMany?: TransactionIntentCreateManyAccountInputEnvelope
    connect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
  }

  export type EnumAccountTypeFieldUpdateOperationsInput = {
    set?: $Enums.AccountType
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumAccountStatusFieldUpdateOperationsInput = {
    set?: $Enums.AccountStatus
  }

  export type TransactionIntentUpdateManyWithoutAccountNestedInput = {
    create?: XOR<TransactionIntentCreateWithoutAccountInput, TransactionIntentUncheckedCreateWithoutAccountInput> | TransactionIntentCreateWithoutAccountInput[] | TransactionIntentUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutAccountInput | TransactionIntentCreateOrConnectWithoutAccountInput[]
    upsert?: TransactionIntentUpsertWithWhereUniqueWithoutAccountInput | TransactionIntentUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: TransactionIntentCreateManyAccountInputEnvelope
    set?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    disconnect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    delete?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    connect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    update?: TransactionIntentUpdateWithWhereUniqueWithoutAccountInput | TransactionIntentUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: TransactionIntentUpdateManyWithWhereWithoutAccountInput | TransactionIntentUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: TransactionIntentScalarWhereInput | TransactionIntentScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type TransactionIntentUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<TransactionIntentCreateWithoutAccountInput, TransactionIntentUncheckedCreateWithoutAccountInput> | TransactionIntentCreateWithoutAccountInput[] | TransactionIntentUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutAccountInput | TransactionIntentCreateOrConnectWithoutAccountInput[]
    upsert?: TransactionIntentUpsertWithWhereUniqueWithoutAccountInput | TransactionIntentUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: TransactionIntentCreateManyAccountInputEnvelope
    set?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    disconnect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    delete?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    connect?: TransactionIntentWhereUniqueInput | TransactionIntentWhereUniqueInput[]
    update?: TransactionIntentUpdateWithWhereUniqueWithoutAccountInput | TransactionIntentUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: TransactionIntentUpdateManyWithWhereWithoutAccountInput | TransactionIntentUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: TransactionIntentScalarWhereInput | TransactionIntentScalarWhereInput[]
  }

  export type UserAccountCreateNestedOneWithoutTransactionIntentsInput = {
    create?: XOR<UserAccountCreateWithoutTransactionIntentsInput, UserAccountUncheckedCreateWithoutTransactionIntentsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutTransactionIntentsInput
    connect?: UserAccountWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTransactionIntentsInput = {
    create?: XOR<UserCreateWithoutTransactionIntentsInput, UserUncheckedCreateWithoutTransactionIntentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionIntentsInput
    connect?: UserWhereUniqueInput
  }

  export type PaymentCallbackLogCreateNestedManyWithoutTransactionIntentInput = {
    create?: XOR<PaymentCallbackLogCreateWithoutTransactionIntentInput, PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput> | PaymentCallbackLogCreateWithoutTransactionIntentInput[] | PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput[]
    connectOrCreate?: PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput | PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput[]
    createMany?: PaymentCallbackLogCreateManyTransactionIntentInputEnvelope
    connect?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
  }

  export type PaymentCallbackLogUncheckedCreateNestedManyWithoutTransactionIntentInput = {
    create?: XOR<PaymentCallbackLogCreateWithoutTransactionIntentInput, PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput> | PaymentCallbackLogCreateWithoutTransactionIntentInput[] | PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput[]
    connectOrCreate?: PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput | PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput[]
    createMany?: PaymentCallbackLogCreateManyTransactionIntentInputEnvelope
    connect?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
  }

  export type EnumIntentTypeFieldUpdateOperationsInput = {
    set?: $Enums.IntentType
  }

  export type EnumTransactionStatusFieldUpdateOperationsInput = {
    set?: $Enums.TransactionStatus
  }

  export type UserAccountUpdateOneRequiredWithoutTransactionIntentsNestedInput = {
    create?: XOR<UserAccountCreateWithoutTransactionIntentsInput, UserAccountUncheckedCreateWithoutTransactionIntentsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutTransactionIntentsInput
    upsert?: UserAccountUpsertWithoutTransactionIntentsInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutTransactionIntentsInput, UserAccountUpdateWithoutTransactionIntentsInput>, UserAccountUncheckedUpdateWithoutTransactionIntentsInput>
  }

  export type UserUpdateOneRequiredWithoutTransactionIntentsNestedInput = {
    create?: XOR<UserCreateWithoutTransactionIntentsInput, UserUncheckedCreateWithoutTransactionIntentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionIntentsInput
    upsert?: UserUpsertWithoutTransactionIntentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionIntentsInput, UserUpdateWithoutTransactionIntentsInput>, UserUncheckedUpdateWithoutTransactionIntentsInput>
  }

  export type PaymentCallbackLogUpdateManyWithoutTransactionIntentNestedInput = {
    create?: XOR<PaymentCallbackLogCreateWithoutTransactionIntentInput, PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput> | PaymentCallbackLogCreateWithoutTransactionIntentInput[] | PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput[]
    connectOrCreate?: PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput | PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput[]
    upsert?: PaymentCallbackLogUpsertWithWhereUniqueWithoutTransactionIntentInput | PaymentCallbackLogUpsertWithWhereUniqueWithoutTransactionIntentInput[]
    createMany?: PaymentCallbackLogCreateManyTransactionIntentInputEnvelope
    set?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
    disconnect?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
    delete?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
    connect?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
    update?: PaymentCallbackLogUpdateWithWhereUniqueWithoutTransactionIntentInput | PaymentCallbackLogUpdateWithWhereUniqueWithoutTransactionIntentInput[]
    updateMany?: PaymentCallbackLogUpdateManyWithWhereWithoutTransactionIntentInput | PaymentCallbackLogUpdateManyWithWhereWithoutTransactionIntentInput[]
    deleteMany?: PaymentCallbackLogScalarWhereInput | PaymentCallbackLogScalarWhereInput[]
  }

  export type PaymentCallbackLogUncheckedUpdateManyWithoutTransactionIntentNestedInput = {
    create?: XOR<PaymentCallbackLogCreateWithoutTransactionIntentInput, PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput> | PaymentCallbackLogCreateWithoutTransactionIntentInput[] | PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput[]
    connectOrCreate?: PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput | PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput[]
    upsert?: PaymentCallbackLogUpsertWithWhereUniqueWithoutTransactionIntentInput | PaymentCallbackLogUpsertWithWhereUniqueWithoutTransactionIntentInput[]
    createMany?: PaymentCallbackLogCreateManyTransactionIntentInputEnvelope
    set?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
    disconnect?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
    delete?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
    connect?: PaymentCallbackLogWhereUniqueInput | PaymentCallbackLogWhereUniqueInput[]
    update?: PaymentCallbackLogUpdateWithWhereUniqueWithoutTransactionIntentInput | PaymentCallbackLogUpdateWithWhereUniqueWithoutTransactionIntentInput[]
    updateMany?: PaymentCallbackLogUpdateManyWithWhereWithoutTransactionIntentInput | PaymentCallbackLogUpdateManyWithWhereWithoutTransactionIntentInput[]
    deleteMany?: PaymentCallbackLogScalarWhereInput | PaymentCallbackLogScalarWhereInput[]
  }

  export type TransactionIntentCreateNestedOneWithoutPaymentCallbacksInput = {
    create?: XOR<TransactionIntentCreateWithoutPaymentCallbacksInput, TransactionIntentUncheckedCreateWithoutPaymentCallbacksInput>
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutPaymentCallbacksInput
    connect?: TransactionIntentWhereUniqueInput
  }

  export type TransactionIntentUpdateOneRequiredWithoutPaymentCallbacksNestedInput = {
    create?: XOR<TransactionIntentCreateWithoutPaymentCallbacksInput, TransactionIntentUncheckedCreateWithoutPaymentCallbacksInput>
    connectOrCreate?: TransactionIntentCreateOrConnectWithoutPaymentCallbacksInput
    upsert?: TransactionIntentUpsertWithoutPaymentCallbacksInput
    connect?: TransactionIntentWhereUniqueInput
    update?: XOR<XOR<TransactionIntentUpdateToOneWithWhereWithoutPaymentCallbacksInput, TransactionIntentUpdateWithoutPaymentCallbacksInput>, TransactionIntentUncheckedUpdateWithoutPaymentCallbacksInput>
  }

  export type UserCreateNestedOneWithoutKycDocumentsInput = {
    create?: XOR<UserCreateWithoutKycDocumentsInput, UserUncheckedCreateWithoutKycDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutKycDocumentsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumVerificationStatusFieldUpdateOperationsInput = {
    set?: $Enums.VerificationStatus
  }

  export type UserUpdateOneRequiredWithoutKycDocumentsNestedInput = {
    create?: XOR<UserCreateWithoutKycDocumentsInput, UserUncheckedCreateWithoutKycDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutKycDocumentsInput
    upsert?: UserUpsertWithoutKycDocumentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutKycDocumentsInput, UserUpdateWithoutKycDocumentsInput>, UserUncheckedUpdateWithoutKycDocumentsInput>
  }

  export type EnumAdminRoleFieldUpdateOperationsInput = {
    set?: $Enums.AdminRole
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OtpCodeCreateNestedManyWithoutRegistrationSessionInput = {
    create?: XOR<OtpCodeCreateWithoutRegistrationSessionInput, OtpCodeUncheckedCreateWithoutRegistrationSessionInput> | OtpCodeCreateWithoutRegistrationSessionInput[] | OtpCodeUncheckedCreateWithoutRegistrationSessionInput[]
    connectOrCreate?: OtpCodeCreateOrConnectWithoutRegistrationSessionInput | OtpCodeCreateOrConnectWithoutRegistrationSessionInput[]
    createMany?: OtpCodeCreateManyRegistrationSessionInputEnvelope
    connect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
  }

  export type OtpCodeUncheckedCreateNestedManyWithoutRegistrationSessionInput = {
    create?: XOR<OtpCodeCreateWithoutRegistrationSessionInput, OtpCodeUncheckedCreateWithoutRegistrationSessionInput> | OtpCodeCreateWithoutRegistrationSessionInput[] | OtpCodeUncheckedCreateWithoutRegistrationSessionInput[]
    connectOrCreate?: OtpCodeCreateOrConnectWithoutRegistrationSessionInput | OtpCodeCreateOrConnectWithoutRegistrationSessionInput[]
    createMany?: OtpCodeCreateManyRegistrationSessionInputEnvelope
    connect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
  }

  export type EnumSessionTypeFieldUpdateOperationsInput = {
    set?: $Enums.SessionType
  }

  export type OtpCodeUpdateManyWithoutRegistrationSessionNestedInput = {
    create?: XOR<OtpCodeCreateWithoutRegistrationSessionInput, OtpCodeUncheckedCreateWithoutRegistrationSessionInput> | OtpCodeCreateWithoutRegistrationSessionInput[] | OtpCodeUncheckedCreateWithoutRegistrationSessionInput[]
    connectOrCreate?: OtpCodeCreateOrConnectWithoutRegistrationSessionInput | OtpCodeCreateOrConnectWithoutRegistrationSessionInput[]
    upsert?: OtpCodeUpsertWithWhereUniqueWithoutRegistrationSessionInput | OtpCodeUpsertWithWhereUniqueWithoutRegistrationSessionInput[]
    createMany?: OtpCodeCreateManyRegistrationSessionInputEnvelope
    set?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    disconnect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    delete?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    connect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    update?: OtpCodeUpdateWithWhereUniqueWithoutRegistrationSessionInput | OtpCodeUpdateWithWhereUniqueWithoutRegistrationSessionInput[]
    updateMany?: OtpCodeUpdateManyWithWhereWithoutRegistrationSessionInput | OtpCodeUpdateManyWithWhereWithoutRegistrationSessionInput[]
    deleteMany?: OtpCodeScalarWhereInput | OtpCodeScalarWhereInput[]
  }

  export type OtpCodeUncheckedUpdateManyWithoutRegistrationSessionNestedInput = {
    create?: XOR<OtpCodeCreateWithoutRegistrationSessionInput, OtpCodeUncheckedCreateWithoutRegistrationSessionInput> | OtpCodeCreateWithoutRegistrationSessionInput[] | OtpCodeUncheckedCreateWithoutRegistrationSessionInput[]
    connectOrCreate?: OtpCodeCreateOrConnectWithoutRegistrationSessionInput | OtpCodeCreateOrConnectWithoutRegistrationSessionInput[]
    upsert?: OtpCodeUpsertWithWhereUniqueWithoutRegistrationSessionInput | OtpCodeUpsertWithWhereUniqueWithoutRegistrationSessionInput[]
    createMany?: OtpCodeCreateManyRegistrationSessionInputEnvelope
    set?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    disconnect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    delete?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    connect?: OtpCodeWhereUniqueInput | OtpCodeWhereUniqueInput[]
    update?: OtpCodeUpdateWithWhereUniqueWithoutRegistrationSessionInput | OtpCodeUpdateWithWhereUniqueWithoutRegistrationSessionInput[]
    updateMany?: OtpCodeUpdateManyWithWhereWithoutRegistrationSessionInput | OtpCodeUpdateManyWithWhereWithoutRegistrationSessionInput[]
    deleteMany?: OtpCodeScalarWhereInput | OtpCodeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType
  }

  export type EnumNotificationPriorityFieldUpdateOperationsInput = {
    set?: $Enums.NotificationPriority
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumKycStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KycStatus | EnumKycStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKycStatusFilter<$PrismaModel> | $Enums.KycStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumKycStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KycStatus | EnumKycStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKycStatusWithAggregatesFilter<$PrismaModel> | $Enums.KycStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKycStatusFilter<$PrismaModel>
    _max?: NestedEnumKycStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumOtpTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OtpType | EnumOtpTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OtpType[] | ListEnumOtpTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OtpType[] | ListEnumOtpTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOtpTypeFilter<$PrismaModel> | $Enums.OtpType
  }

  export type NestedEnumOtpTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OtpType | EnumOtpTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OtpType[] | ListEnumOtpTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OtpType[] | ListEnumOtpTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOtpTypeWithAggregatesFilter<$PrismaModel> | $Enums.OtpType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOtpTypeFilter<$PrismaModel>
    _max?: NestedEnumOtpTypeFilter<$PrismaModel>
  }

  export type NestedEnumAccountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountTypeFilter<$PrismaModel> | $Enums.AccountType
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumAccountStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountStatus | EnumAccountStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStatusFilter<$PrismaModel> | $Enums.AccountStatus
  }

  export type NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountTypeFilter<$PrismaModel>
    _max?: NestedEnumAccountTypeFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumAccountStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountStatus | EnumAccountStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStatusWithAggregatesFilter<$PrismaModel> | $Enums.AccountStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountStatusFilter<$PrismaModel>
    _max?: NestedEnumAccountStatusFilter<$PrismaModel>
  }

  export type NestedEnumIntentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.IntentType | EnumIntentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.IntentType[] | ListEnumIntentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntentType[] | ListEnumIntentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumIntentTypeFilter<$PrismaModel> | $Enums.IntentType
  }

  export type NestedEnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type NestedEnumIntentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntentType | EnumIntentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.IntentType[] | ListEnumIntentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntentType[] | ListEnumIntentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumIntentTypeWithAggregatesFilter<$PrismaModel> | $Enums.IntentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntentTypeFilter<$PrismaModel>
    _max?: NestedEnumIntentTypeFilter<$PrismaModel>
  }

  export type NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusFilter<$PrismaModel> | $Enums.VerificationStatus
  }

  export type NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVerificationStatusFilter<$PrismaModel>
    _max?: NestedEnumVerificationStatusFilter<$PrismaModel>
  }

  export type NestedEnumAdminRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminRole | EnumAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminRoleFilter<$PrismaModel> | $Enums.AdminRole
  }

  export type NestedEnumAdminRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminRole | EnumAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminRoleWithAggregatesFilter<$PrismaModel> | $Enums.AdminRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAdminRoleFilter<$PrismaModel>
    _max?: NestedEnumAdminRoleFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumSessionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeFilter<$PrismaModel> | $Enums.SessionType
  }

  export type NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SessionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionTypeFilter<$PrismaModel>
    _max?: NestedEnumSessionTypeFilter<$PrismaModel>
  }

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type NestedEnumNotificationPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityFilter<$PrismaModel> | $Enums.NotificationPriority
  }

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel> | $Enums.NotificationPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationPriorityFilter<$PrismaModel>
    _max?: NestedEnumNotificationPriorityFilter<$PrismaModel>
  }

  export type KycDocumentCreateWithoutUserInput = {
    id?: string
    documentType: string
    fileUrl: string
    fileName: string
    uploadDate?: Date | string
    verificationStatus?: $Enums.VerificationStatus
    adminNotes?: string | null
  }

  export type KycDocumentUncheckedCreateWithoutUserInput = {
    id?: string
    documentType: string
    fileUrl: string
    fileName: string
    uploadDate?: Date | string
    verificationStatus?: $Enums.VerificationStatus
    adminNotes?: string | null
  }

  export type KycDocumentCreateOrConnectWithoutUserInput = {
    where: KycDocumentWhereUniqueInput
    create: XOR<KycDocumentCreateWithoutUserInput, KycDocumentUncheckedCreateWithoutUserInput>
  }

  export type KycDocumentCreateManyUserInputEnvelope = {
    data: KycDocumentCreateManyUserInput | KycDocumentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OtpCodeCreateWithoutUserInput = {
    id?: string
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    registrationSession?: RegistrationSessionCreateNestedOneWithoutOtpCodesInput
  }

  export type OtpCodeUncheckedCreateWithoutUserInput = {
    id?: string
    registrationSessionId?: string | null
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
  }

  export type OtpCodeCreateOrConnectWithoutUserInput = {
    where: OtpCodeWhereUniqueInput
    create: XOR<OtpCodeCreateWithoutUserInput, OtpCodeUncheckedCreateWithoutUserInput>
  }

  export type OtpCodeCreateManyUserInputEnvelope = {
    data: OtpCodeCreateManyUserInput | OtpCodeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TransactionIntentCreateWithoutUserInput = {
    id?: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    account: UserAccountCreateNestedOneWithoutTransactionIntentsInput
    paymentCallbacks?: PaymentCallbackLogCreateNestedManyWithoutTransactionIntentInput
  }

  export type TransactionIntentUncheckedCreateWithoutUserInput = {
    id?: string
    accountId: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paymentCallbacks?: PaymentCallbackLogUncheckedCreateNestedManyWithoutTransactionIntentInput
  }

  export type TransactionIntentCreateOrConnectWithoutUserInput = {
    where: TransactionIntentWhereUniqueInput
    create: XOR<TransactionIntentCreateWithoutUserInput, TransactionIntentUncheckedCreateWithoutUserInput>
  }

  export type TransactionIntentCreateManyUserInputEnvelope = {
    data: TransactionIntentCreateManyUserInput | TransactionIntentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserAccountCreateWithoutUserInput = {
    id?: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode?: string | null
    productName?: string | null
    interestRate?: Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: number | null
    lockedUntil?: Date | string | null
    allowAdditionalDeposits?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    transactionIntents?: TransactionIntentCreateNestedManyWithoutAccountInput
  }

  export type UserAccountUncheckedCreateWithoutUserInput = {
    id?: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode?: string | null
    productName?: string | null
    interestRate?: Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: number | null
    lockedUntil?: Date | string | null
    allowAdditionalDeposits?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    transactionIntents?: TransactionIntentUncheckedCreateNestedManyWithoutAccountInput
  }

  export type UserAccountCreateOrConnectWithoutUserInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutUserInput, UserAccountUncheckedCreateWithoutUserInput>
  }

  export type UserAccountCreateManyUserInputEnvelope = {
    data: UserAccountCreateManyUserInput | UserAccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    priority: $Enums.NotificationPriority
    isRead?: boolean
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    priority: $Enums.NotificationPriority
    isRead?: boolean
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type KycDocumentUpsertWithWhereUniqueWithoutUserInput = {
    where: KycDocumentWhereUniqueInput
    update: XOR<KycDocumentUpdateWithoutUserInput, KycDocumentUncheckedUpdateWithoutUserInput>
    create: XOR<KycDocumentCreateWithoutUserInput, KycDocumentUncheckedCreateWithoutUserInput>
  }

  export type KycDocumentUpdateWithWhereUniqueWithoutUserInput = {
    where: KycDocumentWhereUniqueInput
    data: XOR<KycDocumentUpdateWithoutUserInput, KycDocumentUncheckedUpdateWithoutUserInput>
  }

  export type KycDocumentUpdateManyWithWhereWithoutUserInput = {
    where: KycDocumentScalarWhereInput
    data: XOR<KycDocumentUpdateManyMutationInput, KycDocumentUncheckedUpdateManyWithoutUserInput>
  }

  export type KycDocumentScalarWhereInput = {
    AND?: KycDocumentScalarWhereInput | KycDocumentScalarWhereInput[]
    OR?: KycDocumentScalarWhereInput[]
    NOT?: KycDocumentScalarWhereInput | KycDocumentScalarWhereInput[]
    id?: StringFilter<"KycDocument"> | string
    userId?: StringFilter<"KycDocument"> | string
    documentType?: StringFilter<"KycDocument"> | string
    fileUrl?: StringFilter<"KycDocument"> | string
    fileName?: StringFilter<"KycDocument"> | string
    uploadDate?: DateTimeFilter<"KycDocument"> | Date | string
    verificationStatus?: EnumVerificationStatusFilter<"KycDocument"> | $Enums.VerificationStatus
    adminNotes?: StringNullableFilter<"KycDocument"> | string | null
  }

  export type OtpCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: OtpCodeWhereUniqueInput
    update: XOR<OtpCodeUpdateWithoutUserInput, OtpCodeUncheckedUpdateWithoutUserInput>
    create: XOR<OtpCodeCreateWithoutUserInput, OtpCodeUncheckedCreateWithoutUserInput>
  }

  export type OtpCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: OtpCodeWhereUniqueInput
    data: XOR<OtpCodeUpdateWithoutUserInput, OtpCodeUncheckedUpdateWithoutUserInput>
  }

  export type OtpCodeUpdateManyWithWhereWithoutUserInput = {
    where: OtpCodeScalarWhereInput
    data: XOR<OtpCodeUpdateManyMutationInput, OtpCodeUncheckedUpdateManyWithoutUserInput>
  }

  export type OtpCodeScalarWhereInput = {
    AND?: OtpCodeScalarWhereInput | OtpCodeScalarWhereInput[]
    OR?: OtpCodeScalarWhereInput[]
    NOT?: OtpCodeScalarWhereInput | OtpCodeScalarWhereInput[]
    id?: StringFilter<"OtpCode"> | string
    userId?: StringNullableFilter<"OtpCode"> | string | null
    registrationSessionId?: StringNullableFilter<"OtpCode"> | string | null
    code?: StringFilter<"OtpCode"> | string
    type?: EnumOtpTypeFilter<"OtpCode"> | $Enums.OtpType
    expiresAt?: DateTimeFilter<"OtpCode"> | Date | string
    used?: BoolFilter<"OtpCode"> | boolean
    createdAt?: DateTimeFilter<"OtpCode"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type TransactionIntentUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionIntentWhereUniqueInput
    update: XOR<TransactionIntentUpdateWithoutUserInput, TransactionIntentUncheckedUpdateWithoutUserInput>
    create: XOR<TransactionIntentCreateWithoutUserInput, TransactionIntentUncheckedCreateWithoutUserInput>
  }

  export type TransactionIntentUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionIntentWhereUniqueInput
    data: XOR<TransactionIntentUpdateWithoutUserInput, TransactionIntentUncheckedUpdateWithoutUserInput>
  }

  export type TransactionIntentUpdateManyWithWhereWithoutUserInput = {
    where: TransactionIntentScalarWhereInput
    data: XOR<TransactionIntentUpdateManyMutationInput, TransactionIntentUncheckedUpdateManyWithoutUserInput>
  }

  export type TransactionIntentScalarWhereInput = {
    AND?: TransactionIntentScalarWhereInput | TransactionIntentScalarWhereInput[]
    OR?: TransactionIntentScalarWhereInput[]
    NOT?: TransactionIntentScalarWhereInput | TransactionIntentScalarWhereInput[]
    id?: StringFilter<"TransactionIntent"> | string
    userId?: StringFilter<"TransactionIntent"> | string
    accountId?: StringFilter<"TransactionIntent"> | string
    accountType?: EnumAccountTypeFilter<"TransactionIntent"> | $Enums.AccountType
    intentType?: EnumIntentTypeFilter<"TransactionIntent"> | $Enums.IntentType
    amount?: DecimalFilter<"TransactionIntent"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"TransactionIntent"> | string
    investmentTranche?: StringNullableFilter<"TransactionIntent"> | string | null
    investmentTerm?: IntNullableFilter<"TransactionIntent"> | number | null
    userNotes?: StringNullableFilter<"TransactionIntent"> | string | null
    adminNotes?: StringNullableFilter<"TransactionIntent"> | string | null
    status?: EnumTransactionStatusFilter<"TransactionIntent"> | $Enums.TransactionStatus
    referenceNumber?: StringFilter<"TransactionIntent"> | string
    providerTransactionId?: StringNullableFilter<"TransactionIntent"> | string | null
    providerStatus?: StringNullableFilter<"TransactionIntent"> | string | null
    lastCallbackAt?: DateTimeNullableFilter<"TransactionIntent"> | Date | string | null
    lastCallbackPayload?: JsonNullableFilter<"TransactionIntent">
    createdAt?: DateTimeFilter<"TransactionIntent"> | Date | string
    updatedAt?: DateTimeFilter<"TransactionIntent"> | Date | string
  }

  export type UserAccountUpsertWithWhereUniqueWithoutUserInput = {
    where: UserAccountWhereUniqueInput
    update: XOR<UserAccountUpdateWithoutUserInput, UserAccountUncheckedUpdateWithoutUserInput>
    create: XOR<UserAccountCreateWithoutUserInput, UserAccountUncheckedCreateWithoutUserInput>
  }

  export type UserAccountUpdateWithWhereUniqueWithoutUserInput = {
    where: UserAccountWhereUniqueInput
    data: XOR<UserAccountUpdateWithoutUserInput, UserAccountUncheckedUpdateWithoutUserInput>
  }

  export type UserAccountUpdateManyWithWhereWithoutUserInput = {
    where: UserAccountScalarWhereInput
    data: XOR<UserAccountUpdateManyMutationInput, UserAccountUncheckedUpdateManyWithoutUserInput>
  }

  export type UserAccountScalarWhereInput = {
    AND?: UserAccountScalarWhereInput | UserAccountScalarWhereInput[]
    OR?: UserAccountScalarWhereInput[]
    NOT?: UserAccountScalarWhereInput | UserAccountScalarWhereInput[]
    id?: StringFilter<"UserAccount"> | string
    userId?: StringFilter<"UserAccount"> | string
    accountType?: EnumAccountTypeFilter<"UserAccount"> | $Enums.AccountType
    accountNumber?: StringFilter<"UserAccount"> | string
    productCode?: StringNullableFilter<"UserAccount"> | string | null
    productName?: StringNullableFilter<"UserAccount"> | string | null
    interestRate?: DecimalNullableFilter<"UserAccount"> | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: IntNullableFilter<"UserAccount"> | number | null
    lockedUntil?: DateTimeNullableFilter<"UserAccount"> | Date | string | null
    allowAdditionalDeposits?: BoolFilter<"UserAccount"> | boolean
    metadata?: JsonNullableFilter<"UserAccount">
    balance?: DecimalFilter<"UserAccount"> | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFilter<"UserAccount"> | $Enums.AccountStatus
    createdAt?: DateTimeFilter<"UserAccount"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    priority?: EnumNotificationPriorityFilter<"Notification"> | $Enums.NotificationPriority
    isRead?: BoolFilter<"Notification"> | boolean
    metadata?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentCreateNestedManyWithoutUserInput
    accounts?: UserAccountCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentUncheckedCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeUncheckedCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentUncheckedCreateNestedManyWithoutUserInput
    accounts?: UserAccountUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUncheckedUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUncheckedUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUncheckedUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutOtpCodesInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentCreateNestedManyWithoutUserInput
    accounts?: UserAccountCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOtpCodesInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentUncheckedCreateNestedManyWithoutUserInput
    accounts?: UserAccountUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOtpCodesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOtpCodesInput, UserUncheckedCreateWithoutOtpCodesInput>
  }

  export type RegistrationSessionCreateWithoutOtpCodesInput = {
    id?: string
    email: string
    phone: string
    data: string
    type?: $Enums.SessionType
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RegistrationSessionUncheckedCreateWithoutOtpCodesInput = {
    id?: string
    email: string
    phone: string
    data: string
    type?: $Enums.SessionType
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RegistrationSessionCreateOrConnectWithoutOtpCodesInput = {
    where: RegistrationSessionWhereUniqueInput
    create: XOR<RegistrationSessionCreateWithoutOtpCodesInput, RegistrationSessionUncheckedCreateWithoutOtpCodesInput>
  }

  export type UserUpsertWithoutOtpCodesInput = {
    update: XOR<UserUpdateWithoutOtpCodesInput, UserUncheckedUpdateWithoutOtpCodesInput>
    create: XOR<UserCreateWithoutOtpCodesInput, UserUncheckedCreateWithoutOtpCodesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOtpCodesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOtpCodesInput, UserUncheckedUpdateWithoutOtpCodesInput>
  }

  export type UserUpdateWithoutOtpCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOtpCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUncheckedUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RegistrationSessionUpsertWithoutOtpCodesInput = {
    update: XOR<RegistrationSessionUpdateWithoutOtpCodesInput, RegistrationSessionUncheckedUpdateWithoutOtpCodesInput>
    create: XOR<RegistrationSessionCreateWithoutOtpCodesInput, RegistrationSessionUncheckedCreateWithoutOtpCodesInput>
    where?: RegistrationSessionWhereInput
  }

  export type RegistrationSessionUpdateToOneWithWhereWithoutOtpCodesInput = {
    where?: RegistrationSessionWhereInput
    data: XOR<RegistrationSessionUpdateWithoutOtpCodesInput, RegistrationSessionUncheckedUpdateWithoutOtpCodesInput>
  }

  export type RegistrationSessionUpdateWithoutOtpCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationSessionUncheckedUpdateWithoutOtpCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionIntentCreateWithoutAccountInput = {
    id?: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionIntentsInput
    paymentCallbacks?: PaymentCallbackLogCreateNestedManyWithoutTransactionIntentInput
  }

  export type TransactionIntentUncheckedCreateWithoutAccountInput = {
    id?: string
    userId: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paymentCallbacks?: PaymentCallbackLogUncheckedCreateNestedManyWithoutTransactionIntentInput
  }

  export type TransactionIntentCreateOrConnectWithoutAccountInput = {
    where: TransactionIntentWhereUniqueInput
    create: XOR<TransactionIntentCreateWithoutAccountInput, TransactionIntentUncheckedCreateWithoutAccountInput>
  }

  export type TransactionIntentCreateManyAccountInputEnvelope = {
    data: TransactionIntentCreateManyAccountInput | TransactionIntentCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentUncheckedCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type TransactionIntentUpsertWithWhereUniqueWithoutAccountInput = {
    where: TransactionIntentWhereUniqueInput
    update: XOR<TransactionIntentUpdateWithoutAccountInput, TransactionIntentUncheckedUpdateWithoutAccountInput>
    create: XOR<TransactionIntentCreateWithoutAccountInput, TransactionIntentUncheckedCreateWithoutAccountInput>
  }

  export type TransactionIntentUpdateWithWhereUniqueWithoutAccountInput = {
    where: TransactionIntentWhereUniqueInput
    data: XOR<TransactionIntentUpdateWithoutAccountInput, TransactionIntentUncheckedUpdateWithoutAccountInput>
  }

  export type TransactionIntentUpdateManyWithWhereWithoutAccountInput = {
    where: TransactionIntentScalarWhereInput
    data: XOR<TransactionIntentUpdateManyMutationInput, TransactionIntentUncheckedUpdateManyWithoutAccountInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUncheckedUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserAccountCreateWithoutTransactionIntentsInput = {
    id?: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode?: string | null
    productName?: string | null
    interestRate?: Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: number | null
    lockedUntil?: Date | string | null
    allowAdditionalDeposits?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type UserAccountUncheckedCreateWithoutTransactionIntentsInput = {
    id?: string
    userId: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode?: string | null
    productName?: string | null
    interestRate?: Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: number | null
    lockedUntil?: Date | string | null
    allowAdditionalDeposits?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.AccountStatus
    createdAt?: Date | string
  }

  export type UserAccountCreateOrConnectWithoutTransactionIntentsInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutTransactionIntentsInput, UserAccountUncheckedCreateWithoutTransactionIntentsInput>
  }

  export type UserCreateWithoutTransactionIntentsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: UserAccountCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionIntentsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentUncheckedCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: UserAccountUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionIntentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionIntentsInput, UserUncheckedCreateWithoutTransactionIntentsInput>
  }

  export type PaymentCallbackLogCreateWithoutTransactionIntentInput = {
    id?: string
    status: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput = {
    id?: string
    status: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentCallbackLogCreateOrConnectWithoutTransactionIntentInput = {
    where: PaymentCallbackLogWhereUniqueInput
    create: XOR<PaymentCallbackLogCreateWithoutTransactionIntentInput, PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput>
  }

  export type PaymentCallbackLogCreateManyTransactionIntentInputEnvelope = {
    data: PaymentCallbackLogCreateManyTransactionIntentInput | PaymentCallbackLogCreateManyTransactionIntentInput[]
    skipDuplicates?: boolean
  }

  export type UserAccountUpsertWithoutTransactionIntentsInput = {
    update: XOR<UserAccountUpdateWithoutTransactionIntentsInput, UserAccountUncheckedUpdateWithoutTransactionIntentsInput>
    create: XOR<UserAccountCreateWithoutTransactionIntentsInput, UserAccountUncheckedCreateWithoutTransactionIntentsInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutTransactionIntentsInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutTransactionIntentsInput, UserAccountUncheckedUpdateWithoutTransactionIntentsInput>
  }

  export type UserAccountUpdateWithoutTransactionIntentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutTransactionIntentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutTransactionIntentsInput = {
    update: XOR<UserUpdateWithoutTransactionIntentsInput, UserUncheckedUpdateWithoutTransactionIntentsInput>
    create: XOR<UserCreateWithoutTransactionIntentsInput, UserUncheckedCreateWithoutTransactionIntentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionIntentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionIntentsInput, UserUncheckedUpdateWithoutTransactionIntentsInput>
  }

  export type UserUpdateWithoutTransactionIntentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionIntentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUncheckedUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PaymentCallbackLogUpsertWithWhereUniqueWithoutTransactionIntentInput = {
    where: PaymentCallbackLogWhereUniqueInput
    update: XOR<PaymentCallbackLogUpdateWithoutTransactionIntentInput, PaymentCallbackLogUncheckedUpdateWithoutTransactionIntentInput>
    create: XOR<PaymentCallbackLogCreateWithoutTransactionIntentInput, PaymentCallbackLogUncheckedCreateWithoutTransactionIntentInput>
  }

  export type PaymentCallbackLogUpdateWithWhereUniqueWithoutTransactionIntentInput = {
    where: PaymentCallbackLogWhereUniqueInput
    data: XOR<PaymentCallbackLogUpdateWithoutTransactionIntentInput, PaymentCallbackLogUncheckedUpdateWithoutTransactionIntentInput>
  }

  export type PaymentCallbackLogUpdateManyWithWhereWithoutTransactionIntentInput = {
    where: PaymentCallbackLogScalarWhereInput
    data: XOR<PaymentCallbackLogUpdateManyMutationInput, PaymentCallbackLogUncheckedUpdateManyWithoutTransactionIntentInput>
  }

  export type PaymentCallbackLogScalarWhereInput = {
    AND?: PaymentCallbackLogScalarWhereInput | PaymentCallbackLogScalarWhereInput[]
    OR?: PaymentCallbackLogScalarWhereInput[]
    NOT?: PaymentCallbackLogScalarWhereInput | PaymentCallbackLogScalarWhereInput[]
    id?: StringFilter<"PaymentCallbackLog"> | string
    transactionIntentId?: StringFilter<"PaymentCallbackLog"> | string
    status?: StringFilter<"PaymentCallbackLog"> | string
    payload?: JsonFilter<"PaymentCallbackLog">
    createdAt?: DateTimeFilter<"PaymentCallbackLog"> | Date | string
  }

  export type TransactionIntentCreateWithoutPaymentCallbacksInput = {
    id?: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    account: UserAccountCreateNestedOneWithoutTransactionIntentsInput
    user: UserCreateNestedOneWithoutTransactionIntentsInput
  }

  export type TransactionIntentUncheckedCreateWithoutPaymentCallbacksInput = {
    id?: string
    userId: string
    accountId: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionIntentCreateOrConnectWithoutPaymentCallbacksInput = {
    where: TransactionIntentWhereUniqueInput
    create: XOR<TransactionIntentCreateWithoutPaymentCallbacksInput, TransactionIntentUncheckedCreateWithoutPaymentCallbacksInput>
  }

  export type TransactionIntentUpsertWithoutPaymentCallbacksInput = {
    update: XOR<TransactionIntentUpdateWithoutPaymentCallbacksInput, TransactionIntentUncheckedUpdateWithoutPaymentCallbacksInput>
    create: XOR<TransactionIntentCreateWithoutPaymentCallbacksInput, TransactionIntentUncheckedCreateWithoutPaymentCallbacksInput>
    where?: TransactionIntentWhereInput
  }

  export type TransactionIntentUpdateToOneWithWhereWithoutPaymentCallbacksInput = {
    where?: TransactionIntentWhereInput
    data: XOR<TransactionIntentUpdateWithoutPaymentCallbacksInput, TransactionIntentUncheckedUpdateWithoutPaymentCallbacksInput>
  }

  export type TransactionIntentUpdateWithoutPaymentCallbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: UserAccountUpdateOneRequiredWithoutTransactionIntentsNestedInput
    user?: UserUpdateOneRequiredWithoutTransactionIntentsNestedInput
  }

  export type TransactionIntentUncheckedUpdateWithoutPaymentCallbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutKycDocumentsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    otpCodes?: OtpCodeCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentCreateNestedManyWithoutUserInput
    accounts?: UserAccountCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutKycDocumentsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    otpCodes?: OtpCodeUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentUncheckedCreateNestedManyWithoutUserInput
    accounts?: UserAccountUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutKycDocumentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutKycDocumentsInput, UserUncheckedCreateWithoutKycDocumentsInput>
  }

  export type UserUpsertWithoutKycDocumentsInput = {
    update: XOR<UserUpdateWithoutKycDocumentsInput, UserUncheckedUpdateWithoutKycDocumentsInput>
    create: XOR<UserCreateWithoutKycDocumentsInput, UserUncheckedCreateWithoutKycDocumentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutKycDocumentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutKycDocumentsInput, UserUncheckedUpdateWithoutKycDocumentsInput>
  }

  export type UserUpdateWithoutKycDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    otpCodes?: OtpCodeUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutKycDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    otpCodes?: OtpCodeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUncheckedUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OtpCodeCreateWithoutRegistrationSessionInput = {
    id?: string
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutOtpCodesInput
  }

  export type OtpCodeUncheckedCreateWithoutRegistrationSessionInput = {
    id?: string
    userId?: string | null
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
  }

  export type OtpCodeCreateOrConnectWithoutRegistrationSessionInput = {
    where: OtpCodeWhereUniqueInput
    create: XOR<OtpCodeCreateWithoutRegistrationSessionInput, OtpCodeUncheckedCreateWithoutRegistrationSessionInput>
  }

  export type OtpCodeCreateManyRegistrationSessionInputEnvelope = {
    data: OtpCodeCreateManyRegistrationSessionInput | OtpCodeCreateManyRegistrationSessionInput[]
    skipDuplicates?: boolean
  }

  export type OtpCodeUpsertWithWhereUniqueWithoutRegistrationSessionInput = {
    where: OtpCodeWhereUniqueInput
    update: XOR<OtpCodeUpdateWithoutRegistrationSessionInput, OtpCodeUncheckedUpdateWithoutRegistrationSessionInput>
    create: XOR<OtpCodeCreateWithoutRegistrationSessionInput, OtpCodeUncheckedCreateWithoutRegistrationSessionInput>
  }

  export type OtpCodeUpdateWithWhereUniqueWithoutRegistrationSessionInput = {
    where: OtpCodeWhereUniqueInput
    data: XOR<OtpCodeUpdateWithoutRegistrationSessionInput, OtpCodeUncheckedUpdateWithoutRegistrationSessionInput>
  }

  export type OtpCodeUpdateManyWithWhereWithoutRegistrationSessionInput = {
    where: OtpCodeScalarWhereInput
    data: XOR<OtpCodeUpdateManyMutationInput, OtpCodeUncheckedUpdateManyWithoutRegistrationSessionInput>
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentCreateNestedManyWithoutUserInput
    accounts?: UserAccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    email: string
    phone: string
    passwordHash?: string | null
    firstName: string
    lastName: string
    dateOfBirth?: Date | string | null
    nationality?: string | null
    address?: string | null
    city?: string | null
    preferredLanguage?: string
    emailVerified?: boolean
    phoneVerified?: boolean
    otpVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    civilite?: string | null
    country?: string | null
    region?: string | null
    department?: string | null
    arrondissement?: string | null
    district?: string | null
    domaineActivite?: string | null
    idExpiryDate?: Date | string | null
    idIssueDate?: Date | string | null
    idNumber?: string | null
    idType?: string | null
    marketingAccepted?: boolean
    metiers?: string | null
    placeOfBirth?: string | null
    privacyAccepted?: boolean
    signature?: string | null
    statutEmploi?: string | null
    termsAccepted?: boolean
    kycDocuments?: KycDocumentUncheckedCreateNestedManyWithoutUserInput
    otpCodes?: OtpCodeUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    transactionIntents?: TransactionIntentUncheckedCreateNestedManyWithoutUserInput
    accounts?: UserAccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    otpVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    civilite?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    arrondissement?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    domaineActivite?: NullableStringFieldUpdateOperationsInput | string | null
    idExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idIssueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idNumber?: NullableStringFieldUpdateOperationsInput | string | null
    idType?: NullableStringFieldUpdateOperationsInput | string | null
    marketingAccepted?: BoolFieldUpdateOperationsInput | boolean
    metiers?: NullableStringFieldUpdateOperationsInput | string | null
    placeOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    privacyAccepted?: BoolFieldUpdateOperationsInput | boolean
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    statutEmploi?: NullableStringFieldUpdateOperationsInput | string | null
    termsAccepted?: BoolFieldUpdateOperationsInput | boolean
    kycDocuments?: KycDocumentUncheckedUpdateManyWithoutUserNestedInput
    otpCodes?: OtpCodeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    transactionIntents?: TransactionIntentUncheckedUpdateManyWithoutUserNestedInput
    accounts?: UserAccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type KycDocumentCreateManyUserInput = {
    id?: string
    documentType: string
    fileUrl: string
    fileName: string
    uploadDate?: Date | string
    verificationStatus?: $Enums.VerificationStatus
    adminNotes?: string | null
  }

  export type OtpCodeCreateManyUserInput = {
    id?: string
    registrationSessionId?: string | null
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
  }

  export type TransactionIntentCreateManyUserInput = {
    id?: string
    accountId: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAccountCreateManyUserInput = {
    id?: string
    accountType: $Enums.AccountType
    accountNumber: string
    productCode?: string | null
    productName?: string | null
    interestRate?: Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: number | null
    lockedUntil?: Date | string | null
    allowAdditionalDeposits?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.AccountStatus
    createdAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    priority: $Enums.NotificationPriority
    isRead?: boolean
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KycDocumentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    uploadDate?: DateTimeFieldUpdateOperationsInput | Date | string
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KycDocumentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    uploadDate?: DateTimeFieldUpdateOperationsInput | Date | string
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KycDocumentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    uploadDate?: DateTimeFieldUpdateOperationsInput | Date | string
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OtpCodeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationSession?: RegistrationSessionUpdateOneWithoutOtpCodesNestedInput
  }

  export type OtpCodeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    registrationSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpCodeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    registrationSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionIntentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: UserAccountUpdateOneRequiredWithoutTransactionIntentsNestedInput
    paymentCallbacks?: PaymentCallbackLogUpdateManyWithoutTransactionIntentNestedInput
  }

  export type TransactionIntentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentCallbacks?: PaymentCallbackLogUncheckedUpdateManyWithoutTransactionIntentNestedInput
  }

  export type TransactionIntentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionIntents?: TransactionIntentUpdateManyWithoutAccountNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionIntents?: TransactionIntentUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type UserAccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    accountNumber?: StringFieldUpdateOperationsInput | string
    productCode?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    interestRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lockPeriodMonths?: NullableIntFieldUpdateOperationsInput | number | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowAdditionalDeposits?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    isRead?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionIntentCreateManyAccountInput = {
    id?: string
    userId: string
    accountType: $Enums.AccountType
    intentType: $Enums.IntentType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    investmentTranche?: string | null
    investmentTerm?: number | null
    userNotes?: string | null
    adminNotes?: string | null
    status?: $Enums.TransactionStatus
    referenceNumber: string
    providerTransactionId?: string | null
    providerStatus?: string | null
    lastCallbackAt?: Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionIntentUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionIntentsNestedInput
    paymentCallbacks?: PaymentCallbackLogUpdateManyWithoutTransactionIntentNestedInput
  }

  export type TransactionIntentUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentCallbacks?: PaymentCallbackLogUncheckedUpdateManyWithoutTransactionIntentNestedInput
  }

  export type TransactionIntentUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accountType?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    intentType?: EnumIntentTypeFieldUpdateOperationsInput | $Enums.IntentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    investmentTranche?: NullableStringFieldUpdateOperationsInput | string | null
    investmentTerm?: NullableIntFieldUpdateOperationsInput | number | null
    userNotes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    referenceNumber?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCallbackAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCallbackPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCallbackLogCreateManyTransactionIntentInput = {
    id?: string
    status: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentCallbackLogUpdateWithoutTransactionIntentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCallbackLogUncheckedUpdateWithoutTransactionIntentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCallbackLogUncheckedUpdateManyWithoutTransactionIntentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpCodeCreateManyRegistrationSessionInput = {
    id?: string
    userId?: string | null
    code: string
    type: $Enums.OtpType
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
  }

  export type OtpCodeUpdateWithoutRegistrationSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutOtpCodesNestedInput
  }

  export type OtpCodeUncheckedUpdateWithoutRegistrationSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpCodeUncheckedUpdateManyWithoutRegistrationSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumOtpTypeFieldUpdateOperationsInput | $Enums.OtpType
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}