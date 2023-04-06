import { PrimaryGeneratedColumn, Column, Entity, BaseEntity } from "typeorm";

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
}