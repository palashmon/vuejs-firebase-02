<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn accent slot="activator">
      Edit Date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editableDate" style="width: 100%" actions>
              <template>
                <v-btn
                  class="blue--text darken-1"
                  flat
                  @click.native="editDialog = false">Close</v-btn>
                <v-btn
                  class="blue--text darken-1"
                  flat
                  @click.native="onSaveChanges">Save</v-btn>
              </template>
            </v-date-picker>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['meetup'],
    data () {
      return {
        editDialog: false,
        editableDate: null
      };
    },
    methods: {
      onSaveChanges () {
        const newDate = new Date(this.meetup.date);
        const newDay = new Date(this.editableDate).getUTCDate();
        const newMonth = new Date(this.editableDate).getUTCMonth();
        const newYear = new Date(this.editableDate).getUTCFullYear();
        newDate.setUTCDate(newDay);
        newDate.setUTCMonth(newMonth);
        newDate.setUTCFullYear(newYear);
        this.$store.dispatch('updateMeetupData', {
          id: this.meetup.id,
          date: newDate
        });
      },
      formatDate (date) {
        if (!date) return null;
        let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
        return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
      }
    },
    created () {
      this.editableDate = this.formatDate(new Date(this.meetup.date));
    }
  };
</script>
