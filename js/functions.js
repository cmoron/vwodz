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
    axios.get('http://localhost:3000/api/sessions').then(sessionResponse => {
      for (let index = 0; index < sessionResponse.data.length; index++) {
        this.sessions.push({
          index: index,
          name: sessionResponse.data[index].name,
          even: index % 2 == 0 ? true : false,
          odd: index % 2 == 1 ? true : false
        });


        for (groupId of sessionResponse.data[index].groups) {
          axios.get('http://localhost:3000/api/group/' + groupId).then(groupResponse => {

            this.groups.push(groupResponse.data);
            console.log(this.groups);

            for (blockId of groupResponse.data.blocks) {
              axios.get('http://localhost:3000/api/block/' + blockId).then(blockResponse => {
                this.blocks.push(blockResponse.data);

                for (exerciseId of blockResponse.data.exercises) {
                  axios.get('http://localhost:3000/api/exercise/' + exerciseId).then(exerciseResponse => {
                    this.exercises.push(exerciseResponse.data);
                  });
                }
              });
            }
          });
        }
      }
      console.log(this.sessions);
    })
    .catch(err => {
      console.log(err);
    })
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

  template: `<div>{{ repeat }}</div>`
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
    'rep',
    'name'
  ],

  template: `
    <div class="exercise">
      <span class="ex_repeat">{{ rep }}</span>
      <span class="ex_name">{{ name }}</span>
    </div>
  `
});
