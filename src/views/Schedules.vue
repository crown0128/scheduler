<template>
  <div>
    <h1>Welcome to the Schedule Manager page.</h1>

    <ul class="list-group">
      <Schedule 
        v-for="schedule in schedules"
        :key="schedule._id"
        :schedule="schedule"
        mode="schedules"
        v-on="$listiners"
      />
    </ul>
  </div>
</template>

<script>
  import Schedule from '../components/Schedule';

  export default {
    name: 'Schedules',

    components: { Schedule },
    props: ["schedules"]

    // data: () => ({
    //   //
    // }),
  };

</script>

<style scoped>

</style>