import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings';
import { EnviroLoggerPlatform } from './platform';

// let hap: HAP;

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  // hap = api.hap;

  api.registerPlatform(PLATFORM_NAME, EnviroLoggerPlatform);
};
