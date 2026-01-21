/**
 * guard.js
 *
 * Guard de autenticação do frontend do Edge Monitor.
 *
 * Responsabilidade:
 * - Impedir acesso a páginas protegidas sem sessão ativa
 * - Redirecionar para a página de login quando necessário
 * Ele atua apenas como controle de navegação (UX).
 */

import { getAccessToken, logout } from "./auth.js";

/**
 * Garante que o usuário esteja autenticado antes
 * de permitir o uso da página.
 *
 * Estratégia:
 * - Verifica existência de access token
 * - Se ausente, encerra sessão local e redireciona
 *
 * @returns {void}
 */
function requireAuth() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        logout();
    }
}

export {
    requireAuth,
};