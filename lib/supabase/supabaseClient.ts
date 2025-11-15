// lib/supabase/supabaseClient.ts
// Stub version just to satisfy imports
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null } }),
    onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }),
    update: () => ({ eq: () => ({}) }),
  }),
};
