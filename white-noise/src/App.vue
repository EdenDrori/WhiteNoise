<script setup>
import { useI18n } from "vue-i18n";
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import * as lottie from "lottie-web";
import CustomDropdown from "./CustomDropdown.vue";

const { locale, t: $t } = useI18n();
const toggleLanguage = () => {
  locale.value = locale.value === "en" ? "he" : "en";
};

// Loading state
const isLoading = ref(true);
const loadedImages = ref(new Set());

// Preload all images
const preloadAllImages = () => {
  carouselSlides.forEach((slide, index) => {
    const img = new Image();
    img.src = slide.image;
    img.onload = () => {
      loadedImages.value.add(index);
      if (loadedImages.value.size === carouselSlides.length) {
        isLoading.value = false;
      }
    };
  });
};

// Combined carousel slides
const carouselSlides = [
  // Airten V3 Category
  {
    image:
      "https://white-noise-2025.s3.eu-north-1.amazonaws.com/Airten+V3+Front+Angle+White+VA04.jpg",
    title: "Airten V3",
    description: "The Art of Sound",
    category: "Airten V3",
  },
  {
    image:
      "https://white-noise-2025.s3.eu-north-1.amazonaws.com/Airten+V3+Front+Zoom+02+White+VA04+2.jpg",
    title: "Airten V3",
    description: "Where Elegance Meets Power",
    category: "Airten V3",
  },
  {
    image:
      "https://white-noise-2025.s3.eu-north-1.amazonaws.com/Airten+V3+Front+Zoom+03+White+VA04.jpg",
    title: "Airten V3",
    description: "Designed for Excellence",
    category: "Airten V3",
  },
  {
    image:
      "https://white-noise-2025.s3.eu-north-1.amazonaws.com/Airten+V3+Front+Zoom+01+White+VA04.jpg",
    title: "Airten V3",
    description: "The Future of Sound",
    category: "Airten V3",
  },

  {
    image:
      "https://white-noise-2025.s3.eu-north-1.amazonaws.com/Airten+V3+Back+Zoom+02+White+VA04.jpg",
    title: "Airten V3",
    description: "Precision Engineering",
    category: "Airten V3",
  },

  // Tri Motion Category
  {
    image:
      "https://white-noise-2025.s3.eu-north-1.amazonaws.com/Tri+Motion+Front+Zoom+01+White+VA010.jpg",
    title: "Tri Motion",
    description: "Experience Pure Luxury",
    category: "Tri Motion",
  },
  {
    image:
      "https://white-noise-2025.s3.eu-north-1.amazonaws.com/Tri+Motion+Front+Zoom+03+White+VA010.jpg",
    title: "Tri Motion",
    description: "Sound Redefined",
    category: "Tri Motion",
  },
  {
    image:
      "https://white-noise-2025.s3.eu-north-1.amazonaws.com/Tri+Motion+Front+Zoom+02+White+VA010.jpg",
    title: "Tri Motion",
    description: "Where Innovation Meets Style",
    category: "Tri Motion",
  },

  // DJ Setup Category
  {
    image: "/djm-v10.png",
    title: "FULL DJ SETUP",
    description: "DJM-10 MIXER & CDJ-3000",
    category: "DJ Setup",
  },
  {
    image: "/V10-1.png",
    title: "DJM-V10",
    description: "6-channel professional DJ mixer",
    category: "DJ Setup",
  },
  {
    image: "/CDJ-1.png",
    title: "CDJ-3000",
    description: "Professional DJ multi player",
    category: "DJ Setup",
  },
  // {
  //   image: "/CDJ-3000-2.png",
  //   title: "CDJ-3000",
  //   description: "Professional DJ multi player",
  //   category: "DJ Setup",
  // },
];

// Get unique categories
const categories = [...new Set(carouselSlides.map((slide) => slide.category))];

const currentSlide = ref(0);
const transformOrigin = ref("50% 50%");
const imageLoaded = ref(false);
const nextImageLoaded = ref(false);
const isTransitioning = ref(false);
const selectedCategory = ref("Airten V3"); // Default category

// Get filtered slides based on selected category
const filteredSlides = computed(() => {
  return carouselSlides.filter(
    (slide) => slide.category === selectedCategory.value
  );
});

// For graceful category transitions
const isCategoryTransitioning = ref(false);
let pendingCategory = null;

const showCarouselImage = ref(true);

// Function to go to a specific category
const goToCategory = (category) => {
  if (selectedCategory.value === category) return;
  if (isCategoryTransitioning.value) {
    pendingCategory = category;
    return;
  }
  isCategoryTransitioning.value = true;
  showCarouselImage.value = false; // trigger fade-out
  setTimeout(() => {
    selectedCategory.value = category;
    currentSlide.value = 0;
    showCarouselImage.value = true; // trigger fade-in
    setTimeout(() => {
      isCategoryTransitioning.value = false;
      if (pendingCategory && pendingCategory !== selectedCategory.value) {
        const next = pendingCategory;
        pendingCategory = null;
        goToCategory(next);
      }
    }, 500); // match fade duration
  }, 500); // fade-out duration
};

