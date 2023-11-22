// app/providers.js
'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    session_recording: {
      maskAllInputs: false,
      maskInputFn: (text, element) => {
        if (element?.attributes['type']?.value === 'password') {
          // If this is a password input, mask it
          return '*'.repeat(text.length);
        }
        // Otherwise, don't mask it
        return text;
      }
    }
  });
}
export function CSPostHogProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
