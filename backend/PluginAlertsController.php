<?php
namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PluginAlertsController extends Controller
{
    public function index(Request $request)
    {
        $serverId = $request->user()->server->id;
        $alerts = DB::table('plugin_alerts')
            ->where('server_id', $serverId)
            ->get();
        return response()->json($alerts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plugin_name' => 'nullable|string',
            'alert_type' => 'required|in:cpu,memory,disk,network,errors',
            'threshold' => 'required|numeric',
            'notification_type' => 'required|in:email,discord,webhook',
            'notification_target' => 'required|string',
            'is_active' => 'boolean'
        ]);
        $serverId = $request->user()->server->id;
        DB::table('plugin_alerts')->insert([
            'server_id' => $serverId,
            'plugin_name' => $validated['plugin_name'] ?? null,
            'alert_type' => $validated['alert_type'],
            'threshold' => $validated['threshold'],
            'notification_type' => $validated['notification_type'],
            'notification_target' => $validated['notification_target'],
            'is_active' => $validated['is_active'] ?? 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        return response()->json(['success' => true]);
    }
} 