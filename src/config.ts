const env = typeof Bun !== "undefined" ? Bun.env : process.env;

export const config = {
  port: Number(env.PORT) || 3000,
  supabaseUrl: env.SUPABASE_URL || "",
  supabaseAnonKey: env.SUPABASE_ANON_KEY || "",
  jwtSecret: env.JWT_SECRET || "dev-secret-change-in-production-min-32-chars",
  cookieName: "auth_token",
  jwtExpiryDays: 7,
};
