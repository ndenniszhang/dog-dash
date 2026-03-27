/**
 * Supabase client stub.
 * Logs all calls — no network requests. Real data lives in service layer.
 * Replace with: import { createClient } from '@supabase/supabase-js'
 */

const log = (method: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[supabase stub] ${method}`, ...args);
  }
};

const makeQueryBuilder = (table: string) => ({
  select: (...cols: unknown[]) => { log('select', table, cols); return makeQueryBuilder(table); },
  insert: (data: unknown) => { log('insert', table, data); return Promise.resolve({ data: null, error: null }); },
  update: (data: unknown) => { log('update', table, data); return makeQueryBuilder(table); },
  delete: () => { log('delete', table); return makeQueryBuilder(table); },
  eq: (col: string, val: unknown) => { log('eq', table, col, val); return makeQueryBuilder(table); },
  neq: (col: string, val: unknown) => { log('neq', table, col, val); return makeQueryBuilder(table); },
  in: (col: string, vals: unknown[]) => { log('in', table, col, vals); return makeQueryBuilder(table); },
  order: (col: string) => { log('order', table, col); return makeQueryBuilder(table); },
  limit: (n: number) => { log('limit', table, n); return makeQueryBuilder(table); },
  single: () => { log('single', table); return Promise.resolve({ data: null, error: null }); },
  then: (resolve: (v: { data: null; error: null }) => void) => {
    resolve({ data: null, error: null });
  },
});

export const supabase = {
  from: (table: string) => {
    log('from', table);
    return makeQueryBuilder(table);
  },
  auth: {
    getUser: async () => { log('auth.getUser'); return { data: { user: null }, error: null }; },
    signOut: async () => { log('auth.signOut'); return { error: null }; },
  },
  channel: (name: string) => {
    log('channel', name);
    return {
      on: (...args: unknown[]) => { log('channel.on', name, args); return { subscribe: () => {} }; },
    };
  },
};

export type SupabaseClient = typeof supabase;
