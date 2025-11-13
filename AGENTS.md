# Development Guidelines v3.0 (Hybrid)

## 🔴 CRITICAL RULES - NON-NEGOTIABLE

### Rule 1: Change Only What Was Requested
**NEVER, UNDER ANY CIRCUMSTANCES** modify elements that the user didn't explicitly request:

- ❌ DON'T change working functionality
- ❌ DON'T modify design elements arbitrarily
- ❌ DON'T add extra features without request
- ❌ DON'T change colors, sizes, layouts
- ❌ DON'T "improve" things that weren't asked for

**ONLY AND EXCLUSIVELY change what was explicitly requested!**

### Rule 2: Step-by-Step Approach
For every task, follow this process:

```
1. ANALYSIS
   ↓ What exactly is being requested?
   ↓ What changes, what stays?
   
2. EXPLORE OPTIONS
   ↓ Option A: [pros/cons]
   ↓ Option B: [pros/cons]
   ↓ Option C: [pros/cons]
   
3. JUSTIFY DECISION
   ↓ Why is this the best solution?
   
4. IMPLEMENTATION
   ↓ Only requested changes
   ↓ Everything else stays unchanged
   
5. VERIFICATION
   ↓ Only requested items changed?
   ↓ Works in all edge cases?
   ↓ Performance adequate?
   ↓ Code clean and understandable?
   ↓ Solution testable?
```

---

## 🎯 8 Development Modes

Claude automatically adapts its approach based on your request. You can **explicitly request a mode** with `@mode-name`, or Claude will **auto-detect** based on keywords.

### Mode 1: Planning (@planning)

**Auto-activates when:** requirements, MVP, user story, roadmap, features, planning
**Mindset:** Business value > technical perfection
**Output:** PRD, user stories, acceptance criteria

**Framework:**
```
1. AUDIENCE IDENTIFICATION
   ↓ Who will use this? (B2B/B2C, age, expertise)
   
2. CORE VALUE PROPOSITION  
   ↓ What's the #1 problem being solved?
   
3. MVP BOUNDARIES
   ↓ Must-have vs Nice-to-have
   ↓ Timeframe: 1 week / 1 month / 3 months?
   
4. SUCCESS METRICS
   ↓ How do we measure success?
   ↓ KPIs: user adoption, revenue, engagement?
   
5. TECHNICAL CONSTRAINTS
   ↓ Budget? Team size? Existing tech?
```

**Output Template:**
```markdown
# [Project Name] - Product Requirements

## 1. Executive Summary
- Vision: [1-2 sentences]
- Target Users: [Who?]
- Core Problem: [What does it solve?]
- Success Metrics: [KPIs]

## 2. User Stories (Prioritized)
### P0 - Must Have (MVP)
- As [who], I want [what], so that [why]
- Acceptance Criteria: [...]

### P1 - Should Have (v1.1)
[...]

## 3. Out of Scope
[What's NOT in MVP and why]
```

**Hungarian Specifics:**
- GDPR: Cookie consent, privacy policy mandatory
- VAT: 27% VAT calculation if e-commerce
- Payment: Barion, SimplePay integration
- Language: Hungarian UI + optional multi-language

---

### Mode 2: Design (@design)

**Auto-activates when:** design, UI, UX, wireframe, layout, Tailwind, component design
**Mindset:** User experience > feature count
**Output:** Wireframes, Tailwind components, style guide

**Framework:**
```
1. USER FLOW MAPPING
   ↓ What's the user's main goal?
   ↓ How many steps to achieve it?
   
2. VISUAL HIERARCHY
   ↓ Most important element? (Hero CTA)
   ↓ Secondary, tertiary elements?
   
3. RESPONSIVE STRATEGY
   ↓ Mobile-first or desktop-first?
   ↓ Breakpoints: sm(640), md(768), lg(1024), xl(1280)
   
4. COLOR SYSTEM
   ↓ Primary (brand), Secondary (accents)
   ↓ Neutral (backgrounds, text)
   ↓ Semantic (success, warning, error)
   
5. SPACING & TYPOGRAPHY
   ↓ Base unit: 4px or 8px grid?
   ↓ Font scale: text-sm to text-5xl
```

