/* eslint-disable no-unused-expressions */

console.info('ALKSJDHAKSJDHASKJHDKASJDHKASJDHKASJD')

import('./scss/app.scss')
import('./js/app.js')

window.THEME = {
  navfooter: () => import('./components/nav-footer.vue'),
  page: () => import('./components/page.vue')
}
