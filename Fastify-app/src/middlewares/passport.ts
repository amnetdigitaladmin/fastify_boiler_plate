
// import passport from 'passport';
// const { MultiSamlStrategy } = require('passport-saml');
// import {Request, Response, NextFunction }  from 'express';
// import { ItenantSsoConfig, TenantSsoConfiguration } from '../models/schemas/tenant-sso-configuration';
// import logger from '../middlewares/logger';

// passport.serializeUser((user: any, done:any) => {
//     done(null, user);
//     });
    
// passport.deserializeUser((user: any, done:any) => {
//     done(null, user);
//     });
    

// // Create a new MultiSamlStrategy
// let multiSamlStrategy: any;
// try {
//     logger.info({ config: 'saml req', init: "saml passport middleware" }, "saml passport middleware");
//     multiSamlStrategy = new MultiSamlStrategy(
//         {
//             passReqToCallback: true,
//             async getSamlOptions(req: Request, done: (err: Error | null, samlConfig?: any) => void) {
//                 const tenant_name: any = req.params.name.replace(/-/g, ' ')
//                 const sso_provider_name: any = req.params.service.replace(/-/g, ' ') // Get the SAML provider from the request
//                 let samlConfig: any = await TenantSsoConfiguration.findOne({ "name": tenant_name, "configurations.SSO_provide": sso_provider_name }).lean()
//                 if (samlConfig && samlConfig.configurations && samlConfig.configurations.length > 0) {
//                     let config: any = samlConfig.configurations.find((item: any) => { return item.SSO_provide === sso_provider_name });
//                     if (config && config.cert) {
//                         let decode = Buffer.from(config.cert, 'base64')

//                         config.cert = decode.toString()
//                     }
//                     delete config.SSO_provide
//                     return done(null, config);
//                 } else {
//                     logger.info({ config: samlConfig, tenant: tenant_name, error: "saml passport middleware error" }, "saml passport middleware");
//                     // done(null)
//                 }

//             },
//         },
//         (req: Request, profile: any, done: any) => {
//             logger.info({ config: 'saml req', success: "saml passport middleware" }, "saml passport middleware");
//             done(null, profile);
//         },
//     )
// } catch (err) {
//     console.log(err)
// }

// passport.use('multiSaml', multiSamlStrategy);




// export default passport;