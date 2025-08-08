// import { Request, Response, NextFunction }  from 'express';
// import UserRepository  from '../models/repositories/user.repo';
// import Meta from '../helpers/utils/meta-data';


// //validate payload object
// const ValidateRoute = () => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             let UserMenus:any = []
//             let userRoles: any = await UserRepository.getUserRoles(req.meta.userId);
//             if (userRoles && userRoles.length > 0) {
//                 await userRoles.map(async (item: any) => {
//                     await Meta.menu_entries.map((query: any) => {
//                         if (query.context == item.role_id.context) {
//                             UserMenus.push(query.route)
//                         }
//                     })
//                 })
//             } 
//             console.log('----------------->',UserMenus) 
//             UserMenus = [].concat(UserMenus)     
//             const isValid = UserMenus.includes(req.params.route);
//             if(isValid){
//                 next();
//             }else{
//                 return res.status(400).json({ status: "error",message:`you don't have access to this route`});
//             }
//             console.log('route Validated',UserMenus)           
           
//         } catch (error:any) {
//             console.log(error)
//           return res.status(400).json({ error: error });
//         }
//     };
//   };




// export default ValidateRoute;