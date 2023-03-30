<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@renderer/store/login'

const router = useRouter()
const state = reactive({
  id: '',
  pw: '',
  rePw: '',
  name: '',
  isCheckedId: false,
  isDuplicateId: false,
  inputs: [] as HTMLCollectionOf<HTMLInputElement> | any,
})

const changeId = (e) => {
  state.id = e.target.value
  state.isCheckedId = false
}
const changePw = (e) => (state.pw = e.target.value)
const changeRePw = (e) => (state.rePw = e.target.value)
const changeName = (e) => (state.name = e.target.value)

const checkPw = () => {
  if ((state.pw, state.rePw)) {
    console.log(state.pw, state.rePw)
  }
}

const onEnter = async (e) => {
  const { target } = e
  if (target.id === 'id') {
    await checkDuplicateId()
  }
  state.isDuplicateId ? e.target.focus() : null
  let isComplete = true
  for (const input of state.inputs) {
    if (!input.value) {
      input.focus()
      isComplete = false
      break
    }
  }
  if (isComplete) signUp()
}

const checkDuplicateId = async () => {
  state.isCheckedId = true
  const { data } = await login.checkId({ id: state.id })
  state.isDuplicateId = data.length > 0
  if (state.isDuplicateId) {
  }
}

const signUp = async () => {
  const { id, pw, name } = state
  if (!(id && pw && name)) return
  const { data } = await login.signUp({ id, pw, name })
  if (data.ok && confirm(`${id}로 회원가입 하시겠습니까?`)) {
    router.push({ name: 'sign-in' })
  }
  if (!data.ok) {
    for (const input of state.inputs) {
      input.blur()
      input.classList.add('border-red-600')
      input.classList.add('border-2')
    }
    state.inputs[0]?.select()
  }
}

onMounted(() => {
  state.inputs = document.getElementsByTagName('input')
  state.inputs[0]?.focus()
})
</script>

<template>
  <ul class="m-40">
    <li>
      <p>아이디:</p>
      <input id="id" :value="state.id" @input="changeId" type="text" @keydown.enter="onEnter" />
      <button class="ml-10 border-2" @click="checkDuplicateId" :="">중복확인</button>
      <ol class="text-xs pb-4" :class="`${state.isCheckedId ? 'opacity-1' : 'opacity-0'}`">
        <li v-if="!state.isDuplicateId" class="text-white">중복되지 않는 ID입니다</li>
        <li v-if="state.isDuplicateId" class="text-red-600">중복되는 ID입니다</li>
      </ol>
    </li>
    <li>
      <p>비밀번호:</p>
      <input :value="state.pw" @input="changePw" type="password" @keydown.enter="onEnter" />
    </li>
    <li>
      <p>비밀번호 확인:</p>
      <input
        :value="state.rePw"
        @input="changeRePw"
        type="password"
        @keydown.enter="onEnter"
        @blur="checkPw"
      />
    </li>
    <li>
      <p>이름:</p>
      <input :value="state.name" @input="changeName" type="text" @keydown.enter="onEnter" />
    </li>
  </ul>

  <button @click="signUp">Sign Up</button>
  <button @click="() => router.push({ name: 'sign-in' })">Sign In</button>
</template>
