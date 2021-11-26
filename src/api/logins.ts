import request from '../utils/request'

/**
 * 登录
 * @param data
 * @returns
 */
export function login(data: Object) {
  return request({
    url: 'admin/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param params
 * @returns
 */
export function getUser(params?: Object) {
  return request({
    url: 'admin/info',
    params
  })
}
