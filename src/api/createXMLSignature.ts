import { _afterPluginsLoaded } from '../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';
import { _getCadesCert } from '../helpers/_getCadesCert';

/** Дополнительные настройки */
type Options = {
  /**
   * Метод подписи
   *
   * @defaultValue `cadesplugin.XmlDsigGost3410Url2012256`
   */
  signatureMethod?: string;
  /**
   * Метод формирования дайджеста
   *
   * @defaultValue `cadesplugin.XmlDsigGost3411Url2012256`
   */
  digestMethod?: string;
};

/**
 * Создает XML подпись для документа в формате XML
 *
 * @param thumbprint - отпечаток сертификата
 * @param unencryptedMessage - подписываемое сообщение в формате XML
 * @options - дополнительные настройки
 *
 * @returns подпись
 */
export const createXMLSignature = _afterPluginsLoaded(
  async (thumbprint: string, unencryptedMessage: string, options?: Options): Promise<string> => {
    const { cadesplugin } = window;
    const cadesCertificate = await _getCadesCert(thumbprint);

    return cadesplugin.async_spawn(function* createXMLSignature() {
      let cadesSigner;
      let cadesSignedXML;
      try {
        cadesSigner = yield cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');
        cadesSignedXML = yield cadesplugin.CreateObjectAsync('CAdESCOM.SignedXML');
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при инициализации подписи');
      }

      try {
        const signatureMethod = options?.signatureMethod ?? cadesplugin.XmlDsigGost3410Url2012256;
        const digestMethod = options?.digestMethod ?? cadesplugin.XmlDsigGost3411Url2012256;

        yield cadesSigner.propset_Certificate(cadesCertificate);
        yield cadesSigner.propset_CheckCertificate(true);
        yield cadesSignedXML.propset_Content(unencryptedMessage);
        yield cadesSignedXML.propset_SignatureType(cadesplugin.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED);
        yield cadesSignedXML.propset_SignatureMethod(signatureMethod);
        yield cadesSignedXML.propset_DigestMethod(digestMethod);
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при указании данных для подписи');
      }

      let signature: string;
      try {
        signature = yield cadesSignedXML.Sign(cadesSigner);
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при подписании данных');
      }

      return signature;
    });
  },
);
