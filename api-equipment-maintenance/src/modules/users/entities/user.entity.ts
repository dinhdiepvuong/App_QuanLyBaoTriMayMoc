import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from "src/common/constants";
import { IsEmail, IsNotEmpty } from "class-validator";
import { EmployeeEntity } from "src/modules/employee/entities/employee.entity";
@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @OneToOne(() => EmployeeEntity, (employee) => employee.user)
    employee:EmployeeEntity;

    @Column({
        type: 'varchar',
        nullable: false
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    password: string;

    @Column('enum', { enum: UserRole })
    role: UserRole;

    @Column({ default: UserStatus.NEW })
    status: UserStatus;

    @Column({ name: 'is_delete',nullable: true,default:false})
    isDelete: boolean

    @Column({nullable:true})
    otp?:number

    @Column({
        nullable:true,
        type : 'bigint'
    })
    @Column({name: 'created_by', nullable: true})
    createdBy?: string;

    @Column({ name: 'updated_by', nullable: true })
    updatedBy?: string;

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    updatedDate?: Date;

    @BeforeInsert() async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
