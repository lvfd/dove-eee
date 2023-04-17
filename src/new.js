import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import './init-page'
UIkit.use(Icons)
tinymce.init({
  selector: 'textarea#content',
  language: 'zh-Hans',
  placeholder: '你可以添加文本，图片，表格，超链接',
  plugins: ['image', 'link', 'preview', 'table', 'lists'],
  toolbar: 'undo redo | bold italic alignleft aligncenter alignright alignjustify | link image table numlist bullist | preview',
  a11y_advanced_options: true,
  images_upload_url: '/dove-eee/images/upload',
})

// window.addEventListener('load', () => {
//   document.getElementById('submitHTML').addEventListener('click', () => {
//     const postData = {
//       title: '文章标题',
//       id: '1',
//       modTime: Date.now()
//     }
//     console.log(tinymce.get('writeHere').getContent())
//   })
// })