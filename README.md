# Encontros Bastelli

Landing page estática. HTML/CSS/JS e fontes locais reaproveitados da identidade de `wireframe/preview`. Os dados dos encontros e depoimentos ficam em `dist/content.js`.

Próximo encontro: **Gestão de tempo e vendas**, com Léo Nicoletto (Resolve) e Bruno Bastelli, **18/11/2026 às 14h**, no escritório da Bastelli — Rua Santa Cruz, 787, Sala 21 (2º andar), Centro, Limeira/SP. Evento gratuito, com coffee break e networking; vagas limitadas. Informações fornecidas pelo usuário em 09/11/2026. A contagem considera o início confirmado no fuso de Brasília. O cadastro atual foi preservado; a equipe confirma a participação pelo WhatsApp.

Prévia local: `node preview.mjs`. Validação: `node verify.mjs`, `node verify-countdown.mjs` e `node verify-pixel.mjs`. Regerar páginas dos encontros após editar os dados: `node build-event-pages.mjs`. Os dados do próximo encontro usados nos rodapés das páginas de vídeos ficam em `upcoming` no `dist/content.js`.

## Publicação pela Vercel

O repositório de trabalho é `srmaeze/bastellievento`; a hospedagem é o projeto `bastellievento`, na equipe Vercel `devbastelli-3602s-projects`. A conexão Git atual da equipe é mantida por escolha do usuário. Para este repositório, envie o commit ao GitHub e publique separadamente pela CLI Vercel; não presuma que o push dispara uma implantação automática.

`vercel.json` seleciona o preset **Other** e publica a pasta `dist` diretamente; o site não precisa de instalação de dependências nem de build.

Os arquivos de `dist`, incluindo vídeos, fontes, módulos `.mjs` e páginas `eventos/*.html`, fazem parte do repositório. Os links relativos funcionam a partir da raiz publicada sem regras de reescrita. O iframe de cadastro continua apontando para o serviço externo original.

O único formulário de cadastro é o iframe fornecido. Não há backend nem confirmação independente. Todos os CTAs de cadastro apontam para `#lista-espera`.

O atributo HTML `height="640"` foi preservado. A altura exibida é ajustada por CSS para 520px, reduzindo a sobra inferior e mantendo a rolagem interna automática disponível para mensagens maiores. Os campos são controlados pelo projeto externo Lovable, cujo componente publicado não oferece tema ou redimensionamento por mensagem; a edição visual dos campos depende do acesso a esse projeto.

## Materiais

- Foto real de Bruno em palestra, equipe e logo: `wireframe/preview/assets`.
- Cinco depoimentos Vimeo da página presencial `wireframe/preview/index.html`, mais seis vídeos SaveClip enviados pelo usuário, com capas locais e reprodução nativa sob demanda. Os seis arquivos locais mantêm os streams originais com faststart. Onze depoimentos, com controles e sem autoplay.
- Vídeos dos encontros Infinita, Transforma, Apêbrands, Black Friday Presencial e BW Talks: arquivos enviados pelo usuário em Downloads. Cópias H.264/AAC com faststart; streams originais preservados. Capas extraídas dos próprios vídeos. Páginas reais criadas em `dist/eventos` para esses registros.
- BW Talks: `bwdaytalk.mp4`, registro de 34,20 s; capa no início com o painel BW Talks/Bastelli.
- Black Friday Presencial: `black friday presencial.mp4`, registro de 85,65 s; capa aos 4 s com a identidade original do treinamento. Página original do treinamento: `https://suablacklucrativa.bastelliconsultoria.com.br/`.
- Black Friday Online: capa ilustrativa de videoconferência gerada para o card, com identificação visível de imagem ilustrativa; não representa uma captura do encontro.
- Descomplica: primeiro card, em 22/10/2026 conforme informado pelo usuário; título neutro “Encontro com a Descomplica”, vídeo original `evento descomplica.mp4` e capa `descomplica.png`. Não é o Black Friday Presencial.
- Capas Descomplica, Apêbrands, BW Talks, Infinita e Transforma: imagens enviadas pelo usuário, copiadas sem alteração.
- O Lucro Invisível (05/11/2026): movido para o primeiro card do histórico, identificado como finalizado. Usa a arte anterior com Hamilton Alves e Bruno Bastelli; nenhum vídeo novo foi fornecido, portanto não há CTA de gravação.
- Léo Nicoletto: miniatura real do perfil público indicado pelo usuário, `https://www.instagram.com/leonicoletto/`, copiada sem alteração em `dist/assets/leo-nicoletto.jpg` (150×150). A foto pequena é usada apenas para identificar o palestrante. Bruno usa a foto real já existente.
- Hero: composição original preservada, com arte conjunta dos palestrantes no lado laranja do cadastro. Imagem fornecida pelo usuário, restaurada com image_gen integrado em `dist/assets/hero-leo-bruno-restaurada.png` (1622×970); [prompt exato](docs/hero-speakers-restoration-prompt.txt).
- Favicon: símbolo vetorial oficial da Bastelli, com enquadramento quadrado e contraste branco sobre azul escuro, em `dist/favicon.svg`. Referenciado na página inicial e nas seis páginas de registros; o gerador mantém a referência nas próximas atualizações.
- Nova capa Black Friday Online: `dist/assets/event-black-friday-online-natural.png`, gerada com image_gen integrado; prompt exato em [docs/black-friday-online-natural-prompt.txt](docs/black-friday-online-natural-prompt.txt).

## Meta Pixel

Pixel `1126433449891278`: um PageView por documento em todas as sete páginas. O Lead aceita exclusivamente confirmação validada do iframe, com deduplicação por ID em memória e na sessão. **O formulário Lovable ainda não emite essa confirmação, portanto o Lead não está ativo.** A alteração necessária no formulário e a verificação integrada pendente estão em [docs/meta-pixel-formulario.md](docs/meta-pixel-formulario.md).

## Pendências reais

- Treinamento Black Friday Online (17/09/2026): vídeo e URL da página do encontro exclusivo. A capa ilustrativa já está disponível; a página do treinamento gravado não foi associada a essa data.
- Lead: publicar a confirmação de sucesso no projeto externo Lovable, cujo acesso de edição não está disponível neste workspace.

Cards com capas ausentes usam composição tipográfica neutra. Nenhuma foto de outro encontro foi apresentada como capa de um vídeo. Cards sem destino confirmado não geram link.
