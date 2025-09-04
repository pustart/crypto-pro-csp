import { _afterPluginsLoaded } from '../../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../../helpers/_extractMeaningfulErrorMessage';
import { Certificate } from './certificate';

/**
 * Проверяет действительность сертификата
 *
 * @returns флаг валидности
 */
export const isValid = _afterPluginsLoaded(function (): boolean {
  const { cadesplugin } = window;
  const cadesCertificate = (this as Certificate)._cadesCertificate;

  return cadesplugin.async_spawn(function* isValid() {
    let isValid;

    try {
      isValid = yield cadesCertificate.IsValid();
      isValid = yield isValid.Result;
    } catch (error) {
      console.error(error);

      throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при проверке сертификата');
    }

    return Boolean(isValid);
  });
});
