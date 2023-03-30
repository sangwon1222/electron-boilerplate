import { reactive } from 'vue'
import api from '../api'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

interface userInfo {
  id: string
  pw: string
  name?: string
}

class Login {
  id = ''
  pw = ''
  jwt = ''
  needSignIn: boolean = true
  get isLogined() {
    return this.jwt.length > 0
  }

  async signIn({ id, pw }: userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await api.post('/auth/sign-in', { id, pw })
        if (data.ok) {
          const access = data.result.accessToken
          const refresh = data.result.refreshToken
          cookies.set('accessToken', access, import.meta.env.VITE_ACCESS_TIME)
          cookies.set('refreshToken', refresh, import.meta.env.VITE_REFRESH_TIME)
          this.id = id
          this.pw = pw
          this.needSignIn = false
          resolve(data.msg)
        }
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }

  async verifyToken() {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, pw } = this
        const { data } = await api.post('auth/sign-in/accessTokenCheck', { id, pw })
        if (data.ok) {
          resolve(true)
        } else {
          console.error(data.msg)
          alert(data.result)
          this.needSignIn = true
          resolve(false)
        }
        return { data }
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }

  async refreshToken() {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await api.post('/api/auth/refreshToken')
        if (data.ok) {
          const access = data.result.accessToken
          const refresh = data.result.refreshToken
          cookies.set('accessToken', access, import.meta.env.VITE_ACCESS_TIME)
          cookies.set('refreshToken', refresh, import.meta.env.VITE_REFRESH_TIME)
          this.needSignIn = false
          resolve(true)
        } else {
          console.error(data.msg)
          this.needSignIn = true
          resolve(false)
        }
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  }

  async signUp({ id, pw, name }: userInfo) {
    const { data } = await api.post('auth/sign-up', { id, pw, name })
    return { data }
  }

  async signOut() {
    try {
      const { data } = await api.post('auth/sign-out', { id: this.id })
      this.id = ''
      this.pw = ''
      this.jwt = ''
      this.needSignIn = true
      return data
    } catch (e) {
      console.error(e)
      return { ok: false }
    }
  }

  async deleteUser() {
    const { id, pw } = this
    try {
      const { data } = await api.post('auth/delete-user', { id, pw })
    } catch (e) {
      return { ok: false }
    }
    this.jwt = ''
    return { ok: true }
  }

  async checkId({ id }: { id: string }) {
    const { data } = await api.post('auth/check-id', { id })
    return { data }
  }
}

export const login = reactive(new Login())
