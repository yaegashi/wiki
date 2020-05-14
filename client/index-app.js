require('core-js/stable')
require('regenerator-runtime/runtime')

/* eslint-disable no-unused-expressions */

switch (window.document.documentElement.lang) {
  case 'ar':
  case 'fa':
    import(/* webpackChunkName: "fonts-arabic" */ './scss/fonts/arabic.scss')
    break
  default:
    import(/* webpackChunkName: "fonts-default" */ './scss/fonts/default.scss')
    break
}

require('./scss/app.scss')
import('@mdi/font/css/materialdesignicons.css')

require('./helpers/compatibility.js')
require('./client-app.js')
