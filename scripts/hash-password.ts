import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Uso: npm run hash-password -- <tu-password>");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  // Next.js expande "$VAR" dentro de archivos .env, así que los signos "$"
  // del hash de bcrypt deben escaparse como "\$" para guardarse tal cual.
  const escaped = hash.replace(/\$/g, "\\$");
  console.log("\nAgrega esto a tu .env:\n");
  console.log(`ADMIN_PASSWORD_HASH="${escaped}"\n`);
});
