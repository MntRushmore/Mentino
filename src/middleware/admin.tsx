import { createMiddleware } from "hono/factory";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";

export const adminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user");

  if (user.role !== "admin") {
    return new Response(
      "<!DOCTYPE html>" +
        renderToString(
          <Layout title="Forbidden" user={user}>
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
              <p className="text-xl text-gray-500 mb-8">
                You don't have permission to access this page.
              </p>
              <a href="/dashboard" className="text-blue-600 hover:underline font-medium">
                Back to Dashboard
              </a>
            </div>
          </Layout>
        ),
      { status: 403, headers: { "Content-Type": "text/html; charset=UTF-8" } }
    );
  }

  await next();
});
