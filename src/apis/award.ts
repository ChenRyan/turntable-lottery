import requests from "@/utils/http/request"

export const getData = () => {
    return requests.get('/data/list.json')
}