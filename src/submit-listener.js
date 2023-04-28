export default function(listener, config) {
  const dangerClass = config && config.dangerClass? config.dangerClass: 'uk-form-danger'
  window.addEventListener('load', () => {
    try {
      document.querySelector('#submitNewArticle').addEventListener('click', listener)
      document.querySelectorAll('.uk-input').forEach(input => input.addEventListener('focus', e => e.target.classList.remove(dangerClass)))
    } catch (e) {
      console.error(e, e.stack)
      UIkit.modal.alert('页面初始化错误')
    }
  })
}