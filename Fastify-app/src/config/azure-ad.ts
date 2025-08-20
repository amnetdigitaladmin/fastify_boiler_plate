import dotenv from 'dotenv';

dotenv.config();
const idmetadata = `${process.env.CLOUD_INSTANCE}${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`;
console.log("Azure AD Configuration:", idmetadata);
export const azureADConfig: any = {
    identityMetadata: idmetadata,
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    responseType: process.env.RESPONSE_TYPE,
    responseMode: process.env.RESPONSE_MODE,
    redirectUrl: process.env.REDIRECT_URI,
    allowHttpForRedirectUrl: true, // Set to true for local development
    isB2C: false, // Set to true if using Azure AD B2C
    validateIssuer: true,  // Set to true if you want to validate the issuer
    passReqToCallback: true,
    useCookieInsteadOfSession: false, // Use cookies for session management
    scope: ['profile', 'email'], // Specify the required scopes
    loggingLevel: 'info', // Adjust logging level as needed,
    nonceLifetime: null,
    nonceMaxAmount: 6,
    clockSkew: 300,
    loggingNoPII: true
};


// export const azureADConfig = {
//     identityMetadata: `${process.env.CLOUD_INSTANCE}${process.env.AZURE_TENANT_ID}/.well-known/openid-configuration`,
//     clientID: 
//     clientSecret: process.env.AZURE_CLIENT_SECRET,
//     responseType: 'code id_token',
//     responseMode: 'form_post',
//     redirectUrl: process.env.REDIRECT_URI,
//     allowHttpForRedirectUrl: true,
//     validateIssuer: true,
//     passReqToCallback: true,
//     scope: ['profile', 'email', 'offline_access'],
//     useCookieInsteadOfSession: true,
//     cookieEncryptionKeys: [
//         { key: process.env.COOKIE_KEY, iv: process.env.COOKIE_IV }
//     ],
//     loggingLevel: 'info',
//     nonceLifetime: 3600,
//     nonceMaxAmount: 10,
//     clockSkew: 300
// };