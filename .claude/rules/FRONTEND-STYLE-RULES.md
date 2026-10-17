---
description: Regras de estilização, design visual, responsividade e acessibilidade do frontend.
paths:
  - "frontend/src/**/*.{tsx,ts,css}"
---

# Regras de Estilização do Frontend

## 1. Tecnologias de Estilização

- Utilize Tailwind CSS como principal ferramenta de estilização.
- Utilize shadcn/ui como base para componentes visuais reutilizáveis.
- Priorize os componentes existentes do projeto antes de criar novos.
- Não introduza bibliotecas de UI adicionais sem necessidade ou autorização.
- Evite CSS tradicional quando a mesma solução puder ser implementada de forma clara com Tailwind CSS.
- Utilize CSS global apenas para configurações globais, variáveis, temas e necessidades que não sejam adequadamente resolvidas com Tailwind.

## 2. Design e Identidade Visual

- Crie interfaces modernas, profissionais, consistentes e visualmente equilibradas.
- Mantenha uma identidade visual coerente em todas as páginas.
- Utilize uma hierarquia visual clara entre títulos, subtítulos, textos, ações e informações secundárias.
- Mantenha consistência em cores, tipografia, espaçamentos, bordas, sombras e arredondamentos.
- Prefira layouts limpos, com bom uso de espaços em branco e sem excesso de elementos decorativos.
- Evite interfaces genéricas, visualmente poluídas ou com aparência de templates prontos sem personalização.
- Não utilize gradientes, sombras intensas, animações ou efeitos decorativos sem uma justificativa visual.
- Não adicione emojis como ícones de interface. Prefira os ícones já utilizados pelo projeto ou uma biblioteca compatível, como Lucide.

## 3. Tailwind CSS

- Utilize as classes utilitárias do Tailwind para estruturar layouts e estilizar componentes.
- Reutilize tokens de cores e variáveis do tema sempre que disponíveis.
- Evite valores arbitrários, como `mt-[37px]` ou `text-[#123456]`, quando houver uma alternativa adequada no sistema de design.
- Evite classes duplicadas, conflitantes ou desnecessárias.
- Utilize `flex`, `grid`, `gap`, `space`, `max-width` e outras ferramentas de layout de forma consistente.
- Extraia componentes visuais reutilizáveis quando isso reduzir duplicação significativa.
- Não crie abstrações de estilização para componentes utilizados em apenas um local sem uma necessidade concreta.
- Preserve a compatibilidade com a versão do Tailwind CSS instalada no projeto.

## 4. shadcn/ui

- Utilize shadcn/ui para elementos comuns, como botões, campos, diálogos, menus, tabelas, cards, alertas e seletores.
- Preserve os padrões de acessibilidade e comportamento dos componentes existentes.
- Personalize componentes por meio de variantes, propriedades e composição sempre que possível.
- Evite modificar diretamente componentes de `components/ui` sem necessidade.
- Mantenha consistência visual entre todos os componentes da interface.
- Utilize os tokens e as variáveis CSS do tema para adaptar os componentes à identidade visual do projeto.
- Não recrie do zero um componente já fornecido pelo shadcn/ui sem uma justificativa clara.

## 5. Responsividade

- Desenvolva todas as interfaces considerando dispositivos móveis, tablets e desktops.
- Adote uma abordagem mobile-first.
- Utilize os breakpoints do Tailwind CSS de forma consistente.
- Evite larguras fixas que provoquem overflow ou prejudiquem telas menores.
- Utilize containers flexíveis, limites de largura e espaçamentos adaptáveis.
- Garanta que formulários, tabelas, menus, cards, modais e navegação funcionem em diferentes tamanhos de tela.
- Quando necessário, adapte a apresentação dos elementos para dispositivos móveis, em vez de simplesmente reduzir suas dimensões.
- Evite rolagem horizontal da página, exceto quando ela for necessária para um componente específico.

## 6. Cores e Temas

- Utilize as cores definidas no sistema de design do projeto.
- Não espalhe valores de cores isolados por diversos componentes.
- Utilize variáveis de tema para cores de fundo, texto, bordas, ações e estados.
- Mantenha contraste suficiente entre o texto e o fundo.
- Diferencie visualmente estados de sucesso, erro, alerta, informação, foco e desabilitado.
- Se houver suporte a tema claro e escuro, garanta consistência em ambos.
- Não introduza um novo sistema de cores sem necessidade.

## 7. Tipografia e Espaçamento

- Estabeleça uma hierarquia tipográfica consistente.
- Utilize tamanhos, pesos e alturas de linha adequados à função de cada texto.
- Evite textos excessivamente pequenos ou difíceis de ler.
- Mantenha espaçamentos consistentes entre seções, campos, botões e elementos relacionados.
- Evite excesso de negrito, textos em caixa alta e variações tipográficas sem propósito.
- Priorize a legibilidade e a organização do conteúdo.

## 8. Estados e Interações Visuais

- Os elementos interativos devem apresentar estados visuais claros de hover, foco, pressionado e desabilitado, quando aplicável.
- Utilize indicadores visuais de carregamento para operações demoradas.
- Garanta que mensagens de erro, sucesso e alerta sejam facilmente identificáveis.
- Evite animações excessivas ou que prejudiquem a navegação.
- Utilize transições sutis quando melhorarem a percepção de interação.
- Respeite a preferência do usuário por redução de movimento quando houver animações relevantes.
- Não dependa exclusivamente de cores para comunicar estados ou erros.

## 9. Acessibilidade Visual

- Utilize HTML semântico e mantenha a ordem visual e a ordem de navegação coerentes.
- Garanta foco visível para navegação por teclado.
- Preserve os indicadores de foco dos componentes acessíveis.
- Utilize contraste adequado para textos, ícones e controles.
- Garanta que campos de formulário tenham rótulos identificáveis.
- Não remova indicadores de foco apenas por motivos estéticos.
- Utilize ícones acompanhados de rótulos ou descrições acessíveis quando necessário.
- Não utilize apenas placeholders como substitutos de rótulos de campos.

## 10. Regras Antes de Finalizar

Antes de concluir alterações visuais:

1. Verifique a consistência com o design existente.
2. Confira a responsividade em telas pequenas e grandes.
3. Verifique alinhamentos, espaçamentos, tipografia e hierarquia visual.
4. Confira os estados de hover, foco, carregamento, erro e desabilitado, quando aplicáveis.
5. Verifique se os componentes shadcn/ui e os tokens existentes foram reutilizados corretamente.
6. Elimine estilos duplicados, conflitantes ou desnecessários.
7. Não altere regras de negócio ou a arquitetura da aplicação durante uma tarefa exclusivamente visual, salvo quando expressamente solicitado.

## Princípio Final

Toda decisão de estilização deve melhorar a clareza, a consistência, a acessibilidade ou a experiência do usuário. Prefira soluções simples e reutilizáveis, sem sacrificar a identidade visual ou a qualidade da interface.