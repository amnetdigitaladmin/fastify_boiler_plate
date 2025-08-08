// import connect from "../../config/db";
import AppDataSource from "../../config/db";
import { Request, Response } from 'express';
// import { Role,Irole } from '../schemas/role';
// import { UserRole,Iuserrole } from '../schemas/user_role';
// import { User } from '../schemas/user';
import { User } from '@dineshReddyPadala/shared_models'
import { Role, Irole } from '../schemas/role';
import moment from 'moment';
import _ from 'lodash';
import 'moment-timezone';


// const roleRepository = AppDataSource.getRepository(Role); 
// const UserRoleRepository = AppDataSource.getRepository(UserRole);
const roleRepository = AppDataSource.getRepository(Role);


class RoleRepo {

    // //role create Actions
    public async createRole(params:any) {
        try {
            return await roleRepository.save(params);
        } catch (error:any) {
            console.log(error)           
        }
    }

    public async updateRole(params:Irole) {
        try {
            return await roleRepository.save(params);
        } catch (error:any) {
            console.log(error)           
        }
    }

    public async deleteRole(id:number) {
        try {
            let role = await roleRepository
            .createQueryBuilder('role')
            .where('role.id=:id', { id: id })             
            .andWhere('role.is_deleted=:is_deleted', { is_deleted: false })
            .getOne();            
            role.is_deleted = true
            return await roleRepository.save(role);
        } catch (error:any) {
            console.log(error)           
        }
    }

    // public async getByCode(code: string) {
    //     try {
    //         return await roleRepository
    //             .createQueryBuilder('role')
    //             .where('role.code=:code', { code: code })             
    //             .andWhere('role.is_deleted=:is_deleted', { is_deleted: false })
    //             .getOne();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }


        public async getRoleByName(name: string) {
        try {
             return await roleRepository
                .createQueryBuilder('role')
                .where('role.is_deleted = :is_deleted', { is_deleted: false })
                .andWhere('role.name = :name', { name: name })
                .getOne();        
        } catch (error) {
            console.log(error);
        }
    }
    public async getRoleById(id: number) {
        try {
            return await roleRepository
                .createQueryBuilder('role')                
                .where('role.id=:roleId', { roleId: id })
                .andWhere('role.is_deleted=:is_deleted', { is_deleted: false })        
                .getOne();
        } catch (err) {
            console.log(err);
        }
    }

