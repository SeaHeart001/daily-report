<template>
  <div class="axis-wrapper">
    <div class="axis-form">
      <div class="form-item">
        <div class="label">请选择日期</div>
        <el-date-picker
          :clearable="false"
          :editable="false"
          value-format="yyyy-MM-dd"
          v-model="daily"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div class="form-item">
        <el-button @click="openAddTask">新增任务</el-button>
        <el-button @click="openTaskDetail">日报详情</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </div>
    <div class="axis-content">
      <Axis :daily="daily" ref="axisComponent"></Axis>
    </div>

    <el-dialog
      align="left"
      :show-close="false"
      :close-on-click-modal="false"
      title="新增任务"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="任务名称" prop="product">
          <el-input v-model="ruleForm.product"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="ruleForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="pre_package_time">
          <el-time-select
            :picker-options="{
              start: '09:00',
              step: '00:30',
              end: '18:00',
              maxTime: ruleForm.pre_release_time,
            }"
            placeholder="选择开始时间"
            v-model="ruleForm.pre_package_time"
            style="width: 100%"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="结束时间" prop="pre_release_time">
          <el-time-select
            :picker-options="{
              start: '09:00',
              step: '00:30',
              end: '18:00',
              minTime: ruleForm.pre_package_time,
            }"
            placeholder="选择结束时间"
            v-model="ruleForm.pre_release_time"
            style="width: 100%"
          ></el-time-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="saveForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { format } from '@/utils/utils.js';
import Axis from "./components/Axis.vue";

export default {
  name: "AxisIndex",

  components: {
    Axis,
  },

  data() {
    return {
      daily: format(new Date().getTime(), "YYYY-MM-DD"),
      ruleForm: {
        product: "",
        pre_package_time: "",
        pre_release_time: "",
        remark: "",
      },
      dialogVisible: false,
      rules: {
        product: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入任务描述", trigger: "blur" },
        ],
        pre_package_time: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        pre_release_time: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
      },
    };
  },

  watch: {
    '$route': {
      deep: true,
      handler(newValue, oldValue){
        console.log(newValue, oldValue)
      }
    }
  },

  mounted(){
    console.log(this.$route.params)
  },

  methods: {
    openAddTask() {
      this.dialogVisible = true;
    },

    openTaskDetail(){
      this.$refs.axisComponent.openTaskDetail()
    },
    
    saveForm() {
      let obj = {
        product: this.ruleForm.product,
        list: [
          {
            pre_package_time: this.daily + " " + this.ruleForm.pre_package_time,
            pre_release_time: this.daily + " " + this.ruleForm.pre_release_time,
            remark: this.ruleForm.remark,
          },
        ],
      };
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.axisComponent.addTask(obj);
          this.handleClose();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log(obj);
    },

    handleClose(done) {
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
      done && done();
    },
  },
};
</script>

<style lang="stylus">
.axis-wrapper {
  width: 100%;
  height: 100%;

  .axis-form {
    width: 100%;
    height: 60px;
    line-height: 60px;
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;

    .form-item {
      display: flex;
      height: 60px;
      justify-content: center;
      align-items: center;
      margin-right: 10px;

      .label {
        margin-right: 10px;
      }
    }
  }

  .axis-content {
    box-sizing: border-box;
    padding: 40px 100px 40px 300px;
    font-size: 12px;
  }
}
</style>