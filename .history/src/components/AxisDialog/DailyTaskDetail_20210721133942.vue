<template>
  <el-dialog
    align="left"
    title="日报详情"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
    class="daily-task-detail-wrapper"
  >
    <div class="date-title">{{ daily }}</div>
    <div class="task-content-wrapper">
      <div class="content" v-for="(item, index1) in chartsdata" :key="index1">
        <div class="task-product">{{ index1 + 1 }}. {{ item.product }}</div>
        <div class="task-time-remark" v-for="(item2, index2) in item.list" :key="index1 + '-' + index2">
            <span>{{item2.pre_package_time.slice(11, 16)}} - {{item2.pre_release_time.slice(11, 16)}}</span>
            &nbsp;
            <span>{{item2.remark}}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DailyTaskDetail",
  props: {
    daily: String,
    chartsdata: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
    },

    handleClose(done) {
      this.dialogVisible = false;
      done instanceof Function && done();
    },
  },
};
</script>

<style lang="stylus">
.daily-task-detail-wrapper {
  .el-dialog__body {
    padding: 0 20px 20px;
  }

  .date-title {
    height: 20px;
    font-size: 16px;
    font-weight: 600;
  }

  .task-content-wrapper {
    .content {
      padding-top: 10px;
      .task-product {
        font-size: 16px;
        text-indent: 20px;
      }
      .task-time-remark{
          padding: 10px 20px 0;
      }
    }
  }
}
</style>