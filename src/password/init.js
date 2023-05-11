import { dataServer } from '../../project.config'

export default function (config) {
  const env = config && config.env? config.env: ''
  const pgeId = config && config.pgeId? config.pgeId: ''
  const pwdhtml = config && config.pwdhtml? config.pwdhtml: ''
  var random, datab;
  //请求通讯加密两个参数(随机数pgeRZRandNum和数据B pgeRZDataB)
  Ajax.request({
    url: `${dataServer}/dove-eee-data/skey_enstr?` + get_time(),
    type: "GET",
    async: false,
    success: function (xhr) {
      var skey_enstr = pgeCtrl.trim(xhr.responseText);
      var o = skey_enstr.split(",");
      random = o[0];
      datab = o[1];
    }
  });
  //new 控件对象
  window.pgeditor = new pge({
    pgePath: "https://www.dovepay.com/dovePay/ocx/",//控件下载目录，可以指定绝对路径，如"http://www.baidu.com/download/"
    pgeId: pgeId,//控件id
    pgeEditType: 0,//控件显示类型,0(星号),1(明文)
    pgeEreg1: "[\\s\\S]*",//输入过程中字符类型限制，如"[0-9]*"表示只能输入数字
    pgeEreg2: "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$",
    pgeMaxLength: 16,//允许最大输入长度
    pgeTabIndex: 2,//tab键顺序
    pgeClass: "uk-input",//控件css样式
    pgeInstallClass: "uk-input",//针对安装或升级的css样式
    pgeOnKeyDown: "",//回车键响应函数，需焦点在控件中才能响应
    tabCallBack: "input2",//火狐tab键回调函数,设置要跳转到的对象ID
    AffineX: env === 'gm'
      ? getPasswordAffineX()
      : "95f26a31b981c8bef00a090849d72384a52c909c60a1aa99220f470ca1fefcbe",
    AffineY: env === 'gm'
      ? getPasswordAffineY()
      : "6165e5e78c59ae13014a5eee0b06351486449e6510a267eb0045a20b3266d1d6",
    pgeWindowID: "password" + new Date().getTime() + 1,
    pgeRZRandNum: random,
    pgeRZDataB: datab
  });
  //定义公共对象
  window.pgeCtrl = pgeditor;
  //绘制控件标签
  pgeCtrl.pwdhtml(pwdhtml, pgeditor.load());
  //初始化
  pgeInit();
  // changeValidateImage();
}

function get_time(){
  return new Date().getTime()
}