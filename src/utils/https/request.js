import Axios from 'axios'

export default function( config ){

    const instance = Axios.create()

    instance.interceptors.request.use( (config) => {

        return config
    }, error => {
        console.log(error);
    })

    instance.interceptors.response.use( (res) => {

        return res.data
    },
    (err) =>{
        console.log(error);
    }
    )

    return instance(config)


}

