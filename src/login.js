import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import axios from 'axios'
import { dataServer } from '../project.config'

UIkit.use(Icons)
const dangerClass = 'uk-form-danger'
const successClass = 'uk-form-success'
window.addEventListener('DOMContentLoaded', () => {
  const inputsForSubmit = document.querySelectorAll('.uk-card-body input')
  const buttonForLogin = document.querySelector('#loginBtn')
  inputsForSubmit.forEach(input => input.addEventListener('focus', e => e.target.classList.remove(successClass, dangerClass)))
  buttonForLogin.addEventListener('click', loginFunction)
})
function checkUserName(event) {
  return new Promise(resolve => {
    const input = event? event.target: document.querySelector('#username')
    const userName = input.value.trim()
    if (!userName) {
      input.classList.add(dangerClass)
      UIkit.modal.alert('用户名不能为空')
      return resolve(false)
    }
    axios.post(`${dataServer}/dove-eee-data/checkUserName`, { name: userName })
    .then(response => {
      if (response.data === true) {
        input.classList.add(successClass)
        return resolve(true)
      }
      input.classList.add(dangerClass)
      UIkit.modal.alert('用户不存在或被禁用')
      return resolve(false)
    })
    .catch(error => {
      console.error('==>Error@checkUserName: ', error)
      if (error.message) UIkit.modal.alert(error.message)
      return resolve(false)
    })
  })
}
async function loginFunction() {
  const userNamePass = await checkUserName()
  if (userNamePass === false) return
  const passwordInput = document.querySelector('#password')
  let postData = {
    username: document.querySelector('#username').value.trim(),
    password: passwordInput.value.trim()
  }
  axios.post('/dove-eee/login', postData)
  .then(response => {
    if (response.status === 201) {
      passwordInput.classList.add(successClass)
      UIkit.notification({
        message: response.data.msg,
        status: 'success',
        timeout: 500
      })
      UIkit.util.on('.uk-notification', 'close', () => window.location.replace('/dove-eee/main'))
    }
  })
  .catch(error => {
    if (error.response) {
      passwordInput.classList.add(dangerClass)
      UIkit.modal.alert(error.response.data.msg)
    }
  })
}