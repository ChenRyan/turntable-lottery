import Axios from 'axios'

export default function( config ){

    const instance = Axios.create()

    instance.interceptors.request.use( (config) => {

        return config
    })

    instance.interceptors.response.use( (res) => {

        return res.data
    },
    (err) =>{
        console.log(err);
    }
    )

    return instance(config)


}

