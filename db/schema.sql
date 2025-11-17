CREATE DATABASE IF NOT EXISTS banco_alimentos CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE banco_alimentos;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(140) NOT NULL UNIQUE,
  senha VARCHAR(80) NOT NULL,
  perfil ENUM('admin','operacional') DEFAULT 'operacional'
);

CREATE TABLE IF NOT EXISTS doadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  tipo ENUM('Pessoa Física','Pessoa Jurídica') DEFAULT 'Pessoa Jurídica',
  documento VARCHAR(32),
  email VARCHAR(140),
  telefone VARCHAR(40),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS instituicoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  tipo VARCHAR(60) DEFAULT 'Creche',
  cnpj VARCHAR(18),
  email VARCHAR(140),
  telefone VARCHAR(40),
  endereco VARCHAR(200),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  categoria VARCHAR(80) DEFAULT 'Geral'
);

CREATE TABLE IF NOT EXISTS doacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doador_id INT NOT NULL,
  data_doacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacao VARCHAR(255),
  CONSTRAINT fk_doacao_doador FOREIGN KEY (doador_id) REFERENCES doadores(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS doacao_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doacao_id INT NOT NULL,
  item_id INT NOT NULL,
  quantidade DECIMAL(12,3) NOT NULL,
  unidade VARCHAR(10) NOT NULL,
  validade DATE NULL,
  lote VARCHAR(40) NULL,
  CONSTRAINT fk_di_doacao FOREIGN KEY (doacao_id) REFERENCES doacoes(id) ON DELETE CASCADE,
  CONSTRAINT fk_di_item FOREIGN KEY (item_id) REFERENCES itens(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS estoque_lotes (
  item_id INT NOT NULL,
  lote VARCHAR(40) NOT NULL,
  validade DATE NULL,
  saldo DECIMAL(12,3) NOT NULL,
  PRIMARY KEY (item_id, lote),
  CONSTRAINT fk_est_item FOREIGN KEY (item_id) REFERENCES itens(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS entregas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  instituicao_id INT NOT NULL,
  data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacao VARCHAR(255),
  CONSTRAINT fk_entrega_inst FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS entregas_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entrega_id INT NOT NULL,
  item_id INT NOT NULL,
  qtd DECIMAL(12,3) NOT NULL,
  unidade VARCHAR(10) NOT NULL,
  CONSTRAINT fk_ei_ent FOREIGN KEY (entrega_id) REFERENCES entregas(id) ON DELETE CASCADE,
  CONSTRAINT fk_ei_item FOREIGN KEY (item_id) REFERENCES itens(id) ON DELETE RESTRICT
);

CREATE OR REPLACE VIEW vw_estoque_validade AS
SELECT e.item_id, i.nome AS item, e.lote, e.validade, e.saldo,
       DATEDIFF(e.validade, CURRENT_DATE()) AS dias_para_vencer
FROM estoque_lotes e JOIN itens i ON i.id = e.item_id;

INSERT IGNORE INTO users (id,nome,email,senha,perfil) VALUES (1,'Administrador','admin@bal.org','admin','admin');

INSERT IGNORE INTO itens (id,nome,categoria) VALUES
(1,'Arroz','Grãos'),
(2,'Feijão','Grãos'),
(3,'Leite','Laticínios'),
(4,'Macarrão','Massas'),
(5,'Banana','Frutas');

INSERT IGNORE INTO doadores (id,nome,tipo,documento,email,telefone,created_at) VALUES
(1,'Supermercado Bom Preço','Pessoa Jurídica','12.345.678/0001-90','contato@bompreco.com','(43) 3333-0000', DATE_SUB(CURDATE(), INTERVAL 20 DAY)),
(2,'Atacado Central','Pessoa Jurídica','98.765.432/0001-11','vendas@atacadocentral.com','(43) 3222-1111', DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(3,'Produtor Local','Pessoa Física',NULL,'produtor@rural.com','(43) 9999-8888', DATE_SUB(CURDATE(), INTERVAL 2 DAY));

INSERT IGNORE INTO instituicoes (id,nome,tipo,cnpj,email,telefone,endereco,created_at) VALUES
(1,'Creche Pequenos Passos','Creche','11.111.111/0001-11','contato@crechepp.org','(43) 3333-1111','Rua A, 100', DATE_SUB(CURDATE(), INTERVAL 25 DAY)),
(2,'Casa Esperança','Casa de Acolhimento','22.222.222/0001-22','contato@esperanca.org','(43) 3333-2222','Rua B, 200', DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
(3,'Cozinha Solidária Centro','Cozinha Solidária','33.333.333/0001-33','contato@cozinhasolidaria.org','(43) 3333-3333','Rua C, 300', DATE_SUB(CURDATE(), INTERVAL 5 DAY));

SET @base := DATE_SUB(CURDATE(), INTERVAL 150 DAY);
INSERT INTO doacoes (id,doador_id,data_doacao,observacao) VALUES
(1,1,DATE_ADD(@base, INTERVAL 0 DAY),'Entrega mensal'),
(2,2,DATE_ADD(@base, INTERVAL 15 DAY),'Doação especial'),
(3,1,DATE_ADD(@base, INTERVAL 35 DAY),'Rotina'),
(4,3,DATE_ADD(@base, INTERVAL 65 DAY),'Feira solidária'),
(5,2,DATE_ADD(@base, INTERVAL 95 DAY),'Rotina'),
(6,1,DATE_ADD(@base, INTERVAL 125 DAY),'Campanha inverno'),
(7,2,DATE_ADD(@base, INTERVAL 140 DAY),'Campanha primavera');

INSERT INTO doacao_itens (doacao_id,item_id,quantidade,unidade,validade,lote) VALUES
(1,1,120,'kg',DATE_ADD(CURDATE(), INTERVAL 120 DAY),'A1'),
(1,2,80,'kg',DATE_ADD(CURDATE(), INTERVAL 60 DAY),'B1'),
(2,3,200,'l',DATE_ADD(CURDATE(), INTERVAL 20 DAY),'L1'),
(3,4,150,'kg',DATE_ADD(CURDATE(), INTERVAL 240 DAY),'M1'),
(4,5,100,'kg',DATE_ADD(CURDATE(), INTERVAL 7 DAY),'F1'),
(5,1,90,'kg',DATE_ADD(CURDATE(), INTERVAL 90 DAY),'A2'),
(6,2,110,'kg',DATE_ADD(CURDATE(), INTERVAL 45 DAY),'B2'),
(7,3,150,'l',DATE_ADD(CURDATE(), INTERVAL 30 DAY),'L2');

INSERT INTO estoque_lotes (item_id,lote,validade,saldo) VALUES
(1,'A1',DATE_ADD(CURDATE(), INTERVAL 120 DAY),120),
(2,'B1',DATE_ADD(CURDATE(), INTERVAL 60 DAY),80),
(3,'L1',DATE_ADD(CURDATE(), INTERVAL 20 DAY),200),
(4,'M1',DATE_ADD(CURDATE(), INTERVAL 240 DAY),150),
(5,'F1',DATE_ADD(CURDATE(), INTERVAL 7 DAY),100),
(1,'A2',DATE_ADD(CURDATE(), INTERVAL 90 DAY),90),
(2,'B2',DATE_ADD(CURDATE(), INTERVAL 45 DAY),110),
(3,'L2',DATE_ADD(CURDATE(), INTERVAL 30 DAY),150);

INSERT INTO entregas (id,instituicao_id,data,observacao) VALUES
(1,1,DATE_SUB(CURDATE(), INTERVAL 25 DAY),'Saída mensal'),
(2,2,DATE_SUB(CURDATE(), INTERVAL 15 DAY),'Apoio emergencial'),
(3,3,DATE_SUB(CURDATE(), INTERVAL 5 DAY),'Cestas de leite'),
(4,1,DATE_SUB(CURDATE(), INTERVAL 2 DAY),'Cesta semanal');

INSERT INTO entregas_itens (entrega_id,item_id,qtd,unidade) VALUES
(1,1,60,'kg'),(1,2,40,'kg'),
(2,3,100,'l'),
(3,3,80,'l'),(3,4,60,'kg'),
(4,5,40,'kg');