**Component Standards:**
```tsx
// Primary Button (Tailwind)
<button className="
  px-6 py-3 
  bg-blue-600 hover:bg-blue-700 
  text-white font-semibold
  rounded-lg shadow-md
  transition-all duration-200
  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Button Text
</button>

// Input Field
<input className="
  w-full px-4 py-2
  border border-gray-300 rounded-lg
  focus:border-blue-500 focus:ring-2 focus:ring-blue-200
  disabled:bg-gray-100
  invalid:border-red-500
" />
```

**Hungarian UI Elements:**
- Date format: YYYY.MM.DD. (2025.01.08.)
- Number format: 1 000 000 Ft (space separator)
- Error messages: "Kötelező mező" not "Required field"
- Buttons: "Küldés" not "Submit", "Mégse" not "Cancel"

---

### Mode 3: Architecture (@architecture)

**Auto-activates when:** architecture, tech stack, database, schema, API design, scaling
**Mindset:** Every decision needs technical justification
**Output:** ADRs, database schema, API specs, system diagrams

**Framework:**
```
1. REQUIREMENTS ANALYSIS
   ↓ Functional requirements (from Planning)
   ↓ Non-functional: Performance, Security, Scalability
   
2. TECH STACK COMPARISON
   ↓ Option A vs B vs C
   ↓ Pros/Cons for each
   ↓ Cost/Benefit analysis
   
3. ARCHITECTURE PATTERN
   ↓ Monolith vs Microservices?
   ↓ SSR vs CSR?
   ↓ Real-time (WebSocket) vs Polling?
   
4. DATABASE DESIGN
   ↓ Relational vs NoSQL?
   ↓ Schema, indexes, relationships
   
5. API STRATEGY
   ↓ REST vs GraphQL vs tRPC?
   ↓ Versioning, rate limiting, caching
```

**ADR Template:**
```markdown
### ADR-001: [Decision Title]
**Status**: Accepted/Rejected/Superseded
**Context**: [Why do we need to make this decision?]
**Decision**: [What we decided]

**Alternatives Considered:**
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Option A | [...] | [...] | ⭐⭐⭐⭐⭐ |
| Option B | [...] | [...] | ⭐⭐⭐ |

**Rationale**: [Why this is the best choice]
**Consequences**: [What does this decision imply?]
```

**Recommended Stack:**
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- State: Zustand or Context API
- Backend: Node.js + Express, Prisma ORM
- Database: PostgreSQL (Supabase)
- Deployment: Vercel (frontend), Supabase (backend)

---

### Mode 4: Frontend (@frontend)

**Auto-activates when:** React, component, frontend, UI implementation, TypeScript, Tailwind
**Mindset:** Pixel-perfect, performant, accessible
**Output:** React components, hooks, TypeScript code

**Code Standards:**
```typescript
// Component Structure (strict order)
'use client'; // or 'use server' for RSC

// 1. Imports (grouped)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Types/Interfaces
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

// 3. Component
export function MyComponent({ title, onSubmit }: Props) {
  // 4. Hooks (state)
  const [data, setData] = useState<FormData | null>(null);
  
  // 5. Event Handlers (useCallback)
  const handleSubmit = useCallback(() => {
    if (data) onSubmit(data);
  }, [data, onSubmit]);
  
  // 6. Conditional Renders
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  
  // 7. Main Render
  return <div className="container">{/* JSX */}</div>;
}
```

**Must Include:**
- Loading states (every async operation)
- Error handling (try/catch + error state)
- Empty states (no data scenarios)
- Accessibility (ARIA, keyboard nav)
- Responsive design (mobile, tablet, desktop)

**Anti-Patterns:**
- ❌ DON'T use 'any' type (use 'unknown' or define interface)
- ❌ DON'T forget error handling
- ❌ DON'T inline event handlers (use useCallback)
- ❌ DON'T hardcode API URLs (environment variables)

**Hungarian Error Messages:**
```typescript
const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ez a mező kötelező',
  INVALID_EMAIL: 'Érvénytelen e-mail cím',
  PASSWORD_TOO_SHORT: 'A jelszónak legalább 8 karakter hosszúnak kell lennie',
  NETWORK_ERROR: 'Hálózati hiba történt',
} as const;
```

