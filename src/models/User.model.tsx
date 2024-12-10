export interface IRegister {
  username: string;
  email: string;
  password: string;
  familySize: number;
  SecretQuestion: string; 
  answer: string;
}

  export interface ILogin {
    email: string;
    password: string;
  }