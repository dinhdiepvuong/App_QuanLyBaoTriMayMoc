import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { EquipmentEntity } from "src/modules/equipment/entities/equipment.entity";
@Entity('category')
export class CategoryEntity {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column({ type: "varchar",nullable: false,length: 100 })

    category: string;

    @Column({ 
        type: 'varchar',
        nullable: false,
        length: 500
    })

    description: string;


    @OneToMany(() => EquipmentEntity, (equiment) => equiment.category) // note: we will create author property in the Photo class below
    equipments: EquipmentEntity[]

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    updatedDate?: Date;
    
    @Column({        
        nullable: true,
        type: "varchar"
    })
    creatBy? : string

    @Column({        
        nullable: true,
        type: "varchar"
    })
    updateBy? : string

    @Column({default: false})
    isDelete : boolean
}
