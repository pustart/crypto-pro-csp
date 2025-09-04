import { CADESCOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME } from '../constants';
import { _afterPluginsLoaded } from '../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';
import { _getCadesCert } from '../helpers/_getCadesCert';
import { _getDateObj } from '../helpers/_getDateObj';

/** Дополнительные настройки */
type Options = {
  /**
   * Алгоритм хеширования
   *
   * @defaultValue `cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256`
   */
  hashedAlgorithm?: number;
};

/**
 * Создает отсоединенную подпись хеша по отпечатку сертификата
 *
 * @param thumbprint - отпечаток сертификата
 * @param messageHash - хеш подписываемого сообщения, сгенерированный по ГОСТ Р 34.11-2012 256 или 512 бит в зависимости от алгоритма открытого ключа
 * @param options - дополнительные настройки
 * @returns подпись в формате PKCS#7
 */
export const createDetachedSignature = _afterPluginsLoaded(
  async (thumbprint: string, messageHash: string, options?: Options): Promise<string> => {
    const { cadesplugin } = window;
    const cadesCertificate = await _getCadesCert(thumbprint);

    return cadesplugin.async_spawn(function* createDetachedSignature() {
      let cadesAttrs;
      let cadesHashedData;
      let cadesSignedData;
      let cadesSigner;
      try {
        cadesAttrs = yield cadesplugin.CreateObjectAsync('CADESCOM.CPAttribute');
        cadesHashedData = yield cadesplugin.CreateObjectAsync('CAdESCOM.HashedData');
        cadesSignedData = yield cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');
        cadesSigner = yield cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при инициализации подписи');
      }

      const currentTime = _getDateObj(new Date());
      try {
        yield cadesAttrs.propset_Name(CADESCOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME);
        yield cadesAttrs.propset_Value(currentTime);
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при установке времени подписи');
      }

      let cadesAuthAttrs;
      try {
        yield cadesSigner.propset_Certificate(cadesCertificate);
        cadesAuthAttrs = yield cadesSigner.AuthenticatedAttributes2;
        yield cadesAuthAttrs.Add(cadesAttrs);
        yield cadesSigner.propset_Options(cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN);
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при установке сертификата');
      }

      try {
        yield cadesHashedData.propset_Algorithm(
          options?.hashedAlgorithm ?? cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256,
        );
        yield cadesHashedData.SetHashValue(messageHash);
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при установке хеша');
      }

      let signature;
      try {
        signature = yield cadesSignedData.SignHash(cadesHashedData, cadesSigner, cadesplugin.CADESCOM_PKCS7_TYPE);
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при подписании данных');
      }

      return signature;
    });
  },
);
