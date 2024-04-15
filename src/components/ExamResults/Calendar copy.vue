<template>
  <div>
    <ScheduleXCalendar
      v-if="calendarApp !== null"
      :calendar-app="calendarApp"
    />
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
    const start = meetingDate.toISOString(); // แปลงเป็น ISO string เพื่อใช้ในปฏิทิน
    const end = new Date(meetingDate.getTime() + 60 * 60 * 1000).toISOString(); // เพิ่มหนึ่งชั่วโมงแล้วแปลงเป็น ISO string
    return {
      id: result._id,
      title: `${result.Position_applied} (${result.Meeting_result}) | ${meetingDateStr}`,
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