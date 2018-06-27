<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Create a new Meetup</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateMeetup">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="title"
                label="Title"
                id="title"
                v-model="title"
                required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="location"
                label="Location"
                id="location"
                v-model="location"
                required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="imageUrl"
                label="Image URL"
                id="image-url"
                v-model="imageUrl"
                required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img :src="imageUrl" height="150">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                multi-line
                v-model="description"
                required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <h4>Choose a Data & Time</h4>
            </v-flex>
          </v-layout>
          <v-layout row class="mb-2">
            <v-flex xs12 sm6 offset-sm3>
              <v-menu
                ref="menu2"
                :close-on-content-click="false"
                v-model="menu2"
                :nudge-right="40"
                :return-value.sync="date"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="date"
                  label="Pick a date for event"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="date" @input="$refs.menu2.save(date)"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="menu3"
                :nudge-right="40"
                :return-value.sync="time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="time"
                  label="Picker in menu"
                  prepend-icon="access_time"
                  readonly
                ></v-text-field>
                <v-time-picker v-model="time" @change="$refs.menu.save(time)" format="24hr"></v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn
                class="primary"
                :disabled="!formIsValid"
                type="submit">Create Meetup</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        location: '',
        imageUrl: '',
        description: '',
        date: null,
        time: '10:00',
        menu2: false,
        menu3: false
      };
    },
    beforeMount() {
      this.date = this.formatDate(new Date());
    },
    computed: {
      formIsValid () {
        return this.title !== '' &&
          this.location !== '' &&
          this.imageUrl !== '' &&
          this.description !== '';
      },
      submittableDateTime () {
        const date = new Date(this.date);
        if (typeof this.time === 'string') {
          let hours = this.time.match(/^(\d+)/)[1];
          const minutes = this.time.match(/:(\d+)/)[1];
          date.setHours(hours);
          date.setMinutes(minutes);
        } else {
          date.setHours(this.time.getHours());
          date.setMinutes(this.time.getMinutes());
        }
        return date;
      }
    },
    methods: {
      onCreateMeetup () {
        if (!this.formIsValid) {
          return;
        }
        const meetupData = {
          title: this.title,
          location: this.location,
          imageUrl: this.imageUrl,
          description: this.description,
          date: this.submittableDateTime
        };
        this.$store.dispatch('createMeetup', meetupData);
        this.$router.push('/meetups');
      },
      formatDate (date) {
        if (!date) return null;
        let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
        return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
      }
    }
  };
</script>
