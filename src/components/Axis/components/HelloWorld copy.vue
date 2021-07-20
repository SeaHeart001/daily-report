<template>
  <div
    style="width: 100%; position: relative"
    ref="lineComponent"
    @mouseup="udown"
    @mouseleave="udown"
  >
    <div class="line-wrap-all-x">
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
      <div class="line-x-content">
        <div class="line-x"></div>
      </div>
    </div>
    <div
      class="line-wrap-all-y"
      name="mouse-event-div"
      v-if="lineComponentWidth"
      @mousedown="mdown($event)"
    >
      <div
        class="line-y-content"
        v-for="(colItem, index1) in chartsdata"
        :key="index1"
      >
        <div class="line-y"></div>
        <div
          class="content"
          v-for="(rowItem, index2) in colItem.list"
          :key="index1 + '_' + index2"
          :style="lineContentStyle(rowItem)"
          @mousedown="currentItemIndex = index1 + '_' + index2"
        >
          <div
            v-show="currentItemIndex === index1 + '_' + index2"
            name="mouse-event-target"
            class="left"
            @mousedown="dirEleClick($event, rowItem, index1, index2, -1)"
          ></div>
          <div
            class="time-line"
            @mouseup="udown"
            @mousedown="moveContent($event, rowItem, index1, index2)"
          ></div>
          <div
            v-show="currentItemIndex === index1 + '_' + index2"
            name="mouse-event-target"
            class="right"
            @mousedown="dirEleClick($event, rowItem, index1, index2, 1)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const time = new Date().toISOString().slice(0, 10);
const timeLength = 9 * 60 * 60 * 1000; //总时长的毫秒数
const errorTime = 1000 * 60; //由于js小数位的计算误差，暂设1分钟的时间处理误差

// 1. 每个元素的长度为 release - package;
// 2. 元素的位置为left : release - (time :09:00:00) / timeLength;

const format = function (date) {
  let year = new Date(date).getFullYear();
  let month =
    new Date(date).getMonth() + 1 > 9
      ? new Date(date).getMonth() + 1
      : "0" + (new Date(date).getMonth() + 1);
  let day =
    new Date(date).getDate() > 9
      ? new Date(date).getDate()
      : "0" + new Date(date).getDate();
  let hours =
    new Date(date).getHours() > 9
      ? new Date(date).getHours()
      : "0" + new Date(date).getHours();
  let minutes =
    new Date(date).getMinutes() > 9
      ? new Date(date).getMinutes()
      : "0" + new Date(date).getMinutes();
  let seconds =
    new Date(date).getSeconds() > 9
      ? new Date(date).getSeconds()
      : "0" + new Date(date).getSeconds();
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
};

