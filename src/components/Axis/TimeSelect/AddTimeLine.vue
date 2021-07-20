<template>
  <el-dialog
    align="left"
    :show-close="false"
    :close-on-click-modal="false"
    title="编辑进度"
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
      <el-form-item label="开始时间" prop="pre_package_time">
        <el-time-picker
          :default-value="new Date(daily + ' 00:00:00')"
          style="width: 100%"
          v-model="ruleForm.pre_package_time"
          placeholder="选择开始时间"
        >
        </el-time-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="pre_release_time">
        <el-time-picker
          :default-value="new Date(daily + ' 00:00:00')"
          style="width: 100%"
          v-model="ruleForm.pre_release_time"
          placeholder="选择结束时间"
        >
        </el-time-picker>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="saveForm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { format } from "@/utils/utils.js";
export default {
  name: "addTimeLine",
  props: {
    daily: {
      type: String,
      default: format(new Date().getTime(), "YYYY-MM-DD"),
    }
  },
  data() {
    return {
      ruleForm: {
        pre_package_time: "",
        pre_release_time: "",
        remark: "",
      },
      dialogVisible: false,
      rules: {
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
  methods: {
    show() {
      this.dialogVisible = true;
    },

    saveForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.handleClose();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleClose(done) {
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
      done && done();
    },
  },
};
</script>

<style>
</style>