<?php
namespace App\Services;

use Pterodactyl\Models\Server;
use Illuminate\Support\Facades\DB;

class PluginMetricsService
{
    public function getPluginStats($serverId)
    {
        return DB::table('plugin_metrics')
            ->where('server_id', $serverId)
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();
    }

    public function storePluginStats($serverId, $pluginData)
    {
        return DB::table('plugin_metrics')->insert([
            'server_id' => $serverId,
            'plugin_name' => $pluginData['plugin_name'],
            'cpu_usage' => $pluginData['cpu_usage'],
            'memory_usage' => $pluginData['memory_usage'],
            'disk_io' => $pluginData['disk_io'],
            'network_io' => $pluginData['network_io'],
            'errors' => $pluginData['errors'],
            'version' => $pluginData['version'] ?? null,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function getServerPluginsSummary($serverId)
    {
        return DB::table('plugin_metrics')
            ->select('plugin_name', 
                DB::raw('AVG(cpu_usage) as avg_cpu'),
                DB::raw('AVG(memory_usage) as avg_memory'),
                DB::raw('SUM(errors) as total_errors'))
            ->where('server_id', $serverId)
            ->groupBy('plugin_name')
            ->orderBy('avg_cpu', 'desc')
            ->get();
    }
}