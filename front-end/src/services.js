import axios from './axios';

class Services {

  // Admin adds a new user
  newUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        var res = await axios({
          method: 'post',
          url: `/admin/create`,
          data: user
        });

        if (res.data){
          if (res.data.msg){
            resolve(res.data)
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

  // Admin updates a user
  updateUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        var res = await axios({
          method: 'patch',
          url: `/admin/update/${user._id}`,
          data: user
        });

        if (res.data){
          if (res.data.msg){
            resolve(res.data)
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

  // Admin can get all users
  allUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        var res = await axios({
          method: 'get',
          url: '/admin/all'
        });

        if (res.data){
          if (res.data.msg){
            resolve(res.data)
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

  // Update user
  update(name, email, password, password2) {
    return new Promise(async (resolve, reject) => {
      try {
        var res
        if (name && email && password && password2 && password === password2){
          res = await axios({
            method: 'patch',
            url: '/user/update',
            data: { name, email, password, password2 }
          });
        } else if(name && email && !password && !password2) {
          res = await axios({
            method: 'patch',
            url: '/user/update',
            data: { name, email }
          });
        } else if (!name && !email && password && password2 && password === password2){
          res = await axios({
            method: 'patch',
            url: '/user/update',
            data: { password, password2 }
          });
        } else if (name && !email && !password && !password2){
          res = await axios({
            method: 'patch',
            url: '/user/update',
            data: { name }
          });
        } else if (!name && email && !password && !password2){
          res = await axios({
            method: 'patch',
            url: '/user/update',
            data: { email }
          });
        }
        
        if (res.data){
          if (res.data.msg){
            resolve(res.data)
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

  // Logout
  logout() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'get',
          url: '/user/logout'
        });
        
        if (res.data){
          resolve(res.data)
        } else {
          reject("Nothing came up on this route.")
        }
      } catch(err) {
        // console.log(err)
        reject(err)
      }
    })
  }

  // Get profile
  profile() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'get',
          url: '/user/profile'
        });
        
        if (res.data){
          resolve(res.data)
        } else {
          reject("Nothing came up on this route.")
        }
      } catch(err) {
        // console.log(err)
        reject(err)
      }
    })
  }

  // Login
  login(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          url: '/user/login',
          data: { email, password }
        });
        
        if (res.data){
          if (res.data.msg){
            resolve(res.data)
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

  // Credits for api
  static getCredits() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`/credits`);
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