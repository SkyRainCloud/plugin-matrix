#!/bin/bash
set -e

# 1. Database migration
if mysql -u root -e 'use pterodactyl; describe plugin_metrics;' 2>/dev/null | grep -q version; then
  echo "[DB] 'version' column already exists in plugin_metrics. Skipping migration."
else
  echo "[DB] Running plugin_metrics.sql migration..."
  mysql -u root -p pterodactyl < backend/plugin_metrics.sql
fi

# 2. Copy backend files (update these paths as needed for your panel install)
PANEL_PATH="/var/www/pterodactyl"
echo "[Backend] Copying PHP files..."
cp backend/PluginMetricsController.php "$PANEL_PATH/app/Http/Controllers/Api/Client/"
cp backend/PluginMetricsService.php "$PANEL_PATH/app/Services/"
cp backend/PluginAlertsController.php "$PANEL_PATH/app/Http/Controllers/Api/Client/"
cp backend/PluginMetricsRouteProvider.php "$PANEL_PATH/app/Providers/"

# 3. Register route provider (manual step)
echo "[Route] Please register PluginMetricsRouteProvider in your panel's RouteServiceProvider if not already done."

# 4. Build frontend and copy assets
cd frontend
npm install
npm run build
cd ..
mkdir -p "$PANEL_PATH/public/assets/plugins/plugin-metrics"
cp frontend/dist/* "$PANEL_PATH/public/assets/plugins/plugin-metrics/"

# 5. Daemon instructions
echo "[Daemon] To enable metrics collection, copy backend/metrics-daemon.py to each server/container."
echo "Set environment variables: PTERO_URL, PTERO_API_KEY, SERVER_ID, SERVER_TYPE, ALERT_THRESHOLD (optional)."
echo "Install dependencies: pip install psutil requests"
echo "Run: python3 metrics-daemon.py"

# 6. Success message
echo "\n[Success] Plugin Metrics Addon installed!"
echo "- Restart your Pterodactyl panel if needed."
echo "- Log in to the panel to see the Plugin Metrics tab."
echo "- Configure alerts and enjoy!"