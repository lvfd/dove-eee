import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import axios from 'axios'

UIkit.use(Icons)
const dangerClass = 'uk-form-danger'
const successClass = 'uk-form-success'
const dataServer = 'http://localhost:8080'
window.addEventListener('DOMContentLoaded', () => {
  const inputForUserName = document.querySelector('#username')
  const inputsForSubmit = document.querySelectorAll('.uk-card-body input')
  const buttonForLogin = document.querySelector('#loginBtn')
  inputForUserName.addEventListener('blur', checkUserName)
  inputsForSubmit.forEach(input => input.addEventListener('focus', e => e.target.classList.remove(successClass, dangerClass)))
  buttonForLogin.addEventListener('click', loginFunction)
})
function checkUserName(event) {
  return new Promise((resolve, reject) => {
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
      console.error(error)
      input.classList.add(dangerClass)
      UIkit.modal.alert(error)
      return reject()
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
  axios.post(`${dataServer}/dove-eee-data/checkPassword`, postData)
  .then(response => {
    if (response.data === true) {
      passwordInput.classList.add(successClass)
      return document.querySelector('#loginForm').submit()
    }
    passwordInput.classList.add(dangerClass)
    UIkit.modal.alert('密码错误')
  })
  .catch(error => {
    console.error(error)
    UIkit.modal.alert(error)
  })
}