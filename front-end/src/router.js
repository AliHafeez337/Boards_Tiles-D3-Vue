import Vue from 'vue';
import Router from 'vue-router';
import Index from './pages/Index.vue';
import Users from './pages/Users.vue';
import Login from './pages/Login.vue';
import History from './pages/components/History/History.vue';
import MainNavbar from './layout/MainNavbar.vue';
import UsersNavbar from './layout/UsersNavbar.vue';
import LoginNavbar from './layout/LoginNavbar.vue';
import HistoryNavbar from './layout/HistoryNavbar.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'index',
      components: { default: Index, header: MainNavbar },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: 'black' }
      }
    },
    {
      path: '/users',
      name: 'users',
      components: { default: Users, header: UsersNavbar },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: 'black' }
      }
    },
    {
      path: '/login',
      name: 'login',
      components: { default: Login, header: LoginNavbar },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: '/history',
      name: 'history',
      components: { default: History, header: HistoryNavbar },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: 'black' }
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
