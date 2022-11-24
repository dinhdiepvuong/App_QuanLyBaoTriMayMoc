import { EquipmentStatus } from './../../../common/constants';
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { EmployeeEntity } from "src/modules/employee/entities/employee.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity('equipment')
export class EquipmentEntity {
    @JoinColumn()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ 
        nullable: true,
        type: "varchar",
        length: 100
    })
    equipmentName: string;
    
    @Column({ 
        nullable: true,
        type: "text",
    })
    description: string;

    @Column({
        nullable: true, 
        type: 'varchar',
        length: 50
    })
    color: string;

    @Column({ 
        nullable: true,
        type: 'varchar',
        length: 100,
    })
    avatar: string;

    //Trang thai active hay lock
    @Column({ 
        default: EquipmentStatus.ACTIVE
    })
    status: EquipmentStatus;

    //Trang thai su dung cua thiet bi
    @Column({ 
        nullable: true,
        type: 'varchar',
        length: 100,
    })
    statusEquipment: string;

    @Column({ 
        nullable: true,
        type: 'varchar',
        length: 100,
    })
    size: string;

    @Column({ 
        nullable: true,
        type: 'real',
    })
    wattage: number;

    @Column({ 
        nullable: true,
        type: 'real',
    })
    efficiency: number;

    @Column({ 
        nullable: true,
        type: 'timestamp',
    })
    insurance: Date;

    @Column({ 
        nullable: true,
        type: 'varchar',
        length: 50,
    })
    series: string;

    @Column({ 
        nullable: true,
    })
    qr: string;


    @Column({ 
        nullable: true,
        type: 'real',
    })
    longitude: number;

    @Column({ 
        nullable: true,
        type: 'real',
    })
    latitude: number;

    @Column({ 
        nullable: true,
        type: 'real',
    })
    weight: number;

    @Column({ 
        nullable: true,
        type: 'real',
    })
    electricity: number;

    @ManyToOne(() => CategoryEntity, (catogory) => catogory.equipments)
    category: CategoryEntity
    
    @ManyToOne(() => EmployeeEntity, (employee) => employee.equipments)
    employee: EmployeeEntity


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
}