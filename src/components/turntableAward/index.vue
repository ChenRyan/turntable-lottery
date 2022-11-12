<script setup>
import {  onMounted, reactive, ref } from 'vue';
import { getData } from '../../apis/award';

const props = defineProps({
    index:{
        type: Number,
        default:0
    },
    width: {
        type: Number,
        default: 300
    }
})

const turntableRef = ref(null)
const canvasRef = ref(null)
const turntableConfig = reactive({
    // 是否在转
    rotateState: true,
    // 
    rotateNum: 0,
    duration:3,
    // 当前指针位置
    currentIndex:0,
    // 当前角度
    currentRotate:0,
    // 加载数据
    list:[],
})

 // 绘制转盘
const initCanvas = async ( rotateDeg)=>{


    const canvas = turntableRef.value.querySelector('canvas')
    canvas.width = canvas.height = props.width

    let context = canvas.getContext('2d')
    context.translate( canvas.width/2 , canvas.height / 2)
    context.rotate(rotateDeg)
    let num =  turntableConfig.list?.length || 0;
    // 绘制转盘分隔弧
    for(let i = 0 ; i < num ; i ++ ){
        context.save()
        context.beginPath()
        context.moveTo(0,0)
        context.rotate( 360 / num * i * Math.PI / 180)
        // 从12点钟方向0度开始绘制
        context.arc(0 , 0,  canvas.width/2,  -90*Math.PI/180,   2 * Math.PI / num-90*Math.PI/180, false)
        context.lineTo(0,0)
        if( turntableConfig.list[i].bgColor ){
            context.fillStyle = `${turntableConfig.list[i].bgColor}`
        }else{
            context.fillStyle = '#eee'
        }
        context.fill()

        // 文字图片居中 0.33
        context.rotate( 360 / num * 0.5 * Math.PI / 180)

        // 绘制文字
        context.fillStyle= turntableConfig.list[i].txtColor || "#111"
        context.strokeStyle= turntableConfig.list[i].txtColor || "#111"
        context.lineWidth = 20
        context.textAlign = 'center'
        context.font = "16px 微软雅黑"
        context.fillText( turntableConfig.list[i].title , 0, -canvas.width/2 + 75, 100 )
        
        // 绘制图片
        if( turntableConfig.list[i].img ) {
            // 等待图片加载
            let picPromise = new Promise( (resolve, reject) => {
                let pic = new Image
                pic.src = turntableConfig.list[i].img
                pic.onload = function(){
                    resolve(pic)
                }
            })
            let pic =  await picPromise
            context.drawImage( pic , -16, -canvas.width/2 + 20, 32, 32 )
        }
        context.restore()
        }
}

const onRotateEnd = ()=>{
    turntableConfig.rotateState = true
    console.log('抽中了'+ turntableConfig.list[turntableConfig.currentIndex].title);
    alert('抽中了'+ turntableConfig.list[turntableConfig.currentIndex].title)
}
const rotate = ( index, rotateNum, duration)  => {

if (  !turntableConfig.rotateState ) {
    console.log('转盘正在转圈，请等待...');
    return
}
if ( isNaN(index) ) {
    alert('请输入指针最终停留位置');
    return
}
turntableConfig.rotateState = false
// 默认3秒
turntableConfig.duration = duration || 3
// 默认0圈
turntableConfig.rotateNum = rotateNum || 3
// 获取当前的currentIndex
let currentIndex = turntableConfig.currentIndex
turntableConfig.currentIndex = index

// 在现在的基础上重新计算转盘
let num = turntableConfig.list.length || 0
// let rotateDeg = (rotateNum * 360 - index * 360 / data.length)  * Math.PI / 180 

let rotateDeg = turntableConfig.currentRotate == 0 ? (turntableConfig.rotateNum * 360 + ( num - index - 0.5) * 360 / num) 
: turntableConfig.currentRotate + (turntableConfig.rotateNum * 360 + (num - (index-currentIndex)) * 360 / num) 

const canvas = turntableRef.value.querySelector('canvas')
canvas.style.transform = `rotate(${rotateDeg}deg)`
canvas.style.transition = `transform ${turntableConfig.duration}s ease`
// 设置当前角度，以便在当前角度继续使用转盘
turntableConfig.currentRotate = rotateDeg

}

const onPointerClick =  ()=>{
    let index = parseInt( Math.random() * 6)
    rotate(index)
}

onMounted(async () => {
    let {data} = await getData()
    turntableConfig.list = data
    initCanvas()
})



</script>

<template>
  <div class="turntable" ref="turntableRef">
    <div class="pointer" @click="onPointerClick"></div>
    <canvas  @transitionend="onRotateEnd" ref="canvasRef">浏览器不支持画布效果</canvas>
  </div>
</template>

<style scoped>
       .turntable{
            width: 350px;
            height: calc(468px * 350 / 460);
            background: url('./assets/turnplate-bg.png') top/cover no-repeat;
            position: relative;
            border-radius: 50%;
            margin: auto;
            overflow: hidden;
        }

       .turntable canvas{
               width: 300px;
               height: 300px;
               position: absolute;
               left: 25px;
               top: 25px;
        }

        /* 重写指针样式 */
        .pointer::after{
            display: none;
        }
        .pointer{
            position: absolute;
            width: 72px;
            /* width: calc(185px/3); */
            height: calc(72px * 254 / 185);
            top: calc(50% - 90px/2 - 10px);
            left: calc(50% - 46px/2 - 12px);
            background: url(./assets/p9-pointer.png) no-repeat top/cover;
            border-radius: 50%;
            z-index: 2;
        }
      
</style>