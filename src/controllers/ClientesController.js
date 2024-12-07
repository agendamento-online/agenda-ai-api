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
      const comandoSql = "SELECT * FROM clientes WHERE nome LIKE ?";

      const filtro = req.query.filtro || "";
      const [resultado] = await conexao.execute(comandoSql, [`%${filtro}%`]);
      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async buscarPorId(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql = "SELECT * FROM clientes WHERE id_cliente = ?";

      const [resultado] = await conexao.execute(comandoSql, [+req.params.id]);
      resp.send(resultado[0]);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async atualizar(req, resp) {
    try {
      const clienteEditar = req.body;

      if (!clienteEditar.id_cliente || !clienteEditar.nome || !clienteEditar.veiculo) {
        resp.status(400).send("Os campos id, nome e veículo são obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "UPDATE clientes SET nome = ?, telefone = ?, veiculo = ?, placa = ? WHERE id_cliente = ?";

      const [resultado] = await conexao.execute(comandoSql, [
        clienteEditar.nome,
        clienteEditar.telefone,
        clienteEditar.veiculo,
        clienteEditar.placa,
        +clienteEditar.id_cliente,
      ]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

    async excluir(req, resp) {
      try {
        const conexao = await new ConexaoMySql().getConexao();

        const comandoSqlDelete = "DELETE FROM clientes WHERE id_cliente = ?";
        await conexao.execute(comandoSqlDelete, [+req.params.id]);


        const comandoSqlConsulta = "SELECT * FROM clientes"
        const [resultadoConsulta] = await conexao.execute(comandoSqlConsulta)


        resp.send(resultadoConsulta);
      } catch (error) {
        resp.status(500).send(error);
      }
    }
}

export default ClientesController;
