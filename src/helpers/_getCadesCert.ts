import { CadesCertificate } from '../api/certificate';
import { _afterPluginsLoaded } from './_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from './_extractMeaningfulErrorMessage';

/**
 * Возвращает сертификат в формате Cades по отпечатку
 *
 * @param thumbprint - отпечаток сертификата
 * @returns сертификат в формате Cades
 */
export const _getCadesCert = _afterPluginsLoaded(
  (thumbprint: string): CadesCertificate => {
    const { cadesplugin } = window;

    return cadesplugin.async_spawn(function* _getCadesCert() {
      let cadesStore;
      try {
        cadesStore = yield cadesplugin.CreateObjectAsync('CAdESCOM.Store');
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при попытке доступа к хранилищу');
      }

      if (!cadesStore) {
        throw new Error('Не удалось получить доступ к хранилищу сертификатов');
      }

      try {
        yield cadesStore.Open(
          cadesplugin.CAPICOM_CURRENT_USER_STORE,
          cadesplugin.CAPICOM_MY_STORE,
          cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED,
        );
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при открытии хранилища');
      }

      let cadesCertificateList;
      let certificatesCount;
      try {
        cadesCertificateList = yield cadesStore.Certificates;
        certificatesCount = yield cadesCertificateList.Count;
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка получения списка сертификатов');
      }

      if (!certificatesCount) {
        throw new Error('Нет доступных сертификатов');
      }

      let cadesCertificate: CadesCertificate;
      try {
        cadesCertificateList = yield cadesCertificateList.Find(
          cadesplugin.CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
          thumbprint,
        );

        const count = yield cadesCertificateList.Count;

        if (!count) {
          throw new Error(`Сертификат с отпечатком: "${thumbprint}" не найден`);
        }

        cadesCertificate = yield cadesCertificateList.Item(1);
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при получении сертификата');
      }

      cadesStore.Close();

      return cadesCertificate;
    });
  },
);
