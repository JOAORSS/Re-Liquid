# shiny-pdp

Motor de fusão React → Liquid para Shopify. Componentes React compilam para `.liquid` via pipeline de build customizado.

## Stack
- React + TypeScript + Vite
- Linaria (CSS-in-JS) + CSS plano
- Build pipeline: `build-vite.js` → `build-shopify.js` → `build-types.js` → `build-schemas.js`

## Comandos
```bash
npm run build              # pipeline completo
npm run build -- hero      # compila só um componente (mais rápido)
npm run watch              # rebuild automático ao salvar
npm run watch:types        # regenera .types.d.ts ao mudar .schema.json
```

## Estrutura de componente (padrão 4 arquivos)
```
src/components/hero/
├── hero.tsx              # componente React
├── hero.schema.json      # settings Shopify
├── hero.css              # estilos (opcional)
└── hero.types.d.ts       # gerado automaticamente via schema
```

Componentes com blocos têm uma pasta `blocks/` — cada subpasta vira um block Shopify e é mergeado no schema pai automaticamente.

## injectLiquid — o macro principal

Definido em `src/util/shopify.ts`. É um **macro de compile-time**, não roda no browser.

```typescript
injectLiquid<T>(liquidString: string): T       // para valores simples e filtros
injectLiquidRaw<T>(liquidString: string): T    // para lógica com loops/condicionais
```

**Como funciona:** O build substitui a chamada pelo token `[[LIQUID_..._LIQUID]]`, e o `build-shopify.js` reverte para `{{ ... }}` Liquid antes de escrever o `.liquid`.

**Exemplos:**
```typescript
// valor simples
const speed = injectLiquid<number>("section.settings.marquee_speed | json | default: 70");

// string traduzida
const title = injectLiquid<string>(`'cart.title' | t | json`);

// lógica complexa com loop
const menus = injectLiquidRaw<NavLink[]>(`
    {%- assign menu = linklists[settings.menu] -%}
    {%- if menu -%}
        [{%- for link in menu.links -%}
            {"title": {{ link.title | json }}, "url": "{{ link.url }}"}
            {%- unless forloop.last -%},{%- endunless -%}
        {%- endfor -%}]
    {%- else -%}[]
    {%- endif -%}
`);
```

## Types

- `*.types.d.ts` → gerados automaticamente do schema, **não editar manualmente**
- `src/types/` → tipos globais compartilhados (ShopifyData, store, filtros, nav)

## Convenções
- Componentes prefixados com `$` são snippets (ex: `$context`)
- Componentes prefixados com `_` são privados/internos
- CSS usa classes BEM plain — sem CSS Modules
- React/ReactDOM são externos (carregados pelo Shopify CDN)
- Cada componente é um IIFE isolado — sem bundle compartilhado
