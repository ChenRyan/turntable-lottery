<template>
    <div class="turntable" ref="turntableRef" >
        <div class="pointer"  @click="onPointerClick"></div>
        <canvas @transitionend="onRotateEnd">浏览器不支持画布效果</canvas>
    </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import {getData } from '@/apis/award'
interface StyleInterface {
    width: number
}
interface ListItem {
    title: string;
    img: string;
    bgColor: string;
    txtColor: string;
    [index:string] : string | number;
}

interface EVENT_NAME {
    [key: string]: string
}

const turntableRef = ref<any>()
// const turntableRef = ref(null)
const canvasRef = ref(null)
const turntableConfig : any = reactive({
    width: 400,
    // 是否在转
    rotateState: true,
    // 默认转3圈
    rotateNum: 3,
    duration: 3,
    // 当前指针位置
    currentIndex: 0,
    // 当前角度
    currentRotate: 0,
    // 加载数据
    list:[],
})


// 绘制转盘
const initCanvas = async (rotateDeg?:number) => {

    const canvas : any  = turntableRef.value!.querySelector('canvas')
    canvas!.width = canvas.height = turntableConfig.width

    let context:CanvasRenderingContext2D = canvas!.getContext('2d')
    context!.translate(canvas.width / 2, canvas.height / 2)
    // context!.rotate(rotateDeg)
    let num = turntableConfig.list?.length || 0;
    // 绘制转盘分隔弧
    for (let i = 0; i < num; i++) {
        context!.save()
        context!.beginPath()
        context!.moveTo(0, 0)
        context!.rotate(360 / num * i * Math.PI / 180)
        // 从12点钟方向0度开始绘制
        context!.arc(0, 0, canvas!.width / 2, -90 * Math.PI / 180, 2 * Math.PI / num - 90 * Math.PI / 180, false)
        context!.lineTo(0, 0)
        if (turntableConfig.list[i]?.bgColor) {
            context!.fillStyle = `${turntableConfig.list[i]!.bgColor}`
        } else {
            context!.fillStyle = '#eee'
        }
        context.fill()

        // 文字图片居中 0.33
        context.rotate(360 / num * 0.5 * Math.PI / 180)

        // 绘制文字
        context.fillStyle = turntableConfig.list[i].txtColor || "#111"
        context.strokeStyle = turntableConfig.list[i].txtColor || "#111"
        context.lineWidth = 20
        context.textAlign = 'center'
        context.font = "16px 微软雅黑"
        context.fillText(turntableConfig.list[i].title, 0, -canvas.width / 2 + 75, 100)

        // 绘制图片
        if (turntableConfig.list[i].img) {
            // 等待图片加载
            let picPromise = new Promise((resolve, reject) => {
                let pic = new Image
                pic.src = turntableConfig.list[i].img
                pic.onload = function () {
                    resolve(pic)
                }
            })
            let pic:any = await picPromise
            context.drawImage(pic, -16, -canvas.width / 2 + 20, 32, 32)
        }
        context.restore()
    }
}

const onRotateEnd = () => {
    turntableConfig.rotateState = true
    console.log('抽中了' + turntableConfig.list[turntableConfig.currentIndex].title);
    alert('抽中了' + turntableConfig.list[turntableConfig.currentIndex].title)
}
const rotate = (index:number, rotateNum?:number, duration?:number) => {

    if (!turntableConfig.rotateState) {
        console.log('转盘正在转圈，请等待...');
        return
    }
    if (isNaN(index)) {
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

    let rotateDeg = turntableConfig.currentRotate == 0 ? (turntableConfig.rotateNum * 360 + (num - index - 0.5) * 360 / num)
        : turntableConfig.currentRotate + (turntableConfig.rotateNum * 360 + (num - (index - currentIndex)) * 360 / num)

    const canvas = turntableRef.value.querySelector('canvas')
    canvas.style.transform = `rotate(${rotateDeg}deg)`
    canvas.style.transition = `transform ${turntableConfig.duration}s ease`
    // 设置当前角度，以便在当前角度继续使用转盘
    turntableConfig.currentRotate = rotateDeg

}

const onPointerClick = () => {
    let index:any = parseInt((Math.random() * 6).toString())
    rotate(index)
}

onMounted(async () => {
    let { data } = await getData()
    turntableConfig.list = data
    initCanvas()
})


</script>
<style scoped>
.pointer {
    position: absolute;
    width: 10%;
    height: 10%;
    top: 45%;
    left: 45%;
    background: red;
    /* background: #ddd; */
    z-index: 2;
    border-radius: 50%;
}

/* 小尖角 */
.pointer::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    left: calc(50% - 10px);
    top: calc(50% - 90px);
    border-top: 40px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 40px solid red;
    /* border-bottom: 40px solid #ddd; */
    border-left: 10px solid transparent;
    position: absolute;
    z-index: 99;
}

.turntable {
    width: 460px;
    height: 468px;
    background: url('./assets/turnplate-bg.png') top/cover no-repeat;
    position: relative;
    border-radius: 50%;
    /* overflow: hidden; */
}

.turntable canvas {
    width: 400px;
    height: 400px;
    position: absolute;
    left: 30px;
    top: 30px;
}

/* 重写指针样式 */
.pointer::after {
    display: none;
}

.pointer {
    width: calc(185px/2);
    height: calc(254px/2);
    top: calc(50% - 90px);
    left: calc(50% - 46px);
    background: url(./assets/p9-pointer.png) no-repeat top/cover;
}
</style>