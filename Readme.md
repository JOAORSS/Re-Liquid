# ⚡ Re-Liquid: Shopify + React

Um motor de build de alto desempenho para criar temas Shopify utilizando **React (TypeScript)** e **Vite**, sem perder os recursos nativos do painel da Shopify (Theme Settings, Blocos Dinâmicos e Liquid Run-time).

A arquitetura do ShinyStorm rompe com o padrão tradicional de desenvolvimento Shopify. Em vez de injetar objetos JSON gigantes de estado global ou depender de bibliotecas pesadas de CSS-in-JS, este motor utiliza compilação cirúrgica com macros no Vite e injeção direta de Liquid nativo.

## 🚀 Principais Recursos

* **Ilhas React Independentes:** Cada seção da Shopify é compilada como um arquivo isolado (IIFE) pelo Vite, mantendo o bundle final minúsculo.
* **Liquid Macros no React:** Acesso a variáveis do servidor da Shopify diretamente no código TypeScript via funções utilitárias que são transformadas no tempo de compilação.
* **Schema Fusion Automático:** Suporte nativo para Blocos (Blocks) da Shopify através de uma arquitetura de pastas. O motor lê os componentes filhos e os aninha automaticamente no schema do pai.
* **Design Tokens via CSS Variables:** Um sistema de tipografia e cores gerenciado pelo lojista no painel da Shopify, consumido de forma assíncrona nativa (`var(--token)`) pelo React sem recompilação.
* **Tipagem Automática:** Um *watcher* que escuta os arquivos `.schema.json` e gera interfaces TypeScript automáticas para as `props` dos seus componentes.

---

## 🏗️ Arquitetura do Motor

O ciclo de vida do build do ShinyStorm passa por três etapas principais orquestradas pelo Node.js:

1. **Vite Bundler (Build-time):** Transforma o código JSX/TSX em JavaScript clássico e minifica o CSS. Um plugin customizado (`liquid-macro`) varre o código procurando por funções `injectLiquid()` e as substitui por marcadores seguros.
2. **Shopify Injector (Node.js):** Lê os arquivos minificados gerados pelo Vite. Ele cria o arquivo `.liquid` final, substituindo os marcadores seguros pelas tags nativas do Liquid (`{{ variavel | json }}`). 
3. **Shopify Server (Run-time):** O servidor da loja processa o Liquid, inserindo os dados dinâmicos no código antes de entregar ao navegador, garantindo que o JavaScript não quebre e o React monte a árvore instantaneamente.

---

## 📂 Estrutura de Componentes

O motor de *Schema Fusion* permite que seções e blocos sejam modulares. Para criar uma seção com blocos, basta seguir a hierarquia de pastas:

src/components/
└── adbar/                   # Componente Pai (Section)
    ├── adbar.tsx
    ├── adbar.css
    ├── adbar.schema.json
    └── blocks/              # Pasta Mágica para subcomponentes
        └── announcement/    # Componente Filho (Block)
            ├── announcement.tsx
            └── announcement.schema.json

*O script de build funde automaticamente o `announcement.schema.json` para dentro do array de blocos do `adbar.schema.json` e injeta a constante `props.blocks` via Liquid no arquivo final.*

---

## 🛠️ Como Funciona: A Mágica do Liquid no TypeScript

No ecossistema ShinyStorm, você não passa o estado global da loja via props. Você "puxa" os dados do servidor sob demanda usando a ponte de macros.

import React from 'react';
import { injectLiquid, injectRaw } from '../../utils/shopify';

export function Header(props: any) {
    // 1. Injetando variáveis puras (Strings, Numbers, Booleans)
    const shopName = injectLiquid<string>("shop.name | link_to: routes.root_url | json");
    const cartCount = injectLiquid<number>("cart.item_count | json");
    
    // 2. Injetando Lógica Liquid Pura (Arrays, Loops e Condicionais)
    const menuLinks = injectRaw<any[]>(`
        {%- if section.settings.menu -%} 
            [
                {%- for link in linklists[section.settings.menu].links -%} 
                    { "title": {{ link.title | json }}, "url": {{ link.url | json }} } 
                    {%- unless forloop.last -%},{%- endunless -%} 
                {%- endfor -%}
            ] 
        {%- else -%} 
            [] 
        {%- endif -%}
    `);

    return (
        <header>
            <h2>{shopName}</h2>
            <div className="menu">
                {menuLinks.map(link => (
                    <a href={link.url}>{link.title}</a>
                ))}
            </div>
        </header>
    );
}

Durante o build, essas funções são eliminadas e o Vite gera uma string segura. O Node.js finaliza envelopando o Liquid, entregando a lógica pronta para o render do navegador.

---

## 🎨 Design System e Tokens

O tema foi planejado com escalabilidade visual. Não há dependências de `styled-components` ou CSS-in-JS.

1. As configurações (Cores, Fontes, Radius, Espaçamento) ficam no arquivo `config/settings_schema.json` para o lojista editar no painel da Shopify.
2. O arquivo `layout/theme.liquid` (ou `snippets/css-variables.liquid`) captura as preferências e as converte em propriedades `:root`.
3. O CSS do React consome os tokens nativamente, refletindo alterações instantaneamente sem necessidade de rodar o build:

.adbar {
    background-color: var(--plum);
    color: var(--pearl);
    padding: var(--space-2) 0;
    border-radius: var(--radius-sm);
}

---

## 💻 CLI e Scripts de Build

Todos os scripts estão desacoplados para máxima previsibilidade. O orquestrador principal encontra-se em `scripts/build.js`.

| Comando | Descrição |
|---|---|
| npm run build | Roda todo o pipeline (Types -> Vite -> Shopify Injector) para todos os componentes. |
| npm run build -- <nome> | Roda todo o pipeline exclusivamente para o componente específico (ex: -- main-header), muito mais rápido para desenvolvimento isolado. |
| npm run watch:types | Fica observando os arquivos `.schema.json`. Ao serem salvos, gera o arquivo TypeScript `.types.ts` atualizado. |
| npm run lint | Checa padronização do código via ESLint. |

---

**Desenvolvido para criar a melhor experiência tanto para o usuário final quanto para a equipe de desenvolvimento. 🥂**