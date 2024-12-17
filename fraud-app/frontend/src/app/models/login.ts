/*
 * login dto that we use in order to login
 * */
export class LoginDto {
  constructor(
    public email: string,
    public password: string,
  ) {}
}

/*
 * response from the server
 * */
export interface AuthToken {
  access_token: string
}
