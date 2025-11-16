import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    app: {
      logo: '♠️ Kings Club',
      tagline: 'Premium Poker Tournament Experience',
      admin: 'Admin',
      reserveTitle: 'Reserve Your Seat',
      reserveSubtitle: 'Join us for an unforgettable evening. Fill in your details below.',
      firstName: 'First Name *',
      lastName: 'Last Name *',
      phone: 'Phone Number *',
      email: 'Email (Optional)',
      enterFirstName: 'Enter your first name',
      enterLastName: 'Enter your last name',
      enterPhone: '555-123-4567',
      enterEmail: 'example@email.com',
      reserveButton: 'Reserve Seat Now',
      processing: 'Processing...',
      tournamentDetails: 'Tournament Details',
      tournamentName: 'Tournament Name',
      tournamentDate: 'Date',
      tournamentTime: 'Time',
      location: 'Location',
      entryFee: 'Entry Fee',
      prizePool: 'Prize Pool',
      tables: 'Tables:',
      seats: 'Seats:',
      totalCapacity: 'Total Capacity:',
      checkin: 'Check-in:',
      premiumTables: 'premium tables',
      seatsPerTable: 'seats per table',
      players: 'players',
      qrAtDoor: 'QR code at door',
      fillForm: 'Fill out the form to reserve your seat',
      confirmed: 'Reservation Confirmed!',
      allSet: "You're all set for an amazing night at Kings Club.",
      table: 'Table',
      seat: 'Seat',
      checkinCode: 'Your Check-in Code',
      qrCode: '📱 QR Code',
      scanAtDoor: 'Scan this at the door for quick check-in',
      viewQR: 'View QR Code',
      name: 'Name:',
      phoneLabel: 'Phone:',
      emailLabel: 'Email:',
      makeAnother: 'Make Another Reservation',
      waitlist: 'Join the Waitlist',
      allFull: 'All seats are currently full, but don\'t worry!',
      inQueue: 'in queue',
      notifyMessage: 'We\'ll notify you by phone if a seat becomes available. You\'ll have a chance to confirm within 30 minutes.',
      tryAnother: 'Try Another Name',
      alreadyReserved: 'Already Reserved',
      somethingWrong: 'Something went wrong',
      userAlreadyReserved: 'User already has a reservation',
      phoneAlreadyRegistered: 'Phone number already registered',
      serverNotRunning: 'Backend server is not running',
      reservationFailed: 'Failed to create reservation',
      tryAgain: 'Try Again',
      footer: '© 2025 Kings Club. All rights reserved. | Premium Poker Tournament Series'
    },
    login: {
      title: '♠️ Kings Club Admin',
      subtitle: 'Tournament Management System',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      error: 'Invalid username or password',
      logout: 'Logout',
      enterUsername: 'Enter username',
      enterPassword: 'Enter password'
    },
    dashboard: {
      overview: 'Dashboard Overview',
      reserved: 'Reserved Seats',
      waiting: 'Waiting List',
      checked_in: 'Checked In',
      capacity: 'Capacity Used',
      details: 'Tournament Details',
      total_tables: 'Total Tables',
      seats_per_table: 'Seats per Table',
      total_capacity: 'Total Capacity',
      seats_remaining: 'Seats Remaining',
      quick_actions: 'Quick Actions',
      export_csv: 'Export to CSV',
      reset: 'Reset Tournament'
    },
    reservations: {
      all: 'All Reservations',
      search: 'Search by name or phone...',
      status: 'Status',
      table: 'Table',
      seat: 'Seat',
      actions: 'Actions',
      check_in: 'Check In',
      missing: 'Missing',
      remove: 'Remove',
      no_data: 'No reservations found'
    },
    tables: {
      layout: 'Tournament Seating Layout',
      description: '{tables} Tables × {seats} Seats = {capacity} Total Capacity',
      legend: 'Legend:',
      empty: 'Empty Seat',
      reserved: 'Reserved (Red)',
      occupied: 'Occupied (Seated)'
    },
    waiting: {
      title: 'Waiting List',
      promote: 'Promote',
      empty: 'Waiting list is empty'
    },
    checkin: {
      title: 'Check-in Management',
      manual: 'Manual Check-in by Phone',
      process: 'Process Check-in',
      recent: 'Recent Check-ins'
    },
    settings: {
      title: 'Settings',
      apply: 'Apply Settings',
      tournamentInfo: 'Tournament Information',
      tournamentName: 'Tournament Name',
      tournamentDate: 'Tournament Date',
      tournamentTime: 'Start Time',
      location: 'Location',
      entryFee: 'Entry Fee',
      prizePool: 'Prize Pool',
      description: 'Description',
      saveInfo: 'Save Information',
      tableSettings: 'Table Settings',
      openInMaps: 'Open in Maps'
    }
  },
  ka: {
    app: {
      logo: '♠️ Kings Club',
      tagline: 'პრემიუმ პოკერის ტურნირის გამოცდილება',
      admin: 'ადმინი',
      reserveTitle: 'დააჯავშნეთ თქვენი ადგილი',
      reserveSubtitle: 'შემოგვიერთდით დაუვიწყარ საღამოზე. შეავსეთ თქვენი მონაცემები ქვემოთ.',
      firstName: 'სახელი *',
      lastName: 'გვარი *',
      phone: 'ტელეფონის ნომერი *',
      email: 'ელფოსტა (არასავალდებულო)',
      enterFirstName: 'შეიყვანეთ თქვენი სახელი',
      enterLastName: 'შეიყვანეთ თქვენი გვარი',
      enterPhone: '555-123-4567',
      enterEmail: 'example@email.com',
      reserveButton: 'დააჯავშნეთ ადგილი ახლა',
      processing: 'მუშავდება...',
      tournamentDetails: 'ტურნირის დეტალები',
      tournamentName: 'ტურნირის სახელი',
      tournamentDate: 'თარიღი',
      tournamentTime: 'დრო',
      location: 'მდებარეობა',
      entryFee: 'შესვლის საფასური',
      prizePool: 'პრიზების ფონდი',
      tables: 'მაგიდები:',
      seats: 'ადგილები:',
      totalCapacity: 'სულ ტევადობა:',
      checkin: 'ჩასვლა:',
      premiumTables: 'პრემიუმ მაგიდა',
      seatsPerTable: 'ადგილი თითო მაგიდაზე',
      players: 'მოთამაშე',
      qrAtDoor: 'QR კოდი კართან',
      fillForm: 'შეავსეთ ფორმა თქვენი ადგილის დასაჯავშნად',
      confirmed: 'ჯავშანი დადასტურებულია!',
      allSet: 'ყველაფერი მზადაა Kings Club-ში საოცარი საღამოსთვის.',
      table: 'მაგიდა',
      seat: 'ადგილი',
      checkinCode: 'თქვენი ჩასვლის კოდი',
      qrCode: '📱 QR კოდი',
      scanAtDoor: 'სკანირება გააკეთეთ კართან სწრაფი ჩასვლისთვის',
      viewQR: 'ნახეთ QR კოდი',
      name: 'სახელი:',
      phoneLabel: 'ტელეფონი:',
      emailLabel: 'ელფოსტა:',
      makeAnother: 'დააჯავშნეთ სხვა ჯავშანი',
      waitlist: 'შეუერთდით მოლოდინის სიას',
      allFull: 'ყველა ადგილი ახლა დაკავებულია, მაგრამ არ ინერვიულოთ!',
      inQueue: 'რიგში',
      notifyMessage: 'თუ ადგილი გათავისუფლდება, ტელეფონით შეგეტყობინებათ. გექნებათ 30 წუთი დადასტურებისთვის.',
      tryAnother: 'სცადეთ სხვა სახელი',
      alreadyReserved: 'უკვე დაჯავშნილია',
      somethingWrong: 'რაღაც შეცდომა მოხდა',
      userAlreadyReserved: 'მომხმარებელს უკვე აქვს ჯავშანი',
      phoneAlreadyRegistered: 'ეს ტელეფონის ნომერი უკვე დარეგისტრირებულია',
      serverNotRunning: 'სერვერთან დაკავშირება ვერ მოხერხდა',
      reservationFailed: 'რეზერვაცია ვერ შესრულდა',
      tryAgain: 'კვლავ სცადეთ',
      footer: '© 2025 Kings Club. ყველა უფლება დაცულია. | პრემიუმ პოკერის ტურნირის სერია'
    },
    login: {
      title: '♠️ Kings Club ადმინი',
      subtitle: 'ტურნირის მართვის სისტემა',
      username: 'მომხმარებელი',
      password: 'პაროლი',
      login: 'შესვლა',
      error: 'არასწორი მომხმარებელი ან პაროლი',
      logout: 'გასვლა',
      enterUsername: 'შეიყვანეთ მომხმარებელი',
      enterPassword: 'შეიყვანეთ პაროლი'
    },
    dashboard: {
      overview: 'დეშბორდის მიმოხილვა',
      reserved: 'დაჯავშნილი ადგილები',
      waiting: 'მოლოდინის სია',
      checked_in: 'ჩასული',
      capacity: 'ტევადობის გამოყენება',
      details: 'ტურნირის დეტალები',
      total_tables: 'სულ მაგიდები',
      seats_per_table: 'ადგილები თითო მაგიდაზე',
      total_capacity: 'სულ ტევადობა',
      seats_remaining: 'დარჩენილი ადგილები',
      quick_actions: 'სწრაფი ქმედებები',
      export_csv: 'გატანა CSV-ში',
      reset: 'ტურნირის განულება'
    },
    reservations: {
      all: 'ყველა ჯავშანი',
      search: 'ძებნა სახელით ან ნომრით...',
      status: 'სტატუსი',
      table: 'მაგიდა',
      seat: 'ადგილი',
      actions: 'ქმედებები',
      check_in: 'ჩასვლა',
      missing: 'დაკარგული',
      remove: 'წაშლა',
      no_data: 'ჯავშნები არ მოიძებნა'
    },
    tables: {
      layout: 'ტურნირის დასაჯდომი განლაგება',
      description: '{tables} მაგიდა × {seats} ადგილი = {capacity} სულ ტევადობა',
      legend: 'ლეგენდა:',
      empty: 'ცარიელი ადგილი',
      reserved: 'დაჯავშნილი (წითელი)',
      occupied: 'დაკავებული (ჩასული)'
    },
    waiting: {
      title: 'მოლოდინის სია',
      promote: 'აწინაურება',
      empty: 'მოლოდინის სია ცარიელია'
    },
    checkin: {
      title: 'ჩასვლის მართვა',
      manual: 'ხელით ჩასვლა ნომრით',
      process: 'ჩასვლის დამუშავება',
      recent: 'ბოლო ჩასულები'
    },
    settings: {
      title: 'პარამეტრები',
      apply: 'პარამეტრების გამოყენება',
      tournamentInfo: 'ტურნირის ინფორმაცია',
      tournamentName: 'ტურნირის სახელი',
      tournamentDate: 'ტურნირის თარიღი',
      tournamentTime: 'დაწყების დრო',
      location: 'მდებარეობა',
      entryFee: 'შესვლის საფასური',
      prizePool: 'პრიზების ფონდი',
      description: 'აღწერა',
      saveInfo: 'ინფორმაციის შენახვა',
      tableSettings: 'მაგიდების პარამეტრები',
      openInMaps: 'გახსნა რუკაზე'
    }
  }
};

// Get saved locale from localStorage or default to 'en'
const savedLocale = localStorage.getItem('kingsClubLocale') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages
});

// Save locale changes to localStorage
export function setLocale(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem('kingsClubLocale', locale);
}

export function getLocale() {
  return i18n.global.locale.value;
}

export default i18n;
