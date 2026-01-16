/**
 * api.js
 *
 * Camada de comunicação HTTP do frontend do Edge Monitor.
 *
 * Este módulo encapsula todas as chamadas à API backend,
 * garantindo:
 * - Inclusão automática do token JWT
 * - Tratamento centralizado de erros HTTP
 * - Padronização das requisições fetch
 *
 * Este arquivo NÃO implementa lógica de UI nem autenticação.
 * Atua como uma camada de serviço, equivalente aos services
 * do backend.
 */

import { API_CONFIG } from "./config.js";
import { getToken, logout } from "./auth.js";


/**
 * Executa uma requisição HTTP autenticada para a API.
 *
 * @param {string} endpoint
 *     Endpoint relativo da API (ex: "/api/monitoring/")
 *
 * @param {Object} options
 *     Opções adicionais do fetch (method, body, headers, etc).
 *
 * @returns {Promise<any>}
 *     Retorna o JSON da resposta em caso de sucesso.
 *
 * @throws {Error}
 *     Lançada em caso de erro HTTP ou falha de comunicação.
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        ...(options.headers || {}),
    };

    if(token){
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    // Token expirado ou inválido
    if (response.status == 401){
        logout()
        throw new Error("Sessão expirada ou não autorizada");
    }

    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Erro ${response.status}: ${errorText || "Falha na requisição"}`
        )

    }

    // Resposta sem conteúdo 
    if (response.status == 204){
        return null;
    }

    return response.json();
}


/**
 * Realiza uma requisição GET autenticada.
 *
 * @param {string} endpoint
 * @returns {Promise<any>}
 */
function apiGet(endpoint) {
    return apiRequest(endpoint, {
        method: "GET",
    });
}


/**
 * Realiza uma requisição POST autenticada.
 *
 * @param {string} endpoint
 * @param {Object|FormData} data
 * @returns {Promise<any>}
 */
function apiPost(endpoint, data){
    const isFormData = data instanceof FormData;

    return apiRequest(endpoint, {
        method: "POST",
        headers: isFormData
            ? {}
            : {"Content-Type": "application/json"},
        body: isFormData ? data : JSON.stringify(data),
    });
}


/**
 * Realiza uma requisição PUT autenticada.
 *
 * @param {string} endpoint
 * @param {Object} data
 * @returns {Promise<any>}
 */
function apiPut(endpoint, data) {
    return apiRequest(endpoint, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(data)
    });
}


/**
 * Realiza uma requisição DELETE autenticada.
 *
 * @param {string} endpoint
 * @returns {Promise<any>}
 */

function apiDelete(endpoint) {
    return apiRequest(endpoint, {
        method: "DELETE",
    });
}

export{
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
};