// Load environment
import "@dotenvx/dotenvx/config";
// Import configuration
import migrations from "./configs/migrations.js";
// Run Umzug as CLI application
migrations.runAsCLI();
