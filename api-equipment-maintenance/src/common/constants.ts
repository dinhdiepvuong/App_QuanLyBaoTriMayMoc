import { emailConfig, subjectConfig } from './configs';
import * as nodemailer from 'nodemailer';

export const PASSWORD_HASH_SALT_ROUNDS = 10;
export const UNLIMITED = -1;

export enum UserStatus {
  NEW,
  ACTIVE,
  LOCK,
}

export enum EquipmentStatus {
  ACTIVE,
  REPAIR,
  LOCK,
}

export enum ViewImg{
  FRONT,
  LEFT,
  RIGHT,
  BACKSIDE,
}

export enum UserRole {
  AUTHORED_USER = 'AUTHORED_USER', // Ko xài
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  OPERATOR = 'OPERATOR',
  STOCKER = 'STOCKER',
  ADMIN = 'ADMIN',
}

export enum UserType {
  INDIVIDUAL,
  BUSINESS,
}

export enum Gender {
  MALE,
  FEMALE,
}

export enum QUEUE_NAME {
  SEND_MAIL = 'send-mail',
  RESOURCE = 'resource',
}

export enum RESOURCE_JOB_NAME {
  PRODUCT = 'product',
  ACCOUNT = 'account',
  SOLUTION_SCREENSHOT = 'product_screenshot',
}

export const ROLES_ALLOW_SELF_SIGNUP = [
  UserRole.AUTHORED_USER,
  UserRole.CUSTOMER,
];

export enum CHANGE_PASSWORD_TYPE {
  RESET_PASSWORD,
  UPDATE_CURRENT_PASSWORD,
}
export const uploadFilesDir = 'upload';

export enum DurationUnit {
  WEEK = 'week',
  MONTH = 'year',
  YEAR = 'year',
}

export enum SOCIAL_TYPE {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
}