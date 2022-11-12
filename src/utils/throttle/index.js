export default function(func, delay){

    var lasttime = 0

    return function(){
       let nowtime = new Date().getTime()

       if ( nowtime - lasttime > delay){
        lasttime = nowtime
        func.apply(this, arguments)
        }
    }
}