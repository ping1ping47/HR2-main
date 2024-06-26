<template>
  <div>
    <ScheduleXCalendar v-if="calendarApp" :calendar-app="calendarApp" />
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from "vue";
import { ScheduleXCalendar } from "@schedule-x/vue";
import axios from "axios";
import {
  createCalendar,
  viewDay,
  viewWeek,
  viewMonthGrid,
  viewMonthAgenda,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";

const examResults = ref([]);
const calendarApp = ref(null);

const fetchExamResults = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_EXAMRESULTS}/examresults`
    );
    examResults.value = response.data.data;
  } catch (error) {
    console.error(error.message);
  }
};

const createEvents = (results) => {
  if (!Array.isArray(results)) {
    console.error("Results is not an array:", results);
    return [];
  }

  return results.map((result) => {
    const meetingDateStr = result.Meeting.meeting_date;
    const meetingDate = new Date(meetingDateStr);
    const start = meetingDate.toISOString().slice(0, 16).replace("T", " "); // Format: YYYY-MM-DD HH:mm
    const end = new Date(meetingDate.getTime() + 60 * 45 * 1000)
      .toISOString()
      .slice(0, 16)
      .replace("T", " "); // Add one hour and format: YYYY-MM-DD HH:mm
    return {
      id: result._id,
      title: `${result.Position_applied} | ${result.Meeting_result}`,
      start: start,
      end: end,
    };
  });
};

onMounted(fetchExamResults);

watch(examResults, (newVal) => {
  if (Array.isArray(newVal) && newVal.length > 0) {
    calendarApp.value = createCalendar({
      selectedDate: new Date(),
      views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
      defaultView: viewMonthGrid.name,
      events: createEvents(newVal),
    });
  }
});
</script>

<style scoped>
.calendar-container {
  width: 50%;
  height: 400px;
  max-height: 30vh;
}
</style>
