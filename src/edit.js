import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import './init-page'
import './init-tinymce'
import { dataServer } from '../project.config'
import axios from 'axios'
import submitUpdateArticleListener from './submit-listener'
UIkit.use(Icons)

submitUpdateArticleListener(submitUpdateArticle)

function submitUpdateArticle() {
  
}