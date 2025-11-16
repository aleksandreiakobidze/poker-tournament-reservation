# Admin Panel - Usage Guide

## Login

1. Navigate to `http://localhost:5173/admin.html`
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `king`
3. Click "Login"

## Dashboard Tab

Displays key metrics and quick access to common functions.

### Statistics Cards
- **Reserved Seats**: Count of confirmed reservations
- **Waiting List**: Players without assigned seats
- **Checked In**: Players who have arrived
- **Capacity Used**: Percentage of 54 total seats

### Tournament Details
Shows fixed tournament configuration:
- Total Tables: 6
- Seats per Table: 9
- Total Capacity: 54
- Seats Remaining: Auto-calculated

### Quick Actions
- **Export to CSV**: Download all reservations as spreadsheet
- **Reset Tournament**: Clear all reservations (caution: irreversible!)

---

## Reservations Tab

Complete management interface for all reservations.

### Search and Filter
- **Search Box**: Type name or phone number (real-time filtering)
- **Status Filter**: Dropdown to show Reserved/Waiting/Checked In only

### Reservation Table

| Column | Description |
|--------|-------------|
| Name | First and last name |
| Phone | Phone number (unique identifier) |
| Email | Email address (if provided) |
| Status | Current status with color badge |
| Table | Table number (1-6) or blank if waiting |
| Seat | Seat number (1-9) or blank if waiting |
| Actions | Check In or Remove buttons |

### Status Badges
- **Reserved** (green): Player has confirmed seat
- **Waiting** (orange): Player is on the waiting list
- **Checked In** (blue): Player has arrived and confirmed

### Actions
- **Check In**: Mark a reserved player as checked in
  - Only available for reserved status
  - Changes status to "checked_in"
  - Records check-in timestamp
  
- **Remove**: Delete a reservation
  - Requires confirmation
  - Frees up the seat for others
  - Cannot be undone

---

## Tables Tab

Visual representation of tournament seating.

