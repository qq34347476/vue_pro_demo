<template>
  <div>
    <canvas id="canvas"
            ref="canvasRef"
            width="120"
            @click="draw"
            height="40"></canvas>
    <input type="text"
           v-model="text">
    <input type="button"
           value="提交"
           @click="checked">
  </div>
</template>

<script>
export default {
  data() {
    return {
      aCode: [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'q',
        'w',
        'e',
        'r',
        't',
        'y',
        'u',
        'i',
        'o',
        'p',
        'a',
        's',
        'd',
        'f',
        'g',
        'h',
        'j',
        'k',
        'l',
        'z',
        'x',
        'c',
        'v',
        'b',
        'n',
        'm'
      ],
      arr: [],
      text: '',
      num: ''
    }
  },
  methods: {
    // 获取随机颜色函数
    getColor() {
      var r = Math.floor(Math.random() * 256)
      var g = Math.floor(Math.random() * 256)
      var b = Math.floor(Math.random() * 256)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    //生成图形验证码
    draw() {
      let canvas = this.$refs.canvasRef //演员
      let context = canvas.getContext('2d') //舞台，getContext() 方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性。

      this.arr = [] //清除验证码
      this.text = this.num = ''
      context.clearRect(0, 0, 120, 40) //清楚之前的矩形
      context.strokeRect(0, 0, 120, 40) //绘制矩形（无填充）
      //绘制字母
      for (var i = 0; i < 4; i++) {
        let x = 20 + i * 20 //每个字母之间间隔20
        let y = 20 + 10 * Math.random() //y轴方向位置为20-30随机
        let index = Math.floor(Math.random() * this.aCode.length) //随机索引值
        let txt = this.aCode[index]
        context.font = 'bold 20px 微软雅黑' //设置或返回文本内容的当前字体属性
        context.fillStyle = this.getColor() //设置或返回用于填充绘画的颜色、渐变或模式，随机
        context.translate(x, y) //重新映射画布上的 (0,0) 位置，字母不可以旋转移动，所以移动容器
        let deg = -45 + (90 * Math.random() * Math.PI) / 180 //0-90度随机旋转
        context.rotate(deg) // 	旋转当前绘图
        context.fillText(txt, 0, 0) //在画布上绘制“被填充的”文本
        context.rotate(-deg) //将画布旋转回初始状态
        context.translate(-x, -y) //将画布移动回初始状态
        this.arr[i] = txt //接收产生的随机数
      }
      this.num = this.arr[0] + this.arr[1] + this.arr[2] + this.arr[3] //将产生的验证码放入num
      //绘制干扰线
      for (var i = 0; i < 8; i++) {
        context.beginPath() //起始一条路径，或重置当前路径
        context.moveTo(Math.random() * 120, Math.random() * 40) //把路径移动到画布中的随机点，不创建线条
        context.lineTo(Math.random() * 120, Math.random() * 40) //添加一个新点，然后在画布中创建从该点到最后指定点的线条
        context.strokeStyle = this.getColor() //随机线条颜色
        context.stroke() // 	绘制已定义的路径
      }
      // 绘制干扰点，此处用长度为1的线代替点
      for (var i = 0; i < 20; i++) {
        context.beginPath()
        let x = Math.random() * 120
        let y = Math.random() * 40
        context.moveTo(x, y)
        context.lineTo(x + 1, y + 1)
        context.strokeStyle = this.getColor()
        context.stroke()
      }
    },
    //验证验证码
    checked() {
      if (this.text === this.num) {
        alert('验证通过')
      } else {
        alert('验证失败')
      }
    }
  },
  mounted() {
    this.draw()
  }
}
</script>

<style lang="less" scoped>
</style>
