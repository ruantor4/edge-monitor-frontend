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
 * IMPORTANTE:
 * - Este módulo NÃO contém lógica de UI ou DOM
 * - Este módulo NÃO gerencia autenticação
 * - Toda comunicação HTTP é delegada à api.js
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

/**
 * Representa os dados públicos de um usuário.
 *
 * Estrutura retornada pelo backend:
 * UserSerializer
 *
 * @typedef {Object} User
 * @property {number} id
 *     Identificador único do usuário.
 * @property {string} username
 *     Nome de usuário.
 * @property {string} email
 *     Endereço de e-mail do usuário.
 * @property {boolean} [is_staff]
 *     Indica se o usuário é administrador.
 * @property {boolean} [is_superuser]
 *     Indica se o usuário é superusuário (root).
 */


/*  
 * LISTAGEM
 */

/**
 * Lista todos os usuários cadastrados no sistema.
 *
 * Backend esperado:
 * GET /api/user/
 *
 * @returns {Promise<User[]>}
 *     Lista de usuários retornados pelo backend.
 */
async function listUsers() {
    return apiGet("/api/user/");
}

/* 
 * CONSULTA
 */

/**
 * Obtém um usuário específico pelo ID.
 *
 * Backend esperado:
 * GET /api/user/{id}/
 *
 * @param {number} userId
 *     Identificador do usuário.
 *
 * @returns {Promise<User>}
 *     Dados do usuário solicitado.
 */
async function getUserById(userId) {
    return apiGet(`/api/user/${userId}/`);
}

/*
 * CRIAÇÃO
*/

/**
 * Cria um novo usuário.
 *
 * Backend esperado:
 * POST /api/user/
 *
 * Payload esperado:
 * {
 *   username: string,
 *   password: string,
 *   email?: string
 * }
 *
 * @param {Object} data
 * @param {string} data.username
 *     Nome de usuário.
 * @param {string} data.password
 *     Senha do usuário.
 * @param {string} [data.email]
 *     E-mail do usuário (opcional).
 *
 * @returns {Promise<User>}
 *     Usuário criado.
 */
async function createUser(data) {
    return apiPost("/api/user/", data);
}


/*
 * ATUALIZAÇÃO
 */

/**
 * Atualiza parcialmente um usuário existente.
 *
 * Backend esperado:
 * PUT /api/user/{id}/
 * (aceita atualização parcial conforme permissões do usuário autenticado)
 *
 * Payload aceito (dependendo da permissão do usuário autenticado):
 * {
 *   username?: string,
 *   email?: string,
 *   password?: string,
 *   is_staff?: boolean,
 *   is_superuser?: boolean
 * }
 *
 * @param {number} userId
 *     Identificador do usuário.
 * @param {Object} data
 *     Dados a serem atualizados.
 *
 * @returns {Promise<User>}
 *     Usuário atualizado.
 */
async function updateUser(userId, data) {
    return apiPut(`/api/user/${userId}/`, data);
}


/* 
 * REMOÇÃO
 */

/**
 * Remove um usuário do sistema.
 *
 * Backend esperado:
 * DELETE /api/user/{id}/
 *
 * @param {number} userId
 *     Identificador do usuário.
 *
 * @returns {Promise<void>}
 */
async function deleteUser(userId) {
    return apiDelete(`/api/user/${userId}/`);
}

/* 
 * EXPORTAÇÃO EXPLÍCITA
 */
export {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
