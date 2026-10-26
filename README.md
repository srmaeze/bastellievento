# O Lucro Invisível — Bastelli

Landing page estática. HTML/CSS/JS e fontes locais reaproveitados da identidade de `wireframe/preview`. Os dados dos encontros e depoimentos ficam em `dist/content.js`.

Prévia local: `node preview.mjs`. Validação: `node verify.mjs`. Regerar páginas dos encontros após editar os dados: `node build-event-pages.mjs`.

O único formulário de cadastro é o iframe fornecido. Não há backend nem confirmação independente. Todos os CTAs de cadastro apontam para `#lista-espera`.

## Materiais

- Foto real de Bruno em palestra, equipe e logo: `wireframe/preview/assets`.
- Cinco depoimentos e miniaturas: mesma seleção da página presencial `wireframe/preview/index.html`; Vimeo original, com controles, sem autoplay.
- Vídeos dos encontros Infinita, Transforma e Apêbrands: arquivos enviados pelo usuário em Downloads. Cópias H.264/AAC com faststart; streams originais preservados. Capas extraídas dos próprios vídeos. Páginas reais criadas em `dist/eventos` para esses registros.
- Presencial: destino verificado `https://suablacklucrativa.bastelliconsultoria.com.br/`.

## Pendências reais

- BW Talks no Espaço N7 (06/10/2026): vídeo/capa e URL da página.
- Treinamento Black Friday Presencial (24/09/2026): vídeo/capa do próprio encontro.
- Treinamento Black Friday Online (17/09/2026): vídeo/capa e URL da página do encontro exclusivo. A página do treinamento gravado não foi associada a essa data.
- `evento descomplica.mp4`: nome e data do encontro para incluí-lo corretamente. O vídeo mostra um encontro na Bastelli; não há indicação verificável de que seja BW Talks no N7.

Cards com capas ausentes usam composição tipográfica neutra. Nenhuma foto de outro encontro foi apresentada como capa de um vídeo. Cards sem destino confirmado não geram link.
