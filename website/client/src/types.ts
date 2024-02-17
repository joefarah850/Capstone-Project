import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod";

export interface User {
    data: {
        id: number;
        username: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        dataOfBirth: Date;
        accountCreationDate: Date;
        lastLogin: Date;
        updateDate: Date;
        organizationId: number;
        profile_pic: string;
    };
    message: string;
};

export type RegisterFormData = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
};

export type RegisterFormFieldProps = {
    type: string;
    placeholder: string;
    name: RegisterValidFieldNames;
    options?: { label: string; value: string }[];
    register: UseFormRegister<RegisterFormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
  };
  

export type RegisterValidFieldNames =
| "email"
| "password"
| "confirmPassword"
| "firstName"
| "lastName"
| "dateOfBirth"
| "gender"; 
 
export const UserSchema: ZodType<RegisterFormData> = z
 .object({
    email: z.string().email(),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    gender: z.string({
        invalid_type_error: "Gender is required",
    }),
    password: z
     .string()
     .min(8, { message: "Password is too short" })
     .max(20, { message: "Password is too long" })
     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
         message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
     })
        ,
    confirmPassword: z.string(),
 })
 .refine((data) => data.password === data.confirmPassword, {
   message: "Passwords do not match",
   path: ["confirmPassword"], // path of error
 });



//  Login Page

 export type LoginFormData = {
    email: string;
    password: string;
};

 export type LoginFormFieldProps = {
    type: string;
    placeholder: string;
    name: LoginValidFieldNames;
    login: UseFormRegister<LoginFormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
  };
  

export type LoginValidFieldNames =
| "email"
| "password";
 
export const LoginUserSchema: ZodType<LoginFormData> = z
 .object({
    email: z.string().email(),
    password: z.string(),
});