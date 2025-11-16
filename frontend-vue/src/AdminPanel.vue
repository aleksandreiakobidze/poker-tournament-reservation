<template>
  <div class="admin-container">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="login-screen">
      <div class="login-card">
        <h1 class="login-title">{{ $t('login.title') }}</h1>
        <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
        
        <div class="login-language-selector">
          <button @click="toggleLanguage" class="language-button-small" :title="currentLocale === 'en' ? 'Switch to Georgian' : 'Switch to English'">
            🌐 {{ currentLocale === 'en' ? 'ქართული' : 'English' }}
          </button>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">{{ $t('login.username') }}</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              :placeholder="$t('login.enterUsername')"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">{{ $t('login.password') }}</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              :placeholder="$t('login.enterPassword')"
              class="form-input"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary">{{ $t('login.login') }}</button>
          <p v-if="loginError" class="login-error">{{ $t('login.error') }}</p>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="admin-dashboard">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-left">
          <h1>♠️ Kings Club Admin Panel</h1>
          <p class="user-info">Logged in as: <strong>{{ currentUser }}</strong></p>
        </div>
        <div class="header-right">
          <button @click="toggleLanguage" class="language-button-small" :title="currentLocale === 'en' ? 'Switch to Georgian' : 'Switch to English'">
            🌐 {{ currentLocale === 'en' ? 'ქართული' : 'English' }}
          </button>
          <button @click="handleLogout" class="btn btn-secondary">{{ $t('login.logout') }}</button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="admin-main">
        <!-- Tabs Navigation -->
        <nav class="tabs-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
          >
            {{ tab.label }}
          </button>
        </nav>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Dashboard Tab -->
          <section v-if="activeTab === 'dashboard'" class="tab-panel">
            <h2>{{ $t('dashboard.overview') }}</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-value">{{ reservations.filter(r => r.status === 'reserved').length }}</div>
                <div class="stat-label">{{ $t('dashboard.reserved') }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">⏳</div>
                <div class="stat-value">{{ reservations.filter(r => r.status === 'waiting').length }}</div>
                <div class="stat-label">{{ $t('dashboard.waiting') }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">✓</div>
                <div class="stat-value">{{ reservations.filter(r => r.status === 'checked_in').length }}</div>
                <div class="stat-label">{{ $t('dashboard.checked_in') }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-value">{{ (reservations.filter(r => r.status === 'reserved').length / totalCapacity * 100).toFixed(0) }}%</div>
                <div class="stat-label">{{ $t('dashboard.capacity') }}</div>
              </div>
            </div>

            <div class="dashboard-grid">
              <div class="dashboard-card">
                <h3>{{ $t('dashboard.details') }}</h3>
                <ul class="detail-list">
                  <li><strong>{{ $t('dashboard.total_tables') }}:</strong> {{ settings.table_quantity }}</li>
                  <li><strong>{{ $t('dashboard.seats_per_table') }}:</strong> {{ settings.seat_quantity }}</li>
                  <li><strong>{{ $t('dashboard.total_capacity') }}:</strong> {{ totalCapacity }}</li>
                  <li><strong>{{ $t('dashboard.seats_remaining') }}:</strong> {{ totalCapacity - reservations.filter(r => r.status === 'reserved').length }}</li>
                </ul>
              </div>

              <div class="dashboard-card">
                <h3>{{ $t('dashboard.quick_actions') }}</h3>
                <button @click="exportToCSV" class="btn btn-small">📥 {{ $t('dashboard.export_csv') }}</button>
                <button @click="resetTournament" class="btn btn-small btn-danger">🔄 {{ $t('dashboard.reset') }}</button>
              </div>
            </div>
          </section>

          <!-- Reservations Tab -->
          <section v-if="activeTab === 'reservations'" class="tab-panel">
            <h2>All Reservations ({{ reservations.length }})</h2>
            
            <!-- Statistics Cards -->
            <div class="reservations-stats-grid">
              <div class="stat-card-mini stat-reserved">
                <span class="stat-icon-mini">🎫</span>
                <div class="stat-info-mini">
                  <span class="stat-value-mini">{{ reservations.filter(r => r.status === 'reserved').length }}</span>
                  <span class="stat-label-mini">Reserved</span>
                </div>
              </div>
              <div class="stat-card-mini stat-checked-in">
                <span class="stat-icon-mini">✅</span>
                <div class="stat-info-mini">
                  <span class="stat-value-mini">{{ reservations.filter(r => r.status === 'checked_in').length }}</span>
                  <span class="stat-label-mini">Checked In</span>
                </div>
              </div>
              <div class="stat-card-mini stat-waiting">
                <span class="stat-icon-mini">⏳</span>
                <div class="stat-info-mini">
                  <span class="stat-value-mini">{{ reservations.filter(r => r.status === 'waiting').length }}</span>
                  <span class="stat-label-mini">Waiting</span>
                </div>
              </div>
              <div class="stat-card-mini stat-missing">
                <span class="stat-icon-mini">❌</span>
                <div class="stat-info-mini">
                  <span class="stat-value-mini">{{ reservations.filter(r => r.status === 'missing').length }}</span>
                  <span class="stat-label-mini">Missing</span>
                </div>
              </div>
            </div>
            
            <div class="search-box">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="🔍 Search by name, phone, email, table..."
                class="search-input"
              />
              <select v-model="filterStatus" class="filter-select">
                <option value="">All Statuses</option>
                <option value="reserved">Reserved</option>
                <option value="waiting">Waiting</option>
                <option value="checked_in">Checked In</option>
                <option value="missing">Missing</option>
              </select>
            </div>

            <div class="table-wrapper">
              <table class="admin-table admin-table-wide">
                <thead>
                  <tr>
                    <th style="width: 40px">#</th>
                    <th style="width: 180px">Full Name</th>
                    <th style="width: 130px">Phone</th>
                    <th style="width: 180px">Email</th>
                    <th style="width: 140px">Status</th>
                    <th style="width: 160px">Location</th>
                    <th style="width: 150px">Tournament</th>
                    <th style="width: 150px">Reserved</th>
                    <th style="width: 150px">Check-in</th>
                    <th style="width: 140px">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(res, index) in filteredReservations" :key="res.phone" :class="['table-row', 'row-' + res.status]">
                    <td style="text-align: center; color: #95a5a6; font-weight: 600;">{{ index + 1 }}</td>
                    <td>
                      <div style="display: flex; flex-direction: column;">
                        <strong style="color: #2c3e50;">{{ res.first_name }} {{ res.last_name }}</strong>
                        <small style="color: #95a5a6; font-size: 0.75rem;">ID: {{ res.id ? res.id.substring(0, 8) : '—' }}</small>
                      </div>
                    </td>
                    <td><span style="font-family: monospace; color: #3498db; font-weight: 500;">📞 {{ res.phone }}</span></td>
                    <td style="font-size: 0.85rem;">{{ res.email || '—' }}</td>
                    <td>
                      <span :class="['status-badge', 'badge-' + res.status]" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.85rem;">
                        <span v-if="res.status === 'reserved'">🎫 Reserved</span>
                        <span v-else-if="res.status === 'checked_in'">✅ Checked In</span>
                        <span v-else-if="res.status === 'waiting'">⏳ Waiting</span>
                        <span v-else-if="res.status === 'missing'">❌ Missing</span>
                        <span v-else>{{ res.status }}</span>
                      </span>
                    </td>
                    <td>
                      <span v-if="res.table_number && res.seat_number" style="display: inline-block; padding: 6px 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 6px; font-weight: 600; font-size: 0.85rem;">
                        <strong>Table {{ res.table_number }}</strong>, Seat {{ res.seat_number }}
                      </span>
                      <span v-else-if="res.waiting_position" style="display: inline-block; padding: 6px 12px; background: #ff9800; color: white; border-radius: 6px; font-weight: 600; font-size: 0.85rem;">
                        Waiting #{{ res.waiting_position }}
                      </span>
                      <span v-else style="color: #95a5a6;">—</span>
                    </td>
                    <td>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; color: #2c3e50; font-size: 0.9rem;">{{ tournamentInfo.name || 'Kings Club' }}</span>
                        <small style="color: #95a5a6; font-size: 0.75rem;">{{ tournamentInfo.date || '—' }}</small>
                      </div>
                    </td>
                    <td style="font-size: 0.85rem; color: #34495e;">{{ formatReservationDate(res.created_at || res.timestamp) }}</td>
                    <td style="font-size: 0.85rem; color: #34495e;">
                      <span v-if="res.checkin_time">{{ formatReservationDate(res.checkin_time) }}</span>
                      <span v-else style="color: #95a5a6;">—</span>
                    </td>
                    <td>
                      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        <button
                          v-if="res.status === 'reserved'"
                          @click="markCheckedIn(res.phone)"
                          class="btn btn-tiny"
                          style="min-width: 36px;"
                          title="Check in"
                        >
                          ✓
                        </button>
                        <button
                          v-if="res.status === 'reserved' || res.status === 'checked_in'"
                          @click="markMissing(res.phone)"
                          class="btn btn-tiny btn-warning"
                          style="min-width: 36px;"
                          title="Mark missing"
                        >
                          ⚠
                        </button>
                        <button
                          @click="removeReservation(res.phone)"
                          class="btn btn-tiny btn-danger"
                          style="min-width: 36px;"
                          title="Remove"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="filteredReservations.length === 0" class="no-data">
              <span style="font-size: 2rem;">🔍</span><br>
              <span>No reservations found</span>
            </p>
          </section>

          <!-- Tables Tab -->
          <section v-if="activeTab === 'tables'" class="tab-panel">
            <h2>Tournament Seating Layout</h2>
            <p class="section-description">{{ settings.table_quantity }} Tables × {{ settings.seat_quantity }} Seats = {{ totalCapacity }} Total Capacity</p>
            
            <div class="tables-container">
              <div v-for="table in settings.table_quantity" :key="table" class="table-card-new">
                <div class="table-header">
                  <h3>🎰 Table {{ table }}</h3>
                  <span class="occupancy-badge">
                    {{ reservations.filter(r => r.table_number === table && r.status !== 'waiting').length }}/{{ settings.seat_quantity }}
                  </span>
                </div>
                <div class="seats-grid-new">
                  <div
                    v-for="seat in settings.seat_quantity"
                    :key="`${table}-${seat}`"
                    :class="['seat-new', getSeatingStatus(table, seat)]"
                    :title="getSeatingName(table, seat) || 'Empty seat'"
                  >
                    <div class="seat-content">
                      <span class="seat-number-new">{{ seat }}</span>
                      <span v-if="getSeatingName(table, seat)" class="seat-player-name">
                        {{ getSeatingName(table, seat) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="seat-legend-new">
              <div class="legend-header">Legend:</div>
              <div class="legend-items">
                <div class="legend-item-new">
                  <div class="legend-color empty"></div>
                  <span>Empty Seat</span>
                </div>
                <div class="legend-item-new">
                  <div class="legend-color reserved" style="background: linear-gradient(135deg, #e53935 0%, #b71c1c 100%); border-color: #b71c1c;"></div>
                  <span>Reserved (Not Checked In)</span>
                </div>
                <div class="legend-item-new">
                  <div class="legend-color occupied"></div>
                  <span>Checked In (Seated)</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Waiting List Tab -->
          <section v-if="activeTab === 'waiting'" class="tab-panel">
            <h2>Waiting List ({{ waitingList.length }})</h2>
            
            <div v-if="waitingList.length > 0" class="waiting-list">
              <div v-for="(person, index) in waitingList" :key="person.phone" class="waiting-item">
                <div class="waiting-number">#{{ index + 1 }}</div>
                <div class="waiting-info">
                  <div class="waiting-name">{{ person.name }}</div>
                  <div class="waiting-phone">📞 {{ person.phone }}</div>
                  <div v-if="person.email" class="waiting-email">✉️ {{ person.email }}</div>
                  <div class="waiting-time">
                    <small style="color: #95a5a6;">Registered: {{ formatReservationDate(person.created_at || person.timestamp) }}</small>
                  </div>
                </div>
                <div class="waiting-actions">
                  <button 
                    @click="promoteFromWaiting(person.phone)" 
                    class="btn btn-primary btn-small"
                    title="Promote to available seat"
                  >
                    ✓ Promote
                  </button>
                  <button 
                    @click="removeReservation(person.phone)" 
                    class="btn btn-danger btn-small"
                    title="Remove from waiting list"
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="no-data">
              <span style="font-size: 2rem;">⏳</span><br>
              <span>Waiting list is empty</span>
            </p>
          </section>

          <!-- Settings Tab -->
          <section v-if="activeTab === 'settings'" class="tab-panel">
            <h2>{{ $t('settings.title') }}</h2>
            
            <!-- Tournament Information Section -->
            <div class="settings-card tournament-info-card">
              <h3>{{ $t('settings.tournamentInfo') }}</h3>
              
              <div class="settings-grid">
                <div class="form-group">
                  <label>{{ $t('settings.tournamentName') }}</label>
                  <input
                    v-model="tournamentInfo.name"
                    type="text"
                    class="form-input"
                    placeholder="Kings Club Poker Championship"
                  />
                </div>
                
                <div class="form-group">
                  <label>{{ $t('settings.tournamentDate') }}</label>
                  <input
                    v-model="tournamentInfo.date"
                    type="date"
                    class="form-input"
                  />
                </div>
                
                <div class="form-group">
                  <label>{{ $t('settings.tournamentTime') }}</label>
                  <input
                    v-model="tournamentInfo.time"
                    type="time"
                    class="form-input"
                  />
                </div>
                
                <div class="form-group location-group">
                  <label>{{ $t('settings.location') }}</label>
                  <input
                    v-model="tournamentInfo.location"
                    type="text"
                    class="form-input"
                    placeholder="5 გიორგი ტოვსტონოგოვის ქუჩა"
                  />
                  <div v-if="tournamentInfo.location" class="location-map">
                    <iframe
                      width="100%"
                      height="300"
                      frameborder="0"
                      style="border:0; border-radius: 8px;"
                      :src="getMapUrl()"
                      allowfullscreen
                    ></iframe>
                    <div class="map-link">
                      <a :href="getDirectionsUrl()" target="_blank" class="btn btn-small">
                        📍 {{ $t('settings.openInMaps') }}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>{{ $t('settings.entryFee') }}</label>
                  <input
                    v-model="tournamentInfo.entry_fee"
                    type="text"
                    class="form-input"
                    placeholder="100 GEL"
                  />
                </div>
                
                <div class="form-group">
                  <label>{{ $t('settings.prizePool') }}</label>
                  <input
                    v-model="tournamentInfo.prize_pool"
                    type="text"
                    class="form-input"
                    placeholder="5000 GEL"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label>{{ $t('settings.description') }}</label>
                <textarea
                  v-model="tournamentInfo.description"
                  class="form-input form-textarea"
                  rows="4"
                  placeholder="Tournament rules and additional information..."
                ></textarea>
              </div>
              
              <button @click="saveTournamentInfo" class="btn btn-primary">{{ $t('settings.saveInfo') }}</button>
            </div>
            
            <!-- Table Settings Section -->
            <div class="settings-container">
              <div class="settings-card">
                <h3>{{ $t('settings.tableSettings') }}</h3>
                <p class="settings-info">Modify the number of tables and seats per table. Changes will affect all reservations and seating.</p>
                
                <div class="settings-grid">
                  <div class="setting-item">
                    <label for="tableQty">Number of Tables:</label>
                    <div class="input-group">
                      <button @click="tempSettings.table_quantity = Math.max(1, tempSettings.table_quantity - 1)" class="btn-adjust">−</button>
                      <input
                        id="tableQty"
                        v-model.number="tempSettings.table_quantity"
                        type="number"
                        min="1"
                        max="20"
                        class="form-input input-number"
                      />
                      <button @click="tempSettings.table_quantity = Math.min(20, tempSettings.table_quantity + 1)" class="btn-adjust">+</button>
                    </div>
                  </div>

                  <div class="setting-item">
                    <label for="seatQty">Seats per Table:</label>
                    <div class="input-group">
                      <button @click="tempSettings.seat_quantity = Math.max(1, tempSettings.seat_quantity - 1)" class="btn-adjust">−</button>
                      <input
                        id="seatQty"
                        v-model.number="tempSettings.seat_quantity"
                        type="number"
                        min="1"
                        max="20"
                        class="form-input input-number"
                      />
                      <button @click="tempSettings.seat_quantity = Math.min(20, tempSettings.seat_quantity + 1)" class="btn-adjust">+</button>
                    </div>
                  </div>
                </div>

                <div class="capacity-display">
                  <div class="capacity-info">
                    <span class="label">New Capacity:</span>
                    <span class="value">{{ tempSettings.table_quantity * tempSettings.seat_quantity }} seats</span>
                  </div>
                  <div class="capacity-current">
                    <span class="label">Current Setting:</span>
                    <span class="value">{{ settings.table_quantity }} × {{ settings.seat_quantity }} = {{ totalCapacity }} seats</span>
                  </div>
                </div>

                <div class="settings-buttons">
                  <button @click="applySettings" class="btn btn-primary">{{ $t('settings.apply') }}</button>
                  <button @click="cancelSettings" class="btn btn-secondary">Cancel</button>
                </div>

                <div v-if="tempSettings.table_quantity !== settings.table_quantity || tempSettings.seat_quantity !== settings.seat_quantity" class="warning-banner">
                  <strong>⚠️ Warning:</strong> Changing settings will reset all current reservations. Make sure to export data first!
                </div>
              </div>

              <div class="settings-card info-card">
                <h3>📊 Current Tournament Stats</h3>
                <div class="stats-list">
                  <div class="stat-row">
                    <span>Reserved Seats:</span>
                    <strong>{{ reservations.filter(r => r.status === 'reserved').length }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Checked In:</span>
                    <strong>{{ reservations.filter(r => r.status === 'checked_in').length }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Waiting List:</span>
                    <strong>{{ reservations.filter(r => r.status === 'waiting').length }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Total Reservations:</span>
                    <strong>{{ reservations.length }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { setLocale, getLocale } from './i18n';
import { reservationAPI, settingsAPI, tournamentAPI } from './api';

export default {
  data() {
    return {
      isAuthenticated: false,
      currentUser: '',
      loginForm: { username: '', password: '' },
      loginError: '',
      activeTab: 'dashboard',
      currentLocale: getLocale(),
      tabs: [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'reservations', label: '📋 Reservations' },
        { id: 'tables', label: '🎰 Tables' },
        { id: 'waiting', label: '⏳ Waiting List' },
        { id: 'settings', label: '⚙️ Settings' }
      ],
      reservations: [],
      searchQuery: '',
      filterStatus: '',
      settings: {
        table_quantity: 6,
        seat_quantity: 9
      },
      totalCapacity: 54,
      tempSettings: {
        table_quantity: 6,
        seat_quantity: 9
      },
      tournamentInfo: {
        name: 'Kings Club Poker Tournament',
        date: '2025-11-20',
        time: '20:00',
        location: '5 გიორგი ტოვსტონოგოვის ქუჩა, Tbilisi',
        entry_fee: '100 GEL',
        prize_pool: '5000 GEL',
        description: 'Join us for an exciting poker tournament with professional dealers and premium tables. Registration starts 30 minutes before the game.'
      }
    }
  },
  computed: {
    filteredReservations() {
      return this.reservations.filter(r => {
        const matchesSearch = !this.searchQuery || 
          r.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          r.phone.includes(this.searchQuery);
        const matchesStatus = !this.filterStatus || r.status === this.filterStatus;
        return matchesSearch && matchesStatus;
      });
    },
    waitingList() {
      return this.reservations
        .filter(r => r.status === 'waiting')
        .sort((a, b) => a.waiting_position - b.waiting_position);
    }
  },
  methods: {
    toggleLanguage() {
      this.currentLocale = this.currentLocale === 'en' ? 'ka' : 'en';
      setLocale(this.currentLocale);
    },
    handleLogin() {
      if (this.loginForm.username === 'admin' && this.loginForm.password === 'king') {
        this.isAuthenticated = true;
        this.currentUser = this.loginForm.username;
        this.loginError = '';
        this.loadReservations();
      } else {
        this.loginError = this.$t('login.error');
      }
    },
    handleLogout() {
      this.isAuthenticated = false;
      this.currentUser = '';
      this.loginForm = { username: '', password: '' };
      this.reservations = [];
    },
    async loadReservations() {
      try {
        const response = await reservationAPI.getAll();
        if (response && response.reservations) {
          this.reservations = response.reservations;
        }
      } catch (error) {
        console.warn('API not available, loading from localStorage:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('kingClubReservations');
        if (stored) {
          this.reservations = JSON.parse(stored);
        }
      }
    },
    async saveReservations() {
      // Data is saved via API, just keep localStorage as backup
      localStorage.setItem('kingClubReservations', JSON.stringify(this.reservations));
    },
    getSeatingStatus(table, seat) {
      const reservation = this.reservations.find(
        r => r.table_number === table && r.seat_number === seat && r.status !== 'waiting'
      );
      if (!reservation) return 'empty';
      // Return status based on reservation state
      if (reservation.status === 'checked_in') return 'occupied'; // Green - seated
      if (reservation.status === 'reserved') return 'reserved'; // Red - reserved but not checked in
      return 'empty';
    },
    getSeatingName(table, seat) {
      const reservation = this.reservations.find(
        r => r.table_number === table && r.seat_number === seat && r.status !== 'waiting'
      );
      return reservation ? reservation.name : '';
    },
    async markCheckedIn(phone) {
      try {
        await reservationAPI.checkin(phone);
        // Reload to get updated data
        await this.loadReservations();
      } catch (error) {
        console.error('Error checking in:', error);
        alert('Check-in failed: ' + error.message);
      }
    },
    async removeReservation(phone) {
      const reservation = this.reservations.find(r => r.phone === phone);
      if (reservation && confirm(`Are you sure you want to remove ${reservation.name}'s reservation?`)) {
        try {
          await reservationAPI.delete(phone);
          // Reload to get updated data
          await this.loadReservations();
          alert('Reservation removed successfully');
        } catch (error) {
          console.error('Error deleting reservation:', error);
          alert('Delete failed: ' + error.message);
        }
      }
    },
    async markMissing(phone) {
      const reservation = this.reservations.find(r => r.phone === phone);
      if (reservation && (reservation.status === 'reserved' || reservation.status === 'checked_in')) {
        try {
          await reservationAPI.markMissing(phone);
          // Reload to get updated data
          await this.loadReservations();
          alert(`${reservation.name} marked as Missing and seat cleared.`);
        } catch (error) {
          console.error('Error marking missing:', error);
          alert('Mark missing failed: ' + error.message);
        }
      }
    },
    async promoteFromWaiting(phone) {
      const reservation = this.reservations.find(r => r.phone === phone);
      if (reservation && reservation.status === 'waiting') {
        try {
          const response = await reservationAPI.promote(phone);
          // Reload to get updated data
          await this.loadReservations();
          alert(`${reservation.name} promoted to Table ${response.table}, Seat ${response.seat} and checked in`);
        } catch (error) {
          console.error('Error promoting:', error);
          alert('Promote failed: ' + error.message);
        }
      }
    },
    findRandomSeat() {
      // Get all available seats
      const availableSeats = [];
      for (let t = 1; t <= this.settings.table_quantity; t++) {
        for (let s = 1; s <= this.settings.seat_quantity; s++) {
          if (!this.reservations.some(r => r.table_number === t && r.seat_number === s && r.status !== 'waiting')) {
            availableSeats.push({ table: t, seat: s });
          }
        }
      }
      
      // Return a random available seat
      if (availableSeats.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        return availableSeats[randomIndex];
      }
      
      // No seats available
      return null;
    },
    exportToCSV() {
      let csv = 'Name,Phone,Email,Status,Table,Seat,Check-in Time\n';
      this.reservations.forEach(r => {
        csv += `"${r.name}","${r.phone}","${r.email || ''}","${r.status}","${r.table_number || ''}","${r.seat_number || ''}","${r.checkin_time || ''}"\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kings-club-reservations-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    async resetTournament() {
      if (confirm('⚠️ Are you sure you want to reset the entire tournament? This will permanently delete all reservations and cannot be undone.')) {
        try {
          // Delete all reservations via API
          await reservationAPI.deleteAll();
          
          // Reload reservations (should be empty now)
          await this.loadReservations();
          
          alert('✅ Tournament has been reset successfully. All reservations have been deleted.');
        } catch (error) {
          console.error('Error resetting tournament:', error);
          alert('❌ Failed to reset tournament: ' + error.message);
        }
      }
    },
    async applySettings() {
      const newCapacity = this.tempSettings.table_quantity * this.tempSettings.seat_quantity;
      const oldCapacity = this.settings.table_quantity * this.settings.seat_quantity;
      
      if (newCapacity < oldCapacity) {
        if (!confirm(`⚠️ Reducing capacity from ${oldCapacity} to ${newCapacity} seats may affect existing reservations. Continue?`)) {
          return;
        }
      }
      
      if (this.tempSettings.table_quantity !== this.settings.table_quantity || this.tempSettings.seat_quantity !== this.settings.seat_quantity) {
        try {
          // Save to backend API
          await settingsAPI.update({
            table_quantity: this.tempSettings.table_quantity,
            seat_quantity: this.tempSettings.seat_quantity
          });
          
          // Update local state
          this.settings.table_quantity = this.tempSettings.table_quantity;
          this.settings.seat_quantity = this.tempSettings.seat_quantity;
          this.totalCapacity = newCapacity;
          
          // Also save to localStorage as backup
          localStorage.setItem('tournament_settings', JSON.stringify(this.settings));
          
          alert(`✅ Settings updated successfully! New capacity: ${newCapacity} seats`);
        } catch (error) {
          console.error('Error saving settings:', error);
          alert('❌ Failed to save settings: ' + error.message);
        }
      }
    },
    cancelSettings() {
      this.tempSettings.table_quantity = this.settings.table_quantity;
      this.tempSettings.seat_quantity = this.settings.seat_quantity;
    },
    async loadSettings() {
      try {
        const settings = await settingsAPI.get();
        if (settings) {
          this.settings = settings;
          this.totalCapacity = settings.table_quantity * settings.seat_quantity;
        }
      } catch (error) {
        console.warn('API not available, loading from localStorage:', error);
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
      this.tempSettings = { ...this.settings };
      
      try {
        const info = await tournamentAPI.get();
        if (info) {
          this.tournamentInfo = info;
        }
      } catch (error) {
        console.warn('API not available, loading from localStorage:', error);
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
    async saveTournamentInfo() {
      try {
        await tournamentAPI.update(this.tournamentInfo);
        // Also save to localStorage as backup
        localStorage.setItem('tournament_info', JSON.stringify(this.tournamentInfo));
        alert('Tournament information saved successfully!');
      } catch (error) {
        console.error('Error saving tournament info:', error);
        alert('Failed to save tournament info: ' + error.message);
      }
    },
    getMapUrl() {
      const location = encodeURIComponent(this.tournamentInfo.location || '5 გიორგი ტოვსტონოგოვის ქუჩა, Tbilisi');
      return `https://maps.google.com/maps?q=${location}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    },
    getDirectionsUrl() {
      const location = encodeURIComponent(this.tournamentInfo.location || '5 გიორგი ტოვსტონოგოვის ქუჩა, Tbilisi');
      return `https://www.google.com/maps/search/?api=1&query=${location}`;
    },
    formatReservationDate(timestamp) {
      if (!timestamp) return '-';
      const date = new Date(timestamp);
      return date.toLocaleString(this.currentLocale === 'ka' ? 'ka-GE' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    recalculateWaitingPositions() {
      // Get all waiting list reservations sorted by current position
      const waitingList = this.reservations
        .filter(r => r.status === 'waiting')
        .sort((a, b) => (a.waiting_position || 999) - (b.waiting_position || 999));
      
      // Renumber them sequentially 1, 2, 3, 4...
      waitingList.forEach((reservation, index) => {
        reservation.waiting_position = index + 1;
      });
    },
  },
  mounted() {
    this.loadSettings();
    this.loadReservations();
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-container {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Login Screen */
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 2rem;
  color: #0f3460;
  margin-bottom: 0.5rem;
  text-align: center;
}

.login-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #0f3460;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  color: white;
}

.btn-primary:hover {
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
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-tiny {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-danger {
  background: #f44336;
  color: white;
  border: none;
}

.btn-danger:hover {
  background: #d32f2f;
}

.btn-warning {
  background: #ff9800;
  color: white;
  border: none;
}

.btn-warning:hover {
  background: #f57c00;
}

.status-badge.missing {
  background: #ff9800;
  color: white;
}

.btn-danger:hover {
  background: #d32f2f;
}

.login-error {
  color: #f44336;
  text-align: center;
  margin-top: 1rem;
}

/* Admin Dashboard */
.admin-dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-header {
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language-button-small {
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

.language-button-small:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.language-button-small:active {
  transform: translateY(0);
}

.login-language-selector {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.login-language-selector .language-button-small {
  background: rgba(15, 52, 96, 0.1);
  color: #0f3460;
  border: 2px solid rgba(15, 52, 96, 0.3);
}

.login-language-selector .language-button-small:hover {
  background: rgba(15, 52, 96, 0.15);
  border-color: rgba(15, 52, 96, 0.5);
}

.header-left h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.user-info {
  font-size: 0.9rem;
  opacity: 0.9;
}

.admin-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.tabs-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  flex-wrap: wrap;
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #999;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-button:hover {
  color: #0f3460;
}

.tab-button.active {
  color: #e91e63;
  border-bottom-color: #e91e63;
}

.tab-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tab-panel h2 {
  color: #0f3460;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

/* Dashboard Tab */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #e91e63;
}

.dashboard-card h3 {
  color: #0f3460;
  margin-bottom: 1rem;
}

.detail-list {
  list-style: none;
}

.detail-list li {
  padding: 0.5rem 0;
  color: #555;
  border-bottom: 1px solid #e0e0e0;
}

.detail-list li:last-child {
  border-bottom: none;
}

/* Reservations Tab */
.search-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input,
.filter-select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input {
  flex: 1;
}

.filter-select {
  min-width: 150px;
}

.table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.admin-table thead {
  background: #f9f9f9;
}

.admin-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #0f3460;
  border-bottom: 2px solid #e0e0e0;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.tournament-name-cell {
  font-weight: 600;
  color: #0f3460;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.date-cell {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
}

.table-row:hover {
  background: #fafafa;
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.reserved {
  background: #ffcdd2;
  color: #c62828;
}

.status-badge.waiting {
  background: #ffe0b2;
  color: #e65100;
}

.status-badge.checked_in {
  background: #c8e6c9;
  color: #2e7d32;
}

/* Tables Tab */
.section-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.tables-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.table-card-new {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #e91e63;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.table-card-new:hover {
  box-shadow: 0 8px 24px rgba(233, 30, 99, 0.15);
  transform: translateY(-2px);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e91e63;
}

.table-card-new h3 {
  color: #0f3460;
  margin: 0;
  font-size: 1.2rem;
}

.occupancy-badge {
  background: #e91e63;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.seats-grid-new {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
}

.seat-new {
  aspect-ratio: 1 / 1.1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.seat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  text-align: center;
}

.seat-new.empty {
  background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
  color: #999;
  border-color: #d0d0d0;
}

.seat-new.empty:hover {
  background: linear-gradient(135deg, #d0d0d0 0%, #b8b8b8 100%);
  border-color: #999;
}

.seat-new.reserved {
  background: linear-gradient(135deg, #e53935 0%, #b71c1c 100%);
  color: white;
  border-color: #b71c1c;
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.3);
}

.seat-new.reserved:hover {
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.5);
  transform: scale(1.05);
}

.seat-new.occupied {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  border-color: #2e7d32;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.seat-new.occupied:hover {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
  transform: scale(1.05);
}

.seat-new.checked-in {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  border-color: #2e7d32;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.seat-new.checked-in:hover {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
  transform: scale(1.05);
}

.seat-number-new {
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.8;
}

.seat-player-name {
  font-size: 0.65rem;
  margin-top: 0.3rem;
  font-weight: 600;
  word-break: break-word;
  line-height: 1.2;
  max-width: 100%;
}

.seat-legend-new {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #e91e63;
}

.legend-header {
  color: #0f3460;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.legend-item-new {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.legend-item-new span {
  color: #555;
  font-size: 0.95rem;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid #ccc;
}

.legend-color.empty {
  background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
  border-color: #b8b8b8;
}

.legend-color.occupied {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border-color: #2e7d32;
}

/* Waiting List Tab */
.waiting-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.waiting-item {
  background: #fff3e0;
  padding: 1.25rem;
  border-radius: 10px;
  border-left: 4px solid #ff9800;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.waiting-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background: #ffe0b2;
}

.waiting-number {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(255, 152, 0, 0.3);
}

.waiting-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.waiting-name {
  font-weight: 600;
  color: #0f3460;
  font-size: 1.05rem;
}

.waiting-phone {
  font-size: 0.9rem;
  color: #555;
  font-family: monospace;
}

.waiting-email {
  font-size: 0.85rem;
  color: #666;
}

.waiting-time {
  margin-top: 0.25rem;
}

.waiting-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}


.no-data {
  text-align: center;
  color: #999;
  padding: 2rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .tabs-nav {
    overflow-x: auto;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .tables-grid {
    grid-template-columns: 1fr;
  }

  .admin-table {
    font-size: 0.9rem;
  }

  .admin-table th,
  .admin-table td {
    padding: 0.5rem;
  }
}

/* Settings Tab */
.settings-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.tournament-info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 2px solid #0f3460;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.tournament-info-card h3 {
  color: #0f3460;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  border-bottom: 2px solid #e91e63;
  padding-bottom: 0.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
}

.location-group {
  grid-column: 1 / -1;
}

.location-map {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.location-map iframe {
  display: block;
  width: 100%;
}

.map-link {
  margin-top: 0.5rem;
  text-align: center;
}

.map-link .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 2px solid #e91e63;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.settings-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.settings-info {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.setting-item label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-adjust {
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  color: #333;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-adjust:hover {
  background: #e91e63;
  color: white;
  border-color: #e91e63;
}

.input-number {
  flex: 1;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
}

.capacity-display {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #e91e63;
}

.capacity-info,
.capacity-current {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
}

.capacity-info .label,
.capacity-current .label {
  font-weight: 600;
  color: #555;
}

.capacity-info .value,
.capacity-current .value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #e91e63;
}

.settings-buttons {
  display: flex;
  gap: 1rem;
}

.settings-buttons .btn {
  flex: 1;
  padding: 0.8rem;
}

.warning-banner {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
  color: #856404;
  font-size: 0.95rem;
}

.info-card {
  border-color: #4caf50;
}

.info-card h3 {
  color: #2e7d32;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid #4caf50;
}

.stat-row span {
  font-weight: 600;
  color: #666;
}

.stat-row strong {
  font-size: 1.3rem;
  color: #2e7d32;
}

@media (max-width: 1024px) {
  .settings-container {
    grid-template-columns: 1fr;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
