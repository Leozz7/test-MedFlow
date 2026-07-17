# Design do Sistema - Estruturas Globais e Compartilhadas (`shared`)

Este documento define a identidade visual, paleta de cores e o tema global do Material UI (MUI) para a aplicação MedFlow.

## 1. Identidade Visual e Paleta de Cores (MUI Theme)

O MedFlow deve transmitir modernidade, profissionalismo e confiabilidade técnica na área de saúde. Utilizaremos uma paleta de cores baseada em tons médicos premium:

*   **Primary (Cor Principal):** Azul Médico Vivo (`#0288d1` ou HSL equivalente) - Transmite saúde, clareza e tecnologia.
*   **Secondary (Cor Secundária):** Roxo Clínico Sutil (`#7b1fa2` ou `#673ab7`) - Elegante, excelente para ações de destaque como emissão de laudos.
*   **Background (Fundo):**
    *   **Light Mode (Padrão):** Fundo cinza ultra-claro (`#f8f9fa`) e cards brancos puros (`#ffffff`).
    *   **Dark Mode (Opcional/Futuro):** Tons profundos de cinza-escuro/azul-marinho (`#0f172a` e `#1e293b`).
*   **Error:** Vermelho Clínico Suave (`#d32f2f`).
*   **Success:** Verde Clínico Suave (`#2e7d32`).
*   **Typography (Tipografia):** Fonte global definida como **Inter** ou **Outfit** obtidas via Google Fonts, substituindo as fontes padrão do navegador.

---

## 2. Configuração do Tema MUI (`src/providers/ThemeProvider.tsx`)
Exemplo de definição básica do tema:
```typescript
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0288d1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7b1fa2',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    button: {
      textTransform: 'none', // Remove letras maiúsculas automáticas dos botões do MUI
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8, // Bordas suaves e arredondadas para cards e inputs
  },
});
```

---

## 3. Layout de Base e Contêineres
*   **Container Principal:** Utilizar `Container` do MUI com limite máximo de largura `lg` (1200px) para centralizar e organizar os dashboards.
*   **Navbar Compartilhada:** Um componente header fixo no topo da página contendo:
    *   Título destacado: **MedFlow** com ícone de batimentos cardíacos ou cruz médica.
    *   Informação do usuário conectado.
    *   Botão de "Sair" (Logout) minimalista, porém visível.
