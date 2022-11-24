import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { UserEntity } from "src/modules/users/entities/user.entity";
import { EquipmentEntity } from "src/modules/equipment/entities/equipment.entity";

@Entity('employee')
export class EmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UserEntity, (user) => user.employee )
    @JoinColumn()
    user:UserEntity;


    @Column({ 
        type: "varchar",
        length: 50
    })
    firstName: string;
    
    @Column({ 
        type: "varchar",
        length: 50   
    })
    lastName: string;

    @Column({ 
        type: 'varchar',
        nullable: false,
        length: 10
    })
    phone: string;

    @Column({ 
        type: 'varchar',
        length: 100,
        default :'phong1'
    })
    department: string;

    @Column({ 
        nullable: true,
        type: 'varchar',
        length: 200,
    })
    avatar: string;

    @OneToMany(() => EquipmentEntity, (equipment) => equipment.employee) // note: we will create author property in the Photo class below
    equipments: EquipmentEntity[]

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    updatedDate?: Date;
    
    @Column({ name: 'creat_by', nullable: true, default: "" })
    creatBy : string

    @Column({ name: 'update_by', nullable: true, default: "" })
    updateBy : string

    @Column({default:false})
    isDelete : boolean

    @BeforeInsert()
    updateCreatBy() {
        this.creatBy = this.firstName + ' ' +this.lastName;
    }
}