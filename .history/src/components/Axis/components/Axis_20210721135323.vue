<template>
  <div
    style="width: 100%; position: relative"
    ref="lineComponent"
    @mouseup="udown"
    @mouseleave="udown"
  >
    <div class="line-wrap-all-x">
      <div class="line-x-content">
        <div class="line-x">
          <span>09:00</span>
        </div>
      </div>
      <div class="line-x-content">
        <div class="line-x">
          <span>10:00</span>
        </div>
      </div>
      <div class="line-x-content">
        <div class="line-x">
          <span>11:00</span>
        </div>
      </div>
      <div class="line-x-content">
        <div class="line-x">
          <span>12:00</span>
        </div>
      </div>
      <div class="line-x-content">
        <div class="line-x">
          <span>13:00</span>
        </div>
      </div>
      <div class="line-x-content">
        <div class="line-x">
          <span>14:00</span>
        </div>
      </div>
      <div class="line-x-content">
        <div class="line-x">
          <span>15:00</span>
        </div>
      </div>
      <div class="line-x-content">
        <div class="line-x">
          <span>16:00</span>
        </div>
      </div>
      <div class="line-x-content">
        <div class="line-x">
          <span>17:00</span>
        </div>
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
        :class="{ active: currentTaskIndex === index1 }"
        @click="selectCurrentTask(colItem, index1)"
        @contextmenu.prevent="editRowTask($event, colItem, index1)"
      >
        <div class="line-y">
          <div
            class="line-product"
            :style="{ width: 14 * colItem.product.length + 'px' }"
          >
            {{ colItem.product }}
          </div>
        </div>
        <div
          class="content"
          v-for="(rowItem, index2) in colItem.list"
          :key="index1 + '_' + index2"
          :style="lineContentStyle(rowItem)"
          @mousedown="selectCurrentIndex(index1, index2)"
        >
          <div
            v-show="currentItemIndex === index1 + '_' + index2"
            name="mouse-event-target"
            class="left"
            @mousedown="dirEleClick($event, rowItem, index1, index2, -1)"
          ></div>
          <!-- @contextmenu.prevent="editLine($event, rowItem)" editRowTask-->
          <div
            class="time-line"
            :class="{ even: index2 % 2 == 1 }"
            @contextmenu.prevent="editLine($event, rowItem)"
            @mouseup="udown"
            @mousedown="moveContent($event, rowItem, index1, index2)"
            @contextmenu.prevent.stop="() => {}"
          >
            <div class="line-remark">{{ rowItem.remark }}</div>
            <div class="start-time">
              {{ rowItem.pre_package_time.slice(10, 16) }}
            </div>
            <div class="end-time">
              {{ rowItem.pre_release_time.slice(10, 16) }}
            </div>
          </div>
          <div
            v-show="currentItemIndex === index1 + '_' + index2"
            name="mouse-event-target"
            class="right"
            @mousedown="dirEleClick($event, rowItem, index1, index2, 1)"
          ></div>
        </div>
      </div>
    </div>

    <div
      v-show="editTaskRowShow"
      class="edit-line-poppover"
      :style="{
        top: `${contextmenuTop + 5}px`,
        left: `${contextmenuLeft + 5}px`,
      }"
    >
      <el-link type="primary" @click="addTaskLine">增加进度</el-link><br />
      <el-link type="primary" @click="removeTaskRow">删除任务</el-link><br />
    </div>

    <div
      v-show="editLineShow"
      class="edit-line-poppover"
      :style="{
        top: `${contextmenuTop + 5}px`,
        left: `${contextmenuLeft + 5}px`,
      }"
    >
      <el-link type="primary" @click="removeTaskLine">删除进度</el-link><br />
    </div>

    <daily-task-detail
      ref="DailyTaskDetail"
      :daily="daily"
      :chartsdata="chartsdata"
    ></daily-task-detail>
    <add-time-line-remark
      @addLineToCurrentTask="addLineToCurrentTask"
      ref="AddTimeLineRemark"
    ></add-time-line-remark>
  </div>
</template>

<script>
// 1. 每个元素的长度为 release - package;
// 2. 元素的位置为left : release - (time :09:00:00) / timeLength;

import { format } from "@/utils/utils.js";
import DailyTaskDetail from "../../AxisDialog/DailyTaskDetail.vue";

import AddTimeLineRemark from "../TimeSelect/AddTimeLineRemark.vue";

// const time = new Date().toISOString().slice(0, 10);
const timeLength = 9 * 60 * 60 * 1000; //总时长的毫秒数S
const errorTime = 1000 * 60; //由于js小数位的计算误差，暂设1分钟的时间处理误差

