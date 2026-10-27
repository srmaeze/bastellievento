# O Lucro Invisível — Bastelli

Landing page estática. HTML/CSS/JS e fontes locais reaproveitados da identidade de `wireframe/preview`. Os dados dos encontros e depoimentos ficam em `dist/content.js`.

Prévia local: `node preview.mjs`. Validação: `node verify.mjs`. Regerar páginas dos encontros após editar os dados: `node build-event-pages.mjs`.

## Publicação pela Vercel

O repositório de trabalho é `srmaeze/bastellievento`; a hospedagem é o projeto `bastellievento`, na equipe Vercel `devbastelli-3602s-projects`. A conexão Git atual da equipe é mantida por escolha do usuário. Para este repositório, envie o commit ao GitHub e publique separadamente pela CLI Vercel; não presuma que o push dispara uma implantação automática.

`vercel.json` seleciona o preset **Other** e publica a pasta `dist` diretamente; o site não precisa de instalação de dependências nem de build.

Os arquivos de `dist`, incluindo vídeos, fontes, módulos `.mjs` e páginas `eventos/*.html`, fazem parte do repositório. Os links relativos funcionam a partir da raiz publicada sem regras de reescrita. O iframe de cadastro continua apontando para o serviço externo original.

O único formulário de cadastro é o iframe fornecido. Não há backend nem confirmação independente. Todos os CTAs de cadastro apontam para `#lista-espera`.

O atributo HTML `height="640"` foi preservado. A altura exibida é ajustada por CSS para 520px, reduzindo a sobra inferior e mantendo a rolagem interna automática disponível para mensagens maiores. Os campos são controlados pelo projeto externo Lovable, cujo componente publicado não oferece tema ou redimensionamento por mensagem; a edição visual dos campos depende do acesso a esse projeto.

## Materiais

- Foto real de Bruno em palestra, equipe e logo: `wireframe/preview/assets`.
- Cinco depoimentos e miniaturas: mesma seleção da página presencial `wireframe/preview/index.html`; Vimeo original, com controles, sem autoplay.
- Vídeos dos encontros Infinita, Transforma, Apêbrands, Black Friday Presencial e BW Talks: arquivos enviados pelo usuário em Downloads. Cópias H.264/AAC com faststart; streams originais preservados. Capas extraídas dos próprios vídeos. Páginas reais criadas em `dist/eventos` para esses registros.
- BW Talks: `bwdaytalk.mp4`, registro de 34,20 s; capa no início com o painel BW Talks/Bastelli.
- Black Friday Presencial: `black friday presencial.mp4`, registro de 85,65 s; capa aos 4 s com a identidade original do treinamento. Página original do treinamento: `https://suablacklucrativa.bastelliconsultoria.com.br/`.
- Black Friday Online: capa ilustrativa de videoconferência gerada para o card, com identificação visível de imagem ilustrativa; não representa uma captura do encontro.

## Pendências reais

- Treinamento Black Friday Online (17/09/2026): vídeo e URL da página do encontro exclusivo. A capa ilustrativa já está disponível; a página do treinamento gravado não foi associada a essa data.
- `evento descomplica.mp4`: nome e data do encontro para incluí-lo corretamente. O vídeo mostra um encontro na Bastelli; o registro ainda precisa ser associado a uma data e tema confirmados.

Cards com capas ausentes usam composição tipográfica neutra. Nenhuma foto de outro encontro foi apresentada como capa de um vídeo. Cards sem destino confirmado não geram link.
