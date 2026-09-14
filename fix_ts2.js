const fs = require('fs');
const path = require('path');

// 1. Fix src/app/api/admin/categories/[id]/route.ts
const catRoutePath = path.join(__dirname, 'src/app/api/admin/categories/[id]/route.ts');
let catContent = fs.readFileSync(catRoutePath, 'utf8');
catContent = catContent.replace(
  /export async function PUT\(request: Request, \{ params \}: \{ params: \{ id: string \} \}\) \{/g,
  "export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = await params;"
).replace(
  /export async function DELETE\(request: Request, \{ params \}: \{ params: \{ id: string \} \}\) \{/g,
  "export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = await params;"
).replace(/params\.id/g, 'resolvedParams.id');
fs.writeFileSync(catRoutePath, catContent, 'utf8');

// 2. Fix src/app/api/admin/products/[id]/route.ts
const prodRoutePath = path.join(__dirname, 'src/app/api/admin/products/[id]/route.ts');
let prodContent = fs.readFileSync(prodRoutePath, 'utf8');
prodContent = prodContent.replace(
  /export async function PUT\(request: Request, \{ params \}: \{ params: \{ id: string \} \}\) \{/g,
  "export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = await params;"
).replace(
  /export async function DELETE\(request: Request, \{ params \}: \{ params: \{ id: string \} \}\) \{/g,
  "export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = await params;"
).replace(/params\.id/g, 'resolvedParams.id');
fs.writeFileSync(prodRoutePath, prodContent, 'utf8');

// 3. Fix src/app/admin/layout.tsx
const layoutPath = path.join(__dirname, 'src/app/admin/layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
if (layoutContent.includes('session.user.role')) {
  layoutContent = layoutContent.replace(/session\.user\.role/g, '(session.user as any)?.role');
  fs.writeFileSync(layoutPath, layoutContent, 'utf8');
}

console.log("Fixed Next 15 route params and admin layout TS errors.");
