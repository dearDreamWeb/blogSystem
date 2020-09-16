import Vue from "vue";
import ElementUi from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import 'element-ui/lib/theme-chalk/display.css'; //根据类名做样式，如在xs尺寸下隐藏
import "./changeStyles.scss"; // 全局修改element的样式
Vue.use(ElementUi);