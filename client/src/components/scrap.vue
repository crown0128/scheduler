<v-container>
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
          <v-combobox
            slot="activator"
            v-model="datesAll"
            label="Select Dates"
            prepend-icon="event"
            multiple
            readonly
            clearable
          >
            <template
                      slot='selection'
                      slot-scope='data'>
              <v-chip
                      close
                      @input="save(data.item)"> 
                {{getString(data.item)}}
              </v-chip>
            </template>
          </v-combobox>
          <!-- <v-date-picker 
                         v-model="date" 
                         no-title 
                         @input="save(date)"
                         :events="datesAll"
                         event-color="blue lighten-1"
                         >
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu2 = false">OK</v-btn>
          </v-date-picker> -->
  
        </v-menu>
        </v-container>