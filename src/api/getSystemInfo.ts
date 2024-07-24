import { _afterPluginsLoaded } from '../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';

export interface SystemInfo {
  cadesVersion: string;
  cspVersion: string;
}

/**
 * Предоставляет информацию о системе
 *
 * @returns информацию о CSP и плагине
 */
export const getSystemInfo = _afterPluginsLoaded(
  (): SystemInfo => {
    const { cadesplugin } = window;

    const sysInfo = {
      cadesVersion: null,
      cspVersion: null,
    };

    return cadesplugin.async_spawn(function* getSystemInfo() {
      let cadesAbout;
      try {
        cadesAbout = yield cadesplugin.CreateObjectAsync('CAdESCOM.About');

        sysInfo.cadesVersion = yield cadesAbout.PluginVersion;
        sysInfo.cspVersion = yield cadesAbout.CSPVersion();

        if (!sysInfo.cadesVersion) {
          sysInfo.cadesVersion = yield cadesAbout.Version;
        }

        sysInfo.cadesVersion = yield sysInfo.cadesVersion.toString();
        sysInfo.cspVersion = yield sysInfo.cspVersion.toString();
      } catch (error) {
        console.error(error);

        throw new Error(_extractMeaningfulErrorMessage(error) || 'Ошибка при получении информации о системе');
      }

      return sysInfo;
    });
  },
);
