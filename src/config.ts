const env = typeof Bun !== "undefined" ? Bun.env : process.env;

export const config = {
  port: Number(env.PORT) || 3000,
  supabaseUrl: env.SUPABASE_URL || "",
  supabaseAnonKey: env.SUPABASE_ANON_KEY || "",
  jwtSecret: env.JWT_SECRET || "dev-secret-change-in-production-min-32-chars",
  // Public origin (e.g. https://mentino.org) used for absolute OG/canonical URLs.
  siteUrl: (env.SITE_URL || "").replace(/\/$/, ""),
  cookieName: "auth_token",
  jwtExpiryDays: 7,
};
