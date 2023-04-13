import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Author } from "./Author";

// Entity dekoraator ütleb TypoeORMil kuidas sellest tabel teha ja millised väljad on olemas
@Entity()
export class Article extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    // column dekraator kirjeldab andmebaasile veergu, ilma selleta andmebaasi veergu pole
    @Column({type: "varchar", length: 200})
    title!: string;

    @Column({type: "text"})
    body!: string;

    @Column({type: "number"})
    authorId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne((type) => Author, (author)=> author.articles, {eager: true})
    author!: Author;
}


