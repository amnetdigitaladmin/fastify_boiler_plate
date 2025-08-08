
    /** *
@author
Amnet Digital
@date
2024-05-20
@Model 
Role
@usage
Roles Information will store 
*/

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseModel}  from './BaseModel';

@Entity({ name: 'user_sessions' })
export class userSessions extends BaseModel {
    @Column({ nullable: true })
	last_active_at: Date;

    @Column({ nullable: true, default: true })
    is_active: boolean;

    @Column({ nullable: true })
	expires_at: Date;

    @Column({ nullable: true })
	user_id: number;

    constructor(last_active_at: Date, expires_at: Date, user_id: number, is_active: boolean) {
		super();
        this.last_active_at = last_active_at,
        this.expires_at = expires_at,
        this.user_id = user_id,
        this.is_active = is_active
	}
}
   