import { _afterPluginsLoaded } from '../../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../../helpers/_extractMeaningfulErrorMessage';
import { Certificate } from './certificate';

/**
 * Экспортирует сертификат в формате base64
 *
 * @returns сертификат в формате base64
 */
export const exportBase64 = _afterPluginsLoaded(function (): string {
  const { cadesplugin } = window;
  const cadesCertificate = (this as Certificate)._cadesCertificate;

  return cadesplugin.async_spawn(function* exportBase64() {
    let base64: string;

    try {
      base64 = yield cadesCertificate.Export(0);
    } catch (error) {
      console.error(error);

      throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при экспорте сертификата');
    }

    return base64;
  });
});
