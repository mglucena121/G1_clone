# 📰 Portal de Notícias Digital

Este repositório contém um **portal de notícias digital** desenvolvido como **projeto pessoal**, com foco no aprendizado prático e na aplicação de **tecnologias modernas de desenvolvimento web**, seguindo boas práticas de mercado tanto no front-end quanto no back-end.

---

## 🚀 Visão Geral

O sistema permite a criação, edição e visualização de notícias, com **controle de acesso por tipo de usuário**. O portal conta com três níveis principais de permissão:

* **Administrador**: possui acesso total ao sistema, com controle geral das notícias e **gerenciamento de usuários**;
* **Publicador**: pode **criar, editar e gerenciar apenas as suas próprias notícias**;
* **Leitor**: tem acesso somente à visualização das publicações disponíveis no portal.

O projeto foi pensado para simular um ambiente real de produção, incluindo autenticação, **documentação de API**, **gerenciamento de mídia** e regras claras de permissão por perfil de usuário.

---

## 🖥️ Tecnologias Utilizadas

### Front-end

* **React** – Interface dinâmica e componentizada
* **Tailwind CSS** – Estilização moderna, responsiva e customizável
* **TinyMCE** – Editor de texto rico para criação e edição de matérias

### Back-end

* **Node.js**
* **Express** – Criação da API REST
* **JWT (JSON Web Token)** – Autenticação e controle de sessão
* **Swagger** – Documentação interativa da API
* **MongoDB Atlas** – Banco de dados NoSQL em nuvem

### Armazenamento de Imagens

* **Firebase Storage** – Upload de imagens e geração de URLs públicas para uso nas notícias

---

## 🔐 Funcionalidades Principais

* Autenticação de usuários via **JWT**
* Sistema de **login e sessão** para usuários com permissão de publicação
* Controle de permissões por nível de usuário:

  * **Administrador**: cria, edita e remove notícias, além de gerenciar usuários
  * **Publicador**: cria e edita **apenas as próprias notícias**
  * **Leitor**: visualiza as matérias publicadas
* Editor de texto profissional para produção de conteúdo
* Upload e gerenciamento de imagens
* API REST documentada com **Swagger**
* Layout responsivo e moderno

---

## 📚 Documentação da API

A API do projeto está documentada utilizando **Swagger**, permitindo visualizar e testar os endpoints de forma prática.

Após iniciar o back-end, a documentação pode ser acessada em:

```
http://localhost:PORT/api-docs
```

---

## 📦 Instalação e Execução (Resumo)

### Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

### Back-end

```bash
cd backend
npm install
npm run start
```

### Front-end

```bash
cd frontend
npm install
npm run dev
```

> ⚠️ É necessário configurar as variáveis de ambiente (MongoDB, JWT e Firebase) antes de executar o projeto.

---

## 🎯 Objetivo do Projeto

Este projeto tem como principal objetivo **consolidar conhecimentos práticos** em desenvolvimento web full stack, explorando conceitos como:

* Arquitetura de aplicações
* Autenticação e segurança
* Integração entre front-end e back-end
* Gerenciamento de mídia
* Boas práticas de código e versionamento

---

## 🌐 Divulgação

O projeto está versionado neste repositório do **GitHub** e também é compartilhado no **LinkedIn** como parte do meu portfólio e evolução profissional.

---

**Autor:** [Mário Gomes](https://www.linkedin.com/in/m%C3%A1rio-gomes-7b59b71b9/)

