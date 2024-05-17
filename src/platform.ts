import {
  AccessoryPlugin,
  API,
  HAP,
  Logging,
  StaticPlatformPlugin
} from 'homebridge';

import { PLATFORM_NAME } from './settings';

import { TemperatureSensor } from './temperatureAccessory';

let hap: HAP;

export = (api: API) => {
  hap = api.hap;
  api.registerPlatform(PLATFORM_NAME, EnviroLoggerPlatform);
}

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
class EnviroLoggerPlatform implements StaticPlatformPlugin {
  private readonly log: Logging;

  constructor(log: Logging) {
    this.log = log;

    log.info("Enviro Logger Initialised");
  }

  accessories(callback: (foundAccessories: AccessoryPlugin[]) => void): void {
    callback([
      new TemperatureSensor(hap, this.log, "EnviroTemperatureSensor")
    ]);
  }
}

