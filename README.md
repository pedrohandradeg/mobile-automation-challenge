# Mobile Automation Challenge

Automação de testes mobile (Android e iOS) do [`native-demo-app`](https://github.com/webdriverio/native-demo-app),
usando **WebdriverIO + Appium**, com padrão **Page Object**, relatórios **Allure**, e pipelines de
**CI/CD** no GitHub Actions e no GitLab.

Este projeto foi desenvolvido de forma incremental, validando cada seletor e comportamento do app
antes de escrever os testes definitivos — a seção [Jornada técnica e decisões](#jornada-técnica-e-decisões)
documenta os principais problemas encontrados e como foram resolvidos, incluindo diferenças de
comportamento entre Android e iOS que só apareceram na prática.

---

## Stack utilizada

| Categoria | Ferramenta |
|---|---|
| Linguagem | JavaScript (ES Modules) |
| Framework de automação | [WebdriverIO](https://webdriver.io/) |
| Driver mobile | [Appium](https://appium.io/) (UiAutomator2 / XCUITest) |
| Test runner | Mocha |
| Relatórios | Allure Report |
| CI/CD (iOS) | GitHub Actions (runner `macos-14`, simulador nativo) |
| CI/CD (Android) | GitLab CI/CD + [BrowserStack App Automate](https://www.browserstack.com/app-automate) |
| Cloud de dispositivos | BrowserStack (Android, dispositivos reais) |

---

## Estrutura do projeto

```
mobile-automation-challenge/
├── .github/workflows/
│   └── ios-tests.yml              # Pipeline iOS (GitHub Actions, simulador macOS)
├── .gitlab-ci.yml                 # Pipeline Android (GitLab CI, via BrowserStack)
├── apps/                          # Binários do app (.apk/.app) — não versionado, baixado em runtime
├── test/
│   ├── pageobjects/
│   │   ├── base.page.js           # Métodos genéricos (click, setValue, getText, waitFor...)
│   │   ├── navigation.page.js     # Navegação pela tab bar (Home, Login, Forms, Swipe, Drag, Menu)
│   │   ├── login.page.js          # Tela de Login / Sign Up
│   │   └── form.page.js           # Tela de Forms (input, switch, dropdown, alertas)
│   └── specs/
│       ├── login.spec.js          # Login, Sign Up e validações de erro
│       ├── form.spec.js           # Interações com os componentes de formulário
│       └── navigation.spec.js     # Navegação entre as abas da tab bar
├── wdio.conf.js                   # Config Android (execução local)
├── wdio.ios.conf.js                # Config iOS (execução local, requer macOS)
├── wdio.android.bs.conf.js        # Config Android via BrowserStack (usado no GitLab CI)
├── package.json
└── README.md
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ e npm
- [Java JDK](https://adoptium.net/) 17+ (necessário para o Appium/UiAutomator2)
- [Android Studio](https://developer.android.com/studio) com SDK e um emulador configurado
- Um app de destino: o `.apk`/`.app` do `native-demo-app`, baixado em
  [Releases](https://github.com/webdriverio/native-demo-app/releases) (usamos a versão **v2.2.0**)

> **iOS**: rodar localmente exige macOS + Xcode (simulador). Sem isso, use o workflow do GitHub
> Actions (seção [CI/CD — iOS](#cicd--ios-github-actions)).

---

## Instalação

```bash
npm install
```

Baixe o app e coloque em `apps/`:

```bash
mkdir -p apps
# Android
curl -L -o apps/android.apk https://github.com/webdriverio/native-demo-app/releases/download/v2.2.0/android.wdio.native.app.v2.2.0.apk
# iOS (apenas em macOS)
curl -L -o apps/ios.zip https://github.com/webdriverio/native-demo-app/releases/download/v2.2.0/ios.simulator.wdio.native.app.v2.2.0.zip
unzip apps/ios.zip -d apps/
```

---

## Executando os testes localmente

**Android** (emulador ligado previamente):

```bash
npx wdio run ./wdio.conf.js
```

**iOS** (apenas em macOS, simulador):

```bash
npx wdio run ./wdio.ios.conf.js
```

**Um spec específico:**

```bash
npx wdio run ./wdio.conf.js --spec ./test/specs/login.spec.js
```

---

## Relatórios (Allure)

Todo teste que falha gera um screenshot (`reports/screenshots/`) e o anexa automaticamente ao
relatório Allure, junto com informações de ambiente (plataforma, device, versão de OS) e logs de
execução.

```bash
npm run allure:generate
npm run allure:open
```

---

## Cenários de teste

15 cenários no total, cobrindo login/cadastro, navegação, formulários e mensagens de erro:

| # | Spec | Cenário |
|---|---|---|
| 1 | `login.spec.js` | Deve realizar login com sucesso com credenciais válidas |
| 2 | `login.spec.js` | Deve realizar um sign up com sucesso e realizar login em seguida |
| 3 | `login.spec.js` | Deve validar os campos obrigatórios de login |
| 4 | `login.spec.js` | Deve validar os campos obrigatórios de sign up |
| 5 | `form.spec.js` | Deve validar o que está sendo digitado |
| 6 | `form.spec.js` | Deve interagir com o switch |
| 7 | `form.spec.js` | Deve interagir com o dropdown |
| 8 | `form.spec.js` | Deve interagir com o botão Active e clicar em OK |
| 9 | `form.spec.js` | Deve interagir com o botão Active e clicar em Cancel |
| 10 | `form.spec.js` | Deve interagir com o botão Active e clicar em Ask Me Later |
| 11 | `navigation.spec.js` | Deve navegar para a aba Login e marcá-la como selecionada |
| 12 | `navigation.spec.js` | Deve navegar para a aba Forms e marcá-la como selecionada |
| 13 | `navigation.spec.js` | Deve navegar para a aba Swipe e marcá-la como selecionada |
| 14 | `navigation.spec.js` | Deve navegar para a aba Drag e marcá-la como selecionada |
| 15 | `navigation.spec.js` | Deve navegar de volta para Home e marcá-la como selecionada |

---

## Padrão Page Object

Todos os specs interagem exclusivamente com métodos dos Page Objects — nenhum seletor aparece
diretamente nos arquivos de teste. `base.page.js` centraliza as operações genéricas (clique,
digitação, espera, screenshot em falha), reaproveitadas por `login.page.js`, `form.page.js` e
`navigation.page.js`.

### Estratégia cross-platform

Como o mesmo conjunto de specs roda em Android e iOS, os Page Objects usam `driver.isIOS` para
escolher o seletor correto por plataforma quando eles divergem:

```javascript
get alertTitle() {
    return driver.isIOS
        ? '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[1]'
        : 'android=new UiSelector().resourceId("com.wdiodemoapp:id/alert_title")';
}
```

---

## CI/CD — iOS (GitHub Actions)

O simulador iOS só roda em macOS — sem acesso a um Mac local, o pipeline usa um runner **macOS**
hospedado no GitHub Actions (`.github/workflows/ios-tests.yml`), que já vem com Xcode e simuladores
pré-instalados.

- Dispara automaticamente em push na `main`, ou manualmente via aba **Actions**
- Baixa o app, roda os testes, gera o relatório Allure e publica tudo (screenshots + relatório)
  como artifact do workflow

## CI/CD — Android (GitLab CI, via BrowserStack)

Ver a seção seguinte para o motivo dessa escolha — em resumo: **emulador Android não é viável em
runners compartilhados do GitLab** por falta de aceleração de hardware (KVM), então o Android no
GitLab CI roda em um **dispositivo real na nuvem** via BrowserStack App Automate.

O pipeline (`.gitlab-ci.yml`):
1. Instala dependências (`npm ci`)
2. Baixa o `.apk` e faz upload para o BrowserStack via API, capturando a URL do app
3. Roda os testes contra um Google Pixel 8 real (Android 14) na nuvem do BrowserStack
4. Gera e publica o relatório Allure

Requer as variáveis de CI/CD **`BROWSERSTACK_USERNAME`** e **`BROWSERSTACK_ACCESS_KEY`**
(configuradas como protegidas em Settings → CI/CD → Variables).

---

## Jornada técnica e decisões

### 1. Login e Sign Up compartilham o mesmo componente de tela

Ao testar manualmente, percebemos que mensagens de validação de erro **persistem visualmente** ao
trocar da aba Sign Up para a aba Login (e vice-versa) — indicando que ambas as telas são o mesmo
componente React, só alternando quais campos aparecem. Confirmamos isso em iOS reproduzindo a
sequência exata (Sign Up vazio → Login) e capturando o `page source`: as mensagens de erro do Sign
Up realmente apareciam na tela de Login, mesmo sem nenhuma submissão ali.

**Decisão**: os cenários de validação de erro (`campos obrigatórios`) foram posicionados **por
último** em `login.spec.js`, para não contaminar os cenários de fluxo de sucesso que rodam antes.

### 2. iOS: teclado cobre elementos da interface

Diferente do Android (onde o teclado é uma janela separada, invisível para o `getPageSource()`),
no iOS o teclado aparece **dentro da mesma árvore de acessibilidade** do app e pode fisicamente
cobrir a tab bar e outros elementos. A solução foi um `hideKeyboardIfNeeded()` no `base.page.js`,
usando um toque programático (`pointer action`) em uma área neutra da tela — abordagens como
`driver.hideKeyboard()` e `mobile: hideKeyboard` se mostraram inconsistentes nesse app.

### 3. iOS: dropdown é um `UIPickerView` nativo, não uma lista

O componente de dropdown do Forms, que no Android é uma lista clicável, no iOS é implementado como
uma **roleta nativa** (`XCUIElementTypePickerWheel`). A seleção é feita via `setValue()` direto no
elemento da roleta (o driver reconhece o valor e ajusta automaticamente), seguido de um clique no
botão `done_button` para confirmar.

### 4. iOS: texto dos botões de alerta tem capitalização diferente do Android

Botões como "CANCEL" e "ASK ME LATER" no Android são exibidos em caixa alta por transformação
visual do próprio tema (o texto real é diferente) — no iOS, o texto aparece exatamente como definido
no código-fonte do app (`"Cancel"`, `"Ask me later"`). O `form.page.js` mapeia essa diferença
internamente, mantendo os specs idênticos para as duas plataformas.

### 5. iOS: transição pós-Sign-Up é mais pesada

Cronometrando execuções repetidas, identificamos que a tab bar demora sensivelmente mais para
ficar interativa logo após um cadastro bem-sucedido do que após qualquer outra transição — sugerindo
que o app realiza alguma operação adicional (possivelmente autenticação automática) nesse fluxo
específico. Resolvido consolidando o teste de "Sign Up + Login em sequência" para usar navegação
interna da tela (link "Login" dentro do formulário) em vez da tab bar, evitando o ponto de
instabilidade.

### 6. GitLab CI: emulador Android não é viável em runner compartilhado sem KVM

Esta foi a decisão mais significativa do projeto. Tentamos rodar um emulador Android completo
dentro do `.gitlab-ci.yml`, e enfrentamos, em sequência:
- Espaço em disco insuficiente para a partição de dados do emulador
- Incompatibilidade de versão de imagem de sistema
- Ferramenta `aapt2` ausente (pacote Build Tools)
- Múltiplos timeouts de instalação (`androidInstallTimeout`, `uiautomator2ServerInstallTimeout`)
- Driver Appium instalado no lugar errado (global vs. local ao projeto)
- Falhas intermitentes de serviços internos do Android (`settings`, `activity`) não estarem
  totalmente disponíveis mesmo após o boot ser reportado como completo — um
  [problema documentado no próprio repositório do Appium](https://github.com/appium/appium/issues/17200)

Cada um desses problemas tem causa raiz real e foi resolvido individualmente, mas o padrão geral —
falhas diferentes e imprevisíveis a cada execução — é a assinatura de um ambiente sob estresse de
recursos, tentando emular uma CPU completa via software, em um runner dimensionado para tarefas
mais leves. Runners compartilhados do GitLab.com **não oferecem KVM/aceleração de hardware**, uma
limitação de infraestrutura deles, não do projeto.

**Decisão final**: em vez de insistir em emulação local instável, o Android no GitLab CI passou a
rodar em um **dispositivo Android real na nuvem** via BrowserStack App Automate — eliminando por
completo a necessidade de emulador, SDK, e as instabilidades associadas. (BrowserStack não foi
viável para iOS pelo mesmo pipeline, pois o `native-demo-app` só possui build para simulador, e o
BrowserStack testa exclusivamente dispositivos reais — daí o iOS permanecer no GitHub Actions.)

---

## Limitações conhecidas

- **iOS local** requer macOS + Xcode; não é possível rodar em Windows/Linux (restrição da Apple).
- **Android no GitLab CI** depende de uma conta BrowserStack (trial gratuito tem cota limitada de
  minutos de execução).
- O comportamento de compartilhamento de estado entre Login/Sign Up (item 1 da jornada técnica) é
  uma característica do app de demonstração, não um defeito introduzido pela automação.
