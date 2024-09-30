<template>
  <div :class="['content-wrapper', { mobile: isMobile }]">
    <div class="line-chart-loader">
      <svg :width="svgWidth" :height="svgHeight" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <path class="line" d="M10 80 L30 50 L50 70 L70 40 L90 60 L110 20 L130 40 L150 10 L170 50 L190 20" />
        <circle class="dot" cx="10" cy="80" r="3" />
        <circle class="dot" cx="30" cy="50" r="3" />
        <circle class="dot" cx="50" cy="70" r="3" />
        <circle class="dot" cx="70" cy="40" r="3" />
        <circle class="dot" cx="90" cy="60" r="3" />
        <circle class="dot" cx="110" cy="20" r="3" />
        <circle class="dot" cx="130" cy="40" r="3" />
        <circle class="dot" cx="150" cy="10" r="3" />
        <circle class="dot" cx="170" cy="50" r="3" />
        <circle class="dot" cx="190" cy="20" r="3" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "LineChartLoader",
  data() {
    return {
      isMobile: window.innerWidth < 768,
      svgWidth: "100%",
      svgHeight: "100%",
    };
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
.line-chart-loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 50%;
  height: 50%;
}

.line {
  stroke: #e0e0e0a6;
  stroke-width: 2;
  fill: none;
  animation: drawLine 1.5s infinite;
}

.dot {
  fill: #e0e0e0a6;
  animation: pulseDot 1.5s infinite;
}

@keyframes drawLine {
  0% {
    stroke-dasharray: 0, 100;
  }
  100% {
    stroke-dasharray: 100, 0;
  }
}

@keyframes pulseDot {
  0%,
  100% {
    r: 3;
    fill-opacity: 1;
  }
  50% {
    r: 5;
    fill-opacity: 0.5;
  }
}

.content-wrapper.mobile .line-chart-loader {
  width: 100%;
  height: 150px;
}

@media (max-width: 768px) {
  .content-wrapper.mobile .line-chart-loader {
    width: 100%;
    height: 150px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
