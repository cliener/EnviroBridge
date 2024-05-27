import {
    Logging,
} from 'homebridge';
import { LOG_PATH } from "./settings";
import lineByLine from "n-readlines";

export type EnviroData = {
    temp: number;
    pres: number;
    hum: number;
    datetime: string;
}

export interface SenseLogger {
    getData: (log: Logging) => EnviroData;
}

export class SenseLog implements SenseLogger {
    getData(log: Logging): EnviroData {
        let hatData: EnviroData = {
            temp: 0,
            pres: 0,
            hum: 0,
            datetime: ""
        };
        log("Reading file");
        const liner = new lineByLine(LOG_PATH);

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

}