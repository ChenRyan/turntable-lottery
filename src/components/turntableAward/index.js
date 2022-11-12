import React, { useEffect, useState } from 'react'
import './index.css'
import { getData } from '../../apis/award'
import throttle from '../../utils/throttle'

export default function Index() {

    const [turntableConfig, setTurntableConfig] = useState({
        width: 300,
        // 是否在转
        rotateState: true,
        // 
        rotateNum: 3,
        duration:3,
        // 当前指针位置
        currentIndex:0,
        // 当前角度
        currentRotate:0,
        // 加载数据
        list:[],
    })

    const [isInit, setisInit] = useState(false)
  
// 绘制转盘
async function initCanvas(){
        if ( isInit ) {
            console.log('isInit', isInit);
            return
        }
        console.log('isInit true', isInit);
        setisInit(true)
        const canvas = document.querySelector('canvas')
        canvas.width = canvas.height = turntableConfig.width
        console.log(canvas);
        let ctx = canvas.getContext('2d')
        ctx.clearRect(0,0,canvas.width, canvas.height)
        ctx.translate( canvas.width/2 , canvas.height / 2)
        let num =  turntableConfig.list?.length || 0;
        // 绘制转盘分隔弧
        for(let i = 0 ; i < num ; i ++ ){
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(0,0)
            ctx.rotate( 360 / num * i * Math.PI / 180)
            // 从12点钟方向0度开始绘制
            ctx.arc(0 , 0,  canvas.width/2,  -90*Math.PI/180,   2 * Math.PI / num-90*Math.PI/180, false)
            ctx.lineTo(0,0)
            if( turntableConfig.list[i].bgColor ){
                ctx.fillStyle = `${turntableConfig.list[i].bgColor}`
            }else{
                ctx.fillStyle = '#eee'
            }
            ctx.fill()

            // 文字图片居中 0.33
            ctx.rotate( 360 / num * 0.5 * Math.PI / 180)

            // 绘制文字
            ctx.fillStyle= turntableConfig.list[i].txtColor || "#111"
            ctx.strokeStyle= turntableConfig.list[i].txtColor || "#111"
            ctx.lineWidth = 20
            ctx.textAlign = 'center'
            ctx.font = "16px 微软雅黑"
            ctx.fillText( turntableConfig.list[i].title , 0, -canvas.width/2 + 75, 100 )
            
            // 绘制图片
            if( turntableConfig.list[i].img ) {
                // 等待图片加载
                let picPromise = new Promise( (resolve, reject) => {
                    let pic = new Image()
                    pic.src = turntableConfig.list[i].img
                    pic.onload = function(){
                        resolve(pic)
                    }
                })
                let pic =  await picPromise
                ctx.drawImage( pic , -16, -canvas.width/2 + 20, 32, 32 )
            }
            ctx.restore()
            }
   }

  function onPointerClick(){
    let index = parseInt(Math.random()*5)
    rotate(index)
  }
  function rotate( index, rotateNum = 3, duration = 3) {

    if (  !turntableConfig.rotateState ) {
        console.log('转盘正在转圈，请等待...');
        return
    }
    if ( isNaN(index) ) {
        alert('请输入指针最终停留位置');
        return
    }

    

    // 获取当前的currentIndex
    let currentIndex = turntableConfig.currentIndex

  
    
    // 在现在的基础上重新计算转盘
    let num = turntableConfig.list.length || 0
    // let rotateDeg = (rotateNum * 360 - index * 360 / data.length)  * Math.PI / 180 
    
    let rotateDeg = turntableConfig.currentRotate == 0 ? (turntableConfig.rotateNum * 360 + ( num - index - 0.5) * 360 / num) 
    : turntableConfig.currentRotate + (turntableConfig.rotateNum * 360 + (num - (index-currentIndex)) * 360 / num) 
    
    const canvas = document.querySelector('canvas')
    canvas.style.transform = `rotate(${rotateDeg}deg)`
    canvas.style.transition = `transform ${turntableConfig.duration}s ease`
    // 设置当前角度，以便在当前角度继续使用转盘
    setTurntableConfig({
        ...turntableConfig, 
        rotateState: false,
        // 默认3秒
        duration:3,
        // 默认3圈
        rotateNum:3,
        currentIndex:index,
        currentRotate:rotateDeg
     })
    }

  function onRotateEnd(){

    setTurntableConfig({
        ...turntableConfig,
        rotateState: true
    })
    console.log('抽中了'+ turntableConfig.list[turntableConfig.currentIndex].title);
    alert('抽中了'+ turntableConfig.list[turntableConfig.currentIndex].title)

  }
  
  async function initTurnable(){
     // 获取数据
    let { data } = await getData()
    setTurntableConfig({...turntableConfig, list:data})
  }
  const throttleInit = throttle(initCanvas, 2000)

  useEffect( ()=>{
    if( !isInit ){
        initTurnable()
    }
  },[])

  useEffect(()=>{
    throttleInit()
  },[turntableConfig.list])
  
 

  return (
    <div className="turntable" >
    <div className="pointer" onClick={onPointerClick}></div>
    <canvas  onTransitionEnd={onRotateEnd} >浏览器不支持画布效果</canvas>
  </div>
  )
}
