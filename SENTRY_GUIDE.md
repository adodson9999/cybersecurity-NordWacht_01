# Sentry Setup Guide — NordWacht_01

> **Purpose**: A quick guide on how to integrate and use Sentry for error reporting and user feedback in this project.

## 1. Initial Setup

1. **Create an Account**: Go to [Sentry.io](https://sentry.io/) and sign up.
2. **Create a Project**: Once logged in, create a new project. Select the platform (e.g., React, Node.js, Python) that matches our app's tech stack.
3. **Get the DSN**: After project creation, Sentry will provide a DSN (Data Source Name). This is required to configure the SDK.

## 2. Environment Configuration

Add the Sentry DSN to your environment variables:
```env
# .env
SENTRY_DSN=your_dsn_here
```

## 3. Basic Installation

Install the Sentry SDK using your package manager (example for a generic web app):
```bash
npm install @sentry/browser @sentry/tracing
```

## 4. Initialization

Initialize Sentry as early as possible in your application's lifecycle (e.g., in `index.js` or `main.js`):

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
```

## 5. Usage Guidelines

- **Automatic Reporting**: Sentry automatically catches unhandled exceptions and promise rejections.
- **Manual Reporting**: To catch handled errors and send them to Sentry:
  ```javascript
  try {
    // risky code
  } catch (error) {
    Sentry.captureException(error);
  }
  ```
- **Context Information**: Enrich errors with user context when possible:
  ```javascript
  Sentry.setUser({ id: "123", email: "user@example.com" });
  ```

## 6. Feedback Loops
Sentry offers a User Feedback widget. When an error occurs, you can prompt the user to provide context about what they were doing. Follow the [User Feedback documentation](https://docs.sentry.io/platforms/javascript/user-feedback/) to enable this feature.
