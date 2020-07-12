import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()

// require('dotenv').config()
const { VUE_APP_BACKEND_URL } = process.env;

const baseURL = 'https://board-d3-vue.herokuapp.com:3000/api';

class Services {

  // Credits for api
  static getCredits() {
    return new Promise(async (resolve, reject) => {
      try{
        // console.log(VUE_APP_BACKEND_URL)

        const res = await axios.get(`${baseURL}/credits`);
        // console.log(res)
        if (res.data){
          if (res.data.msg){
            resolve(res.data.msg)
          } else if (res.data.errmsg){
            reject(res.data.errmsg)
          }
        } else {
          reject("Nothing came up on this route.")
        }
      } catch(err) {
        // console.log(err)
        reject(err)
      }
    })
  }

}

export default Services;