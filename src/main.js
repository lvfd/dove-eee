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
          td.innerText = /time/.test(property)? new Date(article[property]).toLocaleString(): article[property]
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
        link_delete.title = '删除'
        link_delete.setAttribute('uk-icon', 'icon: trash')
        link_delete.addEventListener('click', function(event) {
          event.preventDefault()
          const id = article['id']
          UIkit.modal.confirm(`确定删除《${article['title']}》吗?`)
          .then(() => {
            postDeleteArticle(id)
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
function postDeleteArticle(id) {
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
