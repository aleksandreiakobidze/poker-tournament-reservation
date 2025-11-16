# Kings Club Admin Panel

A comprehensive tournament management system for the Kings Club Poker Tournament Reservation platform.

## Access

- **URL**: `http://localhost:5173/admin.html`
- **Username**: `admin`
- **Password**: `king`

## Features

### 1. Dashboard Overview
- **Real-time Statistics**: Track reserved seats, waiting list count, checked-in players, and capacity usage
- **Tournament Details**: View tables (6), seats per table (9), total capacity (54), and remaining seats
- **Quick Actions**: 
  - Export all reservations to CSV
  - Reset entire tournament (caution: irreversible)

### 2. Reservations Management
- **View All Reservations**: Complete table with all reservation details
- **Search & Filter**: 
  - Search by name or phone number
  - Filter by status (Reserved, Waiting, Checked In)
- **Actions**:
  - Mark reservations as checked in
  - Remove reservations from system
- **Data Columns**: Name, Phone, Email, Status, Table, Seat

### 3. Table Layout Visualization
- **Visual Seating**: See all 6 tables with 9 seats each
- **Seat Status**: 
  - Empty seats (gray)
  - Occupied seats (pink with player's first name)
- **Instant Updates**: Real-time reflection of seat assignments

### 4. Waiting List Management
- **Queue View**: See all players waiting for a seat
- **Position Tracking**: Each person numbered by position in queue
- **Promote Function**: Manually promote players from waiting list to available seats
- **Auto-Assignment**: System automatically finds available seat when promoting

### 5. Check-In Management
- **Manual Check-in**: Enter phone number to process check-in
- **Status Validation**: Prevents double check-in and validates reservation status
- **Recent Check-ins**: View last 10 checked-in players with timestamps
- **Confirmation**: Instant feedback on successful check-ins

## Data Storage

- **Backend**: Local browser storage (localStorage)
- **Persistence**: All reservations saved between sessions
- **Sync**: Automatically syncs with reservation form in main app

## Reservation States

1. **Reserved**: Player has confirmed seat assignment (Table + Seat number)
2. **Waiting**: Player is on waiting list, no seat assigned yet
3. **Checked In**: Player has arrived and confirmed at door

## CSV Export

Download complete reservation data including:
- Names, phone numbers, emails
- Reservation status
- Table and seat assignments
- Check-in times
- Filename: `kings-club-reservations-[DATE].csv`

## Seat Allocation Logic

- Tables numbered 1-6
- Seats numbered 1-9 per table
- Total capacity: 54 players
- When promoting from waiting list: First available empty seat is assigned

## Admin Actions

| Action | Effect | Status After |
|--------|--------|--------------|
| Mark as Check-in | Player checks in at venue | `checked_in` |
| Promote from Waiting | Assign available seat to waiting player | `reserved` |
| Remove Reservation | Delete reservation from system | Removed |
| Reset Tournament | Clear all reservations (irreversible) | Empty system |

## Security Notes

- Basic authentication (username/password)
- No session persistence (logout clears auth state)
- localStorage-based data (client-side)
- Consider adding:
  - Session tokens
  - Rate limiting
  - Audit logs
  - Database persistence

## Future Enhancements

- [ ] Role-based access control (Admin, Staff, Viewer)
- [ ] Email notifications for check-ins and promotions
- [ ] SMS notifications via Twilio
- [ ] Advanced analytics and reporting
- [ ] Backup/restore functionality
- [ ] Audit trail of all admin actions
- [ ] Integration with payment system
- [ ] Automated waiting list management
- [ ] VIP seating assignments
- [ ] Badge printing
