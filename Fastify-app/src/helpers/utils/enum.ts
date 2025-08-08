//import enums

export enum ImportStatusType {
    NotStarted = 1,
    InProgress = 2,
    Completed = 3,
    Error = 4,
}

export const enum EmployeeType {
    Permanent = 'Permanent',
    Contract = 'Contract',   
}

export const enum MaritalType {
    Single = 'Single',
    Married = 'Married',   
}

export const enum genderType {
    Male = 'Male',
    Female = 'Female', 
    Others = 'Others',   

}

export const enum ActionItemStatusType {
    Not_Yet_Started = 'Not Yet Started',
    InProgress = 'InProgress', 
    Completed = 'Completed', 
    Cancelled = 'Cancelled',   
}

export const enum CampaignStatusType {
    Not_Yet_Started = 'Not Yet Started',
    InProgress = 'InProgress', 
    Completed = 'Completed', 
}

export const enum platformType {
    web = 'Web',
    mobile = 'Mobile'
}

export const enum contextType {
    ADMIN = 'Admin',
    BUSINESS_PARTNER = 'Business Partner',
    CLIENT = 'Client'
}

export enum ImportType {
    admin = 1,
	business_partner = 2,
    client = 3
}

export enum userType {
    admin = 1,
	business_partner = 2,
    client = 3
}

export enum ReportColumnDataType {
	Int = 1,
	String = 2,
	Date = 3,
	Time = 4,
	DateTime = 5,
	Money = 6,
}

export enum CONSTANTS {
	READ = 'READ',
	DELETE = 'DELETE',
	SEND = 'SEND',
}

export enum NotificationRequestType {
	request_raised = 'request raised',	
	request_approve = 'request approve',
	request_reject = 'request reject',
	request_withdraw = 'request withdraw',
	reminder = 'reminder',	
	import = 'import',
}

export enum RequestGroup {
	ADMIN = 'Admin',
    BUSINESS_PARTNER = 'Business Partner',
    CLIENT = 'Client'

}


