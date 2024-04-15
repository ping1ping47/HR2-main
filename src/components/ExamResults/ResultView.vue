<template>
  <div
    class="popup-overlay fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
    @click.self="ModalClose"
    v-show="showPopup"
  >
    <div class="popup-content bg-white rounded-lg overflow-auto max-h-[80vh]">
      <div>
        <form @submit.prevent="updatePostRequest" class="p-6">
          <!-- Modal header -->
          <div class="flex items-center justify-between pb-4 border-b">
            <h3 class="text-lg font-semibold">
              Edit Post: {{ formData.Position_applied }}
            </h3>
            <!-- Close button -->
            <button
              @click.prevent="ModalClose"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label
                for="Position_applied"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                ตำแหน่ง
              </label>
              <select
                v-model="formData.Position_applied"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              >
                <option value="" disabled>เลือกตำแหน่ง</option>
                <option
                  v-for="type in ExamType"
                  :key="type._id"
                  :value="type.extype_name"
                >
                  {{ type.extype_name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="Score"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                คะแนน
              </label>
              <input
                v-model.number="formData.Score"
                type="number"
                name="Score"
                id="Score"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="ป้อน คะแนน"
                required
              />
            </div>
          </div>

          <div class="flex">
            <div class="col-span-2 flex-grow mb-4 mr-6">
              <label
                for="Result"
                class="block mb-2 text-sm font-medium text-gray-900"
                >ผลการสอบ</label
              >
              <input
                v-model="formData.Result"
                type="text"
                name="Result"
                id="Result"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="ป้อน ผลการสอบ"
                required=""
              />
            </div>

            <div class="col-span-2 flex-grow mb-4 mr-6">
              <label
                for="Meeting_result"
                class="block mb-2 text-sm font-medium text-gray-900"
                >ผลการนัดสัมภาษณ์</label
              >
              <input
                v-model="formData.Meeting_result"
                type="text"
                name="Meeting_result"
                id="Meeting_result"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="ป้อน ผลการนัดสัมภาษณ์"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="meeting_type"
                class="block mb-2 text-sm font-medium text-gray-900"
                >ประเภทการนัดหมาย</label
              >
              <input
                v-model="formData.meeting_type"
                type="text"
                name="meeting_type"
                id="meeting_type"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="ป้อน ประเภทการนัดหมาย"
              />
            </div>

            <div>
              <label
                for="meeting_date"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                วันที่นัดหมาย
              </label>
              <input
                v-model="formData.meeting_date"
                type="date"
                name="meeting_date"
                id="meeting_date"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <!-- Save and Close buttons -->

            <button
              @click.prevent="ModalClose"
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "EditPopup",
  props: {
    results: Object, // รับข้อมูลผลสอบที่จะแก้ไข
  },
  data() {
    return {
      showPopup: true,
      formData: {
        Position_applied: "",
        Score: null,
      },
      ExamType: [],
    };
  },

  mounted() {
    this.fetchPostData();
    this.fetchPostTypes();
  },

  methods: {
    async fetchPostData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_EXAMRESULTS}/examresults/byid/${
            this.results._id
          }`
        );
        if (response.data.status) {
          this.formData = response.data.data;
        } else {
          console.error("Error fetching post data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    },

    async fetchPostTypes() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_EXAM}/exam-type`
        );
        if (response.data.status) {
          this.ExamType = response.data.data;
        } else {
          console.error("Error fetching post types:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching post types:", error);
      }
    },

    ModalClose() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.popup-overlay {
  background-color: rgba(0, 0, 0, 0.05);
}

.popup-content {
  max-width: 800px;
  width: 90%;
}
</style>

