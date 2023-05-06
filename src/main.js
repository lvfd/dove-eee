import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import axios from 'axios'
import './init-page'
import { dataServer } from '../project.config'
UIkit.use(Icons)

window.addEventListener('DOMContentLoaded', getArticleList)
function getArticleList() {
  axios.get('/dove-eee/articleListStatus')
  .then(status => {
    return axios.get(`${dataServer}/dove-eee-data/articleList`, { 
      withCredentials: true,
      params: {
        orderBy: status.data.orderBy,
        pageNum: status.data.pageNum,
        pageSize: status.data.pageSize
      }
    })
  }, error => {
    console.error('获取session失败', error)
    UIkit.modal.alert('获取session失败, 请重新登录').then(() => window.location.replace('/dove-eee'))
  })
  .then(response => {
    try {
      const articleList = response.data.articleList
      const thead = document.querySelector('#articleListTable > thead')
      const tbody = document.querySelector('#articleListTable > tbody')
      tbody.innerHTML = ''
      const articleProperties = getArticlePropertiesFrom(thead)
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
            iconEye.classList.add('uk-text-success')
            td.appendChild(iconEye)
            iconEye.addEventListener('click', patchArticle(article['id'], { hidden: 1 }))
          }
          else if (property === 'hidden' && article[property] === 1) {
            const iconEye = document.createElement('a')
            iconEye.setAttribute('uk-icon', 'icon: eye-slash')
            iconEye.setAttribute('uk-tooltip', '文章不可见')
            iconEye.classList.add('uk-text-muted')
            td.appendChild(iconEye)
            iconEye.addEventListener('click', patchArticle(article['id'], { hidden: 0 }))
          }
          else td.innerText = article[property]
          if (property === 'id') {
            td.setAttribute('data-prop', 'id')
            td.setAttribute('hidden', '')
          }
        })
        buildActionTd(tr, article)
      })
    } catch (error) {
      console.error('构建表格失败:', error)
      UIkit.notification('构建表格失败', {status:'danger'})
    }
    buildPagination(response)
  }, error => {
    console.error('获取articleList数据失败', error)
    UIkit.notification('获取articleList数据失败', {status:'danger'})
  })
  .catch(error => {
    console.error('页面程序错误', error)
    UIkit.modal.alert('页面程序错误').then(() => window.location.replace('/dove-eee'))
  })
}
function getArticlePropertiesFrom(thead) {
  const articleProperties = []
  thead.querySelectorAll('th').forEach(th => {
    if (th.hasAttribute('data-prop')) articleProperties.push(th.getAttribute('data-prop'))
  })
  return articleProperties
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
function buildActionTd(tr, article) {
  const actionTd = document.createElement('td')
  tr.appendChild(actionTd)
  const link_modify = document.createElement('a')
  const link_delete = document.createElement('a')
  const link_copy = document.createElement('a')
  actionTd.appendChild(link_modify)
  actionTd.appendChild(link_copy)
  actionTd.appendChild(link_delete)
  link_modify.title = '修改'
  link_delete.title = '删除'
  link_copy.title = '复制'
  link_modify.setAttribute('uk-icon', 'icon: file-edit')
  link_delete.setAttribute('uk-icon', 'icon: trash')
  link_copy.setAttribute('uk-icon', 'icon: copy')
  link_modify.classList.add('uk-margin-small-right')
  link_copy.classList.add('uk-margin-small-right')
  link_modify.href = `/dove-eee/edit/${article['id']}`
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
  link_copy.addEventListener('click', function(event) {
    event.preventDefault()
    axios.get(`${dataServer}/dove-eee-data/article`, {
      withCredentials: true,
      params: {id: article['id']}
    })
    .then(response => {
      const src = response.data.article
      const dist = {}
      for (let prop in src) {
        if (prop === 'id') continue
        if (prop === 'editor') continue
        if (prop === 'timeCreate') continue
        if (prop === 'timeModify') continue
        dist[prop] = src[prop]
      }
      dist.hidden = 1
      dist.editor = document.querySelector('#userName').value
      return axios.put(`${dataServer}/dove-eee-data/article`, dist, { withCredentials: true })
    })
    .then(() => {
      UIkit.notification('复制记录成功', {status:'success'})
      getArticleList()
    })
    .catch(error => {
      console.error('复制失败' ,error)
      UIkit.notification('复制记录失败', {status:'danger'})
    })
  })
}
function buildPagination(response) {
  try {
    const pagination = document.querySelector('#pagination')
      ? document.querySelector('#pagination')
      : buildPaginationIn('#articleListTable')
    pagination.innerHTML = ''
    const pageNum = parseInt(response.data.pageNum)
    const buttonPrevious = buildBtn('previous', pagination)
    const buttonNext = buildBtn('next', pagination)
    if (response.data.isHasPreviousPage) {
      buttonPrevious.addEventListener('click', goPage(pageNum -1))
    } else {
      buttonPrevious.setAttribute('disabled','disabled')
      buttonPrevious.setAttribute('uk-tooltip', '没有了')
    }
    if (response.data.isHasNextPage) {
      buttonNext.addEventListener('click', goPage(pageNum +1))
    } else {
      buttonNext.setAttribute('disabled', 'disabled')
      buttonNext.setAttribute('uk-tooltip', '没有了')
    }
  } catch(error) {
    console.error('分页组件初始化失败', error)
    UIkit.notification('分页组件初始化失败', { status: 'danger' })
  }
  function buildPaginationIn(tableId) {
    const pagination = document.createElement('div')
    pagination.id = 'pagination'
    document.querySelector(tableId).parentElement.appendChild(pagination)
    return pagination
  }
  function buildBtn(type, parentElement) {
    const button = document.createElement('button')
    parentElement.appendChild(button)
    button.innerHTML = `<span uk-icon="icon: chevron-double-${type === 'previous'? 'left': 'right'}"></span>`
    button.classList.add('uk-button', 'uk-button-secondary', `uk-align-${type === 'previous'? 'left': 'right'}`)
    button.setAttribute('uk-tooltip', type === 'previous'? '上一页': '下一页')
    return button
  }
  function goPage(index) {
    return function() {
      axios.put('/dove-eee/articleListStatus', { pageNum: index })
      .then(() => {
        getArticleList()
      })
      .catch(error => {
        console.error('更改pageNum失败', error)
        UIkit.notification('更改pageNum失败', {status: 'danger'})
      })
    }
  }
}