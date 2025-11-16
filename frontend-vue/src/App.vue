<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo">{{ $t('app.logo') }}</h1>
          <p class="tagline">{{ $t('app.tagline') }}</p>
        </div>
        <div class="header-actions">
          <button @click="toggleLanguage" class="language-button" :title="currentLocale === 'en' ? 'Switch to Georgian' : 'Switch to English'">
            {{ currentLocale === 'en' ? 'ქართული' : 'English' }}
          </button>
          <a href="/admin.html" class="admin-link" title="Admin Panel">🔐 {{ $t('app.admin') }}</a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <!-- Left Panel: Form -->
        <section class="form-section">
          <h2>{{ $t('app.reserveTitle') }}</h2>
          <p class="section-subtitle">{{ $t('app.reserveSubtitle') }}</p>

          <form @submit.prevent="reserve" class="reservation-form">
            <div class="form-group">
              <label for="first_name">{{ $t('app.firstName') }}</label>
              <input
                id="first_name"
                v-model="first_name"
                type="text"
                :placeholder="$t('app.enterFirstName')"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="last_name">{{ $t('app.lastName') }}</label>
              <input
                id="last_name"
                v-model="last_name"
                type="text"
                :placeholder="$t('app.enterLastName')"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="phone">{{ $t('app.phone') }}</label>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                :placeholder="$t('app.enterPhone')"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="email">{{ $t('app.email') }}</label>
              <input
                id="email"
                v-model="email"
                type="email"
                :placeholder="$t('app.enterEmail')"
                class="form-input"
              />
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="!isLoading">{{ $t('app.reserveButton') }}</span>
              <span v-else>{{ $t('app.processing') }}</span>
            </button>
          </form>

        </section>

        <!-- Right Panel: Result -->
        <section class="result-section">
          <div v-if="!result" class="tournament-info-display">
            <!-- Tournament Info -->
            <div class="tournament-info-section">
              <h4 class="section-title">{{ $t('app.tournamentDetails') }}</h4>
              
              <div class="info-grid">
                <div v-if="tournamentInfo.name" class="info-item">
                  <span class="info-icon">🏆</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.tournamentName') }}</span>
                    <span class="info-value">{{ tournamentInfo.name }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.date" class="info-item">
                  <span class="info-icon">📅</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.tournamentDate') }}</span>
                    <span class="info-value">{{ formatDate(tournamentInfo.date) }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.time" class="info-item">
                  <span class="info-icon">🕒</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.tournamentTime') }}</span>
                    <span class="info-value">{{ tournamentInfo.time }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.location" class="info-item location-clickable" @click="openMapLocation" title="Open in Google Maps">
                  <span class="info-icon">📍</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.location') }}</span>
                    <span class="info-value">{{ tournamentInfo.location }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="info-icon">🎰</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.tables') }}</span>
                    <span class="info-value">{{ settings.table_quantity }} {{ $t('app.premiumTables') }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="info-icon">💺</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.seats') }}</span>
                    <span class="info-value">{{ settings.seat_quantity }} {{ $t('app.seatsPerTable') }}</span>
                  </div>
                </div>
                
                <div class="info-item highlight">
                  <span class="info-icon">👥</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.totalCapacity') }}</span>
                    <span class="info-value">{{ totalCapacity }} {{ $t('app.players') }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.entry_fee" class="info-item">
                  <span class="info-icon">💰</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.entryFee') }}</span>
                    <span class="info-value">{{ tournamentInfo.entry_fee }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.prize_pool" class="info-item">
                  <span class="info-icon">🏅</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.prizePool') }}</span>
                    <span class="info-value">{{ tournamentInfo.prize_pool }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="info-icon">✅</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.checkin') }}</span>
                    <span class="info-value">{{ $t('app.qrAtDoor') }}</span>
                  </div>
                </div>
              </div>

              <div v-if="tournamentInfo.description" class="tournament-description-result">
                <p>{{ tournamentInfo.description }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="result.status === 'reserved'" class="result-card success">
            <div class="status-header success">
              <span class="status-icon">✓</span>
              <h3>{{ $t('app.confirmed') }}</h3>
            </div>
            <p class="confirmation-text">{{ $t('app.allSet') }}</p>

            <div class="seat-details">
              <div class="seat-item">
                <span class="label">{{ $t('app.table') }}</span>
                <span class="value">{{ result.table_number }}</span>
              </div>
              <div class="seat-item">
                <span class="label">{{ $t('app.seat') }}</span>
                <span class="value">{{ result.seat_number }}</span>
              </div>
            </div>

            <div class="qr-section">
              <p class="qr-label">{{ $t('app.checkinCode') }}</p>
              <div class="qr-placeholder">{{ $t('app.qrCode') }}</div>
              <p class="qr-text">{{ $t('app.scanAtDoor') }}</p>
              <a :href="result.qr" target="_blank" class="qr-link">{{ $t('app.viewQR') }}</a>
            </div>

            <!-- Tournament Information Section -->
            <div class="tournament-info-section">
              <h4 class="section-title">{{ $t('app.tournamentDetails') }}</h4>
              
              <div class="info-grid">
                <div v-if="tournamentInfo.name" class="info-item">
                  <span class="info-icon">🏆</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.tournamentName') }}:</span>
                    <span class="info-value">{{ tournamentInfo.name }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.date" class="info-item">
                  <span class="info-icon">📅</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.tournamentDate') }}:</span>
                    <span class="info-value">{{ formatDate(tournamentInfo.date) }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.time" class="info-item">
                  <span class="info-icon">🕒</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.tournamentTime') }}:</span>
                    <span class="info-value">{{ tournamentInfo.time }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.location" class="info-item location-clickable" @click="openMapLocation" title="Open in Google Maps">
                  <span class="info-icon">📍</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.location') }}:</span>
                    <span class="info-value">{{ tournamentInfo.location }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="info-icon">🎰</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.tables') }}</span>
                    <span class="info-value">{{ settings.table_quantity }} {{ currentLocale === 'ka' ? 'პრემიუმ მაგიდა' : 'Premium Tables' }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="info-icon">💺</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.seats') }}</span>
                    <span class="info-value">{{ settings.seat_quantity }} {{ currentLocale === 'ka' ? 'ადგილი თითო მაგიდაზე' : 'Seats per Table' }}</span>
                  </div>
                </div>
                
                <div class="info-item highlight">
                  <span class="info-icon">👥</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.totalCapacity') }}</span>
                    <span class="info-value">{{ totalCapacity }} {{ currentLocale === 'ka' ? 'მოთამაშე' : 'Players' }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.entryFee" class="info-item">
                  <span class="info-icon">💰</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.entryFee') }}:</span>
                    <span class="info-value">{{ tournamentInfo.entryFee }}</span>
                  </div>
                </div>
                
                <div v-if="tournamentInfo.prizePool" class="info-item">
                  <span class="info-icon">🏅</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.prizePool') }}:</span>
                    <span class="info-value">{{ tournamentInfo.prizePool }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="info-icon">✅</span>
                  <div class="info-content">
                    <span class="info-label">{{ $t('app.checkin') }}</span>
                    <span class="info-value">{{ $t('app.qrAtDoor') }}</span>
                  </div>
                </div>
              </div>

              <div v-if="tournamentInfo.description" class="tournament-description-result">
                <p>{{ tournamentInfo.description }}</p>
              </div>
            </div>

            <div class="confirmation-details">
              <p><strong>{{ $t('app.name') }}</strong> {{ first_name }} {{ last_name }}</p>
              <p><strong>{{ $t('app.phoneLabel') }}</strong> {{ phone }}</p>
              <p v-if="email"><strong>{{ $t('app.emailLabel') }}</strong> {{ email }}</p>
            </div>

            <button @click="resetForm" class="btn btn-secondary">{{ $t('app.makeAnother') }}</button>
          </div>

          <div v-else-if="result.status === 'waiting'" class="result-card waiting">
            <div class="status-header waiting">
              <span class="status-icon">⏳</span>
              <h3>{{ $t('app.waitlist') }}</h3>
            </div>
            <p class="confirmation-text">{{ $t('app.allFull') }}</p>

            <div class="waiting-badge">
              <span class="waiting-number">{{ result.waiting_position }}</span>
              <span class="waiting-label">{{ $t('app.inQueue') }}</span>
            </div>

            <p class="waiting-message">
              {{ $t('app.notifyMessage') }}
            </p>

            <div class="confirmation-details">
              <p><strong>{{ $t('app.name') }}</strong> {{ first_name }} {{ last_name }}</p>
              <p><strong>{{ $t('app.phoneLabel') }}</strong> {{ phone }}</p>
              <p v-if="email"><strong>{{ $t('app.emailLabel') }}</strong> {{ email }}</p>
            </div>

            <button @click="resetForm" class="btn btn-secondary">{{ $t('app.tryAnother') }}</button>
          </div>

          <div v-else-if="result.error" class="result-card error">
            <div class="status-header error">
              <span class="status-icon">✕</span>
              <h3>{{ result.error === 'User already has a reservation' ? $t('app.alreadyReserved') : $t('app.somethingWrong') }}</h3>
            </div>
            <p class="error-message">
              <strong>{{ result.error === 'User already has a reservation' ? $t('app.userAlreadyReserved') : result.error }}</strong>
              <span v-if="result.details"><br />{{ result.details }}</span>
            </p>
            <button @click="resetForm" class="btn btn-secondary">{{ $t('app.tryAgain') }}</button>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>{{ $t('app.footer') }}</p>
    </footer>
  </div>
</template>

<script>
import { setLocale, getLocale } from './i18n';
import { reservationAPI, settingsAPI, tournamentAPI } from './api';

export default {
  data() {
    return {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      result: null,
      isLoading: false,
      settings: {
        table_quantity: 6,
        seat_quantity: 9
      },
      totalCapacity: 54,
      currentLocale: getLocale(),
      tournamentInfo: {
        name: '',
        date: '',
        time: '',
        location: '',
        entry_fee: '',
        prize_pool: '',
        description: ''
      }
    }
  },
  methods: {
    toggleLanguage() {
      this.currentLocale = this.currentLocale === 'en' ? 'ka' : 'en';
      setLocale(this.currentLocale);
    },
    async reserve() {
      this.isLoading = true;
      this.result = null;

      try {
        // Validate
        if (!this.first_name.trim() || !this.last_name.trim() || !this.phone.trim()) {
          this.result = {
            error: 'Please fill in all required fields'
          };
          this.isLoading = false;
          return;
        }

        // Call API to create reservation
        const response = await reservationAPI.create({
          first_name: this.first_name,
          last_name: this.last_name,
          phone: this.phone,
          email: this.email
        });

        this.result = response;
      } catch (e) {
        console.error('Reservation Error:', e);
        
        // Handle specific error cases
        const errorMessage = e.message || '';
        
        if (errorMessage.includes('Phone number already registered') || errorMessage.includes('already registered')) {
          this.result = { 
            error: this.$t('app.phoneAlreadyRegistered'),
            status: 'error'
          };
        } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
          this.result = { 
            error: this.$t('app.serverNotRunning'),
            status: 'error'
          };
        } else {
          this.result = { 
            error: errorMessage || this.$t('app.reservationFailed'),
            status: 'error'
          };
        }
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      this.first_name = '';
      this.last_name = '';
      this.phone = '';
      this.email = '';
      this.result = null;
    },
    async loadSettings() {
      // Try API first, fallback to localStorage
      try {
        const settings = await settingsAPI.get();
        if (settings) {
          this.settings = settings;
          this.totalCapacity = settings.table_quantity * settings.seat_quantity;
        }
      } catch (error) {
        console.warn('API not available, loading from localStorage:', error);
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('tournament_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          this.settings = {
            table_quantity: parsed.tableQuantity || parsed.table_quantity || 6,
            seat_quantity: parsed.seatQuantity || parsed.seat_quantity || 9
          };
          this.totalCapacity = this.settings.table_quantity * this.settings.seat_quantity;
        }
      }

      try {
        const info = await tournamentAPI.get();
        if (info) {
          this.tournamentInfo = info;
        }
      } catch (error) {
        console.warn('API not available, loading from localStorage:', error);
        // Fallback to localStorage
        const savedInfo = localStorage.getItem('tournament_info');
        if (savedInfo) {
          const parsed = JSON.parse(savedInfo);
          this.tournamentInfo = {
            name: parsed.name || '',
            date: parsed.date || '',
            time: parsed.time || '',
            location: parsed.location || '',
            entry_fee: parsed.entryFee || parsed.entry_fee || '',
            prize_pool: parsed.prizePool || parsed.prize_pool || '',
            description: parsed.description || ''
          };
        }
      }
    },
      formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(this.currentLocale === 'ka' ? 'ka-GE' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      },
      openMapLocation() {
        if (this.tournamentInfo.location) {
          const location = encodeURIComponent(this.tournamentInfo.location);
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location}`;
          window.open(mapsUrl, '_blank');
        }
      }
  },
  mounted() {
    this.loadSettings();
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #333;
}

/* Header */
.header {
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  text-align: center;
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.language-button:active {
  transform: translateY(0);
}

.admin-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.admin-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.logo {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tagline {
  font-size: 0.95rem;
  opacity: 0.9;
  letter-spacing: 0.5px;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}

/* Form Section */
.form-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.form-section h2 {
  font-size: 1.8rem;
  color: #0f3460;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.reservation-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #0f3460;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.btn {
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233, 30, 99, 0.4);
}

.btn-secondary {
  background: #f5f5f5;
  color: #0f3460;
  border: 2px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #efefef;
  border-color: #c0c0c0;
}

/* Info Box */
.info-box {
  background: #f9f9f9;
  border-left: 4px solid #e91e63;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.info-box h3 {
  color: #0f3460;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info-list {
  list-style: none;
}

.info-list li {
  padding: 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
  border-bottom: 1px solid #e0e0e0;
}

.info-list li:last-child {
  border-bottom: none;
}

.tournament-description {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e91e63;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
}

.tournament-description p {
  margin: 0;
}

/* Tournament Info in Result Card */
.tournament-info-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #0f3460;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-title {
  color: #0f3460;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #e91e63;
  text-align: center;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem;
  background: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.info-item:hover {
  transform: translateX(4px);
  border-left-color: #e91e63;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-item.highlight {
  background: linear-gradient(135deg, #e91e63 0%, #f06292 100%);
  color: white;
  font-weight: 700;
  border-left: 3px solid #c2185b;
}

.info-item.highlight .info-label,
.info-item.highlight .info-value {
  color: white;
}

.info-icon {
  font-size: 1.5rem;
  min-width: 30px;
  text-align: center;
  line-height: 1;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  color: #666;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #0f3460;
  font-weight: 700;
  font-size: 0.95rem;
}

.info-item.highlight .info-icon {
  color: white;
}

.tournament-description-result {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e91e63;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: center;
  font-style: italic;
}

.tournament-description-result p {
  margin: 0;
}

/* Location Clickable Style */
.location-clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.location-clickable:hover {
  background: rgba(233, 30, 99, 0.1) !important;
  border-left-color: #e91e63 !important;
  transform: translateX(8px) !important;
}

.location-clickable:active {
  transform: translateX(6px) scale(0.98) !important;
}

.location-clickable .info-value {
  text-decoration: underline;
  text-decoration-style: dotted;
}

/* Result Section */
.result-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: #999;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Tournament Info Display in Right Panel */
.tournament-info-display {
  width: 100%;
  animation: slideIn 0.4s ease;
  overflow-y: auto;
  max-height: 90vh;
  padding: 1rem;
}

.result-card {
  width: 100%;
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.status-icon {
  font-size: 1.8rem;
}

.status-header h3 {
  font-size: 1.5rem;
}

.result-card.success .status-header {
  border-bottom-color: #4caf50;
}

.result-card.success .status-icon {
  color: #4caf50;
}

.result-card.success .status-header h3 {
  color: #4caf50;
}

.result-card.waiting .status-header {
  border-bottom-color: #ff9800;
}

.result-card.waiting .status-icon {
  color: #ff9800;
}

.result-card.waiting .status-header h3 {
  color: #ff9800;
}

.result-card.error .status-header {
  border-bottom-color: #f44336;
}

.result-card.error .status-icon {
  color: #f44336;
}

.result-card.error .status-header h3 {
  color: #f44336;
}

.confirmation-text {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.error-message {
  color: #d32f2f;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #ffebee;
  border-radius: 6px;
}

.seat-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.seat-item {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.seat-item .label {
  display: block;
  color: #999;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.seat-item .value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #0f3460;
}

.qr-section {
  background: #fafafa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.qr-label {
  color: #0f3460;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.qr-placeholder {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.7;
}

.qr-text {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.qr-link {
  display: inline-block;
  color: #e91e63;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid #e91e63;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.qr-link:hover {
  background: #e91e63;
  color: white;
}

.waiting-badge {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 2rem auto;
  width: 150px;
  height: 150px;
}

.waiting-number {
  font-size: 2.5rem;
  font-weight: 700;
}

.waiting-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.waiting-message {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #fff3e0;
  border-radius: 6px;
  border-left: 4px solid #ff9800;
}

.confirmation-details {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.confirmation-details p {
  margin-bottom: 0.5rem;
  color: #555;
}

.confirmation-details p:last-child {
  margin-bottom: 0;
}

/* Footer */
.footer {
  background: #0f3460;
  color: white;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
