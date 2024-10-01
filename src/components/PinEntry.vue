<template>
  <div class="pin-popup">
    <div class="pin-container">
      <div class="logo-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="logo">
          <path
            d="M12 2a5 5 0 0 0-5 5v4H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-1V7a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v4H9V7a3 3 0 0 1 3-3zm-6 9h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"
            fill="#007BFF"
          />
        </svg>
      </div>
      <h2 class="title">Enter PIN</h2>
      <p class="description">Please enter your 6-digit PIN to continue</p>

      <div class="pin-input-container">
        <input v-model="pin" :type="isPasswordVisible ? 'text' : 'password'" class="pin-input" maxlength="6" placeholder="Enter PIN" @input="validatePin" />
        <button @click="togglePasswordVisibility" class="toggle-visibility-btn">
          <svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="eye-icon">
            <path d="M12 5C7.58 5 3.76 7.61 2 12c1.76 4.39 5.58 7 10 7s8.24-2.61 10-7c-1.76-4.39-5.58-7-10-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="eye-icon">
            <path d="M12 5C7.58 5 3.76 7.61 2 12c1.76 4.39 5.58 7 10 7s8.24-2.61 10-7c-1.76-4.39-5.58-7-10-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm6-5c0-3.31-2.69-6-6-6s-6 2.69-6 6 2.69 6 6 6 6-2.69 6-6z" />
          </svg>
        </button>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <div class="button-container">
        <button @click="goBack" class="back-btn">Back</button>
        <button @click="submitPin" class="submit-btn">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      pin: "",
      error: "",
      isPasswordVisible: false,
    };
  },
  methods: {
    validatePin() {
      const sanitizedInput = this.pin.replace(/[^0-9]/g, "");

      if (this.pin !== sanitizedInput) {
        this.error = "The input can only be numbers";
        this.pin = sanitizedInput;
      } else {
        this.error = "";
      }
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    getMD5HashFromDate(date) {
      return CryptoJS.MD5(date).toString();
    },
    submitPin() {
      const routeType = this.$route.query.type;
      let correctPin = "";

      if (routeType === "glasshouse") {
        correctPin = "670b14728ad9902aecba32e22fa4f6bd";
      } else if (routeType === "greenhouse") {
        correctPin = "670b14728ad9902aecba32e22fa4f6bd";
      } else if (routeType === "faperta") {
        correctPin = "222ae074b25e226f3bbc78acba7e34c2";
      }

      const hashpin = this.getMD5HashFromDate(this.pin);
      if (hashpin === correctPin) {
        const validUntil = new Date().getTime() + 15 * 60 * 1000; // Valid for 15 minutes
        if (routeType === "glasshouse") {
          localStorage.setItem("pinValidUntilGlasshouse", validUntil);
        } else if (routeType === "greenhouse") {
          localStorage.setItem("pinValidUntilGreenhouse", validUntil);
        } else if (routeType === "faperta") {
          localStorage.setItem("pinValidUntilFaperta", validUntil);
        }

        const redirectPath = this.$route.query.redirect || "/";
        this.$router.replace({ path: redirectPath });
      } else {
        this.error = "Invalid PIN. Please try again.";
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.pin-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ebeff3;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pin-container {
  background-color: #f5f5f5;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
  max-width: 90%;
  position: relative;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
}

.title {
  font-family: "Arial", sans-serif;
  font-size: 26px;
  margin-bottom: 10px;
  color: #333333;
}

.description {
  font-size: 16px;
  color: #666666;
  margin-bottom: 30px;
}

.pin-input {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  transition: border-color 0.3s ease;
  flex: 1;
  padding-right: 40px;
  height: 40px;
  font-size: 16px;
}

.pin-input:focus {
  border-color: #007bff;
  outline: none;
}

.pin-input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.toggle-visibility-btn {
  position: absolute;
  right: 10px;
  top: 35%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.eye-icon {
  width: 24px;
  height: 24px;
  fill: #a2a5a8;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.back-btn {
  background-color: #b30101;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #810505;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.error-msg {
  color: red;
  margin-top: -20px;
  margin-bottom: 10px;
  font-size: 14px;
}

@media (max-width: 400px) {
  .pin-container {
    padding: 20px;
  }

  .pin-input {
    font-size: 16px;
  }

  .button-container {
    flex-direction: column;
  }

  .back-btn,
  .submit-btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .submit-btn {
    margin-bottom: 0;
  }
}
</style>
