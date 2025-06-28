import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({unique: true})
    email: string;

    @Column()
    telefone: string;

    @Column()
    dataNascimento: string;

    @Column()
    turma: string;

    @Column()
    serie: string;

    @Column()
    turno: string;

    @Column()
    responsavel: string;

    @Column()
    pizzaPreferida: string;

    @Column()
    endereco?: string;

    @Column()
    observacoes?: String;

}
