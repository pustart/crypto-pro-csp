[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][downloads-url]
[![Coverage Status][coveralls-image]][coveralls-url]

<a name="cryptopro"></a>
# CryptoPro CSP

Асинхронное API для работы с КриптоПРО ЭЦП Browser Plug-In, с поддержкой строгой (self) [политики CSP (Content Security Policy)](https://developer.mozilla.org/ru/docs/Web/HTTP/Guides/CSP).

## [Список поддерживаемых браузеров](https://www.cryptopro.ru/products/cades/plugin/developer)
Имеют встроенное расширение:
- [Яндекс.Браузер для организаций](https://browser.yandex.ru/b/cryptopro_plugin);
- [Chromium-Gost](https://www.cryptopro.ru/products/chromium-gost).

Необходимо самостоятельно включить расширение в браузере после установки плагина:

- Google Chrome (в том числе Chromium версии 104+);
- Microsoft Edge (на базе Chromium версии 104+);
- Яндекс Браузер (на базе Chromium версии 104+);
- Mozilla Firefox;
- Apple Safari;
- Opera.

## Демо (на базе ./examples/script-tag)

CAdES — это расширенный стандарт электронной подписи, разработанный для обеспечения долгосрочной подлинности и целостности подписанных данных, с поддержкой таких возможностей, как отметка доверенного времени и хранение информации для долгосрочного подтверждения подписи.

В браузерах CAdES реализуется обычно через плагин или расширение, например, «КриптоПро ЭЦП Browser plug-in» (также известный как КриптоПро CADESCOM или Кадеском), который необходим для работы с электронной подписью на разных порталах и торговых площадках. Этот плагин/расширение позволяет пользователям создавать и проверять подписи непосредственно в браузере, используя криптографические сервисы, и применяется в таких браузерах как Microsoft Edge, Opera, Mozilla Firefox, Google Chrome и Яндекс.Браузер (не поддерживается в Internet Explorer). Для работы с этим плагином обязательно наличие установленного криптографического провайдера, например, КриптоПро CSP.

[![demo.gif](resources/demo.gif)](#example-script-tag)

## Навигация

- [CryptoPro CSP](#cryptopro-csp)
  - [Список поддерживаемых браузеров](#список-поддерживаемых-браузеров)
  - [Демо (на базе ./examples/script-tag)](#демо-на-базе-examplesscript-tag)
  - [Навигация](#навигация)
  - [Зачем мне этот пакет?](#зачем-мне-этот-пакет)
  - [Установка](#установка)
  - [API](#api)
    - [Методы объекта cryptoPro](#методы-объекта-cryptopro)
    - [Методы объекта сертификата](#методы-объекта-сертификата)
  - [Поддерживаемые СКЗИ](#поддерживаемые-скзи)
  - [Примеры](#примеры)
    - [Тэг script (UMD)](#тэг-script-umd)
    - [Angular (ES Modules + Typescript)](#angular-es-modules--typescript)
    - [React (ES Modules + JavaScript)](#react-es-modules--javascript)
- [Тем, кто хочет помочь](#тем-кто-хочет-помочь)
  - [Запуск режима разработки](#запуск-режима-разработки)
  - [Запуск тестов](#запуск-тестов)
  - [Проверка работы примеров с React и Angular](#проверка-работы-примеров-с-react-и-angular)
  - [Проверка пакета перед публикацией в NPM](#проверка-пакета-перед-публикацией-в-npm)
- [Лицензия](#лицензия)

<a name="why"></a>
## Зачем мне этот пакет?

КриптоПРО ЭЦП Browser Plug-In доступен в разных браузерах в двух версиях:
асинхронной (в современных браузерах) и синхронной (в браузерах постарше). Синхронная версия для старых браузеров поддерживалась через функцию ```eval()```, которая является дырой в безопасности и несовместима с жесткой политикой CSP ```script-src 'self'```. Так как требование к безопасности веб-приложений растут с каждым годом было принято решение пожертвовать поддержкой старых браузеров для успешной работы в новых с соблюдением политики CSP ```script-src 'self'```. Подробнее о проблеме с реализацией синхронной версии при CSP можно почитать [в этом issue](https://github.com/vgoma/crypto-pro/issues/149). Для этого были удалены вызовы функций ```eval()``` и заменены на генераторы.

<a name="install"></a>
## Установка
Для NPM:
```bash
npm install crypto-pro-csp --save-dev
```

Для Yarn:
```bash
yarn add crypto-pro-csp
```

Подключение пакета как UMD модуля через тэг script:
```html
<script src="crypto-pro-csp/dist/crypto-pro-csp.min.js"></script>
<script>
window.cryptoPro.getUserCertificates()
  .then(function (certificates) {
    //...
  })
  .catch(function (error) {
    //...
  });
</script>
```

Подключение пакета как ES модуля с Typescript или JavaScript:
```typescript
import { getUserCertificates, Certificate } from 'crypto-pro-csp';

(async () => {
  let certificates: Certificate[];

  try {
    certificates = await getUserCertificates();
  } catch(error) {
    // ...
  }
})();
```

Список требуемых полифиллов (если необходимы, подключаются самостоятельно):
- Promise
- Array.prototype.find

<a name="api"></a>
## API

<a name="api-cryptopro"></a>
### Методы объекта cryptoPro
- [getUserCertificates](src/api/getUserCertificates.ts) - возвращает список [сертификатов](#api-certificate), доступных пользователю в системе
- [getCertificate](src/api/getCertificate.ts) - возвращает [сертификат](#api-certificate) по отпечатку
- [createAttachedSignature](src/api/createAttachedSignature.ts) - создает совмещенную (присоединенную) подпись сообщения
- [createDetachedSignature](src/api/createDetachedSignature.ts) - создает отсоединенную (открепленную) подпись сообщения
- [createXMLSignature](src/api/createXMLSignature.ts) - создает XML подпись для документа в формате XML
- [createHash](src/api/createHash.ts) - создает хеш сообщения по ГОСТ Р 34.11-2012 256 бит
- [createSignature](src/api/createSignature.ts) - создает подпись сообщения
    > Является устаревшим и будет убран из будущих версий.
    Используйте "createAttachedSignature" и "createDetachedSignature".
- [getSystemInfo](src/api/getSystemInfo.ts) - возвращает информацию о CSP и плагине
- [isValidSystemSetup](src/api/isValidSystemSetup.ts) - возвращает флаг корректности настроек ЭП на машине

<a name="api-certificate"></a>
### Методы объекта сертификата
[Сертификат](src/api/certificate/certificate.ts) предоставляет следущее API:
- [isValid](src/api/certificate/isValid.ts) - возвращает флаг действительности сертификата
- [getCadesProp](src/api/certificate/getCadesProp.ts) - возвращает указанное внутренее свойство у сертификата в формате Cades
- [exportBase64](src/api/certificate/exportBase64.ts) - возвращает сертификат в формате base64
- [getAlgorithm](src/api/certificate/getAlgorithm.ts) - возвращает информацию об алгоритме сертификата
- [getOwnerInfo](src/api/certificate/getInfo.ts) - возвращает расшифрованную информацию о владельце сертификата
- [getIssuerInfo](src/api/certificate/getInfo.ts) - возвращает расшифрованную информацию об издателе сертификата
- [getExtendedKeyUsage](src/api/certificate/getExtendedKeyUsage.ts) - возвращает ОИД'ы сертификата
- [getDecodedExtendedKeyUsage](src/api/certificate/getDecodedExtendedKeyUsage.ts) - возвращает расшифрованные ОИД'ы
- [hasExtendedKeyUsage](src/api/certificate/hasExtendedKeyUsage.ts) - проверяет наличие ОИД'а (ОИД'ов) у сертификата

<a name="supported-cist"></a>
## Поддерживаемые СКЗИ
[КриптоПРО CSP](https://www.cryptopro.ru/products/csp/downloads) (v4.0+) *рекомендуется использование только сертифицированных версий*. Инструкция по установке:

[КриптоПРО ЭЦП browser plug-in](https://www.cryptopro.ru/products/cades/plugin)

<a name="examples"></a>
## Примеры
Для их запуска необходим NodeJS версии, указанной в [.nvmrc](.nvmrc).

<a name="example-script-tag"></a>
### Тэг script (UMD)
```bash
cd examples/script-tag
npm i
npm start
```

<a name="example-angular"></a>
### Angular (ES Modules + Typescript)
```bash
cd examples/angular
npm i
```

Запуск в режиме разработки:
```bash
npm start
```

Запуск в продакшн режиме:
```bash
npm run build
npm run serve
```

<a name="example-react"></a>
### React (ES Modules + JavaScript)
```bash
cd examples/react
npm i
```

Запуск в режиме разработки:
```bash
npm start
```

Запуск в продакшн режиме:
```bash
npm run build
npm run serve
```

<a name="developers"></a>
# Тем, кто хочет помочь
Буду благодарен за расширение/улучшение/доработку API.
Вам будут полезны [примеры](http://cpdn.cryptopro.ru/?url=/content/cades/plugin-samples-sign.html),
предоставляемые Крипто ПРО.

Необходима NodeJS версии, указанной в [.nvmrc](.nvmrc).
На машине должен быть установлен Python 2.7.18.

<a name="dev-mode"></a>
## Запуск режима разработки
Устанавливаем зависимости:
```bash
npm i
```

Во время работы с кодом необходим запущенный сборщик:
```bash
npm start
```

И пример, на котором можно тестировать изменения.
Удобнее всего тестировать на примере с тэгом script, тк он отвязан от фреймворков
и использует сборку в формате UMD из папки `dist/`, постоянно обновляемую пока работает
сборщик. Запускаем его таким образом:
```bash
cd examples/script-tag
npm i
npm link ../../
npm start
```
> После выполнения `npm link ../../` в директории `examples/script-tag/node_modules` папка `crypto-pro-csp` станет ярлыком,
> указывающим на папку содержащую локально собранный пакет.

<a name="tests-execution"></a>
## Запуск тестов
Тесты написаны с использованием [Jest](https://jestjs.io/docs/en/configuration#testpathignorepatterns-arraystring):
```bash
npm test
```

<a name="examples-testing"></a>
## Проверка работы примеров с React и Angular
React и Angular используют версию сборки пакета в формате ES модулей из директории `lib/`.
Для их запуска необходимо сначала собрать пакет выполнив:
```bash
npm run build
```

После этого из папки `examples/angular` или `examples/react` залинковать пакет:
```bash
cd examples/angular
npm i
npm link ../../
```

И запустить пример в одном из двух режимов. В режиме разработки:
```bash
npm start
```

или в режиме продакшн:
```bash
npm run build
npm run serve
```

<a name="final-check"></a>
## Проверка пакета перед публикацией в NPM
Необходимо протестировать работу в заявленных браузерах, сделав это на локально запакованной версии пакета.
Для этого собираем пакет:
```bash
npm run build
npm pack
mv package ..
```
> Важно переместить папку `package` куда-нибудь выше для избежания конфликтов при линковке с текущим `package.json`.

Переходим в любую директорию с примером и создаем там ссылку на только что собранный пакет:
```bash
cd examples/script-tag
npm link ../../../package
```

Проверяем работу примеров в режимах разработки и продакшн.

После завершения экспериментов можно удалить глобальную ссылку из директории `../../../package` таким образом:
```bash
cd ../../../package
npm unlink
```

<a name="lisense"></a>
# Лицензия
MIT

[npm-url]: https://npmjs.org/package/crypto-pro-csp
[npm-version-image]: http://img.shields.io/npm/v/crypto-pro-csp.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/crypto-pro-csp.svg?style=flat
[downloads-url]: https://npmcharts.com/compare/crypto-pro-csp?minimal=true
[coveralls-image]: https://coveralls.io/repos/github/pustart/crypto-pro-csp/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/pustart/crypto-pro-csp?branch=master
