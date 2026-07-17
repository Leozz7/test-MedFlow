# Design do Sistema - Módulo de Autenticação (`auth`)

Este documento define a interface do usuário (UI) e a experiência do usuário (UX) para os fluxos de login e cadastro.

## 1. Visão Visual e Layout
*   **Layout Centrado:** As telas de login e cadastro serão centralizadas vertical e horizontalmente, utilizando um fundo com gradiente sutil e moderno (ex: azul escuro e tons de roxo médico, transmitindo confiança e tecnologia).
*   **Card Elegante:** O formulário residirá dentro de um container do tipo `Paper` ou `Card` do MUI com bordas arredondadas (`borderRadius: 3`), sombra sutil (`elevation: 6`), e suporte a efeito de vidro (Glassmorphism) se desejado.
*   **Tipografia Premium:** Uso de fonte moderna (ex: *Outfit* ou *Inter*) com pesos contrastados para títulos destacados e subtextos cinzas suaves.

## 2. Componentes de UI Propostos (MUI)
*   **Card / Paper:** Para encapsular o formulário de login e registro.
*   **TextField:** Inputs customizados para e-mail e senha, com ícones decorativos de feedback visual (ex: ícone de cadeado para senha e envelope para e-mail).
*   **Button:** Botão de submissão destacado, com feedback visual de carregamento (`CircularProgress`) e efeito de elevação suave ao passar o mouse.
*   **Select / MenuItem:** Seletor moderno de perfil de usuário na tela de cadastro.
*   **Alert:** Mensagens de erro no login ou registro aparecem dentro do card como um componente `Alert` do MUI vermelho sutil.
*   **Link:** Alternar entre a tela de login e cadastro através de links de navegação estilizados e sutis.

## 3. Experiência de Interações (Micro-animações)
*   **Transição de Estados:** Quando o botão "Entrar" é clicado, o botão fica desabilitado e mostra um loader em rotação suave.
*   **Inputs Focados:** O contorno dos inputs deve transitar suavemente com a cor primária (azul médico) e o label deve deslizar para cima de forma responsiva.
*   **Responsividade:** O card do formulário deve ocupar 100% de largura em telas móveis com preenchimento lateral sutil, e limitar-se a `450px` em telas grandes.
