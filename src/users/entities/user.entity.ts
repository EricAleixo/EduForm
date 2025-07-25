import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false, unique: true})
    username:string;

    @Column({nullable:false})
    password:string;

    @Column("simple-array")
    roles:string[]

}
