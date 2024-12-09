import cors from "cors";
import express from "express";
import UsuariosController from "./controllers/UsuariosController.js";
import AutenticacaoController from "./controllers/AutenticacaoController.js";
import ClientesController from "./controllers/ClientesController.js";
import AgendamentoController from "./controllers/AgendamentoController.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const _usuariosController = new UsuariosController();
const _autenticacaoController = new AutenticacaoController();
const _clientesController = new ClientesController();
const _agendamentoController = new AgendamentoController();

// rotas públicas
app.post("/login", _autenticacaoController.login);
app.post("/usuarios", _usuariosController.adicionar);

// Midleware de verificação de usuário logado

app.use((req, resp, next) => {
  const usuarioLogado = req.headers["x-usuario"];
  if (!usuarioLogado) {
    resp.status(401).send();
    return;
  }
  next();
});

// rotas privadas clientes

app.get("/clientes", _clientesController.listar);
app.get("/clientes/:id", _clientesController.buscarPorId);
app.post("/clientes", _clientesController.adicionar);
app.put("/clientes", _clientesController.atualizar);
app.delete("/clientes/:id", _clientesController.excluir);

//rotas privadas de agendamentos

app.get("/agendamentos", _agendamentoController.listar);
app.get("/agendamentos/:id", _agendamentoController.buscarPorId);
app.post("/agendamentos", _agendamentoController.adicionar);
app.put("/agendamentos", _agendamentoController.atualizar);
app.delete("/agendamentos/:id", _agendamentoController.excluir);


const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log(`API está rodando na porta ${port}`);
});
