import { login } from '@renderer/store/login'
import { createRouter, createWebHistory } from 'vue-router'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

// 라우터 설계
const routes = [
  {
    path: '/',
    name: '/',
    meta: { layout: 'none' },
    component: () => import('../views/login/signIn/index.vue'),
  },
  {
    path: '/sign-in',
    meta: { layout: 'none' },
    name: 'sign-in',
    component: () => import('../views/login/signIn/index.vue'),
  },
  {
    path: '/sign-up',
    meta: { layout: 'none' },
    name: 'sign-up',
    component: () => import('../views/login/signUp/index.vue'),
  },
  { path: '/home', name: 'home', component: () => import('../views/todo/home/index.vue') },
]

// 라우터 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  console.log('needSignIn', login.needSignIn)
  console.log('path', to.path)
  if (to.path === 'sign-in' && !login.needSignIn) {
    return next('home')
  }

  if (!login.needSignIn) {
    const access = cookies.get('accessToken')
    const refresh = cookies.get('refreshToken')

    //@@ refreshToken이 없을 경우 로그인 창 띄우기
    if (refresh === null) {
      login.needSignIn = true
    } else if (access === null && refresh !== null) {
      //refreshToken은 있고 accessToken만 있을 경우 재발급요청
      await login.refreshToken()
    } else {
      //토큰이 다 있다면 페이지 이동 전 토큰 검증
      await login.verifyToken()
    }
    return next()
  } else {
    login.needSignIn = false
    return next()
  }
})

// 라우터 추출 (main.js에서 import)
export { router }
