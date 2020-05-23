var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    info : null
  },
  mounted() {
    axios.get('http://localhost:3000/api/sessions')
    .then(response => (
      this.info = response
    ))
    .catch(err => {
      console.log(err);
    })
  }
});
