// ============================================================================
//  IMPORTAÇÕES DO SWAGGER
// ============================================================================
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// ============================================================================
//  CONFIGURAÇÃO DO SWAGGER
// ============================================================================
// Aqui definimos:
// - versão do OpenAPI
// - título e descrição
// - segurança (JWT)
// - schemas globais (Users, News)
const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API G1 Clone",
      version: "1.0.0",
      description: "Documentação da API do seu projeto",
    },

    components: {
      // ======================================================================
      //  AUTENTICAÇÃO (GLOBAL) — JWT Bearer
      // ======================================================================
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      // ======================================================================
      //  SCHEMAS (MODELS) — usados nas respostas do Swagger
      // ======================================================================
      schemas: {
        // 🔹 SCHEMA DE NOTÍCIA (NEWS)
        News: {
          type: "object",
          properties: {
            title: { type: "string", example: "Título da Notícia" },
            subtitle: { type: "string", example: "Subtítulo da Notícia" },
            text: { type: "string", example: "<p>Conteúdo em HTML...</p>" },
            image: { type: "string", example: "/uploads/imagem.jpg" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
  },

  // SCAN DOS ARQUIVOS DAS ROTAS E MODELS
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

// Gera o objeto final
const swaggerSpec = swaggerJSDoc(options);

// Função utilizada no server.js
export function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger disponível em: http://localhost:5000/api-docs");
}

// ============================================================================
// SEÇÃO 1 — USERS (CRUD COMPLETO) — SEU CÓDIGO ORIGINAL
// ============================================================================

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: CRUD de usuários
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários cadastrados
 *
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 *
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Atualizado
 *               email:
 *                 type: string
 *                 example: novoemail@gmail.com
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

// ============================================================================
//  SEÇÃO 2 — NEWS (ROTAS DE NOTÍCIAS) — ADICIONADAS POR MIM
// ============================================================================

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Rotas públicas de notícias
 */

/**
 * @swagger
 * /api/noticias:
 *   get:
 *     summary: Lista todas as notícias
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Lista de notícias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 */

/**
 * @swagger
 * /api/noticias/{id}:
 *   get:
 *     summary: Retorna uma notícia pelo ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notícia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: Notícia não encontrada
 */
