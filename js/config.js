/**
 * config.js
 *
 * Configurações globais do frontend edge-monitor.
 * Atua como fonte única de verdade (SSOT) para:
 * - URL base da API
 * - Chaves de armazenamento local
 */

export const API_CONFIG = {
    BASE_URL: "http://localhost:8000",
    ACCESS_TOKEN_KEY: "edge_monitor_access",
    RENOVATE_TOKEN_KEY: "edge_monitor_renovate",
};
