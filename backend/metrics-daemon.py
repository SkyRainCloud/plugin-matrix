#!/usr/bin/env python3
import os
import time
import requests
import psutil
from datetime import datetime
import importlib

PTERO_URL = os.getenv("PTERO_URL", "https://your.pterodactyl.url")
API_KEY = os.getenv("PTERO_API_KEY")
SERVER_ID = os.getenv("SERVER_ID")
ALERT_THRESHOLD = float(os.getenv("ALERT_THRESHOLD", 90))  # 90% CPU/Memory

class PluginCollector:
    def collect(self):
        """Return a list of plugin metrics dicts."""
        raise NotImplementedError

class MinecraftPluginCollector(PluginCollector):
    def collect(self):
        # Placeholder: Replace with actual JVM/JMX/Spark logic
        plugins = [
            {
                "plugin_name": "ExamplePlugin",
                "cpu_usage": 10.5,
                "memory_usage": 150 * 1024 * 1024,  # 150MB
                "disk_io": 1024 * 1024,  # 1MB
                "network_io": 512 * 1024,  # 512KB
                "errors": 0,
                "version": "1.0.0"
            },
            {
                "plugin_name": "AnotherPlugin",
                "cpu_usage": 5.2,
                "memory_usage": 80 * 1024 * 1024,
                "disk_io": 512 * 1024,
                "network_io": 256 * 1024,
                "errors": 1,
                "version": "2.3.1"
            }
        ]
        return plugins

def get_plugin_metrics():
    try:
        # Dynamically select collector based on environment or config
        server_type = os.getenv("SERVER_TYPE", "minecraft")
        if server_type == "minecraft":
            collector = MinecraftPluginCollector()
        else:
            collector = PluginCollector()  # Fallback, will raise NotImplementedError
        plugins = collector.collect()
        # Optionally, add server process stats as a special plugin
        process = psutil.Process(1)
        plugins.append({
            "plugin_name": "server_process",
            "cpu_usage": process.cpu_percent(),
            "memory_usage": process.memory_info().rss,
            "disk_io": psutil.disk_io_counters().read_bytes,
            "network_io": psutil.net_io_counters().bytes_sent,
            "errors": 0,
            "version": None
        })
        return plugins
    except Exception as e:
        print(f"Error collecting metrics: {e}")
        return []

def check_alerts(metrics):
    alerts = []
    for metric in metrics:
        if metric['cpu_usage'] > ALERT_THRESHOLD:
            alerts.append({
                "plugin": metric['plugin_name'],
                "type": "cpu",
                "value": metric['cpu_usage'],
                "message": f"High CPU usage detected: {metric['cpu_usage']}%"
            })
        
        mem_percent = (metric['memory_usage'] / psutil.virtual_memory().total) * 100
        if mem_percent > ALERT_THRESHOLD:
            alerts.append({
                "plugin": metric['plugin_name'],
                "type": "memory",
                "value": mem_percent,
                "message": f"High Memory usage detected: {mem_percent:.2f}%"
            })
    
    return alerts

def send_alert(alert):
    try:
        requests.post(
            f"{PTERO_URL}/api/client/servers/{SERVER_ID}/plugin-alerts",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json=alert,
            timeout=5
        )
    except Exception as e:
        print(f"Error sending alert: {e}")

def send_metrics(metrics):
    for plugin in metrics:
        try:
            requests.post(
                f"{PTERO_URL}/api/client/servers/{SERVER_ID}/plugin-metrics",
                headers={"Authorization": f"Bearer {API_KEY}"},
                json=plugin,
                timeout=5
            )
        except Exception as e:
            print(f"Error sending metrics: {e}")

def main():
    while True:
        metrics = get_plugin_metrics()
        if metrics:
            send_metrics(metrics)
            alerts = check_alerts(metrics)
            for alert in alerts:
                send_alert(alert)
        
        time.sleep(60)  # Collect every 60 seconds

if __name__ == "__main__":
    print(f"Starting Plugin Metrics Daemon at {datetime.now()}")
    main()