# Receitas Angular - visual Figma com Painel Admin

Projeto Angular standalone com o visual do ZIP `Website for Recipes.zip` adaptado para a estrutura do projeto `receitas-main-main`.

## Como rodar

No PowerShell do Windows, prefira os comandos com `.cmd`:

```bash
npm.cmd install
npm.cmd start
```

No CMD, Mac ou Linux:

```bash
npm install
npm start
```

Depois acesse:

```text
http://localhost:4200
```

Se a porta 4200 estiver ocupada:

```bash
npx.cmd ng serve --port 4201
```

E acesse:

```text
http://localhost:4201
```

## Rotas principais

```text
/          Página inicial
/receitas  Vitrine de receitas
/login     Login
/cadastro  Cadastro
/admin     Painel administrativo
```

## O que foi adaptado

- Página inicial no estilo do Figma.
- Página de receitas em Angular com busca, filtros, cards e modal.
- Painel administrativo inspirado no Figma/React:
  - sidebar recolhível;
  - topbar com busca e usuário;
  - dashboard com métricas;
  - receitas recentes;
  - atividade recente;
  - banner de receita em alta;
  - aba Minhas Receitas;
  - modal de visualização;
  - confirmação de exclusão;
  - aba Perfil;
  - aba Configurações com toggles animados.
- Animações recriadas em CSS/Angular, sem depender de React, Vite ou Framer Motion.
- Navbar atualizada com link para o Painel Admin.
- Login redirecionando para `/admin` após autenticação.
- `npm run build` validado neste ambiente.

## Observação técnica

O código do Figma estava em React/Vite com Tailwind e `motion/react`. Como este projeto-base é Angular, a adaptação foi feita em HTML/CSS/TypeScript Angular, mantendo a mesma intenção visual e interativa do painel, mas sem misturar runtime React dentro do Angular.
