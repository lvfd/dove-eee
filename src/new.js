import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import './init-page'
import { dataServer } from '../project.config'
import axios from 'axios'
UIkit.use(Icons)
const dangerClass = 'uk-form-danger'
tinymce.init({
  selector: 'textarea#content',
  language: 'zh-Hans',
  placeholder: '你可以添加文本，图片，表格，超链接',
  plugins: ['image', 'link', 'preview', 'table', 'lists'],
  toolbar: 'undo redo | bold italic alignleft aligncenter alignright alignjustify | link image table numlist bullist | preview',
  a11y_advanced_options: true,
  images_upload_url: '/dove-eee/images/upload',
})

window.addEventListener('load', () => {
  try {
    document.querySelector('#submitNewArticle').addEventListener('click', submitNewArticle)
    document.querySelectorAll('.uk-input').forEach(input => input.addEventListener('focus', e => e.target.classList.remove(dangerClass)))
  } catch (e) {
    console.error(e, e.stack)
    UIkit.modal.alert('页面初始化错误')
  }
})

function submitNewArticle() {
  axios.put(`${dataServer}/dove-eee-data/article`, getPostData(), { withCredentials: true })
  .then(response => {
    console.log(response)
    return UIkit.modal.alert('添加成功')
  })
  .catch(error => {
    try {
      if (error.response.status === 406) {
        if (error.response.data.msg === 'error') {
          return UIkit.modal.alert(error.response.data.error)
            .then(() => {
              const element = error.response.data.position
              if (element === 'title' || element === 'author')
                return document.querySelector(`#${element}`).classList.add(dangerClass)
            })
        }
        if (error.response.data.msg === 'failed') {
          console.error(error.response.data.errorMsg)
          return UIkit.modal.alert('远程服务处理失败: 数据库处理异常')
        }
      }
      console.error(error)
      return UIkit.modal.alert('远程服务处理失败: 网络异常')
    } catch(exception) {
      console.error(error)
      return UIkit.modal.alert('远程服务处理失败：其他异常')
    }
  })
}

function getPostData() {
  const title = document.querySelector('#title').value.trim()
  const author = document.querySelector('#author').value.trim()
  const editor = document.querySelector('#editor').value.trim()
  const content = tinymce.get('content').getContent().trim()
  return {
    title: title? title: '',
    author: author? author: '',
    editor: editor? editor: '',
    content: content? content: ''
  }
}