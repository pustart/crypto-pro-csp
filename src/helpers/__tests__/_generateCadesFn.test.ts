import { __cadesAsyncToken__, __createCadesPluginObject__, _generateCadesFn } from '../_generateCadesFn';

const CreateObjectAsync = window.cadesplugin.CreateObjectAsync;

// Хелпер для нормализации строк перед сравнением
function normalize(str: string): string {
  return str.replace(/[ \t]+$/gm, '').trim();
}

describe('_generateCadesFn', () => {
  describe('synchronous environment', () => {
    beforeEach(() => {
      delete window.cadesplugin.CreateObjectAsync;
    });

    test('generates function body from named function callback', () => {
      const result = _generateCadesFn(function namedFunction() {
        console.log('hello from named function');
      });

      expect(normalize(result)).toEqual(
        normalize(`(function anonymous(
) {

                console.log('hello from named function');

})();//# sourceURL=crypto-pro_namedFunction.js`),
      );
    });

    test('generates function body from arrow function callback', () => {
      const result = _generateCadesFn(() => console.log('hello from arrow function'));

      expect(normalize(result)).toEqual(
        normalize(`(function anonymous(
) {
 return console.log('hello from arrow function');
})();//# sourceURL=crypto-pro_dynamicFn.js`),
      );
    });

    test('generates function body with synchronous vendor library references', () => {
      const result = _generateCadesFn(function methodInSyncEnvironment() {
        const cadesFoo = __cadesAsyncToken__ + __createCadesPluginObject__('CADESCOM.Foo');
        const cadesBar = __cadesAsyncToken__ + __createCadesPluginObject__('CAdESCOM.Bar');
        const cadesBarNoMatterWhat = __cadesAsyncToken__ + cadesBar.NoMatterWhat;
        void (__cadesAsyncToken__ + cadesFoo.propset_WhateverProperty('whatever value'));
        void (__cadesAsyncToken__ + cadesBarNoMatterWhat.whateverMethod(cadesFoo));
      });

      expect(normalize(result)).toEqual(
        normalize(`(function anonymous(
) {

                var cadesFoo = cadesplugin.CreateObject('CADESCOM.Foo');
                var cadesBar = cadesplugin.CreateObject('CAdESCOM.Bar');
                var cadesBarNoMatterWhat = cadesBar.NoMatterWhat;
                void (cadesFoo.WhateverProperty = 'whatever value');
                void (cadesBarNoMatterWhat.whateverMethod(cadesFoo));

})();//# sourceURL=crypto-pro_methodInSyncEnvironment.js`),
      );
    });

    test('generates function body for synchronous custom implementation', () => {
      const result = _generateCadesFn(function customSyncEnvImplementation(utils) {
        const cadesFoo = utils.__cadesAsyncToken__ + utils.__createCadesPluginObject__('CADESCOM.Foo');
        const cadesBar = utils.__cadesAsyncToken__ + utils.__createCadesPluginObject__('CAdESCOM.Bar');
        const cadesBarNoMatterWhat = utils.__cadesAsyncToken__ + cadesBar.NoMatterWhat;
        void (utils.__cadesAsyncToken__ + cadesFoo.propset_WhateverProperty('whatever value'));
        void (utils.__cadesAsyncToken__ + cadesBarNoMatterWhat.whateverMethod(cadesFoo));
      });

      expect(normalize(result)).toEqual(
        normalize(`(function anonymous(utils
) {

                var cadesFoo = cadesplugin.CreateObject('CADESCOM.Foo');
                var cadesBar = cadesplugin.CreateObject('CAdESCOM.Bar');
                var cadesBarNoMatterWhat = cadesBar.NoMatterWhat;
                void (cadesFoo.WhateverProperty = 'whatever value');
                void (cadesBarNoMatterWhat.whateverMethod(cadesFoo));

})();//# sourceURL=crypto-pro_customSyncEnvImplementation.js`),
      );
    });
  });

  describe('asynchronous environment', () => {
    beforeEach(() => {
      window.cadesplugin.CreateObjectAsync = CreateObjectAsync;
    });

    test('generates function body with asynchronous vendor library references', () => {
      const result = _generateCadesFn(function methodInAsyncEnvironment() {
        const cadesFoo = __cadesAsyncToken__ + __createCadesPluginObject__('CADESCOM.Foo');
        const cadesBar = __cadesAsyncToken__ + __createCadesPluginObject__('CAdESCOM.Bar');
        const cadesBarNoMatterWhat = __cadesAsyncToken__ + cadesBar.NoMatterWhat;
        void (__cadesAsyncToken__ + cadesFoo.propset_WhateverProperty('whatever value'));
        void (__cadesAsyncToken__ + cadesBarNoMatterWhat.whateverMethod(cadesFoo));
      });

      expect(normalize(result)).toEqual(
        normalize(`cadesplugin.async_spawn(function* anonymous(
) {

                var cadesFoo = yield cadesplugin.CreateObjectAsync('CADESCOM.Foo');
                var cadesBar = yield cadesplugin.CreateObjectAsync('CAdESCOM.Bar');
                var cadesBarNoMatterWhat = yield cadesBar.NoMatterWhat;
                void (yield cadesFoo.propset_WhateverProperty('whatever value'));
                void (yield cadesBarNoMatterWhat.whateverMethod(cadesFoo));

});//# sourceURL=crypto-pro_methodInAsyncEnvironment.js`),
      );
    });

    test('generates function body for asynchronous custom implementation', () => {
      const result = _generateCadesFn(function customAsyncEnvImplementation(utils) {
        const cadesFoo = utils.__cadesAsyncToken__ + utils.__createCadesPluginObject__('CADESCOM.Foo');
        const cadesBar = utils.__cadesAsyncToken__ + utils.__createCadesPluginObject__('CAdESCOM.Bar');
        const cadesBarNoMatterWhat = utils.__cadesAsyncToken__ + cadesBar.NoMatterWhat;
        void (utils.__cadesAsyncToken__ + cadesFoo.propset_WhateverProperty('whatever value'));
        void (utils.__cadesAsyncToken__ + cadesBarNoMatterWhat.whateverMethod(cadesFoo));
      });

      expect(normalize(result)).toEqual(
        normalize(`cadesplugin.async_spawn(function* anonymous(utils
) {

                var cadesFoo = yield cadesplugin.CreateObjectAsync('CADESCOM.Foo');
                var cadesBar = yield cadesplugin.CreateObjectAsync('CAdESCOM.Bar');
                var cadesBarNoMatterWhat = yield cadesBar.NoMatterWhat;
                void (yield cadesFoo.propset_WhateverProperty('whatever value'));
                void (yield cadesBarNoMatterWhat.whateverMethod(cadesFoo));

});//# sourceURL=crypto-pro_customAsyncEnvImplementation.js`),
      );
    });
  });
});
