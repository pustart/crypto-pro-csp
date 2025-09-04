import { _afterPluginsLoaded } from '../../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../../helpers/_extractMeaningfulErrorMessage';
import { Certificate } from './certificate';

/**
 * Возвращает указанное внутренее свойство у сертификата в формате Cades
 *
 * @param propName = наименование свойства
 * @returns значение запрошенного свойства
 */
export const getCadesProp = _afterPluginsLoaded(function (propName: string): any {
  const { cadesplugin } = window;
  const cadesCertificate = (this as Certificate)._cadesCertificate;

  return cadesplugin.async_spawn(function* getCadesProp() {
    let propertyValue;
    try {
      propertyValue = yield cadesCertificate[propName];
    } catch (error) {
      console.error(error);

      throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при обращении к свойству сертификата');
    }

    return propertyValue;
  });
});
