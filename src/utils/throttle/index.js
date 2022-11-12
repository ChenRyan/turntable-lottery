export default function(func, duration){

    let timer = null
    var lasttime = 0

    return ()=>{
        let nowtime = new Date().getTime()

       console.log(lasttime, nowtime);
       if ( timer && nowtime - lasttime < duration){
            return
        }
        lasttime = nowtime
        timer = setTimeout(()=>{
            func(...arguments)
        }, 500)
    }
}