import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    nome: string;

    @Column({unique: true, nullable:false})
    email: string;

    
    @Column({nullable:false})
    telefone: string;
    
    @Column({nullable:false})
    dataNascimento: string;
    
    @Column({nullable:false})
    turma: string;
    
    @Column({nullable:false})
    serie: string;
    
    @Column({nullable:false})
    turno: string;
    
    @Column({nullable:false})
    responsavel: string;
    
    @Column({nullable:false})
    pizzaPreferida: string;
    
    @Column({nullable: true})
    documentosUrl?: string;

    @Column({nullable: true})
    endereco?: string;
    
    @Column({nullable: true})
    observacoes?: String;

    @Column({default: false})
    approved: boolean;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
