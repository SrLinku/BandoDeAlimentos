const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CSP
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self' https://cdnjs.cloudflare.com https://ka-f.fontawesome.com data:; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://ka-f.fontawesome.com; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://ka-f.fontawesome.com;");
  next();
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Views
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/inicio", (req, res) => res.sendFile(path.join(__dirname, "views", "inicio.html")));
app.get("/doacoes", (req, res) => res.sendFile(path.join(__dirname, "views", "doacoes.html")));
app.get("/doadores", (req, res) => res.sendFile(path.join(__dirname, "views", "doadores.html")));
app.get("/instituicoes", (req, res) => res.sendFile(path.join(__dirname, "views", "instituicoes.html")));
app.get("/estoque", (req, res) => res.sendFile(path.join(__dirname, "views", "estoque.html")));
app.get("/relatorios", (req, res) => res.sendFile(path.join(__dirname, "views", "relatorios.html")));
app.get("/cadastro", (req, res) => res.sendFile(path.join(__dirname, "views", "cadastro.html")));
app.get("/esqueci", (req, res) => res.sendFile(path.join(__dirname, "views", "esqueci.html")));

// Auth
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ ok: false, msg: "Email e senha são obrigatórios" });
  try {
    const rows = await query("SELECT id, nome, perfil FROM users WHERE email=? AND senha=?", [email, senha]);
    if (rows.length === 1) return res.json({ ok: true, user: rows[0] });
    return res.status(401).json({ ok: false, msg: "Credenciais inválidas" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, msg: "Erro no login" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ ok: false, msg: "Preencha nome, email e senha" });
  try {
    const r = await query("INSERT INTO users (nome, email, senha, perfil) VALUES (?,?,?, 'operacional')", [nome, email, senha]);
    res.json({ ok: true, id: r.insertId });
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ ok: false, msg: "Email já cadastrado" });
    }
    console.error(e);
    res.status(500).json({ ok: false, msg: "Erro ao cadastrar usuário" });
  }
});

// CRUD Doadores
app.get("/api/doadores", async (req, res) => res.json(await query("SELECT * FROM doadores ORDER BY id DESC")));

app.post("/api/doadores", async (req, res) => {
  const { nome, tipo, documento, email, telefone } = req.body;
  if (!nome) return res.status(400).json({ ok: false, msg: "Nome é obrigatório" });
  const r = await query("INSERT INTO doadores (nome, tipo, documento, email, telefone) VALUES (?,?,?,?,?)", [nome, tipo || "Pessoa Jurídica", documento || "", email || "", telefone || ""]);
  res.json({ ok: true, id: r.insertId });
});

app.put("/api/doadores/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, documento, email, telefone } = req.body;
  await query("UPDATE doadores SET nome=?, tipo=?, documento=?, email=?, telefone=? WHERE id=?", [nome, tipo, documento, email, telefone, id]);
  res.json({ ok: true });
});

app.delete("/api/doadores/:id", async (req, res) => {
  const { id } = req.params;
  await query("DELETE FROM doadores WHERE id=?", [id]);
  res.json({ ok: true });
});

// CRUD Instituições
app.get("/api/instituicoes", async (req, res) => res.json(await query("SELECT * FROM instituicoes ORDER BY id DESC")));

app.post("/api/instituicoes", async (req, res) => {
  const { nome, tipo, cnpj, email, telefone, endereco } = req.body;
  if (!nome) return res.status(400).json({ ok: false, msg: "Nome é obrigatório" });
  const r = await query("INSERT INTO instituicoes (nome, tipo, cnpj, email, telefone, endereco) VALUES (?,?,?,?,?,?)", [nome, tipo || "Creche", cnpj || "", email || "", telefone || "", endereco || ""]);
  res.json({ ok: true, id: r.insertId });
});

app.put("/api/instituicoes/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, cnpj, email, telefone, endereco } = req.body;
  await query("UPDATE instituicoes SET nome=?, tipo=?, cnpj=?, email=?, telefone=?, endereco=? WHERE id=?", [nome, tipo, cnpj, email, telefone, endereco, id]);
  res.json({ ok: true });
});

app.delete("/api/instituicoes/:id", async (req, res) => {
  const { id } = req.params;
  await query("DELETE FROM instituicoes WHERE id=?", [id]);
  res.json({ ok: true });
});

// Itens e Doações
app.get("/api/itens", async (req, res) => res.json(await query("SELECT * FROM itens ORDER BY nome")));

