import moment from "moment-timezone";  
import {   
    Column,   
    CreateDateColumn,   
    UpdateDateColumn,   
    BeforeInsert,   
    PrimaryGeneratedColumn   
} from 'typeorm';  

export abstract class Model0 {  
    jsonIgnore: string[] = ['logicalDelete', 'is_deleted', 'jsonIgnore'];  

    @Column({ nullable: false })  
    created_by?: string = '';  

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })  
    created_at?: Date;  

    @Column({ nullable: true })  
    updated_by?: string = '';  

    @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })  
    updated_at?: Date;  

    @BeforeInsert()  
    insertCreated() {  
        const currentTime = moment().utc().tz('Asia/Kolkata').toDate();  
        this.created_at = currentTime;  
        this.updated_at = currentTime;  
    }  

    @Column({ nullable: true, default: false })  
    is_deleted?: boolean = false;  

    logicalDelete: boolean;  

    constructor() {  
        this.logicalDelete = true;  
    }  

    // Don't serialize some fields  
    toJSON() {  
        const result: Record<string, any> = {};  
        for (const x in this) {  
            if (!this.jsonIgnore.includes(x)) {  
                // @ts-ignore  
                result[x] = this[x];  
            }  
        }  
        return result;  
    }  
}  

export abstract class BaseModel extends Model0 {  
    @PrimaryGeneratedColumn()  
    id: number;  

    constructor() {  
        super();  
        this.id = 0; // This will be set by the database when the entity is saved  
    }  
}  