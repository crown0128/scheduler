<template>
    <v-app class="bg-lightteal">
      <v-col cols="6" class="white">
        <p class="text-left">Choose role(s):</p>
        <!-- to choose more than one in a future release
        <checkbox class="ml-2 my-0 list-height" -->
        <v-radio-group class="ml-2"
          v-model="rolesChosen"
        ><v-radio
        
          class="my-0 list-height"
          v-for="(role, roleIndex) in roles"
          v-bind:key="roleIndex"
          :value="`${role}`"
          :label="`${role}`"
          color="teal"
        ></v-radio>
        </v-radio-group>

      </v-col>


    </v-app>
</template>