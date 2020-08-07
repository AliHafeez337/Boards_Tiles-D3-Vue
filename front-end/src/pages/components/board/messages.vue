<template>
  <div>
    <div class="alert" v-for="(message, index) of messages" :key="index">
      <span class="closebtn" @click="closeMSG(message.message, index)">&times;</span> 
      <strong>{{message.type}}!</strong>&nbsp;{{message.message}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'messages',
  computed: {
    messages() {
      return this.$store.getters.getMessages
    }
  },
  methods: {
    closeMSG(msg, idx) {
      var messages = this.messages.filter((message, index) => !(message.message === msg && index === idx))
      // console.log("close message", msg, messages)
      this.$store.dispatch('setMessages', messages)
    }
  },
}
</script>
<style scoped>
.alert {
  padding: 20px;
  color: white;
  margin: center;
  background-color: rgba(104, 87, 255, 0.6);
}

.closebtn {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.closebtn:hover {
  color: black;
}
</style>