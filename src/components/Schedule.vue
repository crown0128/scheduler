<template>
  <li class="list-group-item">
    <div class="row">
      <div class="col-12">
        <span :class="dateRange">{{schedule.startDate}} - {{schedule.endDate}} </span>
      </div>
    </div>
  </li>
</template>