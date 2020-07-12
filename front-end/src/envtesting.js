
require('dotenv').config({ path: '../../.env' })
console.log(process.env.VUE_APP_BACKEND_URL)
const { VUE_APP_BACKEND_URL } = process.env;
console.log(VUE_APP_BACKEND_URL)