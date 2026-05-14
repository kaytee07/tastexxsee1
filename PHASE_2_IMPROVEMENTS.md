# Phase 2 — Post-Launch Improvements

Tracked issues identified after v1.0. Work through these in priority order.
Each item has a status: `[ ]` todo · `[~]` in progress · `[x]` done.

---

## CRITICAL — Fix before heavy traffic

### [~] Admin dashboard refresh
**Decision:** Manual refresh only. Polling not worth the DB compute for this scale.
Admin refreshes the page when they need latest data.

### [x] Admin orders grouped by status (Kanban)
**Problem:** Flat list — admin has to scroll to see what's in each stage.
**Fix:** Kanban board (desktop: 4 columns, mobile: 4 status tabs).
**Status update:** Optimistic with rollback on failure.
**File:** `components/admin/OrdersTab.tsx`

### [x] Customer SMS on order completion
**Problem:** Customer had no notification when their order was delivered/ready.
**Fix:** PATCH /api/orders/[id] fires completion SMS when status → 'completed'.
**Files:** `lib/sms.ts`, `app/api/orders/[id]/route.ts`

### [x] Server-side total recalculation
**Problem:** Checkout sends `total` from the client. Server trusts it without verifying.
**Fix:** POST `/api/orders` now recalculates every line price from `lib/menu-data.ts`
using `getVariantPrice()`. Client-sent prices are ignored entirely. Server total is used.
**File:** `app/api/orders/route.ts`

---

## IMPORTANT — Fix within first month

### [x] Status update error handling + rollback
**Problem:** Admin taps a status pill → UI updates immediately. If the API call fails
silently, the displayed status is wrong.
**Fix:** Optimistic update with full rollback on API failure, built into Kanban rewrite.
**File:** `components/admin/OrdersTab.tsx`

### [x] Cart persistence to localStorage
**Problem:** Cart lives in React Context only — refresh clears it.
**Fix:** Already implemented — debounced localStorage write + hydration on mount.
**File:** `lib/cart-context.tsx`

### [~] Customer order status page
**Decision:** Deferred — client said leave out customer-facing nice-to-haves for now.

---

## MONITOR — Watch and fix when it becomes painful

### [x] Admin orders pagination
**Problem:** `findMany()` with no limit — grows forever.
**Fix:** Dashboard fetches ALL active orders (received/preparing/ready — never miss one)
+ last 100 completed orders. API route capped at 200. Smart split: action vs history.
**Files:** `app/admin/dashboard/page.tsx`, `app/api/orders/route.ts`

---

## ADMIN DASHBOARD — UI/UX Review Findings (2026-05-14)

### 🔴 Critical

### [x] Confirmation on "Complete Order" — fires irreversible SMS
Admin fat-fingers "Complete Order" on mobile → customer gets "delivered" SMS before
rider has left. One tap, no undo. Needs an inline confirm step.
**Fix:** Inline confirm panel (not window.confirm) — "Send completion SMS? [Yes] [Cancel]".
**File:** `components/admin/OrdersTab.tsx`

### [x] Stat cards go stale the moment Kanban is touched
Server-rendered counts don't update when admin advances orders. Two sources of truth
on the same screen. Replace with live counts derived from client state.
**Fix:** Lifted `orders` state to `AdminDashboard`. Stats (Received/Preparing/Ready/Done Today)
derived from `liveOrders`. `OrdersTab` now receives orders + onAdvance as pure props.
**Files:** `components/admin/AdminDashboard.tsx`, `components/admin/OrdersTab.tsx`

### [x] No urgency signal on old orders
Order sitting in Received for 25 mins looks identical to one 30 seconds old.
Add visual indicator (amber border / dot) on cards older than 15 minutes.
**Fix:** Amber ring + amber dot on cards older than 15 min in Received/Preparing. Time text turns amber too.
**File:** `components/admin/OrdersTab.tsx`

### 🟡 Important

### [x] Order time shows "time ago" only — kitchen needs clock time
"18m ago" is vague. "12:34" matches receipts and phone calls. Show both.
**Fix:** Card shows `12:34 · 18m ago`. Clock time from `toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })`.
**File:** `components/admin/OrdersTab.tsx`

### [x] "Ready" column needs to visually stand out
Food is getting cold. Rider is waiting. Ready is the most urgent status but looks
identical to the others. Needs a pulsing gold border when orders are present.
**Fix:** Column gets `ring-1 ring-gold/50` + `animate-pulse` on header when Ready has orders.
**File:** `components/admin/OrdersTab.tsx`

### [x] Top stat cards don't reflect what admin needs during service
Replace Total Orders / Active Orders / Inquiries / Pending with live Kanban counts:
Received · Preparing · Ready · Done Today. Always in sync.
**Fix:** New stat row in AdminDashboard. Ready card pulses when orders present.
**Files:** `components/admin/AdminDashboard.tsx`

### [x] No search — can't find an order by name or ref
During a busy service admin gets a call about a specific order. No way to find it.
Add a search input that filters across all Kanban columns.
**Fix:** Search input above Kanban; filters by customer name or order ref across all columns.
**File:** `components/admin/OrdersTab.tsx`

### 🔵 Polish

### [x] Catering tab shows total count, not pending count
Tab reads "(12)" but 9 might be closed. Should show only `status === 'new'` count.
**Fix:** Tab badge now shows `pendingInquiries` (filtered to status==='new'). Hides badge when 0.
**File:** `components/admin/AdminDashboard.tsx`

### [x] No date in dashboard header
During service the admin should see today's date at a glance.
**Fix:** Header right side shows today's date (e.g. "Wednesday, 14 May 2026").
**File:** `components/admin/AdminDashboard.tsx`

### [x] No "last refreshed" indicator
Admin doesn't know how stale the data is. Add timestamp + manual refresh button.
**Fix:** "Refreshed HH:MM" + "Refresh ↺" button that calls window.location.reload().
**File:** `components/admin/AdminDashboard.tsx`

### [x] Completed column takes 25% of screen for history that needs no action
Collapse it by default with a toggle to expand. Frees space for active columns.
**Fix:** Completed column collapsed by default. ▼/▲ toggle in column header. Shows order count when collapsed.
**File:** `components/admin/OrdersTab.tsx`

---

## VERIFY — Cannot confirm without live testing

### [ ] Arkesel SMS delivery in Ghana
**Risk:** Sender ID "TastexxSee" is 11 characters. Some Ghana carriers reject sender
IDs over 8 characters. If admin SMS fails, owner gets zero notification of new orders.
**Action:** Place a test order on production, confirm both admin + customer SMS arrive.
If sender ID fails, shorten it to "TasteXSee" (9 chars) or "TXSee" (5 chars).
**File:** `lib/sms.ts`, `.env.local` → `ARKESEL_SENDER_ID`

### [ ] Database migrations on Neon
**Risk:** Prisma schema may not be in sync with the live Neon DB.
**Action:** Run `npx prisma migrate deploy` against the production DATABASE_URL
before first real order. Confirm tables exist.

---

## BACKLOG — Nice to have, not urgent

- [ ] MoMo (Mobile Money) payment option in checkout
- [ ] Online card payment via Paystack
- [ ] Admin can edit menu items without code changes
- [ ] Customer-facing order tracking link in SMS
- [ ] Promo / discount codes
- [ ] Multi-language (English / French)
- [ ] Admin pagination UI
- [ ] Founder page video intro (15s loop)
- [ ] Reservations system

---

_Last updated: 2026-05-14 — all admin dashboard review items closed. Verify items require live deployment testing._
