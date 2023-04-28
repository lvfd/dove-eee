tinymce.init({
  selector: 'textarea#content',
  language: 'zh-Hans',
  placeholder: '你可以添加文本，图片，表格，超链接',
  plugins: ['image', 'link', 'preview', 'table', 'lists'],
  toolbar: 'undo redo | bold italic alignleft aligncenter alignright alignjustify | link image table numlist bullist | preview',
  a11y_advanced_options: true,
  images_upload_url: '/dove-eee/images/upload',
})