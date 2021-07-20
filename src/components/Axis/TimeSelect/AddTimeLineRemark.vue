<template>
  <el-dialog
    align="left"
    :show-close="false"
    :close-on-click-modal="false"
    title="进度描述"
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
  name: "addTimeLineRemark",
  props: {
    daily: {
      type: String,
      default: format(new Date().getTime(), "YYYY-MM-DD"),
    }
  },
  data() {
    return {
      ruleForm: {
        remark: "",
      },
      pre_package_time: '',
      pre_release_time: '',
      dialogVisible: false,
      rules: {
        remark: [
          { required: true, message: "请输入任务描述", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    show(arr) {
      console.log(arr)
      this.pre_package_time = arr[0];
      this.pre_release_time = arr[1];
      this.dialogVisible = true;
    },

    saveForm() {
      let obj = {};
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          obj.pre_package_time = format(this.pre_package_time);
          obj.pre_release_time = format(this.pre_release_time);
          obj.remark = this.ruleForm.remark;
          console.log(obj);
          this.$emit('addLineToCurrentTask', obj);
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