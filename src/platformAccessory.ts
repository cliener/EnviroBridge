import {
  AccessoryPlugin,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service } from 'homebridge';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class EnviroTemperatureSensor implements AccessoryPlugin {
  private readonly log: Logging;

  private currentTemperature: number = 0;

  name: string;

  private temperatureService: Service;
  private informationService: Service;

  constructor(hap: HAP, log: Logging, name: string) {
    this.log = log;
    this.name = name;

    this.temperatureService = new hap.Service.TemperatureSensor(name);
    this.temperatureService.getCharacteristic(hap.Characteristic.CurrentTemperature)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Current temperature sensor was returned: " + this.currentTemperature);
        callback(undefined, this.currentTemperature);
      })
      .on(CharacteristicEventTypes.SET, 
        (value: CharacteristicValue, callback: CharacteristicGetCallback) => {
          this.currentTemperature = value as number;
          log.info(`Temperature sensor state was set to ${this.currentTemperature}`);
          callback();
      });
    
    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "Chris Industries")
      .setCharacteristic(hap.Characteristic.Model, "EnviroLogger Temperature");

    log.info(`Temperature sensor ${this.name} created`);
  }

  identify(): void {
    this.log("Identify");
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.temperatureService
    ]
  }
}
