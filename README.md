# YouTube to News Generator 📰

Este projeto é uma aplicação frontend que permite aos usuários gerar automaticamente notícias a partir de vídeos do YouTube. A aplicação utiliza inteligência artificial para transcrever o áudio do vídeo e transformá-lo em uma notícia estruturada com título, subtítulo e corpo.

---

## 🚀 Tecnologias Utilizadas

### Linguagens e Frameworks

- **[ReactJS](https://reactjs.org/)**: Biblioteca JavaScript para construção de interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática para maior confiabilidade e escalabilidade.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build rápida e eficiente.
- **[TailwindCSS](https://tailwindcss.com/)**: Framework CSS para estilização moderna e responsiva.
- **[ShadCN UI](https://shadcn.dev/)**: Componentes de interface elegantes e acessíveis.

### Integrações e APIs

- **[YouTube Data API](https://developers.google.com/youtube/v3)**: Utilizada para acessar informações e links do YouTube.
- **[RapidAPI](https://rapidapi.com/)**: Integração para conversão de vídeos do YouTube em formato MP3.
- **[OpenAI Whisper API](https://platform.openai.com/docs/guides/whisper)**: Para transcrição automática de áudios.
- **[OpenAI GPT API](https://platform.openai.com/)**: Para geração de notícias com base no texto transcrito.

---

## 📝 Funcionalidades

1. **Geração Automática de Notícias**:

   - Insira o link de um vídeo do YouTube e a aplicação realizará automaticamente:
     - Conversão do vídeo para MP3.
     - Transcrição do áudio para texto.
     - Geração de uma notícia com título, subtítulo e corpo estruturado.

2. **Interface Simples e Moderna**:

   - Design responsivo e estilizado com TailwindCSS e ShadCN UI.
   - Carregamento visual durante o processo, oferecendo uma experiência amigável ao usuário.

3. **Suporte a Inteligência Artificial**:
   - Transcrição com alta precisão usando o modelo Whisper da OpenAI.
   - Redação de notícias contextualizadas e coesas com o modelo GPT.

---

## 🛠️ Como Rodar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/viniciusnreno/video-to-news.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd video-to-news
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente:

   - Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
     ```
     VITE_YOUTUBE_API_KEY=YOUR_API_KEY
     VITE_OPENAI_API_KEY=YOUR_API_KEY
     ```

5. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse a aplicação em: [http://localhost:5173](http://localhost:5173)

## 🌐 Link Hospedado

Acesse a versão online do projeto: [https://video-to-news.vercel.app/](https://video-to-news.vercel.app/)

## 🌟 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias ou correções.

---

💡 Desenvolvido por [Vinícius N. Renó](https://viniciusreno.vercel.app/).
