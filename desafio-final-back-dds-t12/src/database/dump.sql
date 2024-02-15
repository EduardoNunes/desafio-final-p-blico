create table usuarios(
	id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null, 
  cpf text, 
  telefone int
);

create table clientes(
	id serial primary key,
  nome text not null,
  email text not null,
  cpf text not null,
  telefone text not null,
  status text,
  cep text,
  endereco text,
  complemento text,
  bairro text,
  cidade text,
  uf varchar(2),
 	usuario_id int,
  foreign key (usuario_id) references usuarios(id)
);

alter table clientes alter column status set default 'Em Dia';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE cobrancas (
    id_cob uuid DEFAULT uuid_generate_v4(), 
    valor int not null, 
  	data_registro timestamp DEFAULT CURRENT_TIMESTAMP,
    data_venc date not null, 
    status text not null, 
    descricao text not null,
    cliente_id int,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);