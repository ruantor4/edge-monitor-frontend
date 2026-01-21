# Edge Monitor Frontend – Interface Web de Autenticação, Gestão e Dashboard

Frontend do sistema **Edge Monitor**, responsável por fornecer a **interface web**
para autenticação, gestão de usuários, recuperação de senha e visualização de dados
expostos pela **Edge Monitor API**.

Este projeto consome exclusivamente a **API REST**, mantendo separação total entre
**camada de apresentação (UI)** e **lógica de negócio**, seguindo padrões profissionais
de arquitetura frontend.

---

## Objetivos do Projeto

- Fornecer interface web para autenticação segura baseada em JWT
- Permitir gestão de usuários conforme permissões (admin / staff / usuário comum)
- Implementar fluxo completo de recuperação e redefinição de senha
- Consumir dados do backend para visualização em dashboard
- Manter frontend desacoplado, simples e fácil de manter
- Garantir organização clara de código e responsabilidades

---

## Funcionalidades

| Categoria | Descrição |
|---------|-----------|
| **Login JWT** | Autenticação segura baseada em tokens |
| **Logout** | Encerramento de sessão com invalidação de token |
| **Renovação de Token** | Renovação automática do access token |
| **Gestão de Usuários** | Listagem, criação, edição e exclusão de usuários |
| **Recuperação de Senha** | Solicitação de redefinição via e-mail |
| **Redefinição de Senha** | Definição de nova senha via token seguro |
| **Proteção de Rotas** | Bloqueio de páginas para usuários não autenticados |
| **Dashboard** | Interface para consumo e visualização de dados |

---

## Tecnologias Utilizadas

| Categoria | Tecnologia |
|---------|------------|
| **HTML** | **[HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)** |
| **CSS** | **[CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS)** |
| **Framework CSS** | **[Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)** |
| **JavaScript** | **[JavaScript ES Modules](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules)** |
| **Servidor Local** | **[Python HTTP Server](https://docs.python.org/pt-br/3/library/http.server.html)** |
| **Integração API** | **REST API (Edge Monitor API)** |
| **Autenticação** | **JWT (via backend)** |

---

## Estrutura de Diretórios

```bash
edge-monitor-frontend/
├── css/
│   └── styles.css                 # Estilos globais do sistema
│
├── js/
│   ├── api.js                     # Camada HTTP genérica (fetch + JWT)
│   ├── auth.js                    # Autenticação, login, logout e tokens
│   ├── config.js                  # Configurações globais (SSOT)
│   ├── events.js                  # Domínio de eventos
│   ├── guard.js                   # Proteção de rotas
│   └── users.js                   # Domínio de usuários (CRUD)
│
├── index.html                     # Login
├── dashboard.html                 # Dashboard principal
├── users.html                     # Listagem de usuários
├── user-form.html                 # Criação / edição de usuários
├── password-reset.html            # Solicitação de recuperação de senha
├── reset-password-confirm.html    # Redefinição de senha via token
│
├── .gitignore
└── README.md
```
---

## Arquitetura Frontend

O frontend segue uma arquitetura modular e desacoplada, baseada em
responsabilidade única:

- HTML → Estrutura da interface
- CSS → Identidade visual e layout
- JavaScript (Modules) → Lógica organizada por domínio
- API REST → Backend como única fonte de verdade

---

## Iniciar servidor local

Execute na raiz do projeto frontend:

```bash
python -m http.server 5500
``` 
abra no navegador:

```bash
http://0.0.0.0:5500
```
---

## Integração com o Backend

Este frontend depende diretamente da **Edge Monitor API**.

Certifique-se de que o backend esteja rodando em:
```bash
http://127.0.0.1:8000
``` 

Endpoints utilizados:

- `/api/authentication/login/`
- `/api/authentication/logout/`
- `/api/authentication/renovate/`
- `/api/authentication/password-reset/`
- `/api/authentication/password-reset-confirm/`
- `/api/users/`
- `/api/dashboard/`

---

## Segurança

- Tokens JWT armazenados no localStorage
- Proteção de rotas via guard.js
- Recuperação de senha baseada em token temporário
- Nenhuma informação sensível hardcoded no frontend

---

## Integração com o Ecossistema Edge Monitor

Este frontend integra-se aos seguintes projetos:

- **Edge Monitor API** – Backend REST (Django + DRF)
- **Edge Risk Monitor** – Inferência em edge (Visão Computacional)

Arquitetura desacoplada, orientada a eventos e escalável.

---

## Observações Técnicas

O frontend foi projetado para:

- Ambientes industriais
- Sistemas de baixo overhead
- Fácil manutenção
- Clareza arquitetural
- Alinhamento total com o backend

---
