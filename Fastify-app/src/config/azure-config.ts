import passport from 'passport';
import { OIDCStrategy } from 'passport-azure-ad';
import dotenv from 'dotenv';
dotenv.config();

export const azureConfig = {
  identityMetadata: `${process.env.AZURE_AUTHORITY}/.well-known/openid-configuration`,
  clientID: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  redirectUrl: process.env.REDIRECT_URI,
  responseType: 'code',
  responseMode: 'form_post',
  allowHttpForRedirectUrl: true, // only for development
  scope: ['openid', 'profile', 'email'],
  loggingLevel: 'info',
  passReqToCallback: false,
};