// Update nextSlide to work with filtered slides
const nextSlide = () => {
  if (isTransitioning.value) return;

  const nextIndex = (currentSlide.value + 1) % filteredSlides.value.length;
  isTransitioning.value = true;

  const nextImage = new Image();
  nextImage.src = filteredSlides.value[nextIndex].image;
  nextImage.onload = () => {
    currentSlide.value = nextIndex;
    imageLoaded.value = false;
    setTimeout(() => {
      isTransitioning.value = false;
      nextImageLoaded.value = true;
    }, 1000);
  };
};

// Update goToSlide to remove zoom out
const goToSlide = (index) => {
  console.log("goToSlide", index, currentSlide.value, isTransitioning.value);
  if (isTransitioning.value || index === currentSlide.value) return;

  isTransitioning.value = true;

  const targetImage = new Image();
  targetImage.src = filteredSlides.value[index].image;
  targetImage.onload = () => {
    currentSlide.value = index;
    imageLoaded.value = false;
    setTimeout(() => {
      isTransitioning.value = false;
    }, 1000);
    // isTransitioning.value = false;
  };
};

const handleMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  transformOrigin.value = `${x}% ${y}%`;
};

const heroVideo = ref(null);

// For fade-in on scroll for the image section
const imageSectionRef = ref(null);
const imageSectionVisible = ref(false);
let imageSectionObserver;

const formSectionRef = ref(null);
function scrollToForm() {
  formSectionRef.value?.scrollIntoView({ behavior: "smooth" });
}

// Form state for Google Sheets integration
const name = ref("");
const email = ref("");
const phone = ref("");
const submitting = ref(false);
const success = ref(false);
const error = ref("");

// Toast state
const toast = ref({ show: false, message: "", type: "" });
let toastTimeout = null;
function showToast(message, type = "success") {
  toast.value = { show: true, message, type };
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^\d{7,}$/.test(phone.replace(/\D/g, ""));
}

const formErrors = ref({
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  eventType: "",
  eventTypeOther: "",
  eventLocation: "",
  guestCount: "",
  guestCountOther: "",
});

const validateForm = () => {
  let valid = true;
  formErrors.value = { name: "", email: "", phone: "" };
  if (!name.value.trim()) {
    formErrors.value.name = "Name is required.";
    valid = false;
  }
  if (!email.value.trim()) {
    formErrors.value.email = "Email is required.";
    valid = false;
  } else if (!validateEmail(email.value)) {
    formErrors.value.email = "Invalid email address.";
    valid = false;
  }
  if (!phone.value.trim()) {
    formErrors.value.phone = "Phone is required.";
    valid = false;
  } else if (!validatePhone(phone.value)) {
    formErrors.value.phone = "Invalid phone number.";
    valid = false;
  }
  return valid;
};

const formStep = ref(1); // 1 = initial, 2 = extra details
const eventDate = ref("");
const eventLocation = ref("");
const eventType = ref("");
const eventTypeOther = ref("");
const guestCount = ref("");
const guestCountOther = ref("");

const eventTypeOptions = computed(() => [
  { label: $t("form.eventTypeOptions.wedding"), value: "Wedding" },
  { label: $t("form.eventTypeOptions.party"), value: "Party/Festival" },
  { label: $t("form.eventTypeOptions.business"), value: "Business Event" },
  { label: $t("form.eventTypeOptions.private"), value: "Private Event" },
  { label: $t("form.eventTypeOptions.other"), value: "Other" },
]);
const guestCountOptions = computed(() => [
  { label: $t("form.guestCountOptions.0_250"), value: "0-250" },
  { label: $t("form.guestCountOptions.250_500"), value: "250-500" },
  { label: $t("form.guestCountOptions.500_750"), value: "500-750" },
  { label: $t("form.guestCountOptions.750_1000"), value: "750-1000" },
  { label: $t("form.guestCountOptions.other"), value: "Other" },
]);

const showFinalConfirmation = ref(false);

const submitForm = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  submitting.value = true;
  error.value = "";
  success.value = false;
  try {
    const postData = {
      name: name.value,
      email: email.value,
      phone: phone.value,
    };
    // const response = await fetch(
    //   "https://script.google.com/macros/s/AKfycbxEIRGeMDhcDmechSyY8rGCgwl7XjHufUyiJIuS8Ef6/exec",
    //   {
    //     method: "POST",
    //     body: JSON.stringify(postData),
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );
    const response = { ok: true };

    if (response.ok) {
      // Instead of showing success, go to step 2
      setTimeout(() => {
        formStep.value = 2;
        submitting.value = false;
      }, 1000);
    } else {
      error.value = "Submission failed. Please try again.";
      showToast("Submission failed. Please try again.", "error");
      submitting.value = false;
    }
  } catch (err) {
    error.value = "Submission failed. Please try again.";
    showToast("Submission failed. Please try again.", "error");
    submitting.value = false;
  }
};