---

### Mode 5: Backend (@backend)

**Auto-activates when:** API, endpoint, backend, server, database, authentication, JWT
**Mindset:** Works? Scalable? Secure? Ship it.
**Output:** API routes, controllers, services, middleware

**Architecture Pattern:**
```
Route → Controller → Service → Database
  ↓         ↓          ↓          ↓
Input    Business   Data      Prisma
Valid.   Logic     Access     ORM
```

**Code Standards:**
```typescript
// Route (Express)
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createUser } from '../controllers/users.controller';

const router = Router();

const createUserSchema = z.object({
  email: z.string().email({ message: 'Érvénytelen e-mail cím' }),
  name: z.string().min(2),
  password: z.string().min(8)
});

router.post('/users', validate(createUserSchema), createUser);
router.get('/users/:id', authenticate, getUser);

export default router;

// Controller
export async function createUser(req, res, next) {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({
      success: true,
      data: user,
      message: 'Felhasználó sikeresen létrehozva'
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
}

// Service
export async function createUserService(input) {
  // 1. Check existing
  const existing = await prisma.user.findUnique({
    where: { email: input.email }
  });
  
  if (existing) {
    throw new AppError('Ez az e-mail cím már használatban van', 409);
  }
  
  // 2. Hash password
  const passwordHash = await bcrypt.hash(input.password, 10);
  
  // 3. Create user
  const user = await prisma.user.create({
    data: { ...input, passwordHash },
    select: { id: true, email: true, name: true }
  });
  
  return user;
}
```

**Response Format Standard:**
```typescript
// Success
{
  "success": true,
  "data": { /* ... */ },
  "message": "Sikeres művelet" // optional
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Érvénytelen adatok",
    "details": [{ "field": "email", "message": "..." }]
  }
}
```

**Hungarian VAT Calculation:**
```typescript
const HUNGARIAN_VAT_RATE = 0.27; // 27%

export function calculateVAT(netPrice: number) {
  const vatAmount = Math.round(netPrice * HUNGARIAN_VAT_RATE * 100) / 100;
  const grossPrice = Math.round((netPrice + vatAmount) * 100) / 100;
  
  return { netPrice, vatAmount, grossPrice };
}
```

---

### Mode 6: Testing (@testing)

**Auto-activates when:** test, bug, QA, Vitest, Jest, Playwright, coverage
**Mindset:** Everything works until you test it
**Output:** Test suites, bug reports, coverage reports

**Test Pyramid:**
```
        /\
       /  \      E2E Tests (10%)
      /____\     Critical user flows
     /      \    
    / Integr \   Integration Tests (20%)
   /  ation   \  Components + API
  /____________\ 
 /              \ 
/   Unit Tests   \ Unit Tests (70%)
\________________/ Utils, hooks, logic
```

**Unit Test Pattern (Vitest):**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateVAT } from '../utils';

describe('calculateVAT', () => {
  // AAA: Arrange, Act, Assert
  
  it('should calculate 27% Hungarian VAT correctly', () => {
    // Arrange
    const netPrice = 10000;
    
    // Act
    const result = calculateVAT(netPrice);
    
    // Assert
    expect(result.vatAmount).toBe(2700);
    expect(result.grossPrice).toBe(12700);
  });
  
  it('should handle edge case: zero price', () => {
    const result = calculateVAT(0);
    expect(result.grossPrice).toBe(0);
  });
  
  it('should throw error for negative price', () => {
    expect(() => calculateVAT(-100)).toThrow('Price cannot be negative');
  });
});
```

**E2E Test Pattern (Playwright):**
```typescript
import { test, expect } from '@playwright/test';

test('user can complete full registration flow', async ({ page }) => {
  await page.goto('/register');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Üdvözlünk')).toBeVisible();
});
```

**Coverage Targets:**
- Unit tests: 80%+
- Integration: Critical paths
- E2E: Happy path + error scenarios

---

### Mode 7: DevOps (@devops)

**Auto-activates when:** deploy, CI/CD, Docker, GitHub Actions, pipeline, monitoring
**Mindset:** If you did it twice, automate it
**Output:** CI/CD workflows, Docker configs, deployment scripts

**GitHub Actions Template:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

**Docker Multi-Stage Build:**
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
EXPOSE 3000
CMD ["node", "server.js"]
```

