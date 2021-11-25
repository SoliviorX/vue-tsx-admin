import request from '../utils/request'

/**
 * 登录
 * @param data 
 * @returns 
 */
 export function login(data: Object){
    return request({
        url:'admin/login',
        method: 'post',
        data
    })
}