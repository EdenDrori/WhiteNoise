<template>
  <div class="relative w-full">
    <button
      type="button"
      class="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 border-accent focus:ring-0 focus:border-primary text-base sm:text-lg rounded-none transition flex justify-between items-center custom-dropdown-btn"
      :class="{ 'ring-2 ring-primary': isOpen }"
      @click="toggleDropdown"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @blur="closeDropdown"
      ref="buttonRef"
    >
      <span class="truncate text-left">
        {{ selectedLabel || placeholder || "Select..." }}
      </span>
      <svg
        class="ml-2 h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    <transition name="fade-slide-dropdown">
      <ul
        v-if="isOpen"
        class="absolute left-0 z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 animate-dropdown"
        @mousedown.prevent
      >
        <li
          v-for="(option, idx) in options"
          :key="option.value"
          @click="selectOption(option.value)"
          @mouseenter="hoveredIndex = idx"
          @mouseleave="hoveredIndex = null"
          :class="[
            'px-4 py-2 cursor-pointer transition-colors',
            value === option.value
              ? 'bg-gray-200 text-primary font-semibold'
              : '',
            hoveredIndex === idx ? 'bg-gray-100 text-black' : '',
          ]"
          tabindex="0"
          @keydown.enter.prevent="selectOption(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  options: { type: Array, required: true },
  modelValue: [String, Number],
  placeholder: String,
});
const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const hoveredIndex = ref(null);
const value = computed(() => props.modelValue);
const selectedLabel = computed(() => {
  const found = props.options.find((opt) => opt.value === value.value);
  return found ? found.label : "";
});
const buttonRef = ref(null);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    setTimeout(() => {
      const idx = props.options.findIndex((opt) => opt.value === value.value);
      hoveredIndex.value = idx >= 0 ? idx : 0;
    }, 0);
  }
}
function closeDropdown() {
  isOpen.value = false;
}
function selectOption(val) {
  emit("update:modelValue", val);
  isOpen.value = false;
}

function handleClickOutside(event) {
  if (!buttonRef.value?.contains(event.target)) {
    isOpen.value = false;
  }
}
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
.fade-slide-dropdown-enter-active,
.fade-slide-dropdown-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-dropdown-enter-from,
.fade-slide-dropdown-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
.fade-slide-dropdown-enter-to,
.fade-slide-dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.custom-dropdown-btn {
  text-align: left;
}
.animate-dropdown {
  animation: fadeInDropdown 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeInDropdown {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
