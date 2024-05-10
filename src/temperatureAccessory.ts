import {
  AccessoryPlugin,
  CharacteristicEventTypes,
  HAP,
  Logging,
  Service } from 'homebridge';
import fs from "node:fs";

/**
 * Temperature Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class TemperatureSensor implements AccessoryPlugin {
  private readonly log: Logging;

  name: string;

  private temperatureService: Service;
  private informationService: Service;

  constructor(hap: HAP, log: Logging, name: string) {
    this.log = log;
    this.name = name;

    this.temperatureService = new hap.Service.TemperatureSensor(name);
    this.temperatureService.getCharacteristic(hap.Characteristic.CurrentTemperature)
      .on(CharacteristicEventTypes.GET, this.getTemperature);
    
    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "Chris Industries")
      .setCharacteristic(hap.Characteristic.Model, "EnviroLogger Temperature");

    log.info(`Temperature sensor ${this.name} created`);
  }

  getTemperature(): number {
    try {
      const data = fs.readFileSync("~/log.csv");
      // read first line
      this.log.info(`Found data ${data}`);
      return 1;
    } catch (err) {
      this.log.error(`Failed to read temperature log due to error: ${err}`);
      return 0;
    }
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
