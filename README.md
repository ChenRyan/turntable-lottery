## 使用例子见index.html

```
<!-- 数据格式 -->
 const list = [
            {
                title:'1元',
                img: './images/1.png',
                bgColor:'#ffeaa7',
                txtColor:'#111'
            },
            {
                title:'2元',
                img: './images/2.png',
                bgColor:'#fcf9f0',
                txtColor:'#111'
            },
            {
                title:'5元',
                bgColor:'#ffeaa7',
                img: './images/5.png'
            },
             {
                title:'谢谢参与',
                bgColor:'#fcf9f0',
                img: './images/0.png'
            },
            {
                title:'20元',
                bgColor:'#ffeaa7',
                img: './images/20.png'
            },
            {
                title:'50元',
                bgColor:'#fcf9f0',
                txtColor: "red",
                img: './images/50.png'
            },
            {
                title:'5元',
                bgColor:'#ffeaa7',
                img: './images/5.png'
            },
             {
                title:'谢谢参与',
                bgColor:'#fcf9f0',
                img: './images/0.png'
            },
        ]

<!-  创建实例  -  -->
/**
 * 
 * @param {转盘渲染节点id， 默认id名 translate} el 
 * @param {转盘数据[{title, img, bgColor, txtColor},...]} list 
 * @param {转盘的宽度，格式：{width:400 }} style 
 * @param {是否自定义指针：非空则隐藏自定义指针，建议自定义指针样式，使得表盘更加美观} pointer 
 * @returns 
 */
let turntableInstance = new TurntableAward("#translate",list, {width: 400 })
<!-- 初始化 -->
turntableInstance.init()

<!-- 监听指针点击事件 -->
document.querySelector(".pointer").onclick = function(){
    // translateAnimation(3, 4)
    let index = parseInt(Math.random() * 5)
    // 有回调函数
    // turntableInstance.rotate(  index, 3,4, function(){
    //     // 覆盖默认回调函数
    //     console.log('抽中了'+list[index].title)
    // })

    // 无回调函数
    turntableInstance.rotate( index,3,  4)

    // turntableInstance.rotate( index, 3 )
}

```

> 来源：[chenxw  gitee仓库地址](https://gitee.com/ryanchenxw/turntable-lottery.git)
