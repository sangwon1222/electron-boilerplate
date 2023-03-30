<script setup lang="ts">
import { router } from '@renderer/router'
import { login } from '@renderer/store/login'
import { reactive, onMounted } from 'vue'

const state = reactive({
  id: '',
  pw: '',
  hasNotAccount: false,
  inputs: [] as HTMLCollectionOf<HTMLInputElement> | any,
})

const changeId = (e) => {
  state.id = e.target.value
  if (!e.target.value) state.hasNotAccount = false
}

const changePw = (e) => (state.pw = e.target.value)

const signIn = async () => {
  const { id, pw } = state
  if (!id && !pw) {
    state.inputs[0]?.focus()
    return
  }

  await login.signIn({ id, pw })
  if (!login.needSignIn) router.push({ name: 'home' })
}

const goSignUp = () => router.push({ name: 'sign-up' })

const checkInput = () => {
  let isComplete = true
  for (const input of state.inputs) {
    if (!input.value) {
      input.focus()
      isComplete = false
      break
    }
  }

  if (isComplete) signIn()
}

onMounted(() => {
  state.inputs = document.getElementsByTagName('input')
  state.inputs[0]?.focus()
})
</script>

<template>
  <div class="flex flex-col gap-6 p-10">
    <ul class="flex flex-col gap-6 ml-10">
      <li class="flex">
        <p class="w-20">아이디:</p>
        <input
          class="w-full"
          :value="state.id"
          @input="changeId"
          type="text"
          @keyup.enter="checkInput"
        />
      </li>
      <li class="flex">
        <p class="w-20">비밀번호:</p>
        <input
          class="w-full"
          :value="state.pw"
          @input="changePw"
          type="password"
          @keyup.enter="checkInput"
        />
      </li>
    </ul>
    <div class="text-red-600" :class="`${state.hasNotAccount ? 'opacity-1' : 'opacity-0'}`">
      <p>없는 계정입니다.</p>
      <p>회원가입 해주세요.</p>
    </div>
    <div class="flex flex-col gap-6 w-full">
      <button @click="checkInput">sign in</button>
      <button
        @click="goSignUp"
        :class="`${state.hasNotAccount ? 'bg-sky-400 text-white' : 'text-inherit'}`"
      >
        sign up
      </button>
    </div>
  </div>
</template>
