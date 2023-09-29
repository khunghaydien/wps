import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

if (window.organization.enableErrorTracking) {
  const isSandboxOnProduction =
    window.organization.isSandbox && process.env.LOG_ENV === 'production';

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.VERSION,
    environment: isSandboxOnProduction ? 'sandbox' : process.env.LOG_ENV,
    integrations: [
      new Integrations.BrowserTracing(),
      new RewriteFrames({
        iteratee: (frame) => {
          // Remove resource & timestamp from URL
          const arr = frame.filename.split('/');
          arr.splice(3, 2);
          const filename = arr.join('/');
          return {
            ...frame,
            in_app: true,
            filename,
          };
        },
      }),
    ],
    tracesSampleRate: 0.5,
    autoSessionTracking: true,
  });

  Sentry.configureScope((scope) => {
    scope.setUser({
      id: window.empInfo.userId,
      'Organization ID': window.organization.id,
    });
    scope.setTags({
      orgId: window.organization.id,
    });
  });
}
