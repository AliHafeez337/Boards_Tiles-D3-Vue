<template>
  <div>
    <ViewProfile />
    <div class="main" id="historySection">
      <div class="section section-images">
        
        <table style="width:100%">
          <tr>
            <th>#</th>
            <th>Role</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>At time</th>
            <th>Action</th>
          </tr>
          <tr>
            <th><hr /></th>
            <th><hr /></th>
            <th><hr /></th>
            <th><hr /></th>
            <th><hr /></th>
            <th><hr /></th>
            <th><hr /></th>
          </tr>
          <tr v-for="(log, index) in logs" :key="index">
            <td>{{ logs.length - index }}</td>
            <td>{{ log.user.usertype }}</td>
            <td>{{ log.user.name }}</td>
            <td>{{ log.user.email }}</td>
            <td>{{ log.change }}</td>
            <td>{{ log.createdAt }}</td>
            <td class="deleteLog" @click="deleteLog(log._id)">Delete</td>
          </tr>
        </table>

      </div>
    </div>
  </div>
</template>
<script>

import ViewProfile from '../../ViewProfile';
import Services from './../../../services'

export default {
  name: 'history',
  bodyClass: 'history-page',
  components: {
    ViewProfile
  },
  data() {
    return {
      service: new Services()
    }
  },
  computed: {
    logs() {
      return this.$store.getters.getLogs
    }
  },
  created() {
    if (this.$store.getters.getProfile && this.$store.getters.getProfile.usertype !== 'admin'){
      this.$router.push("/")
    }
  },
  methods: {
    deleteLog(id) {
      this.service.deleteLog(id)
        .then(_ => {
          var logs = this.$store.getters.getLogs.filter(log => log._id !== id)
          this.$store.dispatch('setLogs', logs)
        })
    }
  },
};
</script>
<style scoped>
.deleteLog {
  color: red;
  cursor: pointer;
}
</style>
