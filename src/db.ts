import {
    Logging,
} from 'homebridge';
import DBConstructor, { Database, Statement } from "better-sqlite3";
import { DB_PATH } from "./settings";

export type EnviroData = {
    temp: number;
    pres: number;
    hum: number;
    datetime: string;
}

export type EnviroDataRow = {
    temperature: number;
    humidity: number;
    pressure: number;
    date: Date;
}

export interface SqDb {
    getData: (log: Logging) => EnviroData;
    getDb: (log: Logging) => Database;
}

export class SenseDb implements SqDb {
    getData(log: Logging): EnviroData {
        const db = this.getDb(log);
        log("Reading from DB");
        const query: Statement = db.prepare(`
SELECT temperature, humidity, pressure, date
FROM envirolog
ORDER BY date DESC`);
        const dbRow: EnviroDataRow = query.get() as EnviroDataRow;
        let hatData: EnviroData = {
            temp: dbRow.temperature,
            pres: dbRow.pressure,
            hum: dbRow.humidity,
            datetime: dbRow.date.toString()
        };
        db.close();
        return hatData;
    }
    getDb(log: Logging): Database {
        log.info("Initiating DB Connection");
        const db = new DBConstructor(DB_PATH);
        return db;
    }
}