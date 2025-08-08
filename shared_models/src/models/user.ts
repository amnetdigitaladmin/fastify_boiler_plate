
import { Column, Entity ,BeforeInsert,BeforeUpdate } from "typeorm";
import { BaseModel } from './BaseModel';

@Entity({ name: 'users' })
export class User extends BaseModel {
  
    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: true })
    full_name: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    mobile: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    pincode: string;

    @Column({ nullable: true, default: true })
    is_active: boolean;

    @Column({ nullable: true })
    EncryptPassword: string;

    @Column({ nullable: true })
    roleId: number;

    // @Column({ nullable: true })
    // contract_start_date: string;

    // @Column({ nullable: true })
    // contract_end_date: string;

    @Column({ nullable: true })
    company: string;

    constructor(     
        first_name: string,
        last_name: string, 
        full_name: string,       
        password: string,
        mobile: string,
        email: string, 
        address: string,
        city: string,
        state: string,
        country: string,
        pincode: string,
        is_active: boolean,
        EncryptPassword: string,
        roleId: number,
        // contract_start_date: string,
        // contract_end_date: string,
        company: string

    ) {
        super();     
        this.first_name = first_name,
        this.last_name = last_name,
        this.full_name = full_name ,
        this.password = password,
        this.EncryptPassword = EncryptPassword,
        this.mobile = mobile,
        this.email = email,
        this.is_active = is_active,       
        this.address = address,
        this.city = city,
        this.state = state,
        this.country = country,
        this.pincode = pincode,
        this.roleId = roleId,
        // this.contract_start_date = contract_start_date,
        // this.contract_end_date = contract_end_date,
        this.company = company
    }
}


