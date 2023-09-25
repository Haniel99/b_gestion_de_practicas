export interface IUser {
    name: string;
    last_name: string;
    rut: string;
    phone?: number;
    address: string;
    email: string;
    password: string;
    account_type: number;
    verification_code: string;
    status: number;
    creation_date: Date;
    last_access: Date;
    department_id: number;
    rol_id: number;
  }
  