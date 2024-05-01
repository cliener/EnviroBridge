import {
  AccessoryPlugin,
  API,
  HAP,
  Logging,
  PlatformConfig, 
  StaticPlatformPlugin
} from 'homebridge';

import { EnviroTemperatureSensor } from './platformAccessory';

let hap: HAP;

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class EnviroLoggerPlatform implements StaticPlatformPlugin {
  private readonly log: Logging;

  constructor(log: Logging, config: PlatformConfig, api: API) {
    this.log = log;

    log.info("Enviro Logger Initialised");
  }

  accessories(callback: (foundAccessories: AccessoryPlugin[]) => void): void {
    callback([
      new EnviroTemperatureSensor(hap, this.log, "EnviroTemperatureSensor")
    ]);
  }
}