const submitExtraDetails = async (e) => {
  e.preventDefault();
  let valid = true;
  formErrors.value.eventDate = "";
  formErrors.value.eventType = "";
  formErrors.value.eventTypeOther = "";
  formErrors.value.eventLocation = "";
  formErrors.value.guestCount = "";
  formErrors.value.guestCountOther = "";

  if (!eventDate.value.trim()) {
    formErrors.value.eventDate = "Event date is required.";
    valid = false;
  }
  if (!eventType.value) {
    formErrors.value.eventType = "Event type is required.";
    valid = false;
  }
  if (eventType.value === "Other" && !eventTypeOther.value.trim()) {
    formErrors.value.eventTypeOther = "Please specify the event type.";
    valid = false;
  }
  if (!eventLocation.value.trim()) {
    formErrors.value.eventLocation = "Event location is required.";
    valid = false;
  }
  if (!guestCount.value) {
    formErrors.value.guestCount = "Number of guests is required.";
    valid = false;
  }
  if (
    guestCount.value === "Other" &&
    (!guestCountOther.value || isNaN(Number(guestCountOther.value)))
  ) {
    formErrors.value.guestCountOther = "Please specify the number of guests.";
    valid = false;
  }
  if (!valid) return;
  submitting.value = true;
  error.value = "";
  try {
    const postData = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      date: eventDate.value,
      eventType:
        eventType.value === "Other" ? eventTypeOther.value : eventType.value,
      location: eventLocation.value,
      guests:
        guestCount.value === "Other" ? guestCountOther.value : guestCount.value,
    };
    // const response = await fetch(
    //   "https://script.google.com/macros/s/AKfycbxEIRGeMDhcDmechSyY8rGCgwl7XjHufUyiJIuS8Ef6/exec",
    //   {
    //     method: "POST",
    //     body: JSON.stringify(postData),
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );
    const response = { ok: true };
    if (response.ok) {
      formStep.value = 0;
      setTimeout(() => {
        showFinalConfirmation.value = true;
      }, 500);
    } else {
      error.value = "Submission failed. Please try again.";
      showToast("Submission failed. Please try again.", "error");
    }
  } catch (err) {
    error.value = "Submission failed. Please try again.";
    showToast("Submission failed. Please try again.", "error");
  } finally {
    submitting.value = false;
  }
};

let interval;

// Header text animation
const showHeaderText = ref(false);
onMounted(() => {
  setTimeout(() => {
    showHeaderText.value = true;
  }, 200);

  // Initialize Lottie animation with a different animation
  const animation = lottie.default.loadAnimation({
    container: document.getElementById("lottie-container"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "https://assets2.lottiefiles.com/packages/lf20_49rdyysj.json",
  });

  if (heroVideo.value) {
    heroVideo.value.addEventListener(
      "loadedmetadata",
      () => {
        heroVideo.value.currentTime = 8;
      },
      { once: true }
    );
  }

  // Preload all images
  preloadAllImages();

  // Start carousel interval
  startCarouselInterval();

  // Intersection Observer for image section fade-in with improved settings
  imageSectionObserver = new window.IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        imageSectionVisible.value = true;
      } else {
        // Only hide if we've scrolled past the section
        if (entry.boundingClientRect.top > 0) {
          imageSectionVisible.value = false;
        }
      }
    },
    {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      rootMargin: "-50px 0px",
    }
  );
  if (imageSectionRef.value) {
    imageSectionObserver.observe(imageSectionRef.value);
  }
});

const startCarouselInterval = () => {
  interval = setInterval(() => {
    if (!isTransitioning.value) {
      nextSlide();
    }
  }, 4000);
};

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
  if (imageSectionObserver) {
    imageSectionObserver.disconnect();
  }
});

const isRtl = computed(() => locale.value === "he");

// Utility for RTL text fields
const rtlTextField = computed(() =>
  locale.value === "he" ? "rtl-text-field" : ""
);
</script>

