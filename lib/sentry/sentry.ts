import * as Sentry from "@sentry/nextjs";

export const initSentryUser = (user?: {
  id?: string;
  email?: string;
  role?: string;
}) => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } else {
    Sentry.setUser(null);
  }
};

export const logSentryError = (
  error: unknown,
  {
    page,
    context,
    level = "error",
  }: {
    page: string;
    context?: Record<string, any>;
    level?: "error" | "warning" | "info";
  }
) => {
  if (error instanceof Error) {
    Sentry.captureException(error, {
      level,
      tags: { page },
      extra: context,
    });
  } else {
    Sentry.captureMessage(
      typeof error === "string" ? error : "Unknown error",
      {
        level,
        tags: { page },
        extra: context,
      }
    );
  }
};
