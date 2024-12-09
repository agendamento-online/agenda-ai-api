import ConexaoMySql from "../database/ConexaoMySql.js";

class AgendamentoController {
  async adicionar(req, resp) {
    try {
      const novoAgendamento = req.body;

      if (
        !novoAgendamento.clienteSelecionado ||
        !novoAgendamento.data ||
        !novoAgendamento.tempo ||
        !novoAgendamento.servico
      ) {
        resp.status(400).send("Todos os campos são obrigatórios!");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "INSERT INTO agendamento (data_servico, horario, servico, cliente_id) VALUES ( ?, ?, ?, ?)";

      const [resultado] = await conexao.execute(comandoSql, [
        novoAgendamento.data,
        novoAgendamento.tempo,
        novoAgendamento.servico,
        novoAgendamento.clienteSelecionado,
      ]);
      resp.send(resultado);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        resp.status(400).send("Data e hora já agendados.");
        return;
      }
      resp.status(500).send(error);
    }
  }

  async listar(req, resp) {
    try {
      const novoAgendamento = req.headers["x-usuario"];
      console.log(novoAgendamento);

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "SELECT * FROM agendamento WHERE id_agendamento LIKE ?";

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
      const comandoSql = "SELECT * FROM agendamento WHERE id_agendamento = ?";

      const [resultado] = await conexao.execute(comandoSql, [+req.params.id]);
      resp.send(resultado[0]);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async atualizar(req, resp) {
    try {
      const agendamentoEditar = req.body;

      if(!agendamentoEditar.data_servico || !agendamentoEditar.horario || !agendamentoEditar.servico){
        resp.status(400).send("Todos os campos são obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql = "UPDATE agendamento SET data_servico = ?, horario = ?, servico = ? WHERE id_agendamento = ?";

      const [resultado] = await conexao.execute(comandoSql, [
        agendamentoEditar.data_servico,
        agendamentoEditar.horario,
        agendamentoEditar.servico,
        +agendamentoEditar.id_agendamento,
      ]);

      resp.send(resultado);
    } catch (error) {
        resp.status(500).send(error)
    }
  }

  async excluir(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();

      const comandoSqlDelete = "DELETE FROM agendamento WHERE id_agendamento = ?";
      await conexao.execute(comandoSqlDelete, [+req.params.id]);


      const comandoSqlConsulta = "SELECT * FROM agendamento"
      const [resultadoConsulta] = await conexao.execute(comandoSqlConsulta)


      resp.send(resultadoConsulta);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default AgendamentoController;