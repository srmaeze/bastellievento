# Meta Pixel — confirmação do cadastro

Pixel: `1126433449891278`.

## Estado atual

`dist/meta-pixel.js` carrega o Pixel e envia um PageView por documento em todas as páginas da landing page e dos encontros. A navegação entre âncoras não gera outro PageView. O fallback sem JavaScript também registra apenas PageView.

**O Lead ainda depende de alteração no formulário externo.** O formulário publicado em `https://bc-contentadmin.lovable.app/lista-espera` salva em `waitlist_leads`, mas não envia `postMessage` de confirmação à landing page. O navegador impede a leitura do conteúdo desse iframe por outro domínio. Sem acesso ao projeto Lovable, a landing page não pode confirmar o cadastro. Não há disparo por clique, carregamento do iframe ou tentativa de envio.

## Alteração necessária no projeto Lovable

No componente da rota `/lista-espera`, enviar a mensagem abaixo **somente depois que a inserção em `waitlist_leads` retornar sem erro**. O trecho deve ficar depois da verificação de erro, fora do ramo do honeypot (`website`) e de qualquer efeito de renderização. Nunca enviar a mensagem em cliques, falhas de validação ou respostas com erro.

Usar uma referência para impedir a repetição na mesma instância do formulário:

```tsx
const leadConfirmationSent = useRef(false);

// Dentro do handler de envio já existente, após validar os campos:
const { error } = await supabase.from('waitlist_leads').insert({
  ...parsed.data,
  source,
});

setSubmitting(false);
if (error) {
  setError('Não foi possível enviar agora. Tente novamente.');
  return;
}

setSuccess(true);
if (!leadConfirmationSent.current && window.parent !== window) {
  leadConfirmationSent.current = true;
  window.parent.postMessage({
    type: 'bastelli:waitlist:success',
    version: 1,
    submissionId: crypto.randomUUID(),
  }, 'https://bastellievento.vercel.app');
}
```

Adaptar apenas os identificadores ao código fonte original e importar `useRef`. Preservar a validação e o honeypot atuais. O ID deve ser gerado uma única vez após a resposta bem-sucedida; qualquer repetição da mesma confirmação deve reutilizar o mesmo ID. Não incluir nome, e-mail, WhatsApp ou outros dados pessoais na mensagem.

O listener já preparado na landing page aceita somente mensagens da origem exata do Lovable, vindas da janela do iframe de cadastro, com o tipo/versão esperados e UUID válido. IDs repetidos são ignorados em memória e no `sessionStorage`. O evento enviado é apenas `fbq('track', 'Lead', {}, {eventID: ...})`, sem novo `init` ou PageView.

Não instalar também o snippet de Lead no iframe: isso criaria dois pontos de disparo para o mesmo cadastro.

## Verificação

`node verify-pixel.mjs` testa o Pixel com um stub local, sem enviar conversões reais: PageView único por documento, ausência de Lead antes da confirmação, origem/janela/schema inválidos, confirmação válida, duplicidade, recarga e indisponibilidade do armazenamento.

Depois de publicar a alteração no Lovable, validar uma inscrição real autorizada com Meta Test Events/Pixel Helper: nenhum Lead antes do sucesso; exatamente um após a inserção; nenhum em erro de validação ou de gravação. A validação local da landing page não substitui esse teste integrado, ainda pendente.
