export class Messages {	
	public static readonly INVALID_LOCATION: string = 'Invalid Location.';
	public static readonly INVALID_STATE: string = 'Invalid State.';
	public static readonly INVALID_COUNTRY: string = 'Invalid Country.';
	public static readonly INVALID_USER: string = 'Invalid User.';
	public static readonly INVALID_MANAGER: string = 'Invalid Manager.';	
	public static readonly INVALID_ROLE: string = 'Invalid Role.';	
	public static readonly INVALID_EMPLOYEE_TYPE: string = 'Invalid Employee Type.';
	public static readonly INVALID_CONTACT: string = 'Invalid Contact.';
	public static readonly INVALID_CONTACT_MOBILE: string = 'Mobile Number already exists';
	public static readonly INVALID_EMPLOYEE_ID: string = 'Employee ID already exists';
	public static readonly INVALID_USER_NAME: string = 'User Name already exists';
	public static readonly INVALID_CONTACT_EMAIL: string = 'Email ID Already Exists';
	public static readonly INVALID_EMAIL: string = 'Invalid Email ID';
	public static readonly INVALID_NAME: string = 'Invalid character length';	
	public static readonly OTP_TOO_MANY_REQUESTS: string = 'Too many requests for Otp.';
	public static readonly OTP_TOO_MANY_ATTEMPTS: string = 'You have exceeded the max count allowed. Please retry after 24 hours.';
	public static readonly OTP_EXPIRED: string = 'Otp Expired.';
	public static readonly OTP_SEND_MSG: string = 'Your Otp is.';
	public static readonly OTP_SEND_MSG_NEW: string = 'Dear User,';
	public static readonly OTP_SEND_MSG_NEW_EXT: string = 'is your one-time password (OTP). Please enter the OTP to proceed. Thank you, TeamLease Services Ltd';
	public static readonly LOCKED_ROLE: string = 'You cannot edit this role.';
	public static readonly LOCKED_ROLE_CODE: string = 'This code is reserved for system roles.';
	public static readonly LOCKED_ROLE_USERS: string = 'The user(s) for this role can be managed by the system only.';
	public static readonly AT_LEAST_1_SUPER: string = 'Atleast one super admin should exists.';
	public static readonly TENANT_ID_MISSING: string = 'TenantId missing in the Params.';
	public static readonly TENANT_ID_MISMATCH: string = 'TenantId mismatch';
	public static readonly INVALID_FILE_IMPORT: string = 'Invalid file. Please upload valid file';
	public static readonly INVALID_FILE_EMPTY: string = 'No records found. Please upload the file with data';
	public static readonly INVALID_FILE_EMPTY_DATA: string = 'No Data found in file. Upload a valid file';
	public static readonly MISSING_COLUMNS: string = 'Header Names are missing in uploaded file. Please upload valid file';	
	public static readonly IS_PHONE_TEN ="Mobile Number must be 10 Digits";
	public static readonly IS_PINCODE_SIX ="Pincode must be 6 Digits";
	public static readonly IS_FUTURE_DATES = "Future Dates are not Allowed";
	public static readonly IS_JOINING_DATES = "Joining Date is Invalid";
	public static readonly INVALID_BIRTH_DATE_FORMAT = "Invalid date format of DOB";
	public static readonly INVALID_JOINING_DATE_FORMAT = "Invalid date format of DOJ";
	public static readonly IS_VALID_GENDER = "Invalid Gender";
	public static readonly IS_VALID_MARITAL = "Invalid Marital status";
	public static readonly IS_VALID_EMPTYPE = "Invalid Employment type";



}