// node scripts/hash-password.js "your new password"  ->  paste the line into .env.local
const { randomBytes, scryptSync } = require("node:crypto");
const pw = process.argv[2];
if (!pw) {
  console.error('Usage: node scripts/hash-password.js "your password"');
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
console.log(`ADMIN_PASSWORD_HASH=${salt}:${scryptSync(pw, salt, 64).toString("hex")}`);
