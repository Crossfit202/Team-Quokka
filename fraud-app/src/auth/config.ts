/*
 * this is the configuration file for the authentication code in the system
 * */

export class AuthValues {
  static PEPPER: string = process.env.PEPPER
  static JWTSECRET: string = process.env.JWTSECRET
}
