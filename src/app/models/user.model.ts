export interface IUserLogIn {
  email: string;
  password: string;
}

export interface IUserLoggedIn {
  userId: number;
  token: string;
  roles: string[];
  userName: string;
}

export interface IUserRegister {
  userName: string;
  email: string;
  password: string;
}

export interface IAdminRegister {
  userName: string;
  email: string;
  password: string;
  role: string;
}

export interface IUser {
  id: number;
  userName: string;
  email: string;
}