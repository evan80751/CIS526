// Load environment
import "@dotenvx/dotenvx/config";
// Import configuration
import seeds from './configs/seeds.js'
// Run Umzug as CLI application
seeds.runAsCLI();