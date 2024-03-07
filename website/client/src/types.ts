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
    dateOfBirth: Date;
    accountCreationDate: Date;
    lastLogin: Date;
    updateDate: Date;
    organizationId: number;
    profile_pic: string;
    country: string;
    phone: string;
    city: string;
  };
  message: string;
}

export type OrganizationFormData = {
  name: string;
  email: string;
  website: string;
};

export type OrganizationFormFieldProps = {
  type: string;
  placeholder: string;
  name: OrganizationValidFieldNames;
  register: UseFormRegister<OrganizationFormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
  isUnauthorized?: boolean;
  onFocus?: () => void;
};

export type OrganizationValidFieldNames = "email" | "website" | "name";

export const OrganizationUserSchema: ZodType<OrganizationFormData> = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid Email" }),
  website: z
    .string()
    .url({ message: "Enter a URL with 'http://' or 'https://'" }),
});

export type RegisterFormData = {
  email: string;
  password: string;
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
  max?: string;
  register: UseFormRegister<RegisterFormData>;
  error?: FieldError | undefined;
  valueAsNumber?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exists?: boolean;
  onFocus?: () => void;
};

export type RegisterValidFieldNames =
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "dateOfBirth"
  | "gender";

export const UserSchema: ZodType<RegisterFormData> = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string({
    invalid_type_error: "Gender is required",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be 8-20 characters long" })
    .max(20, { message: "Password must be 8-20 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
      message:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    }),
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
  isUnauthorized?: boolean;
  onFocus?: () => void;
};

export type LoginValidFieldNames = "email" | "password";

export const LoginUserSchema: ZodType<LoginFormData> = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string(),
});

// Prediction Form

export type PredictionFormData = {
  propType: string;
  region: string;
  size: number | string;
  bedrooms: string;
  bathrooms: string;
};

export type PredictionFormFieldProps = {
  type: string;
  placeholder: string;
  name: PredictionValidFieldNames;
  predict: UseFormRegister<PredictionFormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  min?: number;
  max?: number;
  id?: string;
};

export type PredictionValidFieldNames =
  | "propType"
  | "region"
  | "size"
  | "bedrooms"
  | "bathrooms";

export const PredictionSchema: ZodType<PredictionFormData> = z.object({
  propType: z.string().min(1, { message: "Required" }),
  region: z.string().min(1, { message: "Required" }),
  size: z
    .number({ invalid_type_error: "Required" })
    .min(0.4, { message: "Size is too small" })
    .max(500, { message: "Size is too large" }),
  bedrooms: z.string().min(1, { message: "Required" }),
  bathrooms: z.string().min(1, { message: "Required" }),
});
