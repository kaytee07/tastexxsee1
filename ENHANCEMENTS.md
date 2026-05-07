# TastexxSee — Pending Enhancements

> Captured after production launch. Items are ordered by business impact, not effort.

---

## Priority 1 — Operational (causes daily pain without it)

### 1.1 Order "Ready" SMS to customer
**What:** When admin marks an order `ready` in the dashboard, the customer receives an SMS automatically.  
**Why:** Owner currently has to call every customer manually when their food is ready. That's unsustainable at volume.  
**Files:** `app/api/orders/[id]/route.ts`, `lib/sms.ts`  
**Message:**
```
TastexxSee: Your order TXS-20250507-1234 is ready!
[Delivery] Your rider is on the way.
[Pickup] Please come collect your order.
```

---

### 1.2 Catering inquiry reference number
**What:** When a catering inquiry is submitted, generate a human-readable ref (e.g. `CAT-20250507-1234`) and show it on the success screen.  
**Why:** When the owner calls the client back, there's no shared token to anchor the conversation. Right now both sides have nothing to reference.  
**Files:** `lib/format.ts` (add `generateInquiryRef`), `app/api/catering/route.ts`, `components/catering/InquiryForm.tsx`

---

## Priority 2 — Security (risk before any bad actor finds the endpoints)

### 2.1 Rate limiting on API routes
**What:** Limit the number of requests per IP on `/api/orders` and `/api/catering`.  
**Why:** Both are open POST endpoints. A single script could flood the owner's phone with fake order SMSes and burn Arkesel credits within minutes.  
**Approach:** Vercel edge rate limiting config or a simple in-memory limiter middleware.  
**Files:** `middleware.ts` (new), or `vercel.json`

---

## Priority 3 — Content (blocks the site looking like a real restaurant)

### 3.1 Real photography
**What:** Replace all Unsplash placeholder images with actual TastexxSee photography.  
**Why:** The design system is luxury-grade. Placeholder stock food images immediately break that perception.  
**Required shots:**
- Hero background — restaurant space or signature dish, full bleed 16:9
- 3 featured dishes — actual food, 4:5 portrait crop
- Menu card images — one per dish or per category, 1:1 square
- Catering tier images — chef in action, plated food, 3:4
- Founder portrait — confirm `/img/nana1.png` is the final approved photo

**Action:** Client deliverable — not a code task.

---

## Priority 4 — Product (becomes painful as business grows)

### 4.1 Menu availability toggle
**What:** The `MenuItem` type already has an `available?: boolean` field but nothing uses it. Add a way to mark dishes as unavailable so they don't appear on the menu.  
**Why:** If Yam Chips runs out on a Friday evening, there's no way to hide it without a code change and redeployment. Customers order it, restaurant has to call them back.  
**Approach:** Phase A — admin dashboard toggle that writes to a separate DB table. Phase B — move menu data from static TS to DB entirely.

### 4.2 Admin multi-user support
**What:** Admin credentials are a single `ADMIN_USERNAME` / `ADMIN_PASSWORD` in env vars. No way to add a second staff member without a redeployment.  
**Why:** If the owner wants a manager to also see orders, it's currently impossible.  
**Approach:** Move credentials to a `users` table in the DB with hashed passwords.

### 4.3 Customer SMS for catering acknowledgement
**What:** When a catering inquiry is submitted, send the client an SMS confirming receipt (same as the order confirmation SMS).  
**Why:** Client submits a form and gets a webpage. If they close the tab, they have nothing. Arkesel infrastructure is already wired.  
**Files:** `app/api/catering/route.ts`, `lib/sms.ts`  
**Message:**
```
TastexxSee: We received your catering inquiry (CAT-20250507-1234).
Our team will call you within 24 hours to discuss your event.
```

---

## Notes

- MoMo payment types are still in `types/index.ts` and the DB schema — they're dormant but clean. Remove or implement in a future sprint depending on client feedback.
- The "we'll call you within 10 mins" copy on the order confirmation page is a hard promise in the UI. Worth confirming with the client that this is achievable at peak hours.
- All SMS functions are fire-and-forget — a failed SMS never surfaces to the customer, only logs to the server. Consider a dead-letter log or retry queue if SMS reliability becomes a concern.
