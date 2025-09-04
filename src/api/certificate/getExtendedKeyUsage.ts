import { _afterPluginsLoaded } from '../../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../../helpers/_extractMeaningfulErrorMessage';
import { Certificate } from './certificate';

/**
 * Возвращает ОИД'ы сертификата
 *
 * @returns список ОИД'ов
 */
export const getExtendedKeyUsage = _afterPluginsLoaded(function (): string[] {
  const { cadesplugin } = window;
  const cadesCertificate = (this as Certificate)._cadesCertificate;

  return cadesplugin.async_spawn(function* getExtendedKeyUsage() {
    const OIDS: string[] = [];
    let count: any;

    try {
      count = yield cadesCertificate.ExtendedKeyUsage();
      count = yield count.EKUs;
      count = yield count.Count;

      if (count > 0) {
        while (count > 0) {
          let cadesExtendedKeyUsage;

          cadesExtendedKeyUsage = yield cadesCertificate.ExtendedKeyUsage();
          cadesExtendedKeyUsage = yield cadesExtendedKeyUsage.EKUs;
          cadesExtendedKeyUsage = yield cadesExtendedKeyUsage.Item(count);
          cadesExtendedKeyUsage = yield cadesExtendedKeyUsage.OID;

          OIDS.push(cadesExtendedKeyUsage);

          count--;
        }
      }
    } catch (error) {
      console.error(error);

      throw new Error(_extractMeaningfulErrorMessage(error) || "Ошибка при получении ОИД'ов");
    }

    return OIDS;
  });
});
