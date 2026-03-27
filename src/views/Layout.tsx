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
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(20px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes slideRight {
              from { opacity: 0; transform: translateX(-16px); }
              to   { opacity: 1; transform: translateX(0); }
            }
            .anim-fade-up   { animation: fadeUp   0.6s ease-out both; }
            .anim-fade-in   { animation: fadeIn   0.5s ease-out both; }
            .anim-slide-r   { animation: slideRight 0.5s ease-out both; }
            .anim-d1 { animation-delay: 0.1s; }
            .anim-d2 { animation-delay: 0.2s; }
            .anim-d3 { animation-delay: 0.3s; }
            .anim-d4 { animation-delay: 0.4s; }
            .anim-d5 { animation-delay: 0.5s; }
`,
          }}
        />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar user={user} badges={navBadges} currentPath={currentPath} />
        {user && (
          <script dangerouslySetInnerHTML={{ __html: `
            (function() {
              // Request notification permission once
              if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
              }

              var lastUnread = ${(navBadges?.unreadMessages || 0)};

              function checkNotifications() {
                fetch('/api/notifications')
                  .then(function(r) { return r.json(); })
                  .then(function(data) {
                    // New message notification
                    if (data.unreadMessages > lastUnread && Notification.permission === 'granted') {
                      var diff = data.unreadMessages - lastUnread;
                      new Notification('Mentino — New message', {
                        body: diff + ' new message' + (diff > 1 ? 's' : '') + ' waiting for you.',
                        icon: '/images/logo-icon.png',
                        tag: 'mentino-msg',
                      });
                    }
                    lastUnread = data.unreadMessages;

                    // Session reminder (15-min warning)
                    if (data.upcomingSessions) {
                      data.upcomingSessions.forEach(function(s) {
                        var msUntil = new Date(s.scheduled_at) - Date.now();
                        if (msUntil > 0 && msUntil < 16 * 60 * 1000 && !sessionStorage.getItem('notified-' + s.id)) {
                          sessionStorage.setItem('notified-' + s.id, '1');
                          if (Notification.permission === 'granted') {
                            new Notification('Mentino — Session in 15 min', {
                              body: 'Your session with ' + s.other_name + ' starts soon.',
                              icon: '/images/logo-icon.png',
                              tag: 'mentino-session-' + s.id,
                            });
                          }
                        }
                      });
                    }
                  })
                  .catch(function() {});
              }

              // Poll every 30 seconds
              setInterval(checkNotifications, 30000);
            })();
          `}} />
        )}
        {flash && (
          <div className="max-w-7xl mx-auto px-4 pt-4 w-full">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {flash}
            </div>
          </div>
        )}
        <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-8 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
