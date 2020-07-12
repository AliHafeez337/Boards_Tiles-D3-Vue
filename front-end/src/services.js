import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

class Services {

  // Credits for api
  static getCredits() {
    return new Promise(async (resolve, reject) => {
      try{
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