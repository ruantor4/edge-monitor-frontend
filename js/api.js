/**
 * api.js
 *
 * Camada de comunicação HTTP do frontend do Edge Monitor.
 *
 * Este módulo encapsula todas as chamadas à API backend,
 * garantindo:
 * - Inclusão automática do access token JWT
 * - Renovação automática do token quando expirado
 * - Tratamento centralizado de erros HTTP
 * - Padronização das requisições fetch
 *
 * IMPORTANTE:
 * - Este módulo NÃO contém lógica de UI
 * - Este módulo NÃO gerencia autenticação diretamente
 * - A lógica de autenticação é delegada ao auth.js
 */


import { API_CONFIG } from "./config.js";
import {
    getAccessToken,
    ensureValidAccessToken,
    logout,
} from "./auth.js";

// FUNÇÃO BASE DE REQUISIÇÃO

/**
 * Executa uma requisição HTTP autenticada para a API.
 *
 * Estratégia:
 * - Anexa access token ao header Authorization
 * - Em caso de 401:
 *     - tenta renovar o access token
 *     - repete a requisição uma única vez
 *     - se falhar, encerra a sessão
 *
 * @param {string} endpoint
 *     Endpoint relativo da API (ex: "/api/monitoring/")
 *
 * @param {RequestInit} options
 *     Opções adicionais do fetch (method, body, headers, etc).
 *
 * @param {boolean} [retry=true]
 *     Controle interno para evitar loop infinito
 *     durante a tentativa de renovação do token.
 *
 * @throws {Error}
 *     Lançada em caso de erro HTTP ou falha de comunicação.
 *
 * @returns {Promise<any>}
 *     Retorna o JSON da resposta em caso de sucesso,
 *     ou null para respostas 204.
 */
async function apiRequest(endpoint, options = {}, retry = true) {
    /** @type {string|null} */
    let accessToken = getAccessToken();

    /** @type {Record<string, string>} */
    const headers = {
        ...(options.headers || {}),
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    /**
     * Access token expirado ou inválido
     * → tenta renovar e repetir a requisição uma vez
     */
    if (response.status === 401 && retry) {
        try {
            accessToken = await ensureValidAccessToken();

            headers["Authorization"] = `Bearer ${accessToken}`;

            return apiRequest(endpoint, options, false);
        } catch (error) {
            await logout();
            throw new Error("Sessão expirada ou não autorizada");
        }
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Erro ${response.status}: ${errorText || "Falha na requisição"}`
        );
    }

    // Resposta sem conteúdo
    if (response.status === 204) {
        return null;
    }

    return response.json();
}


// MÉTODOS HTTP

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
function apiPost(endpoint, data) {
    const isFormData = data instanceof FormData;

    return apiRequest(endpoint, {
        method: "POST",
        headers: isFormData
            ? {}
            : { "Content-Type": "application/json" },
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
        body: JSON.stringify(data),
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

/**
* EXPORTAÇÃO EXPLÍCITA
*/
export {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
};