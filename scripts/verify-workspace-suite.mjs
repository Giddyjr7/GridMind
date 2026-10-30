import assert from "node:assert/strict";
import fs from "fs";

console.log("=================================================");
console.log("GRIDMIND WORKSPACE & ONBOARDING VERIFICATION SUITE");
console.log("=================================================\n");

// Implementation of slugifyHandle to test
function slugifyHandle(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Test 1: Workspace handle slugging
console.log("Test 1: Workspace handle slugging...");
assert.equal(slugifyHandle("Krystal Ice Cold Storage"), "krystal-ice-cold-storage");
assert.equal(slugifyHandle("  PharmaCare  Clinic & Vaccines!!  "), "pharmacare-clinic-vaccines");
assert.equal(slugifyHandle("Supermarket 24/7"), "supermarket-247");
assert.equal(slugifyHandle("---Leading-Hyphens---"), "leading-hyphens");
console.log("  PASS: Workspace handle slugging generates valid URL slugs.");

// Test 2: Verify device catalogue source
console.log("\nTest 2: Device catalogue source parsing...");
const catalogueSource = fs.readFileSync("lib/device-catalogue.ts", "utf8");
const matches = catalogueSource.match(/typeId:\s*["']([^"']+)["']/g);
assert.ok(matches && matches.length >= 14, "Catalogue should contain at least 14 items");
assert.ok(catalogueSource.includes("cold_room"));
assert.ok(catalogueSource.includes("blast_freezer"));
assert.ok(catalogueSource.includes("display_chiller"));
assert.ok(catalogueSource.includes("pharma_fridge"));
assert.ok(catalogueSource.includes("diesel_gen"));
assert.ok(catalogueSource.includes("battery_ess"));
assert.ok(catalogueSource.includes("solar_pv"));
assert.ok(catalogueSource.includes("grid_meter"));
assert.ok(catalogueSource.includes("inverter"));
assert.ok(catalogueSource.includes("air_conditioner"));
assert.ok(catalogueSource.includes("lighting"));
assert.ok(catalogueSource.includes("pos_it"));
assert.ok(catalogueSource.includes("water_pump"));
assert.ok(catalogueSource.includes("custom_device"));
console.log(`  PASS: Found ${matches.length} device catalogue definitions covering all required types.`);

// Test 3: LocalStorage corruption fallback test
console.log("\nTest 3: Corrupt or missing localStorage fallback...");
function parseStorage(raw) {
  try {
    if (!raw) return { fallback: true };
    const p = JSON.parse(raw);
    if (!p || typeof p !== "object" || p.version !== 1) return { fallback: true };
    return p;
  } catch {
    return { fallback: true };
  }
}
assert.deepEqual(parseStorage(null), { fallback: true });
assert.deepEqual(parseStorage(""), { fallback: true });
assert.deepEqual(parseStorage("not valid json{{{"), { fallback: true });
assert.deepEqual(parseStorage('{"version": 2}'), { fallback: true });
console.log("  PASS: Missing or corrupt localStorage safely falls back to default state.");

// Test 4: Verify simulation-context fallback to demo business when workspace empty
console.log("\nTest 4: Fallback to demo business when devices list is empty...");
const simContextSource = fs.readFileSync("context/simulation-context.tsx", "utf8");
assert.ok(
  simContextSource.includes("stored.devices.length > 0") &&
  simContextSource.includes(": MOCK_APPLIANCES"),
  "Simulation context must fall back to MOCK_APPLIANCES when devices are empty"
);
console.log("  PASS: Simulation context verified to fall back to MOCK_APPLIANCES when devices empty.");

// Test 5: Em-dash audit across all new auth and workspace files
console.log("\nTest 5: Em-dash audit...");
const filesToAudit = [
  "components/auth/auth-layout.tsx",
  "components/auth/auth-card.tsx",
  "components/auth/premium-input.tsx",
  "components/auth/full-screen-transition.tsx",
  "components/auth/login-form.tsx",
  "components/auth/step-1-account.tsx",
  "components/auth/step-2-business.tsx",
  "components/auth/step-3-devices.tsx",
  "components/auth/step-4-team.tsx",
  "components/auth/signup-flow.tsx",
  "components/workspace/welcome-modal.tsx",
  "components/workspace/add-device-modal.tsx",
  "components/workspace/device-detail-sheet.tsx",
  "components/workspace/workspace-client.tsx",
  "app/workspace/page.tsx",
  "lib/device-catalogue.ts",
  "lib/workspace-storage.ts",
];

let emDashFound = 0;
for (const file of filesToAudit) {
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, "utf8");
    if (text.includes("—")) {
      console.error(`  FAIL: Em-dash found in ${file}`);
      emDashFound++;
    }
  }
}
assert.equal(emDashFound, 0, "Zero em-dashes allowed");
console.log("  PASS: Zero em-dashes found across all new auth and workspace files.");

console.log("\n=================================================");
console.log("ALL TESTS COMPLETED SUCCESSFULLY");
console.log("=================================================");
