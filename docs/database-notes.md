# Database Notes

## MVP: No Database

BuildQuote's MVP requires no database. All estimate data is ephemeral — it lives in the user's browser session.

### Data storage in MVP
| What | Where | When cleared |
|------|-------|-------------|
| Current estimate form data | `localStorage` (`buildquote_estimate`) | When user clears browser or 30 days |
| Payment session ID | `localStorage` (`buildquote_paid_session`) | Same |
| Nothing else | — | — |

### Schema (localStorage shape)

```typescript
// localStorage key: 'buildquote_estimate'
{
  contractor: {
    name: string;
    email: string;
    phone: string;
    address: string;
    license?: string;
    logo?: string; // base64 data URL
  };
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  estimate: {
    number: string;       // e.g. "EST-001"
    date: string;         // ISO date
    validUntil: string;   // ISO date
    title: string;
    description: string;
  };
  lineItems: Array<{
    id: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }>;
  taxRate: number;        // percentage, e.g. 8.5
  notes: string;
  terms: string;
}
```

## If You Add a Database Later

If a future version adds saved estimates (requires login), the recommended approach:

- **Database**: Supabase (Postgres, free tier, good Next.js integration)
- **Auth**: Supabase Auth (email/password, magic link)
- **Schema**:

```sql
-- users (handled by Supabase Auth)

CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,           -- full estimate data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,          -- null until paid
  stripe_session_id TEXT
);

CREATE INDEX estimates_user_id_idx ON estimates(user_id);
```

- Keep the JSONB approach — the estimate data structure may evolve and JSONB avoids migrations for schema changes.
- Add `status` enum if you build draft/sent/accepted/declined tracking.

## Recommendations for Buyer

The no-database approach is intentional and correct for the MVP. If user demand justifies saved estimates:
1. Add Supabase (5 minutes to connect with Next.js)
2. Add auth (Supabase Auth UI component)
3. Migrate localStorage data → database on first login
