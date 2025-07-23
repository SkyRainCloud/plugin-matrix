#!/bin/bash
set -e

echo "🗑️ Uninstalling Pterodactyl Plugin Metrics Addon..."

# Define paths
PTERO_ROOT="/var/www/pterodactyl"
PLUGIN_DIR="$PTERO_ROOT/plugins/plugin-metrics"
ASSETS_DIR="$PTERO_ROOT/public/assets/plugin-metrics"

# Remove files
echo "📦 Removing files..."
rm -rf "$PLUGIN_DIR"
rm -rf "$ASSETS_DIR"
rm -f "$PTERO_ROOT/routes/plugins/plugin-metrics.php"

# Remove database tables
echo "💾 Dropping database tables..."
mysql -u root -p"$DB_PASSWORD" pterodactyl -e "DROP TABLE IF EXISTS plugin_metrics, plugin_alerts;"

# Remove plugin registration
echo "🔌 Unregistering plugin..."
sed -i '/PluginMetricsRouteProvider::class/d' "$PTERO_ROOT/config/app.php"

# Remove from navigation
if [ -f "$PTERO_ROOT/config/plugin-metadata.json" ]; then
    jq 'del(.navigation.server[] | select(.name == "Plugin Metrics"))' \
       "$PTERO_ROOT/config/plugin-metadata.json" > tmp.json && \
       mv tmp.json "$PTERO_ROOT/config/plugin-metadata.json"
fi

# Clear cache
echo "🧹 Clearing cache..."
php "$PTERO_ROOT/artisan" cache:clear
php "$PTERO_ROOT/artisan" view:clear

echo "✅ Uninstallation complete! Please restart your Pterodactyl queue worker:"
echo "   sudo systemctl restart pteroq.service"