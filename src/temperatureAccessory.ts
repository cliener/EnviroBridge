import {
  AccessoryPlugin,
  HAP,
  Logging,
  Service
} from 'homebridge';
import { SenseLog, SenseLogger } from "./senseLog";

/**
 * Temperature Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class TemperatureSensor implements AccessoryPlugin {
  private readonly log: Logging;
  private name: string;
  private temperatureService: Service;
  private informationService: Service;
  private senseLog: SenseLogger

  constructor(hap: HAP, log: Logging, name: string) {
    this.log = log;
    this.name = name;
    this.senseLog = new SenseLog();

    this.temperatureService = new hap.Service.TemperatureSensor(this.name);
    this.temperatureService.getCharacteristic(hap.Characteristic.CurrentTemperature)
      .onGet(() => {
        let temperature = 10;
        this.log("Getting temperature");

        const hatData = this.senseLog.getData(this.log);
        temperature = hatData.temp;

        return temperature;
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
