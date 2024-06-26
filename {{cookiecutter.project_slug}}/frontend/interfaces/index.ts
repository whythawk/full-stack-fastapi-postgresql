import type {
  IUserProfile,
  IUserProfileUpdate,
  IUserProfileCreate,
  IUserOpenProfileCreate
} from "./profile"

import type {
  ITokenResponse,
  IWebToken,
  INewTOTP,
  IEnableTOTP,
  ISendEmail,
  IMsg,
  INotification
} from "./utilities"

// https://stackoverflow.com/a/64782482/295606
interface IKeyable {
  [key: string]: any | any[]
}
  
export type {
  IKeyable,
  IUserProfile,
  IUserProfileUpdate,
  IUserProfileCreate,
  IUserOpenProfileCreate,
  ITokenResponse,
  IWebToken,
  INewTOTP,
  IEnableTOTP,
  ISendEmail,
  IMsg,
  INotification
}