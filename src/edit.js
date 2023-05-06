import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import './init-page'
import initTinymce from './init-tinymce'
import { dataServer } from '../project.config'
import axios from 'axios'
import submitUpdateArticleListener from './submit-listener'
UIkit.use(Icons)

window.addEventListener('DOMContentLoaded', writeOriginalValues)
submitUpdateArticleListener(submitUpdateArticle)

function writeOriginalValues() {
  const articleId = document.querySelector('#articleId').value
  if (!articleId) return console.error('articleId为空')
  const title = document.querySelector('#title')
  const author = document.querySelector('#author')
  const content = document.querySelector('#content')
  const version = document.querySelector('#version')
  axios.get(`${dataServer}/dove-eee-data/article`, {
    withCredentials: true,
    params: {id: articleId}
  })
  .then(response => {
    // console.log(response)
    try {
      const article = response.data.article
      title.value = article.title
      author.value = article.author
      content.innerText = article.content
      initTinymce()
      version.parentElement.removeAttribute('hidden')
      version.value = article.version
      return Promise.resolve(response.data.article)
    } catch(error) {
      return Promise.reject(error)
    }
  })
  .then(response => {
    document.querySelector('#submitNewArticle').addEventListener('click', () => {
      const submitData = {}
      try {
        if (title.value.trim() !== response.title) 
          submitData.title = title.value.trim()
        if (author.value.trim() !== response.author)
          submitData.author = author.value.trim()
        if (tinymce.get('content').getContent().trim() !== response.content)
          submitData.content = tinymce.get('content').getContent().trim()
        if (Object.keys(submitData).length === 0)
          return UIkit.modal.alert('您没有修改任何内容')
        submitData.timeModify = true
        console.log(submitData)
        axios.patch(`${dataServer}/dove-eee-data/article`, submitData, { 
          withCredentials: true,
          params: {id: articleId}
        })
        .then(() => {
          return UIkit.modal.alert('修改成功')
        })
        .then(() => window.location.href = '/dove-eee/main')
        .catch(error => {
          console.error('文章更新失败', error)
          UIkit.modal.confirm('文章更新失败, 是否返回文章列表界面?')
          .then(() => window.location.href = '/dove-eee/main', () => { return })
        })
      } catch(error) {
        console.error('文章修改界面提交数据错误', error)
        UIkit.modal.alert('文章修改界面提交数据错误')
      }
    })
  })
  .catch(error => {
    console.error('文章修改界面初始化错误', error)
    UIkit.modal.alert('文章修改界面初始化错误')
    .then(() => window.location.replace('/dove-eee/main'))
  })
}
function submitUpdateArticle() {
  
}