<template>
  <div class="min-h-screen bg-white" :class="{ rtl: isRtl }">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
    >
      <div class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>

    <div
      v-if="toast.show"
      :class="[
        'toast',
        toast.type === 'success' ? 'toast-success' : 'toast-error',
      ]"
    >
      {{ toast.message }}
    </div>
    <!-- Header -->
    <header
      class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100"
    >
      <div
        class="container mx-auto px-6 py-6 flex justify-between items-center"
      >
        <div class="flex items-center gap-1">
          <img src="/logo.png" alt="White-Noise Logo" class="h-14 w-auto" />
          <div class="text-lg font-bold tracking-tight flex items-baseline">
            <Transition name="header-main-fade">
              <span
                v-if="showHeaderText"
                class="header-main-text block text-lg font-bold tracking-tight"
                >{{ $t("header.brand") }}</span
              >
            </Transition>
            <Transition name="header-sub-fade">
              <span
                v-if="showHeaderText"
                class="header-sub-text block text-xs text-gray-600 ml-1 font-normal"
                >Powered By
                <svg
                  class="void-logo h-2 md:h-[0.5rem] w-auto align-center text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 993.3 233.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M722.8.6c14-1.7,37.7,1.2,52.1,3.3,94.2,13.6,197.8,74.3,215.6,174.9,4.1,23.1,8,52.4-23.6,54.3h-240.5c-12.3-.4-22.8-8.2-25-20.5-1-64-1.1-128.5,0-192.5,2.1-10.2,10.9-18.3,21.3-19.5ZM941.3,183.2c-20.6-83.6-111.5-126.1-191-132.4v132.4h191Z"
                  />
                  <path
                    d="M382.1.1h144.3c29.2,2,53.1,25.2,55.9,54.3v123.3c-2.7,29.7-27.2,53.1-56.9,54.9h-140.6c-30.5-1.4-55.4-25.5-57.8-55.9,1.7-39.4-2.3-80.8,0-119.9S352.5,2.6,382.1.1ZM385,49c-4.9,1.2-8.2,4.7-9,9.7v114.7c.5,5.7,5.1,10,10.8,10.3h135.4c5.6-.1,10.8-4.1,11.3-9.8V58.7c-.4-5.3-5.2-9.6-10.3-9.8h-138.1Z"
                  />
                  <path
                    d="M243.1,182.3V20.9c0-3.3,4.9-11.3,7.5-13.7,14.3-13.4,38-5.6,41.4,13.7.8,63.9,1.1,128.2-.2,192.1-5.4,23.3-27.8,20.3-46.6,19.2-84.8-5.4-176.9-45.7-221.1-121C10.5,87.9-2.2,50.4.3,23.3S29.8-7.4,43.9,9.4c7.3,8.8,5.3,16.9,6.3,27.3,3.9,41.6,31.1,77.3,64.1,100.9,37.3,26.7,83.2,40.9,128.8,44.7Z"
                  />
                  <path
                    d="M639.4.6c13.5-1.3,25.2,8.3,27,21.7v189c-5,29.9-47.2,28.2-49.5-2.9V24.7c.7-12.4,9.9-22.9,22.5-24.1Z"
                  />
                </svg>
              </span>
            </Transition>
          </div>
        </div>

        <button
          @click="toggleLanguage"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-transparent text-black text-base font-medium shadow border-2 border-black hover:bg-gray-100 transition-colors"
        >
          <span>{{ locale === "en" ? "EN" : "HE" }}</span>
        </button>
      </div>
    </header>

    <!-- Hero Section -->
    <section
      class="relative pt-32 pb-0 px-0 bg-gray-light overflow-hidden min-h-[900px] flex items-center justify-center w-full"
      style="margin: 0; padding: 0; overflow: hidden"
    >
      <!-- Video Background -->
      <video
        ref="heroVideo"
        class="absolute inset-0 w-full h-full object-cover z-0 scale-110 block m-0 p-0 hero-video-mobile-fullscreen"
        src="/video2.mp4"
        autoplay
        loop
        muted
        playsinline
      ></video>
      <!-- Overlay for better text contrast -->
      <div class="absolute inset-0 bg-black/55 z-10"></div>
      <!-- Hero Content -->
      <div
        class="absolute inset-0 flex flex-col items-center justify-center z-20 text-center"
      >
        <h1
          class="text-hero font-bold tracking-tight mb-8 text-white text-center"
          style="text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7)"
        >
          <span class="flex flex-row items-end title-logo">
            <!-- <span class="font-bold">{{ $t("hero.title2") }}</span> -->
            <img
              src="/void_logo-white_shadow.svg"
              alt="VOID Logo"
              class="void-logo h-9 md:h-[4.7rem] w-auto align-bottom block mx-auto md:mx-0 md:inline-block"
            />
            <span class="-ml-2">{{ $t("hero.title2") }}</span>
          </span>
        </h1>
        <p
          class="text-subhero text-gray-100 mb-8 max-w-3xl mx-auto"
          style="text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7)"
        >
          {{ $t("hero.subtitle2") }}
        </p>
        <button
          class="glance-btn bg-white text-black px-12 py-4 text-lg font-bold border-2 border-black shadow-[0_0_16px_2px_rgba(0,0,0,0.12)] hover:bg-gray-100 transition-colors rounded-full shadow-2xl drop-shadow-[0_6px_24px_rgba(0,0,0,0.7)]"
          @click="scrollToForm"
        >
          {{ $t("hero.button2") }}
        </button>
      </div>
    </section>

    <!-- New Image Section -->
    <section
      ref="imageSectionRef"
      class="relative w-full min-h-[700px] flex items-center justify-start bg-cover bg-center"
      style="
        background-image: url('https://white-noise-2025.s3.eu-north-1.amazonaws.com/Void+-+FB+Cover+-+Set+2A+-+v2.jpg');
      "
    >
      <!-- Overlay for readability -->
      <div class="absolute inset-0 bg-black/60 z-10"></div>
      <!-- Left-aligned Content -->
      <div class="relative z-20 max-w-4xl pl-16 py-24 text-left">
        <Transition name="fadein-text">
          <div v-if="imageSectionVisible">
            <h2
              class="text-5xl font-bold text-white mb-6"
              style="text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7)"
            >
              {{ $t("imageSection.title") }}
            </h2>
            <p
              class="text-2xl text-gray-100 max-w-2.5xl"
              style="text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7)"
            >
              {{ $t("imageSection.desc") }}
            </p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Product Showcase -->
    <section class="pt-0 pb-0 px-0 w-full -mt-1">
      <div class="relative w-full">
        <!-- Carousel Container -->
        <div
          class="relative w-full aspect-[16/8] overflow-hidden carousel-mobile-fullscreen"
        >
          <Transition name="fade" mode="out-in">
            <img
              v-if="showCarouselImage"
              :key="currentSlide + '-' + selectedCategory"
              :src="filteredSlides[currentSlide].image"
              :alt="filteredSlides[currentSlide].title"
              loading="eager"
              class="w-full h-full object-cover absolute inset-0 transition-all duration-500 ease-out bg-white"
              @mousemove="handleMouseMove"
              style="
                will-change: transform, opacity;
                backface-visibility: hidden;
                transform: translateZ(0);
              "
            />
          </Transition>
          <!-- Caption Overlay (bottom left) -->
          <div
            class="absolute inset-0 flex flex-col items-start justify-end bg-black/40 text-white z-10 p-8 carousel-caption-mobile"
          >
            <h3 class="text-3xl font-bold mb-2 drop-shadow">
              {{ filteredSlides[currentSlide].title }}
            </h3>
            <p class="text-lg drop-shadow">
              {{ filteredSlides[currentSlide].description }}
            </p>
          </div>
          <!-- Category Navigation -->
          <div
            class="absolute bottom-8 right-8 z-30 flex gap-6 carousel-category-nav"
          >
            <button
              v-for="category in categories"
              :key="category"
              @click="goToCategory(category)"
              class="group relative px-6 py-2 font-semibold tracking-wide text-base transition-all duration-300"
              :class="[
                selectedCategory === category
                  ? 'text-white [text-shadow:_0_2px_8px_rgba(0,0,0,0.5)]'
                  : 'text-black hover:text-white [text-shadow:_0_2px_8px_rgba(0,0,0,0.3)] hover:[text-shadow:_0_2px_8px_rgba(0,0,0,0.5)]',
              ]"
            >
              <span class="relative z-10">{{ category }}</span>
              <div
                class="absolute bottom-0 left-0 w-full h-0.5 bg-white transform transition-all duration-300"
                :class="{
                  'scale-x-100': selectedCategory === category,
                  'scale-x-0 group-hover:scale-x-100':
                    selectedCategory !== category,
                }"
              ></div>
            </button>
          </div>
          <!-- Pagination Dots -->
          <div
            class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20"
          >
            <button
              v-for="(slide, index) in filteredSlides"
              :key="index"
              @click="goToSlide(index)"
              class="w-3 h-3 rounded-full transition-colors"
              :class="
                currentSlide === index
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              "
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Leasing Inquiry Form -->
    <section
      ref="formSectionRef"
      class="py-20 px-2 sm:py-24 sm:px-4 md:py-32 bg-gray-light relative form-section-mobile"
      style="
        background: url('https://white-noise-2025.s3.eu-north-1.amazonaws.com/Tri+Motion+Front+Zoom+01+White+VA010.jpg')
          center/cover no-repeat;
      "
    >
      <!-- Overlay for readability -->
      <div class="absolute inset-0 bg-white/60 z-0"></div>
      <div
        class="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10"
      >
        <!-- Left: Heading and Description -->
        <div class="flex-1 text-left mb-8 md:mb-0 w-full">
          <h2
            class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 sm:mb-6"
          >
            {{ $t("formSection.title") }}
          </h2>
          <p
            class="text-base sm:text-lg md:text-xl text-secondary max-w-lg"
            :class="{ 'text-center': rtlTextField }"
          >
            {{ $t("formSection.desc") }}
            <span v-if="isRtl">
              {{ $t("formSection.desc2") }}
            </span>
          </p>
        </div>
        <!-- Right: Form -->
        <div
          class="flex-1 w-full max-w-md bg-white/90 rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
        >
          <form
            v-if="formStep === 1"
            @submit="submitForm"
            class="space-y-6 sm:space-y-8"
          >
            <div>
              <label class="block text-sm font-medium text-secondary mb-2">{{
                $t("form.name")
              }}</label>
              <input
                v-model="name"
                type="text"
                :placeholder="$t('form.namePlaceholder')"
                class="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 border-accent focus:ring-0 focus:border-primary text-base sm:text-lg placeholder-accent rounded-none transition"
                :class="[formErrors.name ? 'border-red-500' : '', rtlTextField]"
              />
              <div v-if="formErrors.name" class="text-xs text-red-500 mt-1">
                {{ formErrors.name }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary mb-2">{{
                $t("form.email")
              }}</label>
              <input
                v-model="email"
                type="email"
                :placeholder="$t('form.emailPlaceholder')"
                class="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 border-accent focus:ring-0 focus:border-primary text-base sm:text-lg placeholder-accent rounded-none transition"
                :class="[
                  formErrors.email ? 'border-red-500' : '',
                  rtlTextField,
                ]"
              />
              <div v-if="formErrors.email" class="text-xs text-red-500 mt-1">
                {{ formErrors.email }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary mb-2">{{
                $t("form.phone")
              }}</label>
              <input
                v-model="phone"
                type="tel"
                :placeholder="$t('form.phonePlaceholder')"
                class="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 border-accent focus:ring-0 focus:border-primary text-base sm:text-lg placeholder-accent rounded-none transition"
                :class="[
                  formErrors.phone ? 'border-red-500' : '',
                  rtlTextField,
                ]"
              />
              <div v-if="formErrors.phone" class="text-xs text-red-500 mt-1">
                {{ formErrors.phone }}
              </div>
            </div>
            <button
              type="submit"
              class="glance-btn w-full bg-gradient-to-r from-primary via-secondary to-accent text-white px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-xl tracking-widest flex items-center justify-center gap-2"
              :disabled="submitting"
            >
              <span v-if="submitting" class="spinner"></span>
              <span>{{
                submitting ? $t("form.submitting") : $t("form.connect")
              }}</span>
            </button>
          </form>
          <Transition name="fade-confirmation fade-form">
            <div
              v-if="showFinalConfirmation"
              class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-base font-medium text-center flex flex-col justify-center items-center min-h-[200px]"
            >
              <div class="mb-2">
                {{ $t("formSection.submitSuccess") }}
              </div>
              <div
                class="mt-4 text-xs text-gray-500 font-semibold tracking-wide"
                style="font-family: inherit"
              >
                {{ isRtl ? "צוות whitenoise" : "Team whitenoise" }}
              </div>
            </div>
            <div v-else-if="formStep === 2">
              <div
                class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-base font-medium text-center"
              >
                {{ $t("form.saved") }}<br />{{ $t("form.moreDetails") }}
              </div>
              <form @submit="submitExtraDetails" class="space-y-6 sm:space-y-8">
                <div>
                  <label
                    class="block text-sm font-medium text-secondary mb-2"
                    >{{ $t("form.eventDate") }}</label
                  >
                  <input
                    v-model="eventDate"
                    type="date"
                    class="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 border-accent focus:ring-0 focus:border-primary text-base sm:text-lg placeholder-accent rounded-none transition"
                    :class="[
                      formErrors.eventDate ? 'border-red-500' : '',
                      rtlTextField,
                    ]"
                  />
                  <div
                    v-if="formErrors.eventDate"
                    class="text-xs text-red-500 mt-1"
                  >
                    {{ formErrors.eventDate }}
                  </div>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-secondary mb-2"
                    >{{ $t("form.eventType") }}</label
                  >
                  <CustomDropdown
                    v-model="eventType"
                    :options="eventTypeOptions"
                    :placeholder="$t('form.eventTypePlaceholder')"
                  />
                  <div
                    v-if="formErrors.eventType"
                    class="text-xs text-red-500 mt-1"
                  >
                    {{ formErrors.eventType }}
                  </div>
                  <Transition name="fade-slide">
                    <input
                      v-if="eventType === 'Other'"
                      v-model="eventTypeOther"
                      type="text"
                      placeholder="Please specify event type"
                      class="w-full mt-2 px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 border-accent focus:ring-0 focus:border-primary text-base sm:text-lg rounded-none transition"
                      :class="rtlTextField"
                    />
                  </Transition>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-secondary mb-2"
                    >{{ $t("form.eventLocation") }}</label
                  >
                  <input
                    v-model="eventLocation"
                    type="text"
                    :placeholder="$t('form.eventLocationPlaceholder')"
                    class="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 border-accent focus:ring-0 focus:border-primary text-base sm:text-lg placeholder-accent rounded-none transition"
                    :class="[
                      formErrors.eventLocation ? 'border-red-500' : '',
                      rtlTextField,
                    ]"
                  />
                  <div
                    v-if="formErrors.eventLocation"
                    class="text-xs text-red-500 mt-1"
                  >
                    {{ formErrors.eventLocation }}
                  </div>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-secondary mb-2"
                    >{{ $t("form.guestCount") }}</label
                  >
                  <CustomDropdown
                    v-model="guestCount"
                    :options="guestCountOptions"
                    :placeholder="$t('form.guestCountPlaceholder')"
                  />
                  <div
                    v-if="formErrors.guestCount"
                    class="text-xs text-red-500 mt-1"
                  >
                    {{ formErrors.guestCount }}
                  </div>
                  <Transition name="fade-slide">
                    <input
                      v-if="guestCount === 'Other'"
                      v-model="guestCountOther"
                      type="number"
                      min="1"
                      placeholder="Enter number of guests"
                      class="w-full mt-2 px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 border-accent focus:ring-0 focus:border-primary text-base sm:text-lg rounded-none transition"
                      :class="rtlTextField"
                    />
                  </Transition>
                </div>
                <div
                  v-if="formErrors.guestCountOther"
                  class="text-xs text-red-500 mt-1"
                >
                  {{ formErrors.guestCountOther }}
                </div>
                <button
                  type="submit"
                  class="glance-btn w-full bg-gradient-to-r from-primary via-secondary to-accent text-white px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-xl tracking-widest flex items-center justify-center gap-2"
                  :disabled="submitting"
                >
                  <span v-if="submitting" class="spinner"></span>
                  <span>{{
                    submitting
                      ? $t("form.submitting")
                      : $t("form.submitDetails")
                  }}</span>
                </button>
              </form>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="py-2 sm:py-4 px-2 sm:px-4 border-t border-gray-100 bg-white footer-container-mobile"
    >
      <div
        class="container mx-auto flex flex-col items-center justify-center gap-2"
      >
        <div class="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            class="text-gray-400 hover:text-primary transition-colors"
          >
            <Icon icon="mdi:facebook" class="text-[15px]" />
          </a>
          <a
            href="https://www.instagram.com/whitenoise.sound"
            target="_blank"
            rel="noopener"
            class="text-gray-400 hover:text-primary transition-colors"
          >
            <Icon icon="mdi:instagram" class="text-[15px]" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener"
            class="text-gray-400 hover:text-primary transition-colors"
          >
            <Icon icon="ic:baseline-tiktok" class="text-[15px]" />
          </a>
          <!-- <a href="https://twitter.com" target="_blank" rel="noopener" class="text-gray-400 hover:text-primary transition-colors">
            <Icon icon="mdi:twitter" class="text-[15px]" />
          </a> -->
          <span class="mx-3 h-4 border-l border-gray-300"></span>
          <span class="text-[11px] text-gray-400 text-center">{{
            $t("footer.copyright")
          }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap");

/* Custom styles */
html {
  scroll-behavior: smooth;
}

body {
  @apply antialiased text-gray-900;
}

/* Remove default focus outline and add custom focus styles */
*:focus {
  outline: none;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Fade transition for carousel images */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-out;
  will-change: opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Remove zoom out animation */
.carousel-zoom {
  animation: carousel-zoom-in 4s linear forwards;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

@keyframes carousel-zoom-in {
  from {
    transform: scale(1) translateZ(0);
  }
  to {
    transform: scale(1.08) translateZ(0);
  }
}

/* Remove zoom out styles */
.carousel-zoom-out {
  display: none;
}

@keyframes carousel-zoom-out {
  from {
    transform: scale(1.08) translateZ(0);
  }
  to {
    transform: scale(1) translateZ(0);
  }
}

.glance-btn {
  position: relative;
  overflow: hidden;
}

.glance-btn::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 20%,
    rgba(255, 255, 255, 0.8) 40%,
    rgba(240, 240, 240, 0.8) 50%,
    rgba(255, 255, 255, 0.8) 60%,
    rgba(255, 255, 255, 0.4) 80%,
    transparent 100%
  );
  transform: rotate(45deg);
  opacity: 0;
  pointer-events: none;
}

.glance-btn:hover::after {
  opacity: 1;
  animation: gleam 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes gleam {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.void-logo {
  font-family: "Orbitron", Arial, sans-serif;
  letter-spacing: 0.18em;
  font-weight: 700;
  font-size: 0.6em;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
}

.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  z-index: 9999;
  color: #111;
  background: rgba(255, 255, 255, 0.99);
  border: 2px solid #bbb;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  opacity: 0;
  animation: toast-fade-in 0.5s forwards, toast-fade-out 0.5s 2.5s forwards;
  transition: opacity 0.5s;
  font-family: "Inter", "Arial Rounded MT Bold", Arial, sans-serif;
}
.toast-success {
  background: rgba(255, 255, 255, 0.99);
  border: 2px solid #bbb;
  color: #111;
}
.toast-error {
  background: rgba(255, 255, 255, 0.99);
  border: 2px solid #bbb;
  color: #111;
}
@keyframes toast-fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes toast-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.spinner {
  border: 2px solid #fff;
  border-top: 2px solid #666;
  border-radius: 50%;
  width: 1em;
  height: 1em;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  margin-right: 0.5em;
  vertical-align: middle;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Loading animation styles */
#lottie-container {
  width: 150px;
  height: 150px;
  filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%)
    hue-rotate(0deg) brightness(0%) contrast(100%);
}

#lottie-container svg {
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
}

