Component({

  behaviors: [],

  properties: {},
  data: {
    bottom: '86rpx',
    showDefault: false,
    isActive: false,
    itemImgs: [{
      id: 1,
      url: "./image/item1.png"
    }, {
      id: 2,
      url: "./image/item2.png"
    }, {
      id: 3,
      url: "./image/item3.png"
    }],
    currentLine1: { // 第一列当前显示的图片
      id: 1,
      url: "./image/item1.png"
    },
    currentLine2: { // 第二列当前显示的图片
      id: 2,
      url: "./image/item2.png"
    },
    currentLine3: { // 第三列当前显示的图片
      id: 3,
      url: "./image/item3.png"
    },
    animationData1: {}, // 第一列动画
    animationData2: {}, // 第二列动画
    animationData3: {}, // 第三列动画
    resNum: [] // 保存结果，将每一列的结果保存下来，如果有三个值，，说明摇奖结束
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
  },

  methods: {
    /* 触摸开始 */
    _handleTouchStart: function() {
      this.setData({
        bottom: '80rpx'
      })
    },
    /* 触摸结束 */
    _handleTouchEnd: function() {
      this.setData({
        bottom: '86rpx'
      })
    },
    /* "试试手气点击事件" */
    _handleClick: function() {
      if (!this.data.isActive) {
        // 随即生成0-10之间的数，0-2：结果为1,3-5：结果为2,6-8：结果为3,8-10：不中奖
        let randomNum = Math.random() * 10;
        randomNum = parseInt(randomNum, 10);

        // 隐藏默认图片
        this.setData({
          isActive: true, // 修改标识状态，表明摇奖正在进行，禁止重复点击
          showDefault: true,
          resNum: [] // 将结果数组置为空
        })

        this._handleAnimate(1, randomNum); // 第一个动画
        this._handleAnimate(2, randomNum); // 第二个动画
        this._handleAnimate(3, randomNum); // 第二个动画

        var self = this;
        // 校验最终的游戏结果，如果三个结果值都有值，并且全部一致，视为中奖，不一样，视为未中奖
        var resTime = setInterval(function() {
          if (self.data.resNum.length === 3) {
            // 延迟1秒给出提示
            setTimeout(function() {
              if (self.data.resNum[0] === self.data.resNum[1] && self.data.resNum[0] === self.data.resNum[2]) {
                wx.showToast({
                  title: '恭喜中奖',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '很遗憾，未中奖',
                  icon: 'none'
                })
              }
            }, 1000);
            clearInterval(resTime);
          }
        }, 1000);
      } else {
        wx.showToast({
          title: '您已经摇过奖了',
          icon: 'none'
        })
      }
    },
    /**
     * 处理动画动作
     * @param time 滚动多长时间
     * @param line 第几列
     */
    _handleAnimate: function(line, resNum) {
      var self = this;
      // 创建动画
      let animation = wx.createAnimation({
        duration: 200, // 执行一次动画的时间
        timingFunction: 'linear', // 动画的效果，平滑
      })

      // 随即生成摇奖区滚动的总共时长，范围5000-6000
      let randomTotalTime = Math.random() * 1000 + 5000;
      randomTotalTime = parseInt(randomTotalTime, 10);

      // 随即生成每次循环间隔的时间,500-600之间的随机数
      let tempRandom = Math.random() * 300 + 250;
      tempRandom = parseInt(tempRandom, 10);

      let num = 0; // 设定计数标签，从0开始
      let count = 1; // 循环计数
      // 设定循环
      let loop = setInterval(function() {
        num++; // 每次循环加1
        count++;
        if (num > 2) {
          // 如果计数标签大于2，置为0
          num = 0;
        }
        if (count * tempRandom >= randomTotalTime) {
          // 到达预定的时间点，停止循环，将图片定位到显示区域中间位置
          animation.translateY(85).step({
            duration: 1000
          });

          if (resNum >= 0 && resNum < 3) {
            num = 0;
          } else if (resNum >= 3 && resNum < 6) {
            num = 1;
          } else if (resNum >= 6 && resNum < 9) {
            num = 2;
          }

          handleSet(self);
          count = 0;
          // 更新结果数组
          let tempArr = self.data.resNum;
          tempArr.push(num);
          self.setData({
            resNum: tempArr
          })
          clearInterval(loop); // 停止循环
        } else {
          animation.translateY(170).step().translateY(0).step({
            duration: 0
          });
          handleSet(self);
        }

        function handleSet(self) {
          if (line === 1) {
            self.setData({
              currentLine1: self.data.itemImgs[num], // 修改显示的图片
              animationData1: animation.export()
            })
          } else if (line === 2) {
            self.setData({
              currentLine2: self.data.itemImgs[num], // 修改显示的图片
              animationData2: animation.export()
            })
          } else if (line === 3) {
            self.setData({
              currentLine3: self.data.itemImgs[num], // 修改显示的图片
              animationData3: animation.export()
            })
          }
        }
      }, tempRandom);
    },
    /* 动画结束后处理事件 */
    _handleTransitionend: function(val) {
      // console.log(val)
      // this.data.num1++;
      // this._handleClick();
      // if (this.data.num1 > 2) {
      //   this.data.num1 = 0;
      // }
    }
  }
})