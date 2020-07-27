import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Test from '../components/Test.vue'
import Index from '../components/Index.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import RoomInfoManagement from '../components/room/RoomInfoManagement.vue'
import InitImport from '../components/mdata/InitImport.vue'
import UpdateData from '../components/mdata/UpdateData.vue'
import HygieneAdd from '../components/hygiene/HygieneAdd.vue'
import OutpersonRecord from '../components/outinperson/OutPersonRecord.vue'
import StudentLeaveRecord from '../components/outinperson/StudentLeaveRecord.vue'
import OutpersonManagement from '../components/outinperson/OutpersonManagement.vue'
import StudentLeaveManagement from '../components/outinperson/StudentLeaveManagement.vue'
import StudentLeaveStatus from '../components/outinperson/StudentLeaveStatus.vue'
import StudentBackRecord from '../components/outinperson/StudentBackRecord.vue'
import StudentBackManagent from '../components/outinperson/StudentBackManagent.vue'
import Statistics from '../components/statistics/Statistics.vue'
import HygieneManagement from '../components/hygiene/HygieneManagement.vue'
import ForgetPassword from '../components/ForgetPW.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/index',
      component: Index,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/init-import', component: InitImport },
        { path: '/update-data', component: UpdateData },
        { path: '/users', component: Users },
        { path: '/roominfo-management', component: RoomInfoManagement },
        { path: '/hygiene-add', component: HygieneAdd },
        { path: '/outperson-record', component: OutpersonRecord },
        { path: '/student-leave-record', component: StudentLeaveRecord },
        { path: '/outperson-management', component: OutpersonManagement },
        { path: '/student-leave-management', component: StudentLeaveManagement },
        { path: '/student-leave-status', component: StudentLeaveStatus },
        { path: '/student-back-record', component: StudentBackRecord },
        { path: '/student-back-managent', component: StudentBackManagent },
        { path: '/statistics', component: Statistics },
        { path: '/hygiene-management', component: HygieneManagement }
      ]
    },
    { path: '/test', component: Test },
    { path: '/forgetpw', component: ForgetPassword }
  ]
})

// 挂载路由导航守卫，从而实现权限页面控制
router.beforeEach((to, from, next) => {
  // if (to.path === '/login') { return next() }
  // if (to.path === '/test') { return next() }
  // const token = window.sessionStorage.getItem('token')
  // if (!token) { return next('/login') }
  next()
})

export default router
