import { CADESCOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME } from '../constants';
import { _afterPluginsLoaded } from '../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';
import { _getCadesCert } from '../helpers/_getCadesCert';
import { _getDateObj } from '../helpers/_getDateObj';

/**
 * Создает присоединенную подпись сообщения по отпечатку сертификата
 *
 * @param thumbprint - отпечаток сертификата
 * @param message - подписываемое сообщение
 * @returns подпись в формате PKCS#7
 */
export const createAttachedSignature = _afterPluginsLoaded(
  async (thumbprint: string, unencryptedMessage: string | ArrayBuffer): Promise<string> => {
    const { cadesplugin } = window;
    const cadesCertificate = await _getCadesCert(thumbprint);

    return cadesplugin.async_spawn(function* createAttachedSignature() {
      let cadesAttrs;
      let cadesSignedData;
      let cadesSigner;
      try {
        cadesAttrs = yield cadesplugin.CreateObjectAsync('CADESCOM.CPAttribute');
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

      let messageBase64;
      try {
        messageBase64 = Buffer.from(unencryptedMessage).toString('base64');
      } catch (error) {
        console.error(error);
        throw new Error('Ошибка при преобразовании сообщения в Base64');
      }

      let cadesAuthAttrs;
      try {
        yield cadesSigner.propset_Certificate(cadesCertificate);
        cadesAuthAttrs = yield cadesSigner.AuthenticatedAttributes2;
        yield cadesAuthAttrs.Add(cadesAttrs);
        yield cadesSignedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);
        yield cadesSignedData.propset_Content(messageBase64);
        yield cadesSigner.propset_Options(cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN);
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при указании данных для подписи');
      }

      let signature;
      try {
        signature = yield cadesSignedData.SignCades(cadesSigner, cadesplugin.CADESCOM_PKCS7_TYPE);
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при подписании данных');
      }

      return signature;
    });
  },
);
