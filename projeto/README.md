# MEDHORA — Controle de Medicamentos

O MEDHORA é uma aplicação web desenvolvida para auxiliar no gerenciamento e acompanhamento de horários de medicamentos. O sistema permite cadastrar medicamentos, organizar horários, acompanhar doses diárias e consultar o histórico de uso.

## Funcionalidades

- **Cadastro de usuários:** criação de conta e acesso ao sistema.
- **Login:** autenticação e controle de sessão.
- **Dashboard:** visão geral das informações e acompanhamento.
- **Cadastro de medicamentos:** inclusão de medicamentos e suas configurações.
- **Edição e exclusão:** gerenciamento dos medicamentos cadastrados.
- **Acompanhamento diário:** visualização das doses previstas para o dia.
- **Controle de doses:** registro do status das doses.
- **Agendamento de doses:** geração de ocorrências conforme os horários e intervalos configurados.
- **Histórico:** acompanhamento das doses e filtragem por medicamentos, status e período.
- **Validações:** prevenção de dados inválidos e inconsistências.
- **Navegação protegida:** restrição de acesso às páginas internas para usuários não autenticados.
- **Página de erro 404:** tratamento de rotas inexistentes.

## Tecnologias utilizadas

- Vue 3
- JavaScript
- Vite
- Vue Router
- Vitest
- CSS
- Material Design Icons

## Requisitos

Para executar o projeto localmente, é necessário ter instalado:

- Node.js
- npm

## Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git https://github.com/IranSousa18/MedHora
cd projeto
```

Instale as dependências:

```bash
npm install
```

## Executando o projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Após iniciar, acesse o endereço exibido no terminal, normalmente:

http://localhost:5173

## Testes automatizados

O projeto utiliza Vitest para executar testes automatizados.

Execute:

```bash
npm test
```

Os testes verificam funcionalidades relacionadas a:

- Geração e recalculação de ocorrências.
- Regras de horários e doses.
- Persistência e gerenciamento de medicamentos.
- Validações e operações relacionadas à autenticação.

## Compilação para produção

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist`.

## Visualização da versão de produção

Após gerar a compilação, é possível visualizar a versão de produção localmente:

```bash
npm run preview
```

## Estrutura do projeto

```text
src/
├── assets/
│   └── styles/
├── components/
│   ├── history/
│   ├── home/
│   ├── medicines/
│   ├── shared/
│   └── today/
├── router/
├── services/
├── views/
├── App.vue
├── main.js
└── style.css
```

### Organização

- `components/`: componentes reutilizáveis da interface.
- `assets/styles/`: estilos da aplicação.
- `router/`: gerenciamento de rotas e navegação.
- `services/`: regras de negócio, armazenamento e gerenciamento de dados.
- `views/`: páginas da aplicação.
- `App.vue`: componente raiz.
- `main.js`: inicialização da aplicação.

## Persistência e limitações

O MEDHORA utiliza armazenamento local do navegador para persistência de dados, não possuindo atualmente um backend ou banco de dados remoto integrado.

Os dados podem ficar restritos ao navegador e dispositivo utilizados.

A autenticação é implementada localmente e possui finalidade demonstrativa. Não deve ser considerada um sistema de autenticação seguro para uso em produção, pois as credenciais não são protegidas por um backend especializado.

## Status do projeto

Projeto desenvolvido com foco no gerenciamento de medicamentos, organização de horários, acompanhamento de doses e histórico de utilização.

O projeto conta com testes automatizados e validação de compilação para produção.
