import {DataSourceOptions} from "typeorm"

export const configOrm: DataSourceOptions = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true
}