### Layout
- Shows all 6 tables
- Each table displays 9 seats in a 3×3 grid
- Each seat is color-coded:
  - **Gray**: Empty seat
  - **Pink**: Occupied (shows player's first name)

### Reading the Display
```
TABLE 1
[Empty] [John  ] [Empty]
[Empty] [Sarah ] [Mike  ]
[Empty] [Empty] [Empty]
```

### Use Cases
- Quickly verify seat availability
- See who is seated where
- Monitor table fill status
- Plan for promotions from waiting list

---

## Waiting List Tab

Manage players waiting for seats.

### Queue Display
Each waiting player shows:
- **Position Number**: Their place in queue (#1, #2, #3, etc.)
- **Name**: Full name
- **Phone**: Phone number
- **Promote Button**: Move to available seat

### Promoting from Waiting List

When you click "Promote":
1. System finds the first available empty seat
2. Automatically assigns table and seat number
3. Changes status from "waiting" to "reserved"
4. Shows confirmation with new seat location
5. Player can now check in

#### Example Flow
```
Before:
  #1 John Smith - Phone: 555-1234 [Promote]
  #2 Jane Doe - Phone: 555-5678
  
After Promote:
  Status: Jane Doe moved to Table 3, Seat 5
  
Updated List:
  #1 Jane Doe - Phone: 555-5678 [Promote]
```

---

## Check-in Tab

Process player arrivals at the event.

### Manual Check-in

**Scenario**: Player arrives without using the app

1. Click the phone number input field
2. Enter player's phone number (must match reservation)
3. Click "Process Check-in"
4. System validates and confirms

### Validation Rules
- ✅ Phone must exist in reservations
- ✅ Must have "reserved" status (not waiting)
- ❌ Cannot check in twice (prevents duplicates)
- ❌ Cannot check in waiting list players

### Recent Check-ins

Shows last 10 players who checked in with timestamps:
```
John Smith (Table 1, Seat 3) - 7:45 PM
Sarah Johnson (Table 2, Seat 1) - 7:42 PM
Mike Anderson (Table 1, Seat 9) - 7:39 PM
...
```

---

## Export to CSV

Download all reservation data for records, reports, or analysis.

### How to Export
1. Go to Dashboard tab
2. Click "📥 Export to CSV" button
3. File downloads automatically with timestamp

### File Format
```
Name,Phone,Email,Status,Table,Seat,Check-in Time
"John Doe","555-123-4567","john@email.com","reserved","1","3","2025-01-15T19:45:00"
"Jane Smith","555-987-6543","jane@email.com","checked_in","2","1","2025-01-15T19:42:00"
```

### File Naming
- Format: `kings-club-reservations-YYYY-MM-DD.csv`
- Example: `kings-club-reservations-2025-01-15.csv`

### Use Cases
- Venue records
- Follow-up communications
- Analytics and reports
- Backup data
- Import into other systems

---

## Reset Tournament

⚠️ **Warning: This action is irreversible!**

### When to Use
- End of tournament
- Starting a new tournament
- Clear test data

### How to Reset
1. Go to Dashboard tab
2. Click "🔄 Reset Tournament" button
3. Confirm dialog appears
4. Click "OK" to proceed
5. All reservations are deleted

### What Gets Cleared
- All reservations (reserved & waiting)
- All check-in records
- All timestamps
- Seat assignments

### What Remains
- Admin credentials (unchanged)
- System configuration (6 tables, 9 seats)
- Settings

---

## Common Workflows

### Workflow 1: Tournament Check-in

```
1. Player arrives at venue
2. Admin clicks Check-in tab
3. Admin enters player's phone number
4. System confirms: "John Doe checked in at Table 1, Seat 3"
5. Repeat for each arrival
```

### Workflow 2: Promote from Waiting List

```
1. Seat becomes available (player leaves)
2. Remove reservation from Reservations tab
3. Go to Waiting List tab
4. Click "Promote" on next in queue
5. System auto-assigns available seat
6. Notify player they now have a seat
```

### Workflow 3: Monitor Tournament

```
1. Check Dashboard for statistics
2. Go to Tables tab to see fill status
3. If waiting list growing, plan promotions
4. Monitor Check-ins to track attendance
5. Use CSV export for final report
```

### Workflow 4: Handle Missing Reservation

```
1. Player claims to have a reservation but not found
2. Use Search in Reservations tab to double-check
3. If truly missing, create manually:
   - Go to Waiting List (if no seats)
   - OR note for backend team to add
4. Process check-in once located
```

---

## Troubleshooting

### Can't Login
- **Wrong credentials**: Use `admin` / `king`
- **Forgot password**: Hard-coded in code, contact developer
- **Browser issue**: Clear cookies, hard refresh (Ctrl+Shift+R)

### Data Not Showing
- **No reservations made**: Make test reservation in main app first
- **Different browser**: Data is stored per-browser (different localStorage)
- **Cache issue**: Hard refresh the page

### Check-in Failing
- **Phone not found**: Double-check phone number matches
- **Player on waiting list**: Promote to reserved first
- **Already checked in**: Player already processed

### Seat Not Assigned
- **All seats full**: Player auto-goes to waiting list
- **Need to free seat**: Remove other reservation first
- **Manual assignment**: Promote from waiting list

### Export Not Working
- **Pop-up blocked**: Browser might be blocking download
- **No data**: No reservations to export
- **File format**: Opens in Excel, Google Sheets, or text editor

---

## Tips & Best Practices

✅ **DO**
- Export data regularly for backup
- Check dashboard before shift starts
- Use search/filter to find specific players
- Promote waiting list players throughout event
- Document any manual interventions

❌ **DON'T**
- Press Reset unless starting new tournament
- Remove reservations carelessly (affects capacity)
- Share admin credentials
- Rely on password for security (it's visible)

---

## Keyboard Shortcuts

- **Enter** in search field: Trigger search
- **Tab** between fields: Navigation
- **Esc** from modals: Close dialogs
- **Ctrl+R** or **F5**: Refresh page if needed

---

## Support

For issues or questions:
1. Check [ADMIN_PANEL.md](ADMIN_PANEL.md) for technical details
2. Review [ADMIN_IMPLEMENTATION.md](../ADMIN_IMPLEMENTATION.md) for architecture
3. Contact development team for code modifications

---

**Happy Managing! 🎰**
