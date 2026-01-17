/**
 * events.js
 *
 * Camada de domínio responsável pelo acesso e tratamento
 * dos eventos de risco no frontend do Edge Monitor.
 *
 * Este módulo encapsula:
 * - Listagem de eventos de risco
 * - Aplicação de filtros (data, dispositivo)
 * - Isolamento da rota /api/monitoring/
 */

import { apiGet } from "./api.js";

/**
 * Representa um filtro de eventos de risco.
 *
 * @typedef {Object} EventFilters
 * @property {string} [start_date]  Data inicial (ISO 8601)
 * @property {string} [end_date]    Data final (ISO 8601)
 * @property {string} [mac_address] MAC do dispositivo
 */

/**
 * Constrói a query string a partir dos filtros informados.
 *
 * @param {EventFilters} filters
 * @returns {string}
 */

function buildQueryString(filters = {}){
    const params = new URLSearchParams();

    if (filters.start_date){
        params.append("start_date", filters.start_date);
    }

    if (filters.end_date){
        params.append("end_date", filters.end_date);
    }

    if(filters.mac_address){
        params.append("mac_address", filters.mac_address);

    }
    const query = params.toString();
    return query ? `?${query}` : "";    
}


/**
 * Lista eventos de risco a partir da API.
 *
 * @param {EventFilters} filters
 *     Filtros opcionais de consulta.
 *
 * @returns {Promise<Array>}
 *     Lista de eventos de risco retornados pelo backend.
 */
async function listEvents(filters = {}){
    const queryString = buildQueryString(filters);
    const endpoint = `/api/monitoring/${queryString}`;

    return apiGet(endpoint);
}

export {
    listEvents,
};