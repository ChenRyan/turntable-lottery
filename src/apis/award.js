import request from "../utils/https/request"

export const getData = async () => {
    
    return  request({
        url:'/data/list.json',
        type:'post'
    })
}