import { http } from '@/utils/http'
import { IUserInfoLogin } from './model'
export interface IFooItem {
  id: string
  name: string
}

export interface IVierificationCode {
  img: string
  uuid: string
}

/** GET 请求 */
export const getFooAPI = (name: string) => {
  return http.get<IFooItem>('/foo', { name })
}

/** POST 请求 */
export const postFooAPI = (name: string) => {
  return http.post<IFooItem>('/foo', { name }, { name })
}

// 获取登录用户信息
export const getLoginUserAPI = () => {
  return http.post<IUserInfoLogin>('/api/Sys_User/getCurrentUserInfo')
}

// 获取发布信息
export const GetReleaseApi = () => {
  return http.get<string>('/biz/test/GetRelease')
}

// 获取验证码
export const getVierificationCode = () => {
  return http.get<IVierificationCode>('/api/Sys_User/getVierificationCode')
}

// 登录接口
export const loginPost = (parmas) => {
  return http.post<IUserInfo>('/api/Sys_User/login', parmas)
}
