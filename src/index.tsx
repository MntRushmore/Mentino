import { app } from "./app";
import { config } from "./config";

console.log(`Mentino running on http://localhost:${config.port}`);

export default {
  port: config.port,
  fetch: app.fetch,
};
