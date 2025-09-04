import { _afterPluginsLoaded } from '../../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../../helpers/_extractMeaningfulErrorMessage';
import { Certificate } from './certificate';

export interface AlgorithmInfo {
  algorithm: string;
  oid: string;
}

/**
 * Возвращает информацию об алгоритме сертификата
 *
 * @returns информацию об алгоритме и его OID'е
 */
export const getAlgorithm = _afterPluginsLoaded(function (): AlgorithmInfo {
  const { cadesplugin } = window;
  const cadesCertificate = (this as Certificate)._cadesCertificate;

  return cadesplugin.async_spawn(function* getAlgorithm() {
    const algorithmInfo: AlgorithmInfo = {
      algorithm: null,
      oid: null,
    };
    let cadesPublicKey;
    try {
      cadesPublicKey = yield cadesCertificate.PublicKey();
      cadesPublicKey = yield cadesPublicKey.Algorithm;
      algorithmInfo.algorithm = yield cadesPublicKey.FriendlyName;
      algorithmInfo.oid = yield cadesPublicKey.Value;
    } catch (error) {
      console.error(error);

      throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при получении алгоритма');
    }

    return algorithmInfo;
  });
});
