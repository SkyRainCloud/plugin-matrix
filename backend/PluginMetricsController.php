<?php
namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Services\PluginMetricsService;
use Illuminate\Http\Request;

class PluginMetricsController extends Controller
{
    public function __construct(private PluginMetricsService $service) {}

    public function index(Request $request)
    {
        return response()->json([
            'realtime' => $this->service->getPluginStats($request->user()->server->id),
            'summary' => $this->service->getServerPluginsSummary($request->user()->server->id)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plugin_name' => 'required|string',
            'cpu_usage' => 'required|numeric',
            'memory_usage' => 'required|numeric',
            'disk_io' => 'required|numeric',
            'network_io' => 'required|numeric',
            'errors' => 'required|numeric',
            'version' => 'nullable|string'
        ]);

        $this->service->storePluginStats(
            $request->user()->server->id,
            $validated
        );

        return response()->json(['success' => true]);
    }
}