**Environment Variables (.env.example):**
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Authentication
JWT_SECRET="your-secret-key"

# API
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Hungarian Payment
BARION_POS_KEY="your-barion-key"
```

---

### Mode 8: Security (@security)

**Auto-activates when:** security, vulnerability, GDPR, encryption, OWASP, audit
**Mindset:** Every input is an enemy until validated
**Output:** Security audits, vulnerability reports, fixes

**OWASP Top 10 Checklist (Quick):**

```markdown
## A01: Broken Access Control
- [ ] Authorization checks on all protected routes
- [ ] User can only access own resources
- [ ] CORS properly configured

## A02: Cryptographic Failures
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] HTTPS enforced
- [ ] No sensitive data in logs

## A03: Injection
- [ ] Parameterized queries (Prisma ORM)
- [ ] Input validation (Zod)
- [ ] No eval() or innerHTML

## A05: Security Misconfiguration
- [ ] Security headers configured
- [ ] Error messages don't leak info
- [ ] Dependencies updated (npm audit)

## A07: Authentication Failures
- [ ] Strong password policy (8+ chars)
- [ ] Rate limiting on login
- [ ] Account lockout after 5 failed attempts
```

**Security Code Examples:**
```typescript
// ❌ BAD - SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ GOOD - Parameterized (Prisma)
const user = await prisma.user.findUnique({ where: { email } });

// ❌ BAD - XSS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD - Automatic escaping
<div>{userInput}</div>

// Rate Limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Túl sok próbálkozás'
});

app.post('/api/auth/login', limiter, loginHandler);
```

**GDPR Compliance (Hungarian):**
```typescript
// Cookie Consent Banner (mandatory)
const CookieConsent = () => (
  <div className="fixed bottom-0 bg-gray-900 text-white p-4">
    <p>Ez a weboldal sütiket használ. 
       <a href="/adatvedelem">Adatvédelmi Tájékoztató</a>
    </p>
    <button onClick={acceptAll}>Összes elfogadása</button>
  </div>
);

// Data Export (user right)
export async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { posts: true, comments: true }
  });
  return user; // JSON format
}

// Data Deletion (user right)
export async function deleteUserAccount(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
}
```

---

## 📋 Quick Reference

### Tech Stack Defaults

**Frontend:**
- React 18+ (functional components, hooks)
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS (utility-first)
- Zustand or Context API (state)

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- JWT authentication

**Testing:**
- Vitest (unit tests)
- React Testing Library (integration)
- Playwright (E2E)

**DevOps:**
- GitHub Actions (CI/CD)
- Vercel (frontend)
- Supabase (backend)
- Docker (optional)

### Code Standards Checklist

Every code change must include:

- [ ] Only requested functionality changed
- [ ] TypeScript types correct (no 'any')
- [ ] Error handling present
- [ ] Edge cases handled
- [ ] Performance optimized
- [ ] Security best practices followed
- [ ] Accessibility requirements met
- [ ] Responsive on all devices
- [ ] Hungarian UI elements correct
- [ ] Tests written
- [ ] Code documented
- [ ] Git commit message meaningful

### Hungarian Project Specifics

**Date Format:**
```typescript
// YYYY.MM.DD.
const formatted = new Date().toLocaleDateString('hu-HU'); 
// "2025.01.08."
```

**Number Format:**
```typescript
// 1 000 000 Ft (space separator)
const formatted = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
  minimumFractionDigits: 0
}).format(1000000);
// "1 000 000 Ft"
```

**VAT Calculation:**
```typescript
const VAT_RATE = 0.27; // 27%
const netPrice = 10000;
const vatAmount = netPrice * VAT_RATE; // 2700
const grossPrice = netPrice + vatAmount; // 12700
```

**Payment Integration:**
- Barion (recommended for Hungarian market)
- SimplePay (alternative)
- Both support Hungarian bank cards

**GDPR Mandatory:**
- Cookie consent banner
- Privacy policy (Adatvédelmi Tájékoztató)
- Data export endpoint
- Data deletion endpoint

---

## 💡 Workflow Examples

### Example 1: New Feature - User Authentication

```
User: "Kell egy login rendszer"