export default {
  name: "hello",
  data() {
    return {
      elePosX: 0, //记录每次拖动元素时元素的鼠标位置
      lineComponentLeft: 0, //组件整体离浏览器视口的位置
      lineComponentWidth: 0, //组件整体的width
      currentItemIndex: 0,
      rowItemData: null,
      index_1: 0,
      index_2: 0,
      directive: 0,
      chartsdata: [
        {
          product: "1.0",
          list: [
            {
              pre_package_time: time + " 9:00:00",
              pre_release_time: time + " 10:00:00",
              id: 3,
              remark: "优化过滤器\n增加历史对比",
            },
            {
              pre_package_time: time + " 10:30:00",
              pre_release_time: time + " 11:30:00",
              id: 4,
              remark: "",
            },
            {
              pre_package_time: time + " 13:30:00",
              pre_release_time: time + " 17:30:00",
              id: 5,
              remark: "xxxx Test",
            },
          ],
        },
        {
          product: "2.0",
          list: [
            {
              pre_package_time: time + " 9:30:00",
              pre_release_time: time + " 18:00:00",
              id: 5,
              remark: "修复xxxx bug",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.lineComponentWidth = this.$refs.lineComponent.offsetWidth;
    console.log(this.lineComponentWidth, 123);
  },
  methods: {
    lineContentStyle(item) {
      let width =
        Math.floor(
          ((new Date(item.pre_release_time) - new Date(item.pre_package_time)) *
            this.lineComponentWidth) /
            timeLength
        ) +
        1 +
        "px";
      let left =
        Math.floor(
          ((new Date(item.pre_package_time) - new Date(time + " :9:00:00")) *
            this.lineComponentWidth) /
            timeLength
        ) + "px";
      return {
        width,
        left,
      };
    },

    computedTime(e) {
      // (timex / timeLength) = (disx / lineComponentWidth)
      let disX = e.clientX - this.elePosX;
      let disTime = Math.floor((disX / this.lineComponentWidth) * timeLength);
      return disTime;
    },

    udown() {
      document.onmousemove = null;
    },

    mdown(event) {
      if (event.which !== 1) {
        //限制鼠标右键
        return;
      }
      if (event.target.getAttribute("name") !== "mouse-event-target") {
        return;
      }
      let data = this.chartsdata[this.index_1].list[this.index_2];
      let pre_package_time = new Date(data.pre_package_time).getTime();
      let pre_release_time = new Date(data.pre_release_time).getTime();

      document.onmousemove = (e) => {
        this.$nextTick(() => {
          let dT = this.computedTime(e);
          let compareTime = this.compareTimeLint();
          if (this.directive < 0) {
            //修改pre_package_time

            if (
              pre_package_time + dT >= compareTime.lint1 + errorTime &&
              pre_package_time + dT <= compareTime.lint2 - errorTime
            ) {
              data.pre_package_time = format(pre_package_time + dT);
            } else if (pre_package_time + dT < compareTime.lint1 + errorTime) {
              data.pre_package_time = format(compareTime.lint1);
            } else if (pre_package_time + dT > compareTime.lint2 - errorTime) {
              data.pre_package_time = format(compareTime.lint2);
            } else {
              data.pre_package_time = data.pre_package_time;
            }
          } else {
            //修改pre_release_time

            if (
              pre_release_time + dT >= compareTime.lint2 + errorTime &&
              pre_release_time + dT <= compareTime.lint1 - errorTime
            ) {
              data.pre_release_time = format(pre_release_time + dT);
            } else if (pre_release_time + dT < compareTime.lint2 + errorTime) {
              data.pre_release_time = format(compareTime.lint2);
            } else if (pre_release_time + dT > compareTime.lint1 - errorTime) {
              data.pre_release_time = format(compareTime.lint1);
            } else {
              data.pre_release_time = data.pre_release_time;
            }
          }
        });
      };
    },

    compareTimeLint() {
      let lint1 = 0; //与其他时间段发生碰撞
      let lint2 = 0; //与自己发生碰撞
      let data = this.chartsdata[this.index_1].list;
      let compareIndex = this.index_2 + this.directive;
      let maxIndex = this.chartsdata[this.index_1].list.length - 1;
      let exTime = 0; //这里可以设置最小时间半小时60*60*1000/2

      if (this.directive < 0) {
        lint2 =
          new Date(data[this.index_2].pre_release_time).getTime() - exTime;

        if (compareIndex < 0) {
          lint1 = new Date(time + " 9:00:00").getTime();
        } else {
          lint1 = new Date(data[compareIndex].pre_release_time).getTime();
        }
      } else {
        lint2 =
          new Date(data[this.index_2].pre_package_time).getTime() + exTime;
        if (compareIndex > maxIndex) {
          lint1 = new Date(time + " 18:00:00").getTime();
        } else {
          lint1 = new Date(data[compareIndex].pre_package_time).getTime();
        }
      }
      return { lint1, lint2 };
    },

    dirEleClick(event, rowItem, index1, index2, dir) {
      if (event.which !== 1) {
        //限制鼠标右键
        return;
      }
      //模拟点击事件，没办法，事件的捕获机制让我不得不这么做
      console.log(event);
      event.preventDefault();
      console.log(event, rowItem, index1, index2, dir);
      this.lineComponentLeft =
        this.$refs.lineComponent.getBoundingClientRect().left;
      this.lineComponentWidth = this.$refs.lineComponent.offsetWidth;

      this.rowItemData = rowItem;
      this.index_1 = index1;
      this.index_2 = index2;
      this.directive = dir;
      this.elePosX = event.clientX;
    },

    //整体移动
    moveContent(event, rowItem, index1, index2) {
      if (event.which !== 1) {
        //限制鼠标右键
        return;
      }
      event.preventDefault();
      this.lineComponentLeft =
        this.$refs.lineComponent.getBoundingClientRect().left;
      this.lineComponentWidth = this.$refs.lineComponent.offsetWidth;
      this.rowItemData = rowItem;
      this.index_1 = index1;
      this.index_2 = index2;

      let compareData = this.chartsdata[this.index_1].list;
      let maxIndex = this.chartsdata[this.index_1].list.length - 1;
      let prevIndex = index2 - 1;
      let prevLint = 0;
      let nextIndex = index2 + 1;
      let nextLint = 0;
      let data = this.chartsdata[this.index_1].list[this.index_2];
      let pre_package_time = new Date(data.pre_package_time).getTime();
      let pre_release_time = new Date(data.pre_release_time).getTime();
      if (prevIndex < 0) {
        prevLint = new Date(time + " 9:00:00").getTime();
      } else {
        prevLint = new Date(compareData[prevIndex].pre_release_time).getTime();
      }
      if (nextIndex > maxIndex) {
        nextLint = new Date(time + " 18:00:00").getTime();
      } else {
        nextLint = new Date(compareData[nextIndex].pre_package_time).getTime();
      }

      let elePosX1 = event.clientX;

      document.onmousemove = (e) => {
        this.$nextTick(() => {
          let dT = Math.floor(
            ((e.clientX - elePosX1) / this.lineComponentWidth) * timeLength
          );
          data.pre_package_time = format(pre_package_time + dT);
          data.pre_release_time = format(pre_release_time + dT);

          if (dT > 0 && pre_release_time + dT > nextLint - errorTime) {
            data.pre_package_time = format(nextLint - (pre_release_time - pre_package_time));
            data.pre_release_time = format(nextLint)
          }

          if (dT < 0 && pre_package_time + dT < prevLint + errorTime) {
            data.pre_package_time = format(prevLint);
            data.pre_release_time = format(prevLint + (pre_release_time - pre_package_time))
          }

        });
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.line-wrap-all-x {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  border-top: 1px solid #000;

  .line-x-content {
    flex: 1;
    height: 100%;
    position: relative;

    .line-x {
      height: 5px;
      border-right: 1px solid #000;
      position: absolute;
      top: 0;
    }
  }
}

.line-wrap-all-y {
  height: 100%;
  width: 100%;
  border-left: 1px solid #000;

  .line-y-content {
    position: relative;
    width: 100%;
    height: 150px;

    .line-y {
      height: 100%;
      width: 5px;
      border-bottom: 1px solid #000;
      position: absolute;
      top: -1;
    }

    .content {
      position: absolute;
      height: 30px;
      top: 20px;

      .time-line {
        background-color: red;
        width: 100%;
        height: 30px;
      }

      .left, .right {
        width: 0;
        height: 0;
        // background-color: green;
        // width: 16px;
        // height: 16px;
        cursor: pointer;
        position: absolute;
        top: 0;
        z-index: 99;

        &.left {
          left: 0;
          border-left: 15px solid green;
          border-bottom: 15px solid transparent;
          border-top: 15px solid transparent;
        }

        &.right {
          right: 0;
          border-right: 15px solid green;
          border-bottom: 15px solid transparent;
          border-top: 15px solid transparent;
        }
      }
    }
  }
}
</style>
