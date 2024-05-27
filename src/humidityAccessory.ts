import {
    AccessoryPlugin,
    HAP,
    Logging,
    Service
} from 'homebridge';
import { SenseLog, SenseLogger } from "./senseLog";

/**
 * Humidity Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class HumiditySensor implements AccessoryPlugin {
    private readonly log: Logging;
    private name: string;
    private humidityService: Service;
    private informationService: Service;
    private senseLog: SenseLogger;

    constructor(hap: HAP, log: Logging, name: string) {
        this.log = log;
        this.name = name;
        this.senseLog = new SenseLog();

        this.humidityService = new hap.Service.HumiditySensor(this.name);
        this.humidityService.getCharacteristic(hap.Characteristic.CurrentRelativeHumidity)
            .onGet(() => {
                let humidity = 10;
                this.log("Getting humidity");

                const hatData = this.senseLog.getData(this.log);
                humidity = hatData.hum;
                return humidity;
            });

        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "Chris Industries")
            .setCharacteristic(hap.Characteristic.Model, "EnviroLogger Humidity");

        log.info(`Humidity sensor ${this.name} created`);
    }

    identify(): void {
        this.log("Identify");
    }

    getServices(): Service[] {
        return [
            this.informationService,
            this.humidityService
        ]
    }
}
