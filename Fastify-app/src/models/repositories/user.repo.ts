// import { User } from '../schemas/user';
import { User } from'@dineshReddyPadala/shared_models'
// import { UserRole } from '../schemas/user_role';
import AppDataSource from "../../config/db";
import common from "../../helpers/utils/common";
import { Role } from '../schemas/role';
import moment from 'moment';
import _ from 'lodash';
import 'moment-timezone';
import EmailService from './notification.service'; 
import RoleRepo from '../repositories/roles.repo';
import { ImportStatusType, ImportType, userType } from "../../helpers/utils/enum";


const userRepository = AppDataSource.getRepository(User);


class UserRepository {

    public async save(obj: any) {
        try {
            let password = await common.hashPassword(obj.password)
            obj.password = await password
            return await userRepository.save(obj)
        } catch (err) {
            console.log(err);

        }
    }

    public async userSave(obj: any) {
        try {
            return await userRepository.save(obj)
        } catch (err) {
            console.log(err);

        }
    }

    public async ImportUser(obj: any) {
        try {
            let error = []
            if (obj && obj.mobile && obj.mobile.toString().length != 10) {
                error.push('Mobile Number must be 10 Digits')
            }
            if (!await common.validateEmail(obj.email)) {
                error.push("Invalid email address");
            }
            let userInfo: any = await this.getUserByemail(obj.email);
            if (userInfo && userInfo.email) {
                error.push("Email already exists");
            }
            let mobileExist: any = await this.getUserByMobile(obj.mobile);
            if (mobileExist && mobileExist.mobile) {
                error.push("Mobile Number already exists");
            }
            const regex2 = /^[a-zA-Z\s]+$/;
            let mobileResult: any = regex2.test(obj.mobile);
            if (mobileResult) {
                error.push('Special characters and alphabets not allowed in mobile number')
            }
            if (obj && obj.first_name && obj.first_name.length < 3) {
                error.push('First name cannot be lessthan 3 letters')
            }
            const regex = /^[a-zA-Z\s]+$/;
            let FirstResult: any = regex.test(obj.first_name);
            if (!FirstResult) {
                error.push('Special characters and numbers not allowed in first name')
            }

            if (obj && obj.last_name && obj.last_name.length < 3) {
                error.push('Last name cannot be lessthan 3 letters')
            }
            let LastResult: any = regex.test(obj.last_name);
            if (!LastResult) {
                error.push('Special characters and numbers not allowed in last name')
            }

            if (await common.containsSpecialCharacters(obj.first_name)) {
                error.push('Special characters not Allowed in First name column')
            }
            if (await common.containsSpecialCharacters(obj.last_name)) {
                error.push('Special characters not Allowed in Last name column')
            }
            if (obj.type == userType.client) {
                // if (obj && obj.contract_start_date && obj.contract_end_date) {
                //     const startDate = new Date(obj.contract_start_date);
                //     const endDate = new Date(obj.contract_end_date);
                //     if (startDate > endDate) {
                //         error.push('Contract start date cannot be after contract end date');
                //     }
                // }
                // if (obj && obj.contract_start_date && obj.contract_end_date) {
                //     const startDate = new Date(obj.contract_start_date);
                //     const endDate = new Date(obj.contract_end_date);

                //     if (endDate < startDate) {
                //         error.push('Contract end date cannot be before contract start date');
                //     }
                // }              
            }

            if (error && error.length > 0) {
                return { status: 'error', message: error, code: 422 }
            }
            obj.full_name = `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
            let userPassword = obj.password;
            let password = await common.hashPassword(obj.password)
            obj.password = await password
            let Result: any = await userRepository.save(obj)
            if (Result) {
                obj.userPassword = userPassword;
                if (obj.type != userType.client) {
                    await EmailService.sendInvitation(obj);
                }
                return Result;
            }
        } catch (err) {
            console.log(err);

        }
    }

    public async getByemail(email: string) {
        try {
            return await userRepository
                .createQueryBuilder('user')
                .where('user.email=:email', { email: email })
                .andWhere('user.is_active=:is_active', { is_active: true })
                .andWhere('user.is_deleted=:is_deleted', { is_deleted: false })
                .getOne();
        } catch (err) {
            console.log(err);
        }
    }
    public async getUserByemail(email: string) {
        try {
            return await userRepository
                .createQueryBuilder('user')
                .where('user.email=:email', { email: email })
                .andWhere('user.is_deleted=:is_deleted', { is_deleted: false })
                .getOne();
        } catch (err) {
            console.log(err);
        }
    }

    public async getBusinessPartnerById(obj: any) {
        return await userRepository
            .createQueryBuilder('user')           
            .where('user.is_deleted=:is_deleted', { is_deleted: false })
            .getOne();
    }

    public async getSalesRepById(employee_id: number) {
        try {
            let data = await userRepository
                .createQueryBuilder('user')
                .where('user.employee_id =:employee_id', { employee_id: employee_id })
                // .andWhere('user.type=:type', { type: userType.sales_rep })
                .andWhere('user.is_deleted=:is_deleted', { is_deleted: false })
                .getOne();
            return data
        } catch (err) {
            console.log(err);
        }
    }

    public async getUserByMobile(mobile: any) {
        try {
            return await userRepository
                .createQueryBuilder('user')
                .where('user.mobile=:mobile', { mobile: mobile })
                .andWhere('user.is_deleted=:is_deleted', { is_deleted: false })
                .getOne();
        } catch (err) {
            console.log(err);
        }
    }

    public async getCustomerById(id: number) {
        try {
            return await userRepository
                .createQueryBuilder('user')
                .where('user.id=:id', { id: id })
                .andWhere('user.is_active=:is_active', { is_active: true })
                .andWhere('user.is_deleted=:is_deleted', { is_deleted: false })
                .getOne();
        } catch (err) {
            console.log(err);
        }
    }

    // public async getSuperAdminByemail(email: string) {
    //     try {
    //         return await superAdminRepository
    //             .createQueryBuilder('SD')
    //             .where('SD.email=:email', { email: email })
    //             .andWhere('SD.is_deleted=:is_deleted', { is_deleted: false })
    //             .getOne();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    public async getById(id: number) {
        try {
            return await userRepository
                .createQueryBuilder('user')
                .where('user.id=:id', { id: id })
                .andWhere('user.is_deleted =:is_deleted', { is_deleted: false })
                .getOne();
        } catch (err) {
            console.log(err);
        }
    }
    public async assignClients(obj: any, clients: number[]) {
       return  await userRepository
          .createQueryBuilder()
          .update('users') // explicitly specify the table
          .set({
            bp_id: obj.id,
            bp_name: obj.full_name,
            updated_by:obj.updated_by
          })
          .where('id IN (:...ids)', { ids: clients })
          .execute();
    }
    // public async importSave(obj: any) {
    //     try {
    //         return await importRepository.save(obj)
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // public async get(req: any): Promise<any> {
    //     try {
    //         const params = req.query;
    //         let importType: any = +req.params.type;
    //         let offSet = params.offset ? params.offset : 1;
    //         let Limit = params.limit ? params.limit : 10000;
    //         let order_by = params.order_by ? params.order_by : 'created_at';
    //         let sort_order = params.sort_order ? params.sort_order : "DESC";
    //         return await importRepository
    //             .createQueryBuilder('imp')
    //             // .leftJoinAndMapOne('imp.created_by', User, 'u', `CAST("imp"."created_by" AS integer) = u.id`)
    //             // .leftJoinAndMapOne('imp.updated_by', User, 'usr', `CAST("imp"."updated_by" AS integer) = usr.id`)
    //             .where('imp.is_deleted = :is_deleted', {
    //                 is_deleted: false,
    //             })
    //             // .andWhere('imp.import_type = :import_type', { import_type: importType })
    //             .orderBy(`imp.${order_by}`, sort_order)
    //             .skip(offSet - 1)
    //             .take(Limit)
    //             .getManyAndCount();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    public async getAllUsers() {
        try {
            return await userRepository
                    .createQueryBuilder('user')
                    .getRawMany();
        } catch (error) {
            console.log(error);
        }
    }


    public async getAllUserCount(query: any) {
        try {
            let params: any = query.query
            let roleId = params.roleId ? [params.roleId] : await RoleRepo.getRoles()
            if (params.search_text) {
                return await userRepository
                    .createQueryBuilder('user')
                    // .where(
                    //     `(LOWER(user.full_name) LIKE :searchText or 
                    //     LOWER(user.email) LIKE :searchText) and user.type = :type `,
                    //     { searchText: `%${params.search_text.toLowerCase()}%`, type: userType.customer },
                    // )
                    .andWhere('user.is_deleted = :is_deleted', { is_deleted: false })
                    .andWhere('user.roleId IN (:...roleId)', { roleId: roleId })
                    .select([
                        'user.id as id',
                        'user.first_name as first_name',
                        'user.last_name as last_name',
                        'user.email as email',
                        'user.mobile as mobile',
                        'user.is_active as is_active',
                        'user.roleId as roleId',
                        'user.created_at as created_at',
                        'user.updated_at as updated_at',
                    ])
                    .getRawMany();
            } else {
                return await userRepository
                    .createQueryBuilder('user')
                    .where('user.is_deleted = :is_deleted', { is_deleted: false })
                    .andWhere('user.roleId IN (:...roleId)', { roleId: roleId })
                    // Optional date filter
                    // .andWhere(
                    //     `date_trunc('day', user.created_at) >= :fromDate AND date_trunc('day', user.created_at) <= :toDate`,
                    //     {
                    //         fromDate: params.from_date || startYear,
                    //         toDate: params.to_date || endYear,
                    //     }
                    // )
                    .select([
                        'user.id as id',
                        'user.first_name as first_name',
                        'user.last_name as last_name',
                        'user.email as email',
                        'user.mobile as mobile',
                        'user.is_active as is_active',
                        'user.roleId as roleId',
                        'user.created_at as created_at',
                        'user.updated_at as updated_at',
                    ])
                    .getRawMany();
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async saveOTP(params: any) {
        try {
            //return await otpRepository.save(params);
        } catch (error: any) {
            console.log(error)
        }
    }

    // public async getOtpInfoByEmail(email: String) {
    //     try {
    //         let order_by = 'created_at';
    //         let sort_order = "DESC";
    //         return await otpRepository
    //             .createQueryBuilder('otp')
    //             .where('otp.send_to = :email', { email: email })
    //             .orderBy('otp.' + order_by, sort_order)
    //             .getOne();
    //     } catch (error: any) {
    //         console.log(error)
    //     }
    // }
    //dashboardAPIS
    
    public async getCountByRole(role: number) {        
        try {
            return await userRepository
                .createQueryBuilder('user')
                .where('user.roleId IN (:...Roles)', { Roles: [role] })
                .andWhere('user.is_deleted=:is_deleted', { is_deleted: false })
                .getCount();
        } catch (err) {
            console.log(err);
        }
    }

    

    public async getAdminUsers() {
        try {
            let data = await userRepository
                .createQueryBuilder('user')
                .leftJoinAndMapOne('user.role', Role, 'role', 'user.roleId = role.id')                
                .where('role.name =:name', { name: 'Admin' })
                .andWhere('user.is_active=:is_active', { is_active: true })
                .andWhere('user.is_deleted=:is_deleted', { is_deleted: false })
                .getMany();
            return data
        } catch (err) {
            console.log(err);
        }
    }

}

export default new UserRepository()