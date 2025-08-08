/** *
@author
Amnet Digital
@date
2024-05-20
@Model 
Role
@usage
Userrole Information will store 
*/

import { Column, Entity } from "typeorm";
import { BaseModel } from './BaseModel';

export interface Irole {
    name: string;   
    id?: number;
    is_deleted?: boolean;
    created_by?: number;
}
@Entity({ name: 'role' })
export class Role extends BaseModel {

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })   
    is_deleted?: boolean;  


    constructor(name: string,is_deleted:boolean,userId: number) {
        super();
        this.name = name
        this.is_deleted = is_deleted
    }
}
