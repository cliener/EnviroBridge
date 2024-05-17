import {
  AccessoryPlugin,
  HAP,
  Logging,
  Service } from 'homebridge';
import lineByLine from "n-readlines";

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
    
    this.temperatureService = new hap.Service.TemperatureSensor(this.name);
    this.temperatureService.getCharacteristic(hap.Characteristic.CurrentTemperature)
      .onGet(() => {
        let temperature = 10;
        this.log("Getting temperature");
        this.log("Reading file");

        const liner = new lineByLine("/home/cliener/log.csv");

        let line;
        let lineNumber = 0;
        while ((line = liner.next())) {
          if (lineNumber === 1) {
            const parsedLine = line.toString("ascii").replace(/'/g, `"`);
            const data = JSON.parse(parsedLine);
            temperature = data.temp;
            break;
          }
          lineNumber = lineNumber + 1;
        }
        // this.log.error(`Failed to read temperature log due to error:`);
        // this.log.error((err as Error).message);


        this.log(`Current temp: ${temperature}`);
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
