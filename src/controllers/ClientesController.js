import ConexaoMySql from "../database/ConexaoMySql.js";

class ClientesController {
  async adicionar(req, resp) {
    try {
      const novoCliente = req.body;

      if (!novoCliente.nome || !novoCliente.veiculo) {
        resp.status(400).send("Os campos nome, veículo são obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "INSERT INTO clientes (nome, telefone, veiculo, placa) VALUES (?, ?, ?, ?)";

      const [resultado] = await conexao.execute(comandoSql, [
        novoCliente.nome,
        novoCliente.telefone,
        novoCliente.veiculo,
        novoCliente.placa,
      ]);

      resp.send(resultado);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        resp.status(400).send("Placa e/ou telefone já cadastrado.");
        return;
      }
      resp.status(500).send(error);
    }
  }

  async listar(req, resp) {
    try {
      const usuarioLogado = req.headers["x-usuario"];
      console.log(usuarioLogado);

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql = "SELECT * FROM clientes WHERE nome_cliente LIKE ?";

      const filtro = req.query.filtro || "";
      const [resultado] = await conexao.execute(comandoSql, [`%${filtro}%`]);
      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  //   async atualizar(req, resp) {
  //     try {
  //       const usuarioEditar = req.body;

  //       if (!usuarioEditar.id || !usuarioEditar.nome || !usuarioEditar.email) {
  //         resp.status(400).send("Os campos id, nome e email são obrigatórios.");
  //         return;
  //       }

  //       const conexao = await new ConexaoMySql().getConexao();
  //       const comandoSql =
  //         "UPDATE usuarios SET nome = ?, email = ?, foto = ? WHERE id = ?";

  //       const [resultado] = await conexao.execute(comandoSql, [
  //         usuarioEditar.nome,
  //         usuarioEditar.email,
  //         usuarioEditar.foto || null,
  //         usuarioEditar.id,
  //       ]);

  //       resp.send(resultado);
  //     } catch (error) {
  //       resp.status(500).send(error);
  //     }
  //   }

  //   async excluir(req, resp) {
  //     try {
  //       const conexao = await new ConexaoMySql().getConexao();

  //       const comandoSql = "DELETE FROM usuarios WHERE id = ?";
  //       const [resultado] = await conexao.execute(comandoSql, [+req.params.id]);

  //       resp.send(resultado);
  //     } catch (error) {
  //       resp.status(500).send(error);
  //     }
  //   }
}

export default ClientesController;
