import type { NextConfig } from "next";

const config: NextConfig = {
  // PGlite is only used by tests; keep it out of the server bundle.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default config;
