import { seedDatabase } from "../lib/seed";

async function main() {
  try {
    console.log("Iniciando siembra de la base de datos...");
    await seedDatabase();
    console.log("Siembra completada con éxito");
  } catch (error) {
    console.error("Error durante la siembra:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