Claude (auto-detects):
→ Planning mode: "Tervezzük meg a követelményeket"
   Output: User stories, acceptance criteria
   
→ Design mode: "Tervezzük meg a UI-t"
   Output: Login form wireframe, Tailwind components
   
→ Frontend mode: "Implementáljuk a form-ot"
   Output: LoginForm.tsx component
   
→ Backend mode: "Készítsük el az API-t"
   Output: POST /api/auth/login endpoint
   
→ Testing mode: "Teszteljük le"
   Output: Unit tests + E2E tests
   
→ Security mode: "Security audit"
   Output: Rate limiting, password hashing, JWT
```

### Example 2: Bug Fix

```
User: "A login gomb nem működik mobilon"

Claude (auto-detects):
→ Testing mode: "Reprodukálom a bug-ot"
   Steps to reproduce, environment details
   
→ Frontend mode: "Javítom a hibát"
   Fix: Touch event handling
   
→ Testing mode: "Verification"
   Mobile viewport tests passed
```

### Example 3: Explicit Mode Request

```
User: "@planning Tervezd meg egy webshop MVP-jét"

Claude:
[Explicitly enters Planning mode]
[Outputs PRD with user stories]

User: "@design Most tervezd meg a főoldalt"

Claude:
[Explicitly enters Design mode]
[Outputs wireframes + Tailwind components]
```

---

## 🎯 Mode Selection Guide

```
┌─ Unsure what you need?
│  → Just describe your task, Claude will auto-detect
│
├─ Need business planning?
│  → Keywords: "MVP", "requirements", "user story"
│  → Or explicit: @planning
│
├─ Need visual design?
│  → Keywords: "wireframe", "UI", "layout"
│  → Or explicit: @design
│
├─ Need technical architecture?
│  → Keywords: "tech stack", "database", "API"
│  → Or explicit: @architecture
│
├─ Need UI implementation?
│  → Keywords: "React", "component", "TypeScript"
│  → Or explicit: @frontend
│
├─ Need backend/API?
│  → Keywords: "API", "endpoint", "database"
│  → Or explicit: @backend
│
├─ Need testing?
│  → Keywords: "test", "bug", "QA"
│  → Or explicit: @testing
│
├─ Need deployment?
│  → Keywords: "deploy", "CI/CD", "Docker"
│  → Or explicit: @devops
│
└─ Need security review?
   → Keywords: "security", "GDPR", "vulnerability"
   → Or explicit: @security
```

---

## 🚀 Pro Tips

### 1. Auto-Detection Works Best
```
Good: "Kell egy login form validációval"
→ Auto-detects: Frontend mode + Validation

Better: "Kell egy login form validációval, TypeScript, Zod"
→ More specific = better output
```

### 2. Combine Modes Naturally
```
"Tervezd meg és implementáld egy dashboard-ot"
→ Design mode → Frontend mode
→ Claude switches automatically
```

### 3. Use Explicit Mode When Needed
```
When auto-detection might be ambiguous:
@planning "Define MVP scope"
@design "Create wireframe"
@frontend "Implement component"
```

### 4. Context Matters
```
Bad: "Fix this"
Good: "Fix the login button touch event on mobile (iOS Safari)"
→ More context = better solution
```

### 5. Hungarian Projects
Every mode automatically includes:
- Hungarian UI elements
- GDPR compliance
- 27% VAT handling
- Local date/number formats
- Barion/SimplePay support

---

## 📚 Additional Resources

**Official Docs:**
- React: https://react.dev
- Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind: https://tailwindcss.com/docs
- Prisma: https://www.prisma.io/docs

**Security:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- GDPR: https://gdpr.eu

**Testing:**
- Vitest: https://vitest.dev
- Playwright: https://playwright.dev

---

**Version**: 3.0 (Hybrid)  
**Last Updated**: 2025-01-08  
**Total Lines**: ~950  
**Token Estimate**: ~4,000  
**Mode**: Auto-detect + Explicit (@mode)
