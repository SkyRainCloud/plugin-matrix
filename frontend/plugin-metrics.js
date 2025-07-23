document.addEventListener('DOMContentLoaded', function() {
    const serverId = window.PterodactylServer.id;
    let cpuChart, memoryChart;
    let allMetrics = [];
    let allSummaries = [];

    // DOM Elements
    const refreshBtn = document.getElementById('refresh-btn');
    const alertsBtn = document.getElementById('alerts-btn');
    const summaryTable = document.getElementById('summary-table-body');
    const metricsTable = document.getElementById('metrics-table-body');

    // Event Listeners
    refreshBtn.addEventListener('click', loadMetrics);
    alertsBtn.addEventListener('click', showAlertsModal);

    // Initial load
    loadMetrics();

    function loadMetrics() {
        fetch(`/api/client/servers/${serverId}/plugin-metrics`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                allMetrics = data.realtime;
                allSummaries = data.summary;
                updateSummaryTable();
                updateMetricsTable();
                updateCharts();
            })
            .catch(error => {
                console.error('Error loading metrics:', error);
                showError('Failed to load metrics. Please try again.');
            });
    }

    function updateSummaryTable() {
        summaryTable.innerHTML = '';
        
        allSummaries.forEach(summary => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${summary.plugin_name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="metric-badge cpu">${summary.avg_cpu.toFixed(2)}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="metric-badge memory">${formatBytes(summary.avg_memory)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="metric-badge errors">${summary.total_errors}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-blue-600 hover:text-blue-900" onclick="viewPluginDetails('${summary.plugin_name}')">
                        Details
                    </button>
                </td>
            `;
            
            summaryTable.appendChild(row);
        });
    }

    function updateMetricsTable() {
        metricsTable.innerHTML = '';
        
        allMetrics.forEach(metric => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            const date = new Date(metric.created_at);
            const timeString = date.toLocaleTimeString();
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${metric.plugin_name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="metric-badge cpu">${metric.cpu_usage}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="metric-badge memory">${formatBytes(metric.memory_usage)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="metric-badge disk">${formatBytes(metric.disk_io)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="metric-badge network">${formatBytes(metric.network_io)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="metric-badge errors ${metric.errors > 0 ? 'bg-red-200 text-red-800' : ''}">
                        ${metric.errors}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${timeString}
                </td>
            `;
            
            metricsTable.appendChild(row);
        });
    }

    function updateCharts() {
        // Destroy existing charts if they exist
        if (cpuChart) cpuChart.destroy();
        if (memoryChart) memoryChart.destroy();

        // Prepare data for charts
        const pluginNames = [...new Set(allSummaries.map(s => s.plugin_name))];
        const cpuData = pluginNames.map(name => {
            const summary = allSummaries.find(s => s.plugin_name === name);
            return summary ? summary.avg_cpu : 0;
        });
        const memoryData = pluginNames.map(name => {
            const summary = allSummaries.find(s => s.plugin_name === name);
            return summary ? summary.avg_memory / (1024 * 1024) : 0; // Convert to MB
        });

        // CPU Chart
        const cpuCtx = document.getElementById('cpuChart').getContext('2d');
        cpuChart = new Chart(cpuCtx, {
            type: 'bar',
            data: {
                labels: pluginNames,
                datasets: [{
                    label: 'Average CPU Usage (%)',
                    data: cpuData,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'CPU Usage (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Plugins'
                        }
                    }
                }
            }
        });

        // Memory Chart
        const memoryCtx = document.getElementById('memoryChart').getContext('2d');
        memoryChart = new Chart(memoryCtx, {
            type: 'bar',
            data: {
                labels: pluginNames,
                datasets: [{
                    label: 'Average Memory Usage (MB)',
                    data: memoryData,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Memory Usage (MB)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Plugins'
                        }
                    }
                }
            }
        });
    }

    function showAlertsModal() {
        // Implement alert modal display
        alert('Alerts feature will be implemented in next version');
    }

    function viewPluginDetails(pluginName) {
        // Implement plugin details view
        alert(`Details for ${pluginName} will be shown here`);
    }

    function showError(message) {
        // Implement error display
        alert(`Error: ${message}`);
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Make functions available globally for button clicks
    window.viewPluginDetails = viewPluginDetails;
});