<template>

<!-- ********* does this go in Volunteer when edit is clicked ?? ***** -->
<div>
    <!-- volunteer #{{ $route.params.id }}. -->
    This page is to edit volunteer #{{ $route.params.id }}.

    <!-- volunteers[ {{ $route.params.id }} ].firstName  -->
</div>


</template>



<script>
export default {
  name: "EditVolunteer",
//   props: ["volunteer"],
};
</script>

<style scoped>

/* .bg-lightteal {
  background-color: #c4fff9 !important;
  border-width: 0 !important;
} */

.volunteer-name {
  color:blue;
  font-size: 1.25em;
  padding: 20px 0 0;
  text-align: left;
}

.role {
  font-size: 16px;
  background-color:  #c4fff9 !important;
  height: 20px;
}

</style>