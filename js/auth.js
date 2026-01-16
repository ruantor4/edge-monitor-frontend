/**
 * auth.js
 *
 * Módulo responsável exclusivamente pela autenticação do usuário
 * no frontend do Edge Monitor.
 *
 * Responsabilidades:
 * - Realizar login via API (JWT)
 * - Persistir token de acesso
 * - Fornecer verificação de sessão
 * - Realizar logout controlado
 *
 * O backend é a única fonte de verdade.
 */
// IMPORTAÇÃO DE CONFIG 
import { API_CONFIG } from "./config.js";


/**
 * Persiste o token JWT no armazenamento local.
 *
 * @param {string} token
 * @returns {void}
 */
function saveToken(token) {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
}


/**
 * Recupera o token JWT armazenado.
 *
 * @returns {string|null}
 *     Token JWT caso exista, ou null.
 */
function getToken() {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
}




/**
 * Realiza o logout do usuário.
 *
 * Remove o token armazenado e redireciona
 * para a tela de login.
 *
 * @returns {void}
 */
function logout(){
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
    window.location.href = "index.html";
}



/**
 * Realiza o login do usuário na API.
 *
 * Envia as credenciais para o endpoint de autenticação
 * e armazena o token JWT retornado em caso de sucesso.
 *
 * @param {string} username
 *     Nome de usuário.
 *
 * @param {string} password
 *     Senha do usuário.
 *
 * @throws {Error}
 *     Lançada quando as credenciais são inválidas
 *     ou ocorre falha de comunicação.
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

    const data = await response.json();
    saveToken(data.access);
}


/**
 * Exportação explícita do módulo
 */
export {
    login,
    logout,
    getToken,
};