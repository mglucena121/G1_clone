import Content from "../models/content.js";

/**
 * Criar conteúdo (já existia)
 */
export async function criarConteudo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Imagem é obrigatória." });
    }

    const { title, text, subtitle } = req.body;

    if (!title || !text) {
      return res.status(400).json({ error: "Título e texto são obrigatórios." });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const novoConteudo = await Content.create({
      title,
      subtitle,
      text,
      image: imagePath,
      author: req.user?.id, // opcional, só funciona se guardar usuário
    });

    return res.status(201).json({
      message: "Conteúdo criado com sucesso.",
      data: novoConteudo,
    });
  } catch (error) {
    console.error("Erro ao criar conteúdo:", error);
    return res.status(500).json({ error: "Erro interno ao criar conteúdo." });
  }
}

/**
 * Listar todo o conteúdo
 * Rota: GET /api/conteudo
 */
export async function listarConteudos(req, res) {
  try {
    const conteudos = await Content.find().sort({ createdAt: -1 });

    return res.status(200).json(conteudos);
  } catch (error) {
    console.error("Erro ao listar conteúdos:", error);
    return res.status(500).json({ error: "Erro ao listar conteúdos." });
  }
}

/**
 * Obter conteúdo por ID
 * Rota: GET /api/conteudo/:id
 */
export async function obterConteudo(req, res) {
  try {
    const { id } = req.params;

    const conteudo = await Content.findById(id);

    if (!conteudo) {
      return res.status(404).json({ error: "Conteúdo não encontrado." });
    }

    return res.status(200).json(conteudo);
  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error);
    return res.status(500).json({ error: "Erro ao buscar conteúdo." });
  }
}

/**
 * Deletar conteúdo
 * Rota: DELETE /api/conteudo/:id
 */
export async function deletarConteudo(req, res) {
  try {
    const { id } = req.params;

    const conteudo = await Content.findByIdAndDelete(id);

    if (!conteudo) {
      return res.status(404).json({ error: "Conteúdo não encontrado." });
    }

    return res.status(200).json({ message: "Conteúdo removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar conteúdo:", error);
    return res.status(500).json({ error: "Erro ao deletar conteúdo." });
  }
}

/**
 * Editar conteúdo
 * Rota: PUT /api/conteudo/:id
 * Com ou sem imagem
 */
export async function editarConteudo(req, res) {
  try {
    const { id } = req.params;
    const { title, text, subtitle } = req.body;

    const updateData = { title, text, subtitle };

    // Se veio imagem nova, substituímos a antiga
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const conteudoAtualizado = await Content.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!conteudoAtualizado) {
      return res.status(404).json({ error: "Conteúdo não encontrado." });
    }

    return res.status(200).json({
      message: "Conteúdo atualizado com sucesso.",
      data: conteudoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao editar conteúdo:", error);
    return res.status(500).json({ error: "Erro ao editar conteúdo." });
  }
}
