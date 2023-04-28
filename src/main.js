import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import axios from 'axios'
import './init-page'
import { dataServer } from '../project.config'
UIkit.use(Icons)

window.addEventListener('DOMContentLoaded', getArticleList)
function getArticleList() {
  axios.get(`${dataServer}/dove-eee-data/article`, { withCredentials: true })
  .then(response => {
    console.log(response)
    try {
      const articleList = response.data.articleList
      const thead = document.querySelector('#articleListTable > thead')
      const tbody = document.querySelector('#articleListTable > tbody')
      tbody.innerHTML = ''
      let articleProperties = []
      thead.querySelectorAll('th').forEach(th => {
        if (th.hasAttribute('data-prop')) articleProperties.push(th.getAttribute('data-prop'))
      })
      articleList.forEach(article => {
        const tr = document.createElement('tr')
        tbody.appendChild(tr)
        articleProperties.forEach(property => {
          const td = document.createElement('td')
          tr.appendChild(td)
          if (/time/.test(property)) td.innerText = new Date(article[property]).toLocaleString()
          else if (property === 'hidden' && article[property] === 0) {
            const iconEye = document.createElement('a')
            iconEye.setAttribute('uk-icon', 'icon: eye')
            iconEye.setAttribute('uk-tooltip', '文章可见')
            td.appendChild(iconEye)
            iconEye.addEventListener('click', patchArticle(article['id'], { hidden: 1 }))
          }
          else if (property === 'hidden' && article[property] === 1) {
            const iconEye = document.createElement('a')
            iconEye.setAttribute('uk-icon', 'icon: eye-slash')
            iconEye.setAttribute('uk-tooltip', '文章不可见')
            td.appendChild(iconEye)
            iconEye.addEventListener('click', patchArticle(article['id'], { hidden: 0 }))
          }
          else td.innerText = article[property]
          if (property === 'id') {
            td.setAttribute('data-prop', 'id')
            td.setAttribute('hidden', '')
          }
        })
        const actionTd = document.createElement('td')
        tr.appendChild(actionTd)
        const link_modify = document.createElement('a')
        const link_delete = document.createElement('a')
        actionTd.appendChild(link_modify)
        actionTd.appendChild(link_delete)
        link_modify.title = '修改'
        link_modify.setAttribute('uk-icon', 'icon: pencil')
        link_modify.classList.add('uk-margin-small-right')
        link_modify.href = `/dove-eee/edit/${article['id']}`
        link_delete.title = '删除'
        link_delete.setAttribute('uk-icon', 'icon: trash')
        link_delete.addEventListener('click', function(event) {
          event.preventDefault()
          const id = article['id']
          UIkit.modal.confirm(`确定删除《${article['title']}》吗?`)
          .then(() => {
            deleteArticle(id)
          }, () => {
            console.log(`不删除`)
          })
        })
      })
    } catch (error) {
      console.error('获取文章列表失败:', error)
      UIkit.modal.alert('获取文章列表失败')
    }
  })
  .catch(error => {
    console.error('远程数据处理失败：', error)
    UIkit.modal.alert('远程数据处理失败')
  })
}
function deleteArticle(id) {
  axios.delete(`${dataServer}/dove-eee-data/article?id=${id}`, { withCredentials: true })
  .then(() => {
    UIkit.notification('操作成功', {status:'success'})
    getArticleList()
  })
  .catch(error => {
    console.error(error)
    return UIkit.notification('操作失败', {status:'warning'})
  })
}
function patchArticle(id, args) {
  return function() {
    axios.patch(`${dataServer}/dove-eee-data/article`, args, { 
      withCredentials: true,
      params: {id: id}
    })
    .then(() => {
      getArticleList()
    })
    .catch(error => {
      console.error(error)
      UIkit.notification('操作失败', {status:'warning'})
      getArticleList()
    })
  }
}