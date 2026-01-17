/**
 * users.js
 *
 * Camada de domínio responsável pela gestão de usuários
 * no frontend do Edge Monitor.
 *
 * Este módulo encapsula exclusivamente:
 * - Listagem de usuários
 * - Criação de usuários
 * - Atualização de usuários
 * - Remoção de usuários
 *
 * Não contém lógica de UI, DOM ou autenticação.
 * Toda comunicação HTTP é delegada à api.js.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

/**
 * Representa os dados de um usuário.
 *
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {boolean} is_active
 */

/**
 * Lista todos os usuários cadastrados.
 *
 * Backend esperado:
 * GET /api/users/
 *
 * @returns {Promise<User[]>}
 *     Lista de usuários retornados pelo backend.
 */
async function listUsers() {
    // 🔧 ADICIONADO: função estava sendo exportada, mas não existia
    return apiGet("/api/user/");
}



/**
 * Obtém um usuário específico pelo ID.
 *
 * Backend esperado:
 * GET /api/users/{id}/
 *
 * @param {number} userId
 * @returns {Promise<User>}
 */
async function getUserById(userId) {
    return apiGet(`/api/user/${userId}/`);
}




/**
 * Cria um novo usuário.
 *
 * Backend esperado:
 * POST /api/users/
 *
 * @param {Object} data
 * @param {string} data.username
 * @param {string} data.password
 * @param {string} [data.email]
 *
 * @returns {Promise<User>}
 */
async function createUser(data) {
    return apiPost("/api/user/", data);
}


/**
 * Atualiza um usuário existente.
 *
 * Backend esperado:
 * PUT /api/users/{id}/
 *
 * @param {number} userId
 * @param {Object} data
 * @returns {Promise<User>}
 */
async function updateUser(userId, data) {
    return apiPut(`/api/user/${userId}/`, data);
}


/**
 * Remove um usuário.
 *
 * Backend esperado:
 * DELETE /api/users/{id}/
 *
 * @param {number} userId
 * @returns {Promise<void>}
 */
async function deleteUser(userId) {
    return apiDelete(`/api/user/${userId}/`);
}


/**
 * Exportação explícita do domínio de usuários
 */
export {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};


