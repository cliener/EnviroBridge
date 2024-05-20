import {
  AccessoryPlugin,
  HAP,
  Logging,
  Service } from 'homebridge';
import lineByLine from "n-readlines";

type EnviroData = {
  temp: number;
  pres: number;
  hum: number;
  datetime: string;
}

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

        const hatData: EnviroData = this.getHATData(this.log);
        temperature = hatData.temp;

        return temperature;
      });
    this.temperatureService.getCharacteristic(hap.Characteristic.CurrentRelativeHumidity)
      .onGet(() => {
        let humidity = 10;
        this.log("Getting humidity");

        const hatData = this.getHATData(this.log);
        humidity = hatData.hum;
        return humidity;
    });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "Chris Industries")
      .setCharacteristic(hap.Characteristic.Model, "EnviroLogger Temperature");

    log.info(`Temperature sensor ${this.name} created`);
  }

  identify(): void {
    this.log("Identify");
  }

  getHATData(log: Logging): EnviroData {
    let hatData: EnviroData = {
      temp: 0,
      pres: 0,
      hum: 0,
      datetime: ""
    };
    log("Reading file");
    const liner = new lineByLine("/home/cliener/log.csv");

    let line;
    let lineNumber = 0;
    while ((line = liner.next())) {
      if (lineNumber === 1) {
        const parsedLine = line.toString("ascii").replace(/'/g, `"`);
        hatData = JSON.parse(parsedLine);
        break;
      }
      lineNumber = lineNumber + 1;
    }

    // Handle errors
    // this.log.error(`Failed to read temperature log due to error:`);
    // this.log.error((err as Error).message);

    return hatData;
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.temperatureService
    ]
  }
}
