<template>
    <v-container cols="12" text-center align="center" justify="center" class="pt-0">

        <v-row>
            <v-col cols="10" offset="2">
                <h1>Add new voluntter</h1>
            </v-col>

            <v-col cols="2">
                <!-- save button and back button -->
                <p>Save button, back button</p>
            </v-col>
 
         </v-row>

        <v-row>
            <v-col cols="3">
                <!-- enter first name -->
                <p>Enter first name</p>
            </v-col>
            <v-col cols="3">
                <!-- enter last name -->
                <p>Enter last name</p>
            </v-col>
            <v-col cols="3">
                <!-- enter email name -->
                <p>Enter email</p>
            </v-col>
            <v-col cols="3">
                <!-- enter image -->
                <p>choose image</p>
                <p>choose image</p>
            </v-col>
        </v-row>

        <v-row>
            <!-- choose roles & preferred times -->
                <p>choose roles / preferred times</p>
        </v-row>

        <v-row>
            <!-- choose availability -->
                <p>choose availability</p>

        </v-row>

        <v-row>
            <!-- choose who to schedule with (or not) -->
                <p>choose who to be scheduled with or not</p>

        </v-row>

      </v-container>
</template>


<script>
import axios from 'axios'
export default {
    
}
</script>


<style scoped>

</style>