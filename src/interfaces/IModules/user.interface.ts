export interface IUser {
    id: number;
    name: string;
    pat_last_name: string;
    mat_last_name: string;
    rut: string;
    check_digit: string;
    phone?: number;
    address: string;
    email: string;
    password?: string;
    verification_code?: string;
    status?: number;
    creation_date?: Date;
    last_access?: Date;
    rol_id?: number;
    study_plan_id?: number;
  }
  