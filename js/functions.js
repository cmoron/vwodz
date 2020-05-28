var app = new Vue({
  el: '#app',
  data: {
    page_title: 'Wodz',
    message: 'Hello Vue!',
    sessions : [],
    blocks : [],
    groups : [],
    exercises : [],
  },
  mounted() {

    // Get sessions 
    axios.get('http://localhost:3000/api/sessions').then(response => {
      for (let index = 0; index < response.data.length; index++) {
        this.sessions.push({
          index: index,
          name: response.data[index].name,
          even: index % 2 == 0 ? true : false,
          odd: index % 2 == 1 ? true : false
        });
      }
    })
    .catch(err => {
      console.log(err);
    })

    // Get blocks
    axios.get('http://localhost:3000/api/blocks').then(response => {
      this.blocks = response.data;
    }).catch(err => {
      console.log(err);
    });
  }
});

Vue.component('session', {
  props: [
    'index',
    'even',
    'odd',
    'name',
  ],

  template: `
    <div class="session">
      <h2 :class="{even: even, odd: odd}">{{ name }}</h2>
    </div>
    `
});

Vue.component('group', {
  props: [
    'repeat'
  ],

  template: `
  `
});

Vue.component('block', {
  props: [
    'name'
  ],

  template: ` 
    <h3>{{ name }}</h3>
  `
});

Vue.component('exercise', {
  props: [
    'repeat',
    'name'
  ],

  template: `
    <span class="exercise">
      <span class="ex_repeat">{{ repeat }}</span>
      <span class="ex_name">{{ name }}</span>
    </span>
  `
});
