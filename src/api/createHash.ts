import { TranscodeEncoding } from 'buffer';
import { _afterPluginsLoaded } from '../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';

/** Дополнительные настройки */
type Options = {
  /**
   * Алгоритм хеширования
   *
   * @defaultValue `cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256`
   */
  hashedAlgorithm?: number;
  /**
   * Кодировка сообщения для хеширования
   *
   * @defaultValue `utf8`
   */
  encoding?: TranscodeEncoding;
};

/**
 * Создает хеш сообщения по ГОСТ Р 34.11-2012 (по умолчанию 256 бит)
 * https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D1%80%D0%B8%D0%B1%D0%BE%D0%B3_(%D1%85%D0%B5%D1%88-%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F)
 *
 * @param unencryptedMessage - сообщение для хеширования
 * @options - дополнительные настройки
 *
 * @returns хеш
 */
export const createHash = _afterPluginsLoaded(
  async (unencryptedMessage: string | ArrayBuffer, options?: Options): Promise<string> => {
    const { cadesplugin } = window;

    return cadesplugin.async_spawn(function* createHash() {
      const cadesHashedData = yield cadesplugin.CreateObjectAsync('CAdESCOM.HashedData');
      let messageBase64;
      let hash;
      try {
        if (options?.encoding && typeof unencryptedMessage === 'string') {
          messageBase64 = Buffer.from(unencryptedMessage, options?.encoding).toString('base64');
        } else {
          messageBase64 = Buffer.from(unencryptedMessage).toString('base64');
        }
      } catch (error) {
        console.error(error);
        throw new Error('Ошибка при преобразовании сообщения в Base64');
      }

      try {
        yield cadesHashedData.propset_Algorithm(
          options?.hashedAlgorithm ?? cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256,
        );
        yield cadesHashedData.propset_DataEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);
        yield cadesHashedData.Hash(messageBase64);
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при инициализации хэширования');
      }

      try {
        hash = yield cadesHashedData.Value;
      } catch (error) {
        console.error(error);
        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при создании хэша');
      }

      return hash;
    });
  },
);