    // public async getRoleByNameAndUser(name: string, userId: number) {
    //     try {
    //         return await customerRoleRepository
    //             .createQueryBuilder('role')
    //             .where('role.name=:name and role.userId=:userId', { name: name, userId: userId })
    //             .andWhere('role.is_deleted=:is_deleted and RQ.is_deleted=:is_deleted and question.is_deleted=:is_deleted', { is_deleted: false })        
    //             .getOne();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    public async getRoles() {
        try {
             var roles = await roleRepository
                .createQueryBuilder('role')
                .where('role.is_deleted = :is_deleted', { is_deleted: false })
                .select(['role.id as id'])
                .getRawMany();
            if(roles && roles.length > 0 ){
                roles = roles.map((item:any)=> {return item.id})
             }else{
                roles = []
             }
             return roles
        } catch (error) {
            console.log(error);
        }
    }

    public async getRolesForImport() {
        try {
             var roles = await roleRepository
                .createQueryBuilder('role')
                .where('role.is_deleted = :is_deleted', { is_deleted: false })
                .select(['role.id as id','role.name as name'])
                .getRawMany();
            if(roles && roles.length > 0 ){
                return roles
             }else{
                return []
             }           
        } catch (error) {
            console.log(error);
        }
    }



    // // public async getAllRoles(query: any) {
    // //     try {
    // //         let params: any = query
    // //         let offSet = params.offset ? params.offset : 1;
    // //         let Limit = params.limit ? params.limit : 10000;
    // //         const startYear = moment().subtract(10, 'year').format('YYYY-MM-DD');
    // //         const endYear = moment().endOf('year').format('YYYY-MM-DD');
    // //         let order_by = params.order_by ? params.order_by : 'updated_at';
    // //         let sort_order = params.sort_order ? params.sort_order : "DESC";
    // //         if (params.search_text) {
    // //             return await roleRepository
    // //             .createQueryBuilder('role')
    // //             .leftJoinAndMapMany('role.userRoles', UserRole, 'UR', 'UR.roleId = role.id')
    // //             .leftJoinAndMapMany('role.questions', roleQuestion, 'RQ', 'RQ.roleId = role.id')
    // //             .where(
    // //                 `LOWER(role.name) like :searchText`,
    // //                 { searchText: `%${params.search_text.toLowerCase()}%` },
    // //             )
    // //             .andWhere('role.is_deleted = :is_deleted', { is_deleted: false })
    // //             .andWhere('UR.is_deleted = :is_deleted', { is_deleted: false })
    // //             .andWhere('RQ.is_deleted = :is_deleted', { is_deleted: false })
    // //             .select([
    // //                 'role.id as id',
    // //                 'role.name as name',
    // //                 'role.code as code',
    // //                 'role.created_at  as created_at',
    // //                 'role.updated_at as updated_at',
    // //                 'COUNT(DISTINCT UR.userId) as contacts',
    // //                 'COUNT(DISTINCT RQ.questionId) as questions'
    // //             ])
    // //             .groupBy('role.id')
    // //             .orderBy(`role.${order_by}`, sort_order)
    // //             .skip(offSet)
    // //             .take(Limit)
    // //             .getRawMany();
    // //         } else {
    // //             return await roleRepository
    // //             .createQueryBuilder('role')
    // //             .leftJoinAndMapMany('role.userRoles', UserRole, 'UR', 'UR.roleId = role.id')
    // //             .leftJoinAndMapMany('role.questions', roleQuestion, 'RQ', 'RQ.roleId = role.id')
    // //             // .where(`date_trunc('day', role.created_at) >= :fromDate AND date_trunc('day', role.created_at) <= :toDate`, {
    // //             //     fromDate: params.from_date || startYear,
    // //             //     toDate: params.to_date || endYear,
    // //             // })
    // //             .where('role.is_deleted = :is_deleted', { is_deleted: false })
    // //             .andWhere('UR.is_deleted = :is_deleted', { is_deleted: false })
    // //             .andWhere('RQ.is_deleted = :is_deleted', { is_deleted: false })
    // //             .select([
    // //                 'role.id as id',
    // //                 'role.name as name',
    // //                 'role.code as code',
    // //                 'role.created_at  as created_at',
    // //                 'role.updated_at as updated_at',
    // //                 'COUNT(DISTINCT UR.userId) as contacts',
    // //                 'COUNT(DISTINCT RQ.questionId) as questions'
    // //             ])
    // //             .groupBy('role.id')
    // //             .orderBy(`role.${order_by}`, sort_order)
    // //             .skip(offSet)
    // //             .take(Limit)
    // //             .getRawMany();
    // //         }
    // //     } catch (error) {
    // //         console.log(error);
    // //     }
    // // }

    // // public async getAllRolesCount(query: any) {
    // //     try {
    // //         let params: any = query          
    // //         const startYear = moment().subtract(10, 'year').format('YYYY-MM-DD');
    // //         const endYear = moment().endOf('year').format('YYYY-MM-DD');           
    // //         if (params.search_text) {
    // //             return await roleRepository
    // //             .createQueryBuilder('role')
    // //             .leftJoinAndMapMany('role.userRoles', UserRole, 'UR', 'UR.roleId = role.id')
    // //             .leftJoinAndMapMany('role.questions', roleQuestion, 'RQ', 'RQ.roleId = role.id')
    // //             .where(
    // //                 `LOWER(role.name) like :searchText`,
    // //                 { searchText: `%${params.search_text.toLowerCase()}%` },
    // //             )
    // //             .andWhere('role.is_deleted = :is_deleted', { is_deleted: false })
    // //             .andWhere('UR.is_deleted = :is_deleted', { is_deleted: false })
    // //             .andWhere('RQ.is_deleted = :is_deleted', { is_deleted: false })
    // //             .select([
    // //                 'role.id as id',
    // //                 'role.name as name',
    // //                 'role.code as code',
    // //                 'role.created_at  as created_at',
    // //                 'role.updated_at as updated_at',
    // //                 'COUNT(DISTINCT UR.userId) as contacts',
    // //                 'COUNT(DISTINCT RQ.questionId) as questions'
    // //             ])
    // //             .groupBy('role.id')             
    // //             .getCount();
    // //         } else {
    // //             return await roleRepository
    // //             .createQueryBuilder('role')
    // //             .leftJoinAndMapMany('role.userRoles', UserRole, 'UR', 'UR.roleId = role.id')
    // //             .leftJoinAndMapMany('role.questions', roleQuestion, 'RQ', 'RQ.roleId = role.id')
    // //             .where(`date_trunc('day', role.created_at) >= :fromDate AND date_trunc('day', role.created_at) <= :toDate`, {
    // //                 fromDate: params.from_date || startYear,
    // //                 toDate: params.to_date || endYear,
    // //             })
    // //             .andWhere('role.is_deleted = :is_deleted', { is_deleted: false })
    // //             .andWhere('UR.is_deleted = :is_deleted', { is_deleted: false })
    // //             .andWhere('RQ.is_deleted = :is_deleted', { is_deleted: false })              
    // //             .groupBy('role.id')               
    // //             .getCount();
    // //         }
    // //     } catch (error) {
    // //         console.log(error);
    // //     }
    // // }

    // // //assign actions   
    // //  public async assignuser(params:Iuserrole[]) {
    // //     try {
    // //         return await UserRoleRepository.save(params);
    // //     } catch (error:any) {
    // //         console.log(error)           
    // //     }
    // // }

    // // public async getuserRoleByRoleId(roleId:number) {
    // //     try {
    // //         return await UserRoleRepository
    // //             .createQueryBuilder('userrole')
    // //             .where('userrole.roleId=:roleId', { roleId: roleId })             
    // //             .andWhere('userrole.is_deleted=:is_deleted', { is_deleted: false })
    // //             .getMany();
    // //     } catch (err) {
    // //         console.log(err);
    // //     }
    // // }

    // // public async getuserRoleByUserId(userId:number) {
    // //     try {
    // //         return await UserRoleRepository
    // //             .createQueryBuilder('userrole')
    // //             .where('userrole.userId=:userId', { userId: userId })             
    // //             .andWhere('userrole.is_deleted=:is_deleted', { is_deleted: false })
    // //             .getOne();
    // //     } catch (err) {
    // //         console.log(err);
    // //     }
    // // }

    // // public async deleteUserRolesByIds(userIds:number[],id:number) {
    // //     try {
    // //         return await UserRoleRepository
    // //         .createQueryBuilder()
    // //         .update()
    // //         .set({ is_deleted: true })
    // //         .where('userId IN (:...userIds)', { userIds })
    // //         .andWhere('roleId IN (:...roleId)', { roleId: [id] })
    // //         .andWhere('is_deleted = :is_deleted', { is_deleted: false })
    // //         .returning(['id'])
    // //         .execute();
    // //     } catch (err) {
    // //         console.log(err);
    // //     }
    // // }

    // //create customerRoles   
    // public async createCustomerRole(params: Icustomer_role) {
    //     try {
    //         return await customerRoleRepository.save(params);
    //     } catch (error: any) {
    //         console.log(error)
    //     }
    // }

    // public async getByRoleName(name: string, userId: number) {
    //     try {
    //         return await customerRoleRepository
    //             .createQueryBuilder('customrole')
    //             .where('customrole.name=:name', { name: name })               
    //             .andWhere('customrole.userId=:userId', { userId: userId })
    //             .andWhere('customrole.is_deleted=:is_deleted', { is_deleted: false })
    //             .getOne();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // public async getAllRoleByIndustryId(industryId: number) {
    //     try {
    //         return await customerRoleRepository
    //             .createQueryBuilder('customrole')               
    //             .andWhere('customrole.is_deleted=:is_deleted', { is_deleted: false })
    //             .getMany();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

}

export default new RoleRepo()
