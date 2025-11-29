// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: 'https://a8383fd074b3b29f5d178d15c1362012@o4510447176974337.ingest.de.sentry.io/4510447179137104',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