#lottie-container path {
  animation: dotColor 2s infinite;
}

@keyframes dotColor {
  0% {
    fill: #666666;
  }
  33% {
    fill: #444444;
  }
  66% {
    fill: #222222;
  }
  100% {
    fill: #000000;
  }
}

/* Loading animation styles */
.loading-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #333;
  animation: dotPulse 1.5s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Fade/slide animation for dropdown "Other" fields */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 5.3s cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 5.3s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Fade for second form */
.fade-form-enter-active,
.fade-form-leave-active {
  transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-form-enter-from,
.fade-form-leave-to {
  opacity: 0;
}
.fade-form-enter-to,
.fade-form-leave-from {
  opacity: 1;
}

/* RTL support: only align text to right */
.rtl {
  text-align: right;
}

@media (max-width: 480px) {
  header .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .text-hero {
    font-size: 2rem !important;
    line-height: 2.4rem !important;
  }
  .text-subhero {
    font-size: 1.1rem !important;
    line-height: 1.5rem !important;
    padding: 0 2.5rem !important;
  }
  .text-5xl {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }
  .text-3xl,
  .text-4xl {
    font-size: 1.2rem !important;
    line-height: 1.6rem !important;
  }
  .max-w-3xl,
  .max-w-4xl,
  .max-w-2\.5xl,
  .max-w-5xl,
  .max-w-lg {
    max-width: 100% !important;
  }
  .pl-16 {
    padding-left: 1rem !important;
  }
  .py-24,
  .py-20,
  .sm\:py-24,
  .md\:py-32 {
    padding-top: 1.5rem !important;
    padding-bottom: 1.5rem !important;
  }
  .px-6,
  .px-4,
  .px-2,
  .sm\:px-4 {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  .mb-8,
  .mb-6,
  .mb-4 {
    margin-bottom: 1rem !important;
  }
  .glance-btn {
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
    padding-top: 0.75rem !important;
    padding-bottom: 0.75rem !important;
    font-size: 1rem !important;
  }
  .rounded-xl {
    border-radius: 0.75rem !important;
  }
  .container {
    max-width: 100vw !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  .aspect-\[16\/8\] {
    aspect-ratio: 16/12 !important;
    min-height: 180px !important;
  }
  .w-full,
  .h-full {
    width: 100% !important;
    height: auto !important;
  }
  .flex-row,
  .md\:flex-row {
    flex-direction: column !important;
    /* gap: 0.5rem !important; */
  }
  .max-w-md {
    max-width: 100vw !important;
  }
  .shadow-lg,
  .shadow-xl,
  .shadow-2xl {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  }
  .text-base,
  .sm\:text-lg,
  .md\:text-xl,
  .text-lg {
    font-size: 1rem !important;
  }
  .text-secondary {
    font-size: 0.95rem !important;
  }
  .gap-8,
  .md\:gap-12 {
    gap: 1.25rem !important;
  }
  .h-14 {
    height: 2.2rem !important;
  }
  .w-auto {
    width: auto !important;
  }
  .rounded-full {
    border-radius: 9999px !important;
  }
  .border-b-2 {
    border-bottom-width: 2px !important;
  }
  .py-2,
  .sm\:py-4 {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
  .carousel-mobile-fullscreen {
    aspect-ratio: unset !important;
    min-height: 90vh !important;
    height: 90vh !important;
    max-height: 90vh !important;
  }
  .carousel-mobile-fullscreen img {
    height: 90vh !important;
    min-height: 90vh !important;
    object-fit: cover !important;
  }

  .carousel-caption-mobile {
    padding-bottom: 5rem !important;
  }

  .hero-video-mobile-fullscreen {
    height: 100vh !important;
    min-height: 100vh !important;
    width: 100vw !important;
    object-fit: cover !important;
  }

  .form-section-mobile {
    /* min-height: 100vh; */
    height: 90vh;
    padding-top: 2.5rem;
    padding-bottom: 1.5rem;
  }
  .footer-container-mobile {
    min-height: 5vh;
    height: 5vh;
  }
  .carousel-category-nav {
    left: 50% !important;
    width: 100%;
    right: auto !important;
    transform: translateX(-50%);
    justify-content: center !important;
  }
}

/* Header text entrance animation */
.header-main-fade-enter-active {
  transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.header-main-fade-enter-from {
  opacity: 0;
  transform: translateX(-24px) scale(0.95);
}
.header-main-fade-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.header-sub-fade-enter-active {
  transition: opacity 1.5s 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    transform 1.5s 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.header-sub-fade-enter-from {
  opacity: 0;
  transform: translateX(16px) scale(0.95);
}
.header-sub-fade-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

/* RTL text field utility */
.rtl-text-field {
  text-align: right !important;
  direction: rtl !important;
}

/* Fade transition for final confirmation */
.fade-confirmation-enter-active {
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-confirmation-enter-from {
  opacity: 0;
}
.fade-confirmation-enter-to {
  opacity: 1;
}
</style>
