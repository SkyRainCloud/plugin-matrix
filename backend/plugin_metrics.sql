CREATE TABLE `plugin_metrics` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `server_id` bigint(20) unsigned NOT NULL,
  `plugin_name` varchar(255) NOT NULL,
  `cpu_usage` decimal(8,2) NOT NULL,
  `memory_usage` bigint(20) NOT NULL,
  `disk_io` bigint(20) NOT NULL,
  `network_io` bigint(20) NOT NULL,
  `errors` int(11) NOT NULL,
  `version` varchar(64) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugin_metrics_server_id_foreign` (`server_id`),
  CONSTRAINT `plugin_metrics_server_id_foreign` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `plugin_alerts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `server_id` bigint(20) unsigned NOT NULL,
  `plugin_name` varchar(255) DEFAULT NULL,
  `alert_type` enum('cpu','memory','disk','network','errors') NOT NULL,
  `threshold` decimal(8,2) NOT NULL,
  `notification_type` enum('email','discord','webhook') NOT NULL,
  `notification_target` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugin_alerts_server_id_foreign` (`server_id`),
  CONSTRAINT `plugin_alerts_server_id_foreign` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;