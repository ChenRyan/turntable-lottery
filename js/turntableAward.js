/**
 * 
 * @param {转盘渲染节点id， 默认id名 translate} el 
 * @param {转盘数据[{title, img, color},...]} list 
 * @param {转盘的宽度，格式：{width:400 }} style 
 * @param {是否自定义指针：非空则隐藏自定义指针，建议自定义指针样式，使得表盘更加美观} pointer 
 * @returns 
 */
var TurntableAward = function(el , list, style, pointer ){
            
    this.el = el || '#translate'
    this.defaultStyle = {
        width:400,
        height:400
    }
    // 转盘数据 [{title, img, color}] 文字、图片、背景颜色
    this.data = list 
    this.style = style || this.defaultStyle
    // 转盘结束回调函数
    this.callback = ()=>{}
    // 监听动画结束事件并调用回调
    this.setCloseEvent = ()=>{
        let _this = this
        // let canvas = document.querySelector(`${this.el}`)
       // 兼容性写法
        let transitions = {
        // 兼容IE
        'transition': 'transitionend',
        // 兼容Opera
        'OTransition': 'oTransitionEnd',
        // 兼容Firefox
        'MozTransition': 'transitionend',
        // 兼容Google
        'WebkitTransition': 'webkitTransitionEnd'
        };
        function getTransitions() {
            var t;
            for (t in transitions) {
                // t即transition，OTransition，MozTransition，WebkitTransition
                if (_this.canvas.style[t] !== undefined) {
                return transitions[t];
                }
            }
        }
        // 接收返回的当前浏览器的transition的值
        var setTransitions = getTransitions();
        // 添加监听事件
        setTransitions && _this.canvas.addEventListener(setTransitions,function (params) {
            _this.rotateState = true
            
            // console.log(index, '选中了'+list[index].title)
            _this.callback && _this.callback()
        },true)
    }
    // 处理新增轮盘元素
    this.initElem = ()=>{
 
        let _this = this
        // 设置外div
        let rotateElement = document.querySelector(this.el)

        // 设置转盘
        this.canvas = document.createElement('canvas')
        this.canvas.classList.add('canvas')
        this.canvas.innerHTML = '浏览器不支持画布效果'
        rotateElement.appendChild(this.canvas)
        this.canvas.width = this.canvas.height = this.style.width
        // 添加指针
        // 如果pointer不为空
        // 如果translate内部有自定义指针pointer
        if ( pointer|| rotateElement.querySelector('.pointer') ) return
        // 没自定义指针,设置默认pointer
        let pointerElem = document.createElement('div')
        pointerElem.classList.add('pointer')
        rotateElement.append(pointerElem)
    }
    // 绘制转盘
    this.init = async ( rotateDeg )=>{
        // 初始化基本节点
        this.initElem()
        // 设置监听
        this.setCloseEvent()
        // 开始绘制转盘
        let canvasStyle = this.style
        if ( !canvasStyle ) {
            canvasStyle = this.defaultStyle
        }
        // console.log(list);
        // console.log('canvasStyle', canvasStyle)
        // console.log('data', this.data)
        // console.log(typeof this.data , this.data);
        let context = this.canvas.getContext('2d')
        context.translate( this.canvas.width/2 , this.canvas.height / 2)
        context.rotate(rotateDeg)
        let num = typeof this.data == "object" ? this.data?.length : 0;
        // 绘制转盘分隔弧
        for(let i = 0 ; i < num ; i ++ ){
            context.save()
            context.beginPath()
            context.moveTo(0,0)
            context.rotate( 360 / num * i * Math.PI / 180)
            // 从12点钟方向0度开始绘制
            context.arc(0 , 0,  this.canvas.width/2,  -90*Math.PI/180,   2 * Math.PI / num-90*Math.PI/180, false)
            context.lineTo(0,0)
            if( this.data[i].bgColor ){
              context.fillStyle = `${this.data[i].bgColor}`
            }else{
              context.fillStyle = '#eee'
            }
            context.fill()

            // 文字图片居中 0.33
            context.rotate( 360 / num * 0.5 * Math.PI / 180)

            // 绘制文字
            context.fillStyle= this.data[i].txtColor || "#111"
            context.strokeStyle= this.data[i].txtColor || "#111"
            context.lineWidth = 20
            context.textAlign = 'center'
            context.font = "16px 微软雅黑"
            context.fillText( this.data[i].title , 0, -this.canvas.width/2 + 100, 100 )
            
            // 绘制图片
            if( this.data[i].img ) {
                let url = this.data[i].img
                // 等待图片加载
                let picPromise = new Promise( (resolve, reject) => {
                    let pic = new Image
                    pic.src = url
                    pic.onload = function(){
                        resolve(pic)
                    }
                })
                let pic =  await picPromise
                context.drawImage( pic , -16, -this.canvas.width/2 + 40, 32, 32 )

            }

            context.restore()
       
        }
        
    }
    // 当前转盘状态，是否可以开启转盘
    this.rotateState = true
    // 当前指针
    this.currentIndex = 0
    // 当前角度
    this.currentRotate = 0
    /**
     * 旋转转盘
     * rotateNum : 转几圈
     * duration: 动画持续几秒
     * index: 最终选中第几个
     * callback: 回调函数，可选
     * 
     * */
    this.rotate = function( index, rotateNum, duration, callback) {

        let _this = this
        if (  !_this.rotateState ) {
            console.log('转盘正在转圈，请等待...');
            return
        }
        if ( isNaN(index) ) {
            alert('请输入指针最终停留位置');
            return
        }
        this.rotateState = false
        // 默认回调
        this.callback = callback || function(){
            alert('抽中了'+list[index].title)
        }
        // 默认3秒
        this.duration = duration || 3
        // 默认0圈
        this.rotateNum = rotateNum || 0
        // 获取当前的currentIndex
        let currentIndex = this.currentIndex
        this.currentIndex = index
        // 在现在的基础上重新计算转盘
        // let rotateDeg = (rotateNum * 360 - index * 360 / this.data.length)  * Math.PI / 180 
        let rotateDeg = this.currentRotate == 0 ? (this.rotateNum * 360 + (this.data.length - index - 0.5) * 360 / this.data.length) 
        : this.currentRotate + (this.rotateNum * 360 + (this.data.length - (index-currentIndex)) * 360 / this.data.length) 

        let canvas = document.querySelector(`${this.el} canvas`)
        // 初始化
        canvas.style.transform = `rotate(${rotateDeg}deg)`
        canvas.style.transition = `transform ${this.duration}s ease`
        // 设置当前角度，以便在当前角度继续使用转盘
        this.currentRotate = rotateDeg

        setTimeout(()=>{
            canvas.style.transform = 'rotate('+rotateDeg +'deg)'
        },1000)
     
    }
    return  this
}
