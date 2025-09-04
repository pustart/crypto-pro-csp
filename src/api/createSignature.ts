import { CADESCOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME } from '../constants';
import { _afterPluginsLoaded } from '../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';
import { _getCadesCert } from '../helpers/_getCadesCert';
import { _getDateObj } from '../helpers/_getDateObj';

/**
 * Создает подпись base64 строки по отпечатку сертификата
 *
 * @param thumbprint - отпечаток сертификата
 * @param messageHash - хеш подписываемого сообщения, сгенерированный по ГОСТ Р 34.11
 * @param detachedSignature = true - тип подписи открепленная (true) / присоединенная (false)
 * @returns подпись
 */
export const createSignature = _afterPluginsLoaded(
  async (thumbprint: string, messageHash: string, detachedSignature: boolean = true): Promise<string> => {
    console.warn(
      [
        'cryptoPro: Метод "createSignature" является устаревшим и будет убран из будущих версий.',
        'Используйте "createAttachedSignature" и "createDetachedSignature".',
      ].join('\n'),
    );

    const { cadesplugin } = window;
    const cadesCertificate = await _getCadesCert(thumbprint);

    return cadesplugin.async_spawn(function* createSignature() {
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

      let cadesAuthAttrs;
      try {
        yield cadesSigner.propset_Certificate(cadesCertificate);
        cadesAuthAttrs = yield cadesSigner.AuthenticatedAttributes2;
        yield cadesAuthAttrs.Add(cadesAttrs);
        yield cadesSignedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);
        yield cadesSignedData.propset_Content(messageHash);
        yield cadesSigner.propset_Options(cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY);
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при указании данных для подписи');
      }

      let signature: string;
      try {
        signature = yield cadesSignedData.SignCades(cadesSigner, cadesplugin.CADESCOM_CADES_BES, detachedSignature);
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при подписании данных');
      }

      return signature;
    });
  },
);
