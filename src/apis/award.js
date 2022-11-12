import request from "../utils/https/request"

export const getData = async () => {
    
    return  request({
        url:'/public/data/list.json',
        type:'post'
    })
}