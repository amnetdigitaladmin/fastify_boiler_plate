//#region Global Imports
import {
	Entity,
	Column,
} from 'typeorm';
import { NotificationRequestType, RequestGroup } from '../../helpers/utils/enum' 
import { BaseModel } from './BaseModel';

@Entity({ name: 'notification' })
export class Notifications extends BaseModel {
	@Column({ type: 'enum', enum: NotificationRequestType })
	type: NotificationRequestType;

	@Column({ type: 'enum', enum: RequestGroup, nullable: true })
	request_group: RequestGroup;

	@Column({ type: 'integer', nullable: true })
	request_id: number;

	@Column({ type: 'integer' })
	emp_id: number;

	@Column({ type: 'json', nullable: true })
	content: any;

	@Column({ type: 'boolean', nullable: true })
	is_read: boolean;

	constructor(
		type: NotificationRequestType,
		emp_id: number,
		content: any,
		is_read: boolean,
		request_group: RequestGroup,
		request_id: number,	
	) {
		super();
		this.type = type;
		this.emp_id = emp_id;
		this.content = content;
		this.is_read = is_read;
		this.request_group = request_group;
		this.request_id = request_id;	
	}
}