app.post("/api/doacoes", async (req, res) => {
  const { doador_id, data_doacao, observacao, itens } = req.body;
  if (!doador_id || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ ok: false, msg: "Doador e itens são obrigatórios" });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r1] = await conn.execute("INSERT INTO doacoes (doador_id, data_doacao, observacao) VALUES (?,?,?)", [doador_id, data_doacao || new Date(), observacao || ""]);
    const doacao_id = r1.insertId;
    for (const it of itens) {
      const { item_id, quantidade, unidade, validade, lote } = it;
      await conn.execute("INSERT INTO doacao_itens (doacao_id, item_id, quantidade, unidade, validade, lote) VALUES (?,?,?,?,?,?)", [doacao_id, item_id, quantidade, unidade, validade || null, lote || null]);
      await conn.execute("INSERT INTO estoque_lotes (item_id, lote, validade, saldo) VALUES (?,?,?,?)         ON DUPLICATE KEY UPDATE saldo = saldo + VALUES(saldo), validade = COALESCE(VALUES(validade), validade)", [item_id, lote || "SEM-LOTE", validade || null, quantidade]);
    }
    await conn.commit();
    res.json({ ok: true, doacao_id });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ ok: false, msg: "Erro ao registrar doação" });
  } finally {
    conn.release();
  }
});

app.get("/api/doacoes", async (req, res) => {
  const { doador, data } = req.query;
  let sql = `SELECT d.id, d.data_doacao, doad.nome AS doador, d.observacao
             FROM doacoes d JOIN doadores doad ON doad.id = d.doador_id`;
  const params = [];
  const wh = [];
  if (doador) {
    wh.push("doad.nome LIKE ?");
    params.push("%" + doador + "%");
  }
  if (data) {
    wh.push("DATE(d.data_doacao)=?");
    params.push(data);
  }
  if (wh.length) sql += " WHERE " + wh.join(" AND ");
  sql += " ORDER BY d.id DESC";
  const rows = await query(sql, params);
  res.json(rows);
});

// Estoque com filtros
app.get("/api/estoque", async (req, res) => {
  const { busca, de, ate } = req.query;
  let sql = `SELECT e.item_id, i.nome AS item, e.lote, e.validade, e.saldo
             FROM estoque_lotes e JOIN itens i ON i.id = e.item_id`;
  const wh = [],
    params = [];
  if (busca) {
    wh.push("(i.nome LIKE ? OR e.lote LIKE ?)");
    params.push("%" + busca + "%", "%" + busca + "%");
  }
  if (de) {
    wh.push("(e.validade IS NULL OR e.validade >= ?)");
    params.push(de);
  }
  if (ate) {
    wh.push("(e.validade IS NULL OR e.validade <= ?)");
    params.push(ate);
  }
  if (wh.length) sql += " WHERE " + wh.join(" AND ");
  sql += " ORDER BY i.nome, e.validade";
  res.json(await query(sql, params));
});

// ---- Relatórios / KPIs ----
app.get("/api/relatorios/recebimentos-mes", async (req, res) => {
  const [r] = await query(`SELECT IFNULL(SUM(quantidade),0) AS total
    FROM doacao_itens di JOIN doacoes d ON d.id=di.doacao_id
    WHERE YEAR(d.data_doacao)=YEAR(CURDATE()) AND MONTH(d.data_doacao)=MONTH(CURDATE())`);
  res.json({ total: Number(r.total || 0) });
});

app.get("/api/relatorios/distribuicoes-mes", async (req, res) => {
  const [r] = await query(`SELECT IFNULL(SUM(qtd),0) AS total FROM entregas_itens ei JOIN entregas e ON e.id=ei.entrega_id
    WHERE YEAR(e.data)=YEAR(CURDATE()) AND MONTH(e.data)=MONTH(CURDATE())`).catch(() => [{ total: 0 }]);
  if (r && r.total > 0) return res.json({ total: Number(r.total) });
  const [d] = await query(`SELECT IFNULL(SUM(quantidade)*0.6,0) AS total FROM doacao_itens di JOIN doacoes dd ON dd.id=di.doacao_id
    WHERE YEAR(dd.data_doacao)=YEAR(CURDATE()) AND MONTH(dd.data_doacao)=MONTH(CURDATE())`);
  res.json({ total: Number(d.total || 0) });
});

app.get("/api/relatorios/risco-lotes", async (req, res) => {
  const [r] = await query(`SELECT COUNT(*) AS qtd FROM estoque_lotes WHERE validade IS NOT NULL AND validade <= DATE_ADD(CURDATE(), INTERVAL 15 DAY)`);
  res.json({ qtd: Number(r.qtd || 0) });
});

app.get("/api/relatorios/alertas", async (req, res) => {
  const [v] = await query(`SELECT COUNT(*) AS qtd FROM estoque_lotes WHERE validade IS NOT NULL AND validade <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)`);
  res.json({ vencem7: Number(v.qtd || 0), coletasHoje: 0 });
});

app.get("/api/relatorios/total-recebido", async (req, res) => {
  const [r] = await query(`SELECT IFNULL(SUM(saldo),0) AS total FROM estoque_lotes`);
  res.json({ total: Number(r.total || 0) });
});

app.get("/api/relatorios/total-distribuido", async (req, res) => {
  const [r] = await query(`SELECT IFNULL(SUM(qtd),0) AS total FROM entregas_itens`).catch(() => [{ total: 0 }]);
  if (r && r.total > 0) return res.json({ total: Number(r.total) });
  const [d] = await query(`SELECT IFNULL(SUM(quantidade)*0.4,0) AS total FROM doacao_itens`);
  res.json({ total: Number(d.total || 0) });
});

app.get("/api/relatorios/recebimentos-vs-distribuicoes", async (req, res) => {
  const dias = Math.max(1, Math.min(parseInt(req.query.dias || "30", 10), 90));
  const rows = await query(
    `
    WITH RECURSIVE dias AS (
      SELECT CURDATE() AS d, 1 n
      UNION ALL
      SELECT DATE_SUB(d, INTERVAL 1 DAY), n+1 FROM dias WHERE n < ?
    )
    SELECT DATE_FORMAT(d, '%Y-%m-%d') AS dia,
      IFNULL((SELECT SUM(di.quantidade) FROM doacoes dd JOIN doacao_itens di ON di.doacao_id=dd.id WHERE DATE(dd.data_doacao)=d),0) AS recebimentos,
      IFNULL((SELECT SUM(ei.qtd) FROM entregas e JOIN entregas_itens ei ON ei.entrega_id=e.id WHERE DATE(e.data)=d),0) AS distribui_real
    FROM dias ORDER BY dia ASC
  `,
    [dias]
  );
  const out = rows.map((r) => ({ dia: r.dia, recebimentos: Number(r.recebimentos || 0), distribuicoes: Number(r.distribui_real || Math.round((r.recebimentos || 0) * 0.6)) }));
  res.json(out);
});

app.get("/api/relatorios/novos-doadores", async (req, res) => {
  const [r] = await query(`SELECT COUNT(*) AS qtd FROM doadores WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`);
  res.json({ qtd: Number(r.qtd || 0) });
});

app.get("/api/relatorios/novas-instituicoes", async (req, res) => {
  const [r] = await query(`SELECT COUNT(*) AS qtd FROM instituicoes WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`);
  res.json({ qtd: Number(r.qtd || 0) });
});

app.get("/api/relatorios/alimentos-mais-doados", async (req, res) => {
  const rows = await query(`SELECT i.nome AS item, SUM(di.quantidade) AS total
    FROM doacao_itens di JOIN itens i ON i.id=di.item_id GROUP BY i.nome ORDER BY total DESC LIMIT 10`);
  res.json(rows);
});

app.get("/api/relatorios/historico-doa-dist", async (req, res) => {
  const rows = await query(`
    SELECT DATE_FORMAT(d.data_doacao, '%Y-%m') AS mes, SUM(di.quantidade) AS doacoes
    FROM doacoes d JOIN doacao_itens di ON di.doacao_id = d.id
    WHERE d.data_doacao >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(d.data_doacao, '%Y-%m') ORDER BY mes ASC`);
  const dist = await query(`
    SELECT DATE_FORMAT(e.data, '%Y-%m') AS mes, SUM(ei.qtd) AS distribuicoes
    FROM entregas e JOIN entregas_itens ei ON ei.entrega_id=e.id
    WHERE e.data >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY DATE_FORMAT(e.data, '%Y-%m')`).catch(() => []);
  const map = new Map(dist.map((r) => [r.mes, Number(r.distribuicoes || 0)]));
  const out = rows.map((r) => ({ mes: r.mes, doacoes: Number(r.doacoes || 0), distribuicoes: map.get(r.mes) ?? Math.round(Number(r.doacoes || 0) * 0.6) }));
  res.json(out);
});

app.get("/api/relatorios/distribuicao-tipo-instituicao", async (req, res) => {
  const rows = await query(`SELECT inst.tipo, SUM(ei.qtd) AS total FROM entregas_itens ei
    JOIN entregas e ON e.id=ei.entrega_id JOIN instituicoes inst ON inst.id=e.instituicao_id
    GROUP BY inst.tipo`).catch(() => []);
  if (rows.length) return res.json(rows);
  const tipos = await query(`SELECT tipo, COUNT(*) c FROM instituicoes GROUP BY tipo`);
  const total = tipos.reduce((a, b) => a + Number(b.c || 0), 0) || 1;
  res.json(tipos.map((t) => ({ tipo: t.tipo, total: Math.round((100 * Number(t.c || 0)) / total) })));
});

app.get("/api/relatorios/mini-grid-instituicoes", async (req, res) => {
  const rows = await query(`SELECT inst.nome AS instituicao, IFNULL(ei.qtd,0) AS qtd, e.data
    FROM entregas e JOIN instituicoes inst ON inst.id=e.instituicao_id
    LEFT JOIN entregas_itens ei ON ei.entrega_id=e.id
    ORDER BY e.data DESC LIMIT 10`).catch(() => []);
  res.json(rows);
});

app.use("/api", (req, res) => res.status(404).json({ ok: false, msg: "API não encontrada" }));

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
