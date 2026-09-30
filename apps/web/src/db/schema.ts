// Drizzle mirror of db/migrations/0001_app_center.sql. The SQL file is the source of truth;
// tests apply it to PGlite and exercise these definitions against it.
import { pgTable, text, integer, uuid, timestamp, jsonb, primaryKey, boolean } from "drizzle-orm/pg-core";

export const integrationApps = pgTable("integration_apps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").$type<AppCategory>().notNull(),
  iconUrl: text("icon_url").notNull(),
  authType: text("auth_type").$type<AuthType>().notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionId: text("description_id").notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const workspaceIntegrations = pgTable(
  "workspace_integrations",
  {
    organizationId: uuid("organization_id").notNull(),
    appId: text("app_id").notNull(),
    status: text("status").$type<IntegrationStatus>().notNull(),
    encryptedAccessToken: text("encrypted_access_token"),
    encryptedRefreshToken: text("encrypted_refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
    scopes: text("scopes"),
    externalAccountId: text("external_account_id"),
    externalAccountName: text("external_account_name"),
    settings: jsonb("settings").$type<Record<string, unknown>>().notNull().default({}),
    encryptedWebhookSecret: text("encrypted_webhook_secret"),
    connectedBy: uuid("connected_by"),
    connectedAt: timestamp("connected_at", { withTimezone: true }),
    lastRefreshedAt: timestamp("last_refreshed_at", { withTimezone: true }),
    refreshFailures: integer("refresh_failures").notNull().default(0),
    lastError: text("last_error"),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.appId] })],
);

export const userIntegrations = pgTable(
  "user_integrations",
  {
    organizationId: uuid("organization_id").notNull(),
    userId: uuid("user_id").notNull(),
    appId: text("app_id").notNull(),
    status: text("status").$type<"connected" | "error">().notNull(),
    encryptedAccessToken: text("encrypted_access_token").notNull(),
    encryptedRefreshToken: text("encrypted_refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
    scopes: text("scopes"),
    externalAccountId: text("external_account_id"),
    externalAccountName: text("external_account_name"),
    lastRefreshedAt: timestamp("last_refreshed_at", { withTimezone: true }),
    refreshFailures: integer("refresh_failures").notNull().default(0),
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.userId, t.appId] })],
);

export const integrationOauthStates = pgTable("integration_oauth_states", {
  stateHash: text("state_hash").primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  userId: uuid("user_id").notNull(),
  appId: text("app_id").notNull(),
  codeVerifier: text("code_verifier"),
  personal: boolean("personal").notNull().default(false),
  redirectTo: text("redirect_to"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const integrationWebhookEvents = pgTable(
  "integration_webhook_events",
  {
    organizationId: uuid("organization_id").notNull(),
    id: uuid("id").notNull(),
    appId: text("app_id").notNull(),
    deliveryId: text("delivery_id").notNull(),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").notNull(),
    status: text("status").$type<"received" | "processed" | "ignored" | "failed">().notNull(),
    error: text("error"),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.id] })],
);

export const integrationTaskLinks = pgTable(
  "integration_task_links",
  {
    organizationId: uuid("organization_id").notNull(),
    id: uuid("id").notNull(),
    taskId: uuid("task_id").notNull(),
    appId: text("app_id").notNull(),
    kind: text("kind").$type<TaskLinkKind>().notNull(),
    externalId: text("external_id").notNull(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.id] })],
);

/** Placeholder for the space module's tasks table (see migration). */
export const tasks = pgTable(
  "tasks",
  {
    organizationId: uuid("organization_id").notNull(),
    id: uuid("id").notNull(),
    ref: text("ref").notNull(),
    title: text("title").notNull(),
    status: text("status").$type<TaskStatus>().notNull().default("todo"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.id] })],
);

export type AppCategory = "development" | "communication" | "storage" | "calendar" | "design" | "crm";
export type AuthType = "oauth2" | "api_key";
export type IntegrationStatus = "connected" | "error" | "disconnected";
export type TaskLinkKind = "github_pull_request" | "github_commit" | "google_drive_file";
export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type WorkspaceIntegration = typeof workspaceIntegrations.$inferSelect;
