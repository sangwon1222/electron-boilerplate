<script setup lang="ts">
import { router } from '@renderer/router'
import { login } from '@renderer/store/login'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

const deleteUser = async () => {
  if (confirm(`[ ${login.id} ]계정을 탈퇴합니까?`)) {
    const data = await login.deleteUser()
    if (data.ok) {
      router.push({ name: 'sign-in' })
    }
  }
}

const signOut = async () => {
  console.log(cookies.keys())
  const cookie = cookies.keys()
  for (const c of cookie) {
    console.log(c)
    console.log(cookies.get(c))
    cookies.remove(c)
  }
  console.log(cookies.keys())
  // const result = await login.signOut()
  // if(result.ok){
  //   router.push({name: 'sign-in'})
  // }else{

  // }
}
</script>

<template>
  <div class="flex flex-col gap-10 p-10">
    <div class="flex flex-col gap-6 ml-10"></div>
    <button @click="signOut">sign-out</button>
    <button @click="deleteUser">회원 탈퇴</button>
  </div>
</template>
