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

/*
    IMPORTAÇÃO DE CONFIG
*/
import { API_CONFIG } from "./config.js";

/*
    PERSISTÊNCIA DE TOKENS
*/

function saveToken(access, renovate) {
    localStorage.setItem(API_CONFIG.ACCESS_TOKEN_KEY, access);
    localStorage.setItem(API_CONFIG.RENOVATE_TOKEN_KEY, renovate);
}

function updateAccessToken(access) {
    localStorage.setItem(API_CONFIG.ACCESS_TOKEN_KEY, access);
}

function getAccessToken() {
    return localStorage.getItem(API_CONFIG.ACCESS_TOKEN_KEY);
}

function getRenovateToken() {
    return localStorage.getItem(API_CONFIG.RENOVATE_TOKEN_KEY);
}

/*
    AUTENTICAÇÃO
*/

async function login(username, password) {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/authentication/login/`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        }
    );

    if (!response.ok) {
        throw new Error("Falha na autenticação");
    }

    /**
     * @type {{
     *   access: string,
     *   renovate: string,
     *   is_staff: boolean,
     *   is_superuser: boolean
     * }}
     */
    const data = await response.json();

    saveToken(data.access, data.renovate);

    
    localStorage.setItem("user_id", String(data.id));
    localStorage.setItem("username", username);
    localStorage.setItem("is_staff", String(data.is_staff));
    localStorage.setItem("is_superuser", String(data.is_superuser));
}

async function renovateAccessToken() {
    const renovate = getRenovateToken();

    if (!renovate) {
        throw new Error("Renovate token ausente");
    }

    const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/authentication/renovate/`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ renovate }),
        }
    );

    if (!response.ok) {
        throw new Error("Falha ao renovar access token");
    }

    const data = await response.json();
    updateAccessToken(data.access);
    return data.access;
}

async function ensureValidAccessToken() {
    const access = getAccessToken();
    if (access) return access;

    try {
        return await renovateAccessToken();
    } catch {
        await logout();
        throw new Error("Sessão expirada");
    }
}

async function logout() {
    const renovate = getRenovateToken();

    if (renovate) {
        try {
            await fetch(
                `${API_CONFIG.BASE_URL}/api/authentication/logout/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ renovate }),
                }
            );
        } catch {
            // Falha no backend não impede logout local
        }
    }

    localStorage.removeItem(API_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.RENOVATE_TOKEN_KEY);
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("is_superuser");

    window.location.href = "index.html";
}

/*
    RECUPERAÇÃO DE SENHA
*/

async function requestPasswordReset(email) {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/authentication/password-reset/`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao solicitar recuperação de senha");
    }

    return response.json();
}

async function confirmPasswordReset({ uid, token, password }) {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/authentication/password-reset/confirm/`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, token, password }),
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao redefinir senha");
    }

    return response.json();
}

/*
    EXPORTAÇÃO
*/

export {
    login,
    logout,
    getAccessToken,
    getRenovateToken,
    renovateAccessToken,
    ensureValidAccessToken,
    requestPasswordReset,
    confirmPasswordReset,
};
