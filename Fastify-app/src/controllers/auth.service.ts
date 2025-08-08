import { FastifyRequest, FastifyReply } from 'fastify';
// import roleService from './role.service';
// import EmailService from "./notification.service";
// import { IuserRole, userRole } from "../models/schemas/user-roles";
// import { User, Iuser,userSchema } from '../models/schemas/user';
import UserRepository  from '../models/repositories/user.repo';
import UserSessionsRepository  from '../models/repositories/userSessions.repo';
import logger from '../middlewares/logger';
import jwt from 'jsonwebtoken';
// import bcrypt from "bcrypt-nodejs";
import * as bcrypt from 'bcrypt';
import moment from 'moment';
import generator from "generate-password";
import { userType } from "../helpers/utils/enum";
// import common from "../helpers/utils/common";
// const Saml2js = require('saml2js');
// import { jwtDecode } from "jwt-decode";

interface ICridentials {
    email: string,
    password: string
}
class AuthService {
  public async Login(req: FastifyRequest, res: FastifyReply) {
    try {
      logger.info({ userEmail: (req.body as any).email, init: "Login"}, "login method called");
      const cridentials: ICridentials = req.body as ICridentials;
      let result: any = await UserRepository.getByemail(cridentials.email);
      if (result && !result.email && (!result.is_active || result.is_deleted)) {
        return res
          .status(404)
          .send({
            message:
              "User is Inactive or User doesn't exists",
          });
      }
      if (result && result.email) {
        if ((!result.is_active || result.is_deleted) && result.roleId != 1 ) {
          return res
            .status(404)
            .send({
              message:
                "User is Inactive or User doesn't exists please contact to superadmin",
            });
        }
      let isMatch = await bcrypt.compare(cridentials.password,result.password,)
      if (isMatch) {
              delete result["password"]
              let verfiySession: any = await UserSessionsRepository.isSessionActive(result.id);
              if (verfiySession) {
                  result.id = +result.id;
                  result.updated_by = 1
                  result.is_active = false;
                  await UserSessionsRepository.save(result);
              }
              const token = jwt.sign(
                { userId: result.id, roleId: result.roleId },
                process.env.JWT_SECRET_KEY!,
                { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRE!) }
              );
              if (token) {
                let obj: any = {
                  last_active_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                  is_active: true,
                  expires_at: moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
                  user_id: result.id,
                  created_by: result.created_by
                };
                await UserSessionsRepository.save(obj);
              }
              logger.info({ userId: result.id, success: "Login" }, "login method success");
              return res
                .status(200)
                .send({
                  token: token,
                  user_info: result,              
                  message: "User Logged in Successfully",
                });
            } else {
              return res.status(404).send({ message: "Invalid Password, Please try again." });
            }
        //   }
      } else {
        return res
          .status(404)
          .send({ message: "User is inactive or user doesn't exists" });
      }
    } catch (error) {
      logger.error({ userEmail: (req.body as any).email, init: "Login" }, "login method error: " + JSON.stringify(error));
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async forgotPassword(req: FastifyRequest, res: FastifyReply) {
    try {
      logger.info({ userEmail: (req.body as any).email, init: "forgotPassword"}, "forgotPassword method called");
      const cridentials: ICridentials = req.body as ICridentials;
      let result: any = await UserRepository.getByemail(cridentials.email);
      if (result && !result.email && (!result.is_active || result.is_deleted)) {
        return res
          .status(404)
          .send({
            message:
              "User is Inactive or User doesn't exists",
          });
      }
      if (result && result.email) {
        if (!result.is_active || result.is_deleted) {
          return res
            .status(404)
            .send({
              message:
                "User is Inactive or User doesn't exists please contact to superadmin",
            });
        }
        result = { ...result, ...cridentials };
        await UserRepository.save(result);
        return res.status(200).send({ message: "Password Updated Successfully" });
      } else {
        return res
          .status(404)
          .send({ message: "User is Inactive or user doesn't exists" });
      }
    } catch (error) {
      logger.error({ userEmail: (req.body as any).email, init: "forgotPassword" }, "forgotPassword method error: " + JSON.stringify(error));
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // public async SignUp(req: Request, res: Response) {
  //   try {
  //     let params: any = req.body;
  //     params.created_by = req.meta.userId || "1";
  //     params.tenant_id = req.meta.tenantId || "0";
  //     const new_account: Iuser = new User(params);
  //     let result = await new_account.save();
  //     if (result) {
  //       const token = await jwt.sign(
  //         { userId: params.created_by, tenantId: params.tenant_id },
  //         process.env.JWT_SECRET_KEY!,
  //         { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRE!) }
  //       );
  //       if (token) {
  //         let obj: any = {
  //           last_active_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  //           is_active: true,
  //           expires_at: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
  //           user_id: result.id,
  //           created_by: params.created_by,
  //           tenant_id: params.tenant_id,
  //         };
  //         await UserSessionRepository.save(obj);
  //         return res
  //           .status(200)
  //           .send({ token: token, message: "User created successfully" });
  //       }
  //     } else {
  //       return res.status(500).json({ message: "User Creation Failed" });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ message: error });
  //   }
  // }

  public async Logout(req: FastifyRequest, res: FastifyReply) {
    try {
      logger.info({ userId: (req.meta as any).userId, init: "Logout" }, "logout method called");
      let userId: any = (req.meta as any).userId;
      let verfiySession: any = await UserSessionsRepository.isSessionActive(userId);
      if (verfiySession) {
        verfiySession.id = +verfiySession.id;
        verfiySession.updated_by = req && req.meta && req.meta.userId ? req.meta.userId : 0;
        verfiySession.is_active = false;
        await UserSessionsRepository.save(verfiySession);
        return res.status(200).send({ status: "success", message: "User Logged out Successfully" });
      } else {
        res.status(404).send({ status: 'Failure', message: 'User Session Not Found' });
      }
    } catch (error) {
      logger.error({ userId: (req.meta as any).userId, error: "Logout" }, "logout method error: " + JSON.stringify(error));
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // public async MAMLogin(req: Request, res: Response) {
  //   try {
  //     if (req.body.email !== "admin@mam.com") {
  //       return res.status(404).send({ message: "Invalid User Email" });
  //     }
  //     if (req.body.password !== "Admin@123") {
  //       return res.status(404).send({ message: "Invalid Password" });
  //     }
  //     const token = jwt.sign(
  //       { email: req.body.email, password: req.body.password },
  //       process.env.JWT_SECRET_KEY!,
  //       { expiresIn: process.env.JWT_TOKEN_EXPIRE }
  //     );
  //     if (token) {
  //       return res
  //         .status(200)
  //         .send({ token: token, message: "User Logined Successfully" });
  //     } else {
  //       return res.status(404).send({ message: "Issue while login" });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ message: error });
  //   }
  // }

  // public async MAMVerifyToken(req: Request, res: Response) {
  //   const token: any = req.headers["jwt"];
  //   try {
  //     if (token) {
  //       let verifiedUser: any = await jwt.verify(
  //         token,
  //         process.env.JWT_SECRET_KEY!
  //       );
  //       if (verifiedUser) {
  //         req.meta = verifiedUser;
  //         return res
  //           .status(200)
  //           .send({
  //             status: "Success",
  //             message: "Token Verified Successfully",
  //           });
  //       } else {
  //         return res.status(401).json({ message: "Failed to Verify Token" });
  //       }
  //     } else {
  //       return res.status(401).json({ message: "Token must be sent!" });
  //     }
  //   } catch (error) {
  //     return res.status(401).json({ message: "Invalid Token" });
  //   }
  // }

  // public async ssoLogin(req: Request, res: Response) {
  //   try {
  //     logger.info({ userEmail: req.user, init: "ssoLogin" }, "ssoLogin method called");
  //     // let name:any
  //     if (!("user" in req)) {
  //       throw new Error("Request object without user found unexpectedly");
  //     }
  //     let NameObj: any = req.user
  //     let result: any = await UserRepository.getByemailAndTenant(NameObj.nameID);
  //     if (result && result.email) {
  //       let tenantInfo: any = await tenantRepository.getById(result.tenant_id);
  //       let tenantConfigInfo: any = await tenantRepository.findTenantConfigById(result.tenant_id);
  //       let currentDate: any = moment().format('YYYY-MM-DD');
  //       let end_date: any = tenantConfigInfo && tenantConfigInfo.subscription_end_date ? tenantConfigInfo.subscription_end_date : currentDate
  //       console.log("current date", currentDate)
  //       console.log("end_date---->", end_date)
  //       if (tenantConfigInfo && end_date < currentDate) {
  //         return res
  //           .status(404)
  //           .redirect(`${process.env.UI_URL}${req.params.name}/subscription-expired`)
  //       }
  //       if (tenantInfo && tenantInfo.is_draft) {
  //         return res
  //           .status(404)
  //           .send({ message: "Tenant is in Draft, please contact to superadmin" });
  //       }
  //       if (tenantInfo && !tenantInfo.is_active || tenantInfo.is_deleted) {
  //         return res
  //           .status(404)
  //           .redirect(`${process.env.UI_URL}${req.params.name}/subscription-expired`)
  //       }
  //       if (!result.is_active || result.is_deleted) {
  //         return res
  //           .status(404)
  //           .redirect(`${process.env.UI_URL}${req.params.name}/subscription-expired`)
  //       }
  //          if (tenantInfo && tenantInfo.name != req.params.name.replace(/-/g, ' ')) {
  //         return res
  //           .status(404)
  //           // .send({ message: "Invalid user please login with valid user" });
  //           .redirect(`${process.env.UI_URL}${req.params.name}/login-denied`)
            
  //       }

  //       let userRoles: any = await UserRepository.getUserRoles(result.id);
  //       let verfiySession: any =
  //         await UserSessionRepository.isSessionActive(result.id);
  //       if (verfiySession) {
  //         await UserSessionRepository.makeSessionInactive(result.id);
  //       }
  //       const token = jwt.sign(
  //         { userId: result.id, managerId: result.manager_id, tenantId: result.tenant_id, roles:userRoles },
  //         process.env.JWT_SECRET_KEY!,
  //         { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRE!) }
  //       );
  //       if (token) {
  //         let obj: any = {
  //           last_active_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  //           is_active: true,
  //           expires_at: moment()
  //             .add(1, "hours")
  //             .format("YYYY-MM-DD HH:mm:ss"),
  //           user_id: result.id,
  //           created_by: result.created_by,
  //           tenant_id: result.tenant_id,
  //         };
  //         await UserSessionRepository.save(obj);
  //       }
  //       logger.info({ userId: result.id, tenant_id: result.tenant_id, success: "Login" }, "login method success");
  //       res.status(200)           
  //       // res.cookie('meta', { roles: userRoles, jwt: token },)
  //       res.redirect(`${process.env.UI_URL}${req.params.name}/please-wait?jwt=${token}`)
  //     } else {
  //       let TenantInfo: any = await tenantRepository.getBySsoTenantName(req.params.name.replace(/-/g, ' '));
  //       if (TenantInfo) {
  //         let tenantConfigInfo: any = await tenantRepository.findTenantConfigById(TenantInfo._id);
  //         let currentDate: any = moment().format('YYYY-MM-DD');
  //         let end_date: any = tenantConfigInfo && tenantConfigInfo.subscription_end_date ? tenantConfigInfo.subscription_end_date : currentDate
  //         if (tenantConfigInfo && end_date < currentDate) {
  //           return res
  //             .status(404)
  //             .redirect(`${process.env.UI_URL}${req.params.name}/subscription-expired`)
  //         }
  //         if (TenantInfo && TenantInfo.is_draft) {
  //           return res
  //             .status(404)
  //              .redirect(`${process.env.UI_URL}${req.params.name}/subscription-expired`)
  //         }
  //         if (TenantInfo && !TenantInfo.is_active || TenantInfo.is_deleted) {
  //           return res
  //             .status(404)
  //              .redirect(`${process.env.UI_URL}${req.params.name}/subscription-expired`)
  //         }
  //         let params: any = {};
  //         params.created_by = TenantInfo.created_by;
  //         params.tenant_id = TenantInfo._id;
  //         let password: any = generator.generate({ length: 10, numbers: true });
  //         let EncryptPassword: any = await common.stringToBinary64(password);
  //         params.password = password;
  //         params.encrypt_password = EncryptPassword;
  //         params.employee_type = 'Permanent';
  //         params.first_name = NameObj.nameID.split('@')[0]
  //         params.email = NameObj.nameID
  //         params.employee_id = generator.generate({ length: 5 });
  //         const new_account: Iuser = new User(params);
  //         let result: any = await new_account.save();
  //         if (result) {
  //           params.user_id = result.id;
  //           // Add role to User
  //           let rolesInfo: any = await roleService.getTenantDefaultRolesForImport(params);
  //           if (rolesInfo && rolesInfo.length > 0) {
  //             rolesInfo = rolesInfo.filter((obj: any) => {
  //               return obj.name === "Account Manager";
  //             });
  //             if (rolesInfo && rolesInfo.length == 1) {
  //               let newObj: any = {};
  //               newObj.user_id = result.id;
  //               newObj.role_id = rolesInfo[0]._id;
  //               newObj.created_by = result.id;
  //               newObj.tenant_id = TenantInfo._id;
  //               const new_account1: IuserRole = new userRole(newObj);
  //               await new_account1.save();
  //             }
  //           }
  //           let objInfo: any = {};
  //           objInfo.full_name = result.first_name;
  //           objInfo.email = result.email;
  //           objInfo.encrypt_password = result.encrypt_password;
  //           objInfo.tenantId = TenantInfo._id;
  //           await EmailService.addUserInvitation(objInfo, res);
  //           let userRoles: any = await UserRepository.getUserRoles(params.user_id);
  //           let verfiySession: any =
  //             await UserSessionRepository.isSessionActive(params.user_id);
  //           if (verfiySession) {
  //             await UserSessionRepository.makeSessionInactive(params.user_id);
  //           }
  //           const token = jwt.sign(
  //             { userId: result.id, managerId: result.manager_id, tenantId: result.tenant_id,roles:userRoles },
  //             process.env.JWT_SECRET_KEY!,
  //             { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRE!) }
  //           );
  //           if (token) {
  //             let obj: any = {
  //               last_active_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  //               is_active: true,
  //               expires_at: moment()
  //                 .add(1, "hours")
  //                 .format("YYYY-MM-DD HH:mm:ss"),
  //               user_id: params.user_id,
  //               created_by: result.created_by,
  //               tenant_id: result.tenant_id,
  //             };
  //             await UserSessionRepository.save(obj);
  //           }
  //           logger.info({ userId:params.user_id, tenant_id: result.tenant_id, success: "Login" }, "login method success");
  //           res.status(200)           
  //           res.redirect(`${process.env.UI_URL}${req.params.name}/please-wait?jwt=${token}`)
  //           logger.info({ userId: result.userId, tenant_id: result.tenant_id, success: "AddUser" }, "add user method through sso");
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     logger.error({ userEmail: req.body.email, init: "Login" }, "login method error: " + JSON.stringify(error));
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // public async getMenusByRoleId(req: Request, res: Response) {
  //   try {
  //     logger.info({ userId: req.meta.userId, init: "getMenusByRoleId" }, "getMenusByRoleId method called"); 
  //     let UserMenus:any = []
  //     let userRoles: any = await UserRepository.getUserRole(req.params.id);
  //          if(userRoles && userRoles.role_id){     
  //           UserMenus = await Meta.menu_entries.filter((query:any)=>{ return query.context == userRoles.role_id.context})       
  //          }                
  //     logger.info({ userId: req.meta.userId, success: "getMenusByRoleId" }, "getMenusByRoleId method success");
  //     return res.status(200).send({ status: "success",data: UserMenus });
  //   } catch (error) {
  //     logger.error({ userId: req.meta.userId, error: JSON.stringify(error) }, "getMenusByRoleId method error: " + JSON.stringify(error));
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }
  // public async VerifyServiceAuth(req: Request, res: Response) {   
  //   const token:any =  req.headers['jwt'];
  //   try {
  //       if(token)    {
  //           let verifiedUser:any = await jwt.verify(token, process.env.JWT_SECRET_KEY!);
  //           if(verifiedUser){
  //               req.meta = verifiedUser
  //               // req.params = verifiedUser;
  //               let verfiySession:any = await UserSessionRepository.isSessionActive(verifiedUser.userId);
  //               if(!verfiySession){
  //                  return res.status(401).send('Session Expired please login again');                   
  //               }
  //               return res.status(200).json({ verifiedUser:verifiedUser}); 
  //           }else{
  //               let decoded:any = jwtDecode(token);
  //               //if token not verfied. make Inactive, users active session
  //               await UserSessionRepository.makeSessionInactive(decoded.userId);
  //               res.status(401).send('Session Expired please login again');               
  //           }           
  //       }else {
  //           return res.status(401).send('Token must be sent!' );         
  //       }       
  //   } catch (error) {
  //       // console.log(error)
  //       return res.status(401).send('Invalid Token');        
  //   }
  // }
}
export default new AuthService();