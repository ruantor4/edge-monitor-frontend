/**
 * events.js
 *
 * Camada de domínio responsável pelo acesso aos eventos
 * de monitoramento no frontend do Edge Monitor.
 *
 * Este módulo encapsula exclusivamente:
 * - Consulta de eventos para visualização no dashboard
 * - Acesso opcional à lista bruta de eventos (monitoring)
 *
 * IMPORTANTE:
 * - Este módulo NÃO contém lógica de UI
 * - Este módulo NÃO constrói componentes visuais
 * - A filtragem por data é responsabilidade do endpoint /api/dashboard/
 */

import { apiGet } from "./api.js";

/**
 * Representa um evento retornado pelo dashboard.
 *
 * @typedef {Object} DashboardEvent
 * @property {string} mac
 *     Endereço MAC do dispositivo edge.
 * @property {string} class_name
 *     Classe do objeto de risco detectado.
 * @property {string} datetime
 *     Data e hora da detecção (ISO 8601).
 * @property {string} image
 *     URL da imagem de evidência.
 */

// DASHBOARD

/**
 * Lista eventos de monitoramento para o dashboard,
 * filtrados por intervalo de datas.
 *
 * Backend esperado:
 * GET /api/dashboard/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
 *
 * @param {string} startDate
 *     Data inicial no formato YYYY-MM-DD.
 *
 * @param {string} endDate
 *     Data final no formato YYYY-MM-DD.
 *
 * @throws {Error}
 *     Lançada quando parâmetros obrigatórios não são informados.
 *
 * @returns {Promise<DashboardEvent[]>}
 *     Lista de eventos serializados para o dashboard.
 */
async function listDashboardEvents(startDate, endDate) {
    if (!startDate || !endDate) {
        throw new Error("start_date e end_date são obrigatórios");
    }

    const endpoint =
        `/api/dashboard/?start_date=${startDate}&end_date=${endDate}`;

    return apiGet(endpoint);
}


// MONITORING (ACESSO BRUTO / AUDITORIA)

/**
 * Lista eventos brutos de monitoramento.
 *
 * Backend esperado:
 * GET /api/monitoring/
 *
 * IMPORTANTE:
 * - Este método NÃO aplica filtros
 * - Utilizado apenas para auditoria ou debug
 *
 * @returns {Promise<Array>}
 *     Lista bruta de eventos de monitoramento.
 */
async function listMonitoringEvents() {
    return apiGet("/api/monitoring/");
}

/*
* EXPORTAÇÃO EXPLÍCITA
*/
export {
    listDashboardEvents,
    listMonitoringEvents,
};