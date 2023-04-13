import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany, Timestamp, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Article } from "./Article";

// Entity dekoraator ütleb TypoeORMil kuidas sellest tabel teha ja millised väljad on olemas
@Entity()
export class Author extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "text"})
    firstName!: string;
    
    @Column({type: "text"})
    lastName!: string;

    @Column({type: "text", nullable: true})
    title!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany((type) => Article, (article)=> article.author)
    articles!: Article[];
}