export default {
  name: "hello",
  props: {
    daily: {
      type: String,
      default: format(new Date().getTime(), "YYYY-MM-DD"),
    },
  },
  components: {
    DailyTaskDetail,
    AddTimeLineRemark,
  },
  watch: {
    daily(value) {
      //console.log(value, 'dayli');
      if (this.chartsdata.length === 0) {
        return;
      }
      let reg = /(\d{4})-(\d{2})-(\d{2})/;
      for (let i = 0; i < this.chartsdata.length; i++) {
        let chartsList = this.chartsdata[i].list;
        //console.log(chartsList);
        chartsList.forEach((item) => {
          item.pre_package_time = item.pre_package_time.replace(
            reg,
            this.daily
          );
          item.pre_release_time = item.pre_release_time.replace(
            reg,
            this.daily
          );
        });
      }
    },
  },
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
      exTime: (60 * 60 * 1000) / 2, //任务的最小时间差
      chartsdata: [
        {
          product: "1.0",
          list: [
            {
              pre_package_time: this.daily + " 9:00:00",
              pre_release_time: this.daily + " 10:00:00",
              id: 3,
              remark: "优化过滤器\n增加历史对比",
            },
            {
              pre_package_time: this.daily + " 10:30:00",
              pre_release_time: this.daily + " 11:30:00",
              id: 4,
              remark: "",
            },
            {
              pre_package_time: this.daily + " 13:30:00",
              pre_release_time: this.daily + " 17:30:00",
              id: 5,
              remark: "xxxx Test",
            },
          ],
        },
        {
          product: "2.0",
          list: [
            {
              pre_package_time: this.daily + " 9:30:00",
              pre_release_time: this.daily + " 18:00:00",
              id: 5,
              remark: "修复xxxx bug",
            },
          ],
        },
      ],
      currentTask: {},
      currentTaskIndex: -1,
      contextmenuTop: 0,
      contextmenuLeft: 0,
      editTaskRowShow: false,
      currentSelectTimeList: [],
      addLineToIndex: 0,

      editLineShow: false,
    };
  },
  mounted() {
    this.lineComponentWidth = this.$refs.lineComponent.offsetWidth;
    setTimeout(() => {
      //滚动条出现时需要重新计算宽度，暂没有找到更合适方式监视滚动条消失出现
      this.lineComponentWidth = this.$refs.lineComponent.offsetWidth;
    }, 300);

    window.onresize = () => {
      this.lineComponentWidth = this.$refs.lineComponent.offsetWidth;
    };
  },
  computed: {
    ableSelectTimeList() {
      let arr = this.currentSelectTimeList.filter((item1, index) => {
        return index % 2 == 0;
      });
      return arr;
    },
  },
  methods: {
    openTaskDetail() {
      this.$refs.DailyTaskDetail.open();
    },

    selectCurrentTask(data, index) {
      this.currentTask = data;
      this.currentTaskIndex = index;
      this.editTaskRowShow = false;
      this.editLineShow = false;
    },

    editRowTask(event, data, index) {
      this.currentTask = data;
      this.currentTaskIndex = index;
      this.contextmenuTop =
        event.clientY - this.$refs.lineComponent.getBoundingClientRect().top;
      this.contextmenuLeft = event.clientX - 300;
      this.editTaskRowShow = true;
      this.editLineShow = false;
    },

    showEditLineDialog() {
      this.editTaskRowShow = false;
    },

    removeTaskRow() {
      this.editTaskRowShow = false;
      this.chartsdata.splice(this.currentTaskIndex, 1);
    },

    //增加进度
    addTaskLine() {
      let arr = [];
      this.currentSelectTimeList = [];
      arr.push(this.daily + " 09:00:00");
      for (let i = 0; i < this.currentTask.list.length; i++) {
        arr.push(this.currentTask.list[i].pre_package_time);
        arr.push(this.currentTask.list[i].pre_release_time);
      }
      arr.push(this.daily + " 18:00:00");
      for (let j = 0; j < arr.length - 1; j++) {
        this.currentSelectTimeList.push([arr[j], arr[j + 1]]);
      }
      this.editTaskRowShow = false;
      let time =
        Math.floor(
          (this.contextmenuLeft / this.lineComponentWidth) * timeLength
        ) + new Date(this.daily + " 09:00:00").getTime();
      console.log(time);
      this.addTaskLimit(time);
    },

    addTaskLimit(time) {
      console.log(this.ableSelectTimeList);
      let arr = [];
      for (let i = 0; i < this.ableSelectTimeList.length; i++) {
        let st = new Date(this.ableSelectTimeList[i][0]).getTime();
        let et = new Date(this.ableSelectTimeList[i][1]).getTime();
        if (time >= st && time + this.exTime <= et) {
          console.log(11111);
          this.addLineToIndex = i;
          arr[0] = time;
          arr[1] = time + this.exTime;
          break;
        }
      }
      if (arr.length) {
        this.$refs.AddTimeLineRemark.show(arr);
      } else {
        this.$message.error("请合理安排时间");
      }
    },

    addLineToCurrentTask(data) {
      console.log(this.addLineToIndex);
      this.currentTask.list.splice(this.addLineToIndex, 0, data);
    },

    //编辑进度
    editLine(event, data) {
      // let { pre_package_time, pre_release_time, remark } = data;
      // this.rowItemData = data;
      // this.$set(this.rowItemData, "pre_package_time", pre_package_time);
      // this.$set(this.rowItemData, "pre_release_time", pre_release_time);
      // this.$set(this.rowItemData, "remark", remark);
      // console.log(data, this.currentTask, this.rowItemData, event);
      this.editLineShow = true;
      this.contextmenuTop =
        event.clientY - this.$refs.lineComponent.getBoundingClientRect().top;
      this.contextmenuLeft = event.clientX - 300;
    },

    removeTaskLine() {
      this.editLineShow = false;
    },

    addTask(task) {
      this.chartsdata.push(task);
      setTimeout(() => {
        //滚动条出现时需要重新计算宽度，暂没有找到更合适方式监视滚动条消失出现
        this.lineComponentWidth = this.$refs.lineComponent.offsetWidth;
      }, 300);
    },

    selectCurrentIndex(index1, index2) {
      this.currentItemIndex = index1 + "_" + index2;
      this.index_1 = index1;
      this.index_2 = index2;
      this.editTaskRowShow = false;
    },

    //元素移动碰撞边界

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
          ((new Date(item.pre_package_time) -
            new Date(this.daily + " 09:00:00")) *
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
      let exTime = this.exTime; //这里可以设置最小时间半小时60*60*1000/2

      if (this.directive < 0) {
        lint2 =
          new Date(data[this.index_2].pre_release_time).getTime() - exTime;

        if (compareIndex < 0) {
          lint1 = new Date(this.daily + " 09:00:00").getTime();
        } else {
          lint1 = new Date(data[compareIndex].pre_release_time).getTime();
        }
      } else {
        lint2 =
          new Date(data[this.index_2].pre_package_time).getTime() + exTime;
        if (compareIndex > maxIndex) {
          lint1 = new Date(this.daily + " 18:00:00").getTime();
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
        prevLint = new Date(this.daily + " 09:00:00").getTime();
      } else {
        prevLint = new Date(compareData[prevIndex].pre_release_time).getTime();
      }
      if (nextIndex > maxIndex) {
        nextLint = new Date(this.daily + " 18:00:00").getTime();
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
            data.pre_package_time = format(
              nextLint - (pre_release_time - pre_package_time)
            );
            data.pre_release_time = format(nextLint);
          }

          if (dT < 0 && pre_package_time + dT < prevLint + errorTime) {
            data.pre_package_time = format(prevLint);
            data.pre_release_time = format(
              prevLint + (pre_release_time - pre_package_time)
            );
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
      z-index: 1;

      span {
        position: absolute;
        top: -20px;
        left: -5px;
      }
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
    height: 200px;
    top: 1px;

    .line-product {
      max-width: 200px;
      position: absolute;
      top: 50%;
      transform: translate(-100%, -50%);
      padding: 10px;
      text-align: left;
      font-size: 14px;
      pointer-events: none;
    }

    &.active {
      background-color: #eee;
    }

    .line-y {
      height: 100%;
      width: 5px;
      border-bottom: 1px solid #000;
      position: absolute;
      top: -1px;
      z-index: 1;
    }

    .content {
      position: absolute;
      height: 30px;
      top: 20px;

      .time-line {
        background-color: red;
        width: 100%;
        height: 30px;
        position: relative;
        border-radius: 5px;

        .start-time, .end-time {
          position: absolute;
          top: 30px;
          pointer-events: none;
        }

        &.even {
          .start-time, .end-time {
            top: -15px;
          }
        }

        .start-time {
        }

        .end-time {
          right: 0;
          transform: translateX(100%);
        }

        .line-remark {
          width: 100%;
          box-sizing: border-box;
          line-height: 15px;
          max-height: 120px;
          position: absolute;
          top: 40px;
          pointer-events: none;
          text-align: left;
          overflow: hidden;
          text-indent: 20px;
          margin: 5px 0;
          padding: 0 5px;
          word-break: break-all;
        }
      }

      .left, .right {
        width: 0;
        height: 0;
        border-radius: 5px;
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

.edit-line-poppover {
  position: absolute;
  min-width: 40px;
  min-height: 20px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  z-index: 109;
}
</style>
