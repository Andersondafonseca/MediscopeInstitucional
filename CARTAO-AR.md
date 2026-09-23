# Mediscope — cartão WebAR

Rota de produção: https://www.mediscope.com.br/cartao

Esta aplicação é independente do site principal, `/banner` e `/evento`. O build existente é preservado; `tools/cartao/build.mjs` acrescenta apenas `dist/cartao`. As duas formas `/cartao` e `/cartao/` usam a mesma página.

## Conteúdo

Avatar GLB original de 1.982.064 bytes, visualização 3D sem câmera, coração e respiração interativos, painéis com dados explicitamente simulados, WhatsApp e vCard. O reconhecimento usa a arte do cartão fornecida por Anderson. O marcador é pré-compilado, evitando compilação no primeiro acesso. A câmera só é aberta após a ação do visitante; as imagens são processadas localmente, sem gravação ou envio pelo aplicativo.

## Release e manutenção

`tools/cartao/release.json` identifica o bundle imutável e seu SHA-256. O bundle contém o código da aplicação, assets e a distribuição MindAR 1.2.5 com licença. Ele é obtido no build; todos os arquivos são servidos pela própria Vercel em tempo de execução. O build falha se tamanho, hash, GLB ou marcador não corresponderem à versão aprovada. Uma cópia offline pode ser salva em `tools/cartao/runtime-v1.json`.

O ZIP de origem é a entrega Mediscope-Cartao-WebAR.zip aprovada na conversa, SHA-256 `6f31a83b8e50f0bc238ab65d1697695b7184187bd4d6cdd3df5cd6186992b81f`. O espelho está em https://d2ol7oe51mr4n9.cloudfront.net/user_3IqOaaNu4mtsp2EPjuknEeNjvbj/c59c247c-1a7d-46ec-9cb0-8ffd3dcfca54.zip.

## Verificação

`/cartao/build-info.json` registra a versão, commit, integridade e verificações automatizadas. Testes com câmera sintética não equivalem à validação física: conferir o cartão impresso no Safari/iPhone e Chrome/Android, permissão negada, perda e retorno do alvo, reflexos e rotação do aparelho. O modo 3D e os contatos permanecem como alternativas.

Não alterar o QR impresso. Não substituir o build ou as rotas do banner e do formulário ao atualizar esta experiência. O modelo e seus indicadores são ilustrativos, não um dispositivo de diagnóstico.
