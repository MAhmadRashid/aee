# ZERO TO ONE — Product Requirements Document (PRD)

**Project:** ZERO TO ONE Haute Parfumerie & Artisanal Fragrances  
**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Three.js / React Three Fiber, Firebase Admin / Local DB  
**Ports:** Storefront: `3000` | Atelier Admin Suite: `3001`  

---

## 🤖 Instructions for Ralph Loop Agent

When executing in an autonomous Ralph Loop iteration:
1. **Fresh Context**: Treat this session as an atomic unit of work.
2. **Read Backlog**: Inspect `@PRD.md` and read `@progress.txt` to see what was done previously.
3. **Select 1 Task**: Pick the highest-priority incomplete task (`- [ ]`) from the backlog below.
4. **Implement**: Write clean, production-grade code. Do not break existing functionality.
5. **Verify**: Run `npx tsc --noEmit` and check for linter or runtime errors.
6. **Log & Update**: 
   - Mark the completed task with `- [x]` in this `PRD.md` file.
   - Append a detailed entry to `progress.txt` (Iteration #, Task, Files modified, Verification status).
7. **Commit**: Make a clean, descriptive git commit for this task.
8. **Completion Signal**: When all tasks in the backlog are marked `[x]`, output the exact token:
   `<promise>COMPLETE</promise>`

---

## 📋 Task Backlog

### Phase 1: Architecture & Admin Panel
- [x] **Task 1.1:** Configure dedicated Admin Panel on port 3001 with independent `.next-admin` build directory.
- [x] **Task 1.2:** Add middleware to automatically redirect port 3001 root visits (`/`) directly to `/admin`.
- [x] **Task 1.3:** Add dual server launcher (`start-all.bat` and `node start-all.js`) to run Storefront (3000) and Admin (3001) simultaneously.
- [x] **Task 1.4:** Setup Ralph Loop autonomous runner scripts (`ralph.ps1`, `ralph.bat`, `ralph.sh`, `ralph.js`).
- [ ] **Task 1.5:** Implement Admin Product Edit and Delete API endpoints (`/api/admin/products/[id]`).

### Phase 2: Orders, Consignments & Checkout
- [ ] **Task 2.1:** Implement Admin Order Status Update API (`/api/admin/orders/[id]` PUT) to transition orders between Pending, Confirmed, Shipped, Delivered, Cancelled.
- [ ] **Task 2.2:** Connect Checkout page to `/api/orders` with local guest session persistence and validation.
- [ ] **Task 2.3:** Add Cash on Delivery (COD) order confirmation receipt modal with WhatsApp order concierge link.

### Phase 3: Catalog & Asset Management
- [ ] **Task 3.1:** Add Cloudinary / Local file upload API endpoint (`/api/admin/upload`) for product and banner imagery.
- [ ] **Task 3.2:** Provide JSON export and import utility in Admin Configuration for `local-database.json` backup.

### Phase 4: 3D Luxury Visualizer (ZTO Phase 2)
- [ ] **Task 4.1:** Verify 3D Olfactory Hotspot annotations (Top, Heart, Base notes) with distance occlusion on product detail page.
- [ ] **Task 4.2:** Ensure mobile fallback and responsive canvas rendering for 3D fragrance bottles.

### Phase 5: High-Performance Loading & Bundle Speed (Ralph Optimization)
- [x] **Task 5.1:** Strip unused bundle imports from `src/app/page.tsx` (Canvas, Three.js, FloatingParticles, Tilt, Lucide icons) saving ~600KB+ client JS.
- [x] **Task 5.2:** Enable AVIF/WebP image formats, Brotli/Gzip compression, and 1-year CDN caching in `next.config.ts`.
- [x] **Task 5.3:** Configure non-blocking `display: 'swap'` for Google Fonts and preconnects for image CDNs in `src/app/layout.tsx`.
- [x] **Task 5.4:** Implement on-demand hover image loading in `ProductCard.tsx` cutting initial homepage image requests by 50%.
- [x] **Task 5.5:** Add stale-while-revalidate edge caching (`Cache-Control`) to `/api/products`, `/api/admin/categories`, and `/api/admin/stats`.

---

## 🔒 Ralph Loop Completion Status
- **Current Status:** In Progress
- **Completed Tasks:** 9 / 16
- **Target Release:** Q3 2026 Production
