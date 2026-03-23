import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  user?: { first_name: string; role: string } | null;
  flash?: string | null;
  navBadges?: { unreadMessages?: number; pendingRequests?: number };
  currentPath?: string;
}

export function Layout({ title = "Mentino", children, user, flash, navBadges, currentPath }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${title} | Mentino`}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `,
          }}
        />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar user={user} badges={navBadges} currentPath={currentPath} />
        {flash && (
          <div className="max-w-7xl mx-auto px-4 pt-4 w-full">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {flash}
            </div>
          </div>
        )}
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
