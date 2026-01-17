/**
 * auth.js
 *
 * Módulo responsável exclusivamente pela autenticação do usuário
 * no frontend do Edge Monitor.
 *
 * Este módulo atua como camada de serviço de autenticação,
 * mantendo total alinhamento com o backend Django REST + JWT.
 *
 * Responsabilidades:
 * - Realizar login via API (JWT)
 * - Persistir access token e renovate token
 * - Renovar access token quando expirado
 * - Realizar logout controlado com invalidação de token
 *
 * IMPORTANTE:
 * - Este módulo NÃO contém lógica de UI
 * - Este módulo NÃO executa chamadas genéricas à API
 * - O backend é a única fonte de verdade
 */


// IMPORTAÇÃO DE CONFIG 

import { API_CONFIG } from "./config.js";


// PERSISTÊNCIA DE TOKENS

/**
 * Persiste os tokens JWT no armazenamento local.
 *
 * @param {string} access
 *     Access token JWT utilizado para autenticação das requisições.
 *
 * @param {string} renovate
 *     Token de renovação (refresh) utilizado para gerar novos
 *     access tokens.
 *
 * @returns {void}
 */
function saveToken(access, renovate) {
    localStorage.setItem(API_CONFIG.ACCESS_TOKEN_KEY, access);
    localStorage.setItem(API_CONFIG.RENOVATE_TOKEN_KEY, renovate);
}


/**
 * Atualiza apenas o access token armazenado.
 *
 * Utilizado após a renovação bem-sucedida do token.
 *
 * @param {string} access
 *     Novo access token JWT.
 *
 * @returns {void}
 */
function updateAccessToken(access) {
    localStorage.setItem(API_CONFIG.ACCESS_TOKEN_KEY, access);
}



/**
 * Recupera o access token armazenado.
 *
 * @returns {string|null}
 *     Access token JWT ou null caso não exista.
 */
function getAccessToken() {
    return localStorage.getItem(API_CONFIG.ACCESS_TOKEN_KEY);
}



/**
 * Recupera o renovate (refresh) token armazenado.
 *
 * Necessário para:
 * - Renovação do access token
 * - Logout real (blacklist no backend)
 *
 * @returns {string|null}
 *     Renovate token JWT ou null.
 */
function getRenovateToken() {
    return localStorage.getItem(API_CONFIG.RENOVATE_TOKEN_KEY);
}


// AUTENTICAÇÃO

/**
 * Realiza o login do usuário na API.
 *
 * Envia credenciais para o backend e, em caso de sucesso,
 * armazena o par de tokens JWT retornados.
 *
 * Backend esperado:
 * POST /api/authentication/login/
 *
 * @param {string} username
 *     Nome de usuário.
 *
 * @param {string} password
 *     Senha do usuário.
 *
 * @throws {Error}
 *     Lançada quando as credenciais são inválidas ou ocorre
 *     falha de comunicação com o backend.
 *
 * @returns {Promise<void>}
 */
async function login(username, password) {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/authentication/login/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );

    if(!response.ok){
        throw new Error("Falha na autenticação");
    }

    /** 
    * @type {{access: string, renovate: string}} 
    */
    const data = await response.json();

    saveToken(data.access, data.renovate);
}



/**
 * Renova o access token utilizando o renovate token.
 *
 * Backend esperado:
 * POST /api/authentication/renovate/
 *
 * Payload:
 * {
 *   renovate: string
 * }
 *
 * @throws {Error}
 *     Lançada quando o renovate token é inválido ou expirado.
 *
 * @returns {Promise<string>}
 *     Novo access token JWT.
 */
async function renovateAccessToken() {
    const renovate = getRenovateToken();

    if (!renovate) {
        throw new Error("Renovate token ausente");
    }

    const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/authentication/renovate/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ renovate }),
        }
    );

    if (!response.ok) {
        throw new Error("Falha ao renovar access token");
    }

    /** @type {{access: string}} */
    const data = await response.json();

    updateAccessToken(data.access);
    return data.access;
}


/**
 * Garante que exista um access token válido para a sessão.
 *
 * Estratégia:
 * - Retorna o access token atual, se existir
 * - Caso contrário, tenta renová-lo via renovate token
 * - Em caso de falha, executa logout
 *
 * Esta função foi projetada para ser utilizada pela camada api.js
 * em cenários de resposta HTTP 401.
 *
 * @throws {Error}
 *     Lançada quando não é possível garantir uma sessão válida.
 *
 * @returns {Promise<string>}
 *     Access token válido.
 */
async function ensureValidAccessToken() {
    try {
        return getAccessToken() || await renovateAccessToken();
    } catch (error) {
        await logout();
        throw new Error("Sessão expirada");
    }
}




/**
 * Realiza o logout do usuário.
 *
 * Responsabilidades:
 * - Invalida o renovate token no backend (blacklist)
 * - Remove tokens do armazenamento local
 * - Redireciona para a tela de login
 *
 * Backend esperado:
 * POST /api/authentication/logout/
 *
 * @returns {Promise<void>}
 */
async function logout() {
    const renovate = getRenovateToken();

    if (renovate) {
        try {
            await fetch(
                `${API_CONFIG.BASE_URL}/api/authentication/logout/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ renovate }),
                }
            );
        } catch (error) {
            // Falha no backend não impede encerramento da sessão local
        }
    }

    localStorage.removeItem(API_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.RENOVATE_TOKEN_KEY);

    window.location.href = "index.html";
}


/**
* EXPORTAÇÃO EXPLÍCITA
*/
export {
    login,
    logout,
    getAccessToken,
    getRenovateToken,
    renovateAccessToken,
    ensureValidAccessToken,
};