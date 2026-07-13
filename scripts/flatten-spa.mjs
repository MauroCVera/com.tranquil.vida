// Post-build: flatten TanStack Start SPA output into a plain static site.
// Moves dist/client/* to dist/, renames _shell.html -> index.html, and drops
// the dist/server folder so APK wrappers (Capacitor/Cordova) can consume
// dist/ directly.
import { existsSync, renameSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const clientDir = join(dist, "client");
const serverDir = join(dist, "server");

if (!existsSync(clientDir)) {
  console.log("[flatten-spa] no dist/client — skipping");
  process.exit(0);
}

for (const entry of readdirSync(clientDir)) {
  const from = join(clientDir, entry);
  const to = join(dist, entry);
  if (existsSync(to)) rmSync(to, { recursive: true, force: true });
  renameSync(from, to);
}
rmSync(clientDir, { recursive: true, force: true });
if (existsSync(serverDir)) rmSync(serverDir, { recursive: true, force: true });

const shell = join(dist, "_shell.html");
const index = join(dist, "index.html");
if (existsSync(shell)) {
  if (existsSync(index)) rmSync(index);
  renameSync(shell, index);
}

console.log("[flatten-spa] dist/ is now a flat static SPA with index.html");
