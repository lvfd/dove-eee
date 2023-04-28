import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import './init-page'
import './init-tinymce'
import { dataServer } from '../project.config'
import axios from 'axios'
import submitNewArticleListener from './submit-listener'
UIkit.use(Icons)
const dangerClass = 'uk-form-danger'

submitNewArticleListener(submitNewArticle)

function submitNewArticle() {
  axios.put(`${dataServer}/dove-eee-data/article`, getPostData(), { withCredentials: true })
  .then(() => {
    return UIkit.modal.alert('添加成功')
  }, error => {
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
  .then(() => window.location.replace('/dove-eee/main'))
  .catch(error => {
    console.error('其他异常', error)
    UIkit.modal.alert('其他异常')
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