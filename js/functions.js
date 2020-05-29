let exercise = { 

    props: {
        exercise: Object
    },

    template: `
        <li class="ex_li">
            <span class="exercise">
            <span class="ex_repeat">{{ this.exercise.repeat }}</span>
            <span class="ex_name">{{ this.exercise.name }}</span>
            </span>
        </li>
    `
}

let block = {
    data: function() {
        return {
            exercises: []
        }
    },

    props: {
        block: Object
    },

    components: {
        exercise
    },

    mounted() {
        for (blockExercises of this.block.exercises) {
            axios.get('http://localhost:3000/api/exercise/' + blockExercises).then(exerciseResponse => {
                this.exercises.push(exerciseResponse.data);
            }).catch(err => {
                console.error("Failed to load exercise with id: " + blockExercise, err);
            });
        }
    },

    template: `
        <div>
            <h3>{{ block.name }}</h3>

            <ul class="ex_ul">
                <li class="ex_li" v-for="exercise of this.exercises">
                    <exercise
                        :exercise="exercise"
                        :key="exercise.id"
                    ></exercise>
                </li>
            </ul>
        </div>
    `
}

let group = {

    data: function() {
        return {
            blocks: []
        }
    },

    props: {
        group: Object
    },

    mounted() {
        for (groupBlock of this.group.blocks) {
            axios.get('http://localhost:3000/api/block/' + groupBlock).then(blockResponse => {
                this.blocks.push(blockResponse.data);
            }).catch(err => {
                console.error("Failed to load block with id : " + groupBlock, err);
            });
        }
    },

    template: `
    <tr>
        <th>{{ group.repeat }}</th>
        <td>
            <p v-for="block in this.blocks">
                {{ block.name }}
            </p>
        </td>
    </tr>`
}

let session = {

    data: function() {
        return {
            groups: [],
            blocks: [],
            display: false
        }
    },

    props: {
        session: Object,
    },

    components: {
        block,
        group
    },

    methods: {
        toggleSession() {
            this.display = !this.display;
        }
    },

    mounted() {
        for (sessionGroup of this.session.groups) {
            axios.get('http://localhost:3000/api/group/' + sessionGroup).then(groupResponse => {
                this.groups.push(groupResponse.data);

                for (sessionBlock of groupResponse.data.blocks) {
                    axios.get('http://localhost:3000/api/block/' + sessionBlock).then(blockResponse => {
                        this.blocks.push(blockResponse.data);
                    }).catch(err => {
                        console.error("Failed to load block with id : " + sessionBlock, err);
                    });
                }

            }).catch(err => {
                console.error("Failed to load group with id : " + sessionGroup, err);
            });
        }
    },

    template: `
    <div class="session">
        <h2 :class="{ even: session.even, odd: !session.even }" @click="toggleSession">{{ session.name }}</h2>
        <div class="wod_content" v-show="display">
                <block
                    v-for="block in blocks"
                    :block="block"
                    :key="block.id"
                ></block>
            <div class="structure">
                <h3>WOD</h3>
                <div class="structure_content">
                    <table>
                        <group
                            v-for="group in groups"
                            :group="group"
                            :key="group.id"
                        ></group>
                    </table>
                </div>
            </div>
        </div>
    </div>
  `
}

var app = new Vue({
    el: '#app',
    data: {
        page_title: 'Wodz',
        sessions: []
    },

    components: {
        session
    },

    mounted() {

        axios.get('http://localhost:3000/api/sessions').then(sessionResponse => {
            index = 0;
            for(sessionData of sessionResponse.data) {
                this.sessions.push({
                    id: sessionData._id,
                    name: sessionData.name,
                    groups: sessionData.groups,
                    even: index % 2 == 0
                });
                ++index
            }
        })
    }
});
