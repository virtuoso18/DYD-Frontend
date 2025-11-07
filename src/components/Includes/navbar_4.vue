

<!-- GeneralNavbar.vue -->
<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo and Brand -->
      <div class="navbar-brand">
        <router-link :to="'/'">
          <div class="logo">
            <img src="../../assets/dyd-logo.png" style="width:40px;height:40px" alt="">
          </div>
        </router-link>
      </div>

      <!-- Navigation Links -->
      <div class="navbar-nav">
        <a href="#" class="nav-link">Business Owner</a>
        <a href="#" class="nav-link">Interior Designer or Architecture</a>
        <a href="/comunity" class="nav-link">Community</a>
        <a href="/pricing" class="nav-link">Pricing</a>
        <a href="/contact-us" class="nav-link">Contact us</a>
      </div>

      <!-- Right Side Actions -->
      <div class="navbar-actions">
        <a-select
          ref="select"
          v-model:value="language_selected"
          style="width: 100px"
          @change="handleChange"
        >
          <a-select-option value="en">EN</a-select-option>
          <a-select-option value="he">HB</a-select-option>
        </a-select>
        
        <router-link :to="'/signup'">
          <button class="btn-primary">Signup for free</button>
        </router-link>
        <router-link :to="'/login'">
          <button class="btn-primary">Login</button>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'GeneralNavbar',
  setup() {
    const { locale } = useI18n()
    return { locale }
  },
  data() {
    return {
      language_selected: 'en'
    }
  },
  mounted() {
    // Load saved language preference on mount
    const savedLang = localStorage.getItem('preferred_language')
    if (savedLang) {
      this.language_selected = savedLang
      this.locale = savedLang
      document.dir = savedLang === 'he' ? 'rtl' : 'ltr'
    }
  },
  methods: {
    handleChange(value) {
      console.log("Language changing to:", value)
      
      // Update local state
      this.language_selected = value
      
      // ✅ Update Vue i18n locale
      this.locale = value
      
      // ✅ Switch layout direction
      document.dir = value === 'he' ? 'rtl' : 'ltr'
      
      // ✅ Save preference to localStorage
      localStorage.setItem('preferred_language', value)
      
      console.log(`🌐 Language changed to: ${value}`)
    }
  }
}
</script>

<style scoped>
/* Global Navbar Styles */
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  /* max-width: 1200px; */
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1;
}

.brand-subtitle {
  font-size: 12px;
  color: #6b7280;
  line-height: 1;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-left: 20px;
  margin-right: auto;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: #3B63FB;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.language-selector:hover {
  background-color: #f3f4f6;
}

.btn-primary {
  background: #3B63FB;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary:hover {
  background: #2c4fd6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 99, 251, 0.25);
}

.btn-outline {
  background: transparent;
  color: #3B63FB;
  border: 1px solid #3B63FB;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-outline:hover {
  background: #3B63FB;
  color: white;
  transform: translateY(-1px);
}

.btn-icon {
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.btn-icon:hover {
  border-color: #3B63FB;
  color: #3B63FB;
}

.icon-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  border-radius: 6px;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #3B63FB;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.user-avatar:hover {
  border-color: #3B63FB;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
    height: 56px;
  }
  
  .navbar-nav {
    display: none;
  }
  
  .navbar-actions {
    gap: 8px;
  }
  
  .btn-primary,
  .btn-outline {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .brand-title {
    font-size: 14px;
  }
  
  .brand-subtitle {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .navbar-actions .btn-outline {
    display: none;
  }
  
  .icon-actions {
    gap: 4px;
  }
  
  .language-selector {
    display: none;
  }
}
</style>