# Blueberry HMS - Logging System Documentation

## Overview

Complete logging system for debugging, auditing, and compliance across backend and frontend.

### What Gets Logged

**Backend:**
- All HTTP requests and responses
- All errors with stack traces
- All data changes (audit trail)
- Performance metrics

**Frontend:**
- User actions and navigation
- API errors
- React component crashes
- Form submissions

### Log Storage

**Backend:** Files in `logs/` directory (rotate daily)
**Frontend:** Browser localStorage (last 50 entries)

---
## Backend Logging

### Automatic Logging

The following are logged automatically without any code changes:

✅ **HTTP Requests**
- Method (GET, POST, PUT, DELETE)
- URL path
- IP address
- Request duration
- Response status code

Example log:
2026-03-07T10:30:00.000Z LOG [HTTP] → GET /api/v1/bookings from 192.168.1.10
2026-03-07T10:30:00.008Z PERFORMANCE endpoint="/api/v1/bookings" duration=8ms status=200
2026-03-07T10:30:00.010Z LOG [HTTP] ✓ GET /api/v1/bookings 200 (8ms)


✅ **Errors**
- Error message
- Stack trace
- Request context
- User information (if authenticated)

Example error log:
2026-03-07T11:15:00.000Z ERROR [BookingService] Failed to create booking: Guest not found
Stack trace...

✅ **Audit Trail**
- Who made the change (user ID)
- What changed (action type)
- When it changed (timestamp)
- Old and new values
- IP address

Example audit log:
2026-03-07T14:20:00.000Z AUDIT action="BOOKING_CREATED" userId="user-123" details={"bookingId":"booking-456","amount":12000}

### Log Files

Location: `logs/` directory in project root


logs/
├── application-2026-03-07.log  # All info and debug logs
├── error-2026-03-07.log        # Errors only
├── audit-2026-03-07.log        # Compliance/audit trail


**File Rotation:** New file created daily at midnight
**Retention:** Files kept for 30 days (errors: 90 days, audit: 365 days)

---


import { CustomLoggerService } from '../common/logging/logger.service';

@Injectable()
export class BookingService {
  constructor(private readonly logger: CustomLoggerService) {}
}


this.logger.log('Booking created successfully', 'BookingService');


this.logger.warn('Payment gateway response delayed', 'PaymentService');



this.logger.error(
  'Failed to send email notification',
  error.stack,
  'EmailService'
);


this.logger.debug('Calculating room rate', 'BookingService');


this.logger.audit('BOOKING_CREATED', user.id, {
  bookingId: booking.id,
  guestName: `${guest.firstName} ${guest.lastName}`,
  totalAmount: booking.totalAmount,
  checkInDate: booking.checkInDate,
});


this.logger.audit('ROOM_STATUS_CHANGED', user.id, {
  roomId: room.id,
  roomNumber: room.roomNumber,
  oldStatus: 'CLEANING',
  newStatus: 'AVAILABLE',
});


this.logger.audit('BOOKING_CANCELLED', user.id, {
  bookingId: booking.id,
  reason: 'Guest request',
  refundAmount: booking.paidAmount,
});




@Injectable()
export class BookingService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly repository: Repository<Booking>,
  ) {}

  async create(dto: CreateBookingDto, userId: string) {
    this.logger.log(
      `Creating booking for guest ${dto.guestId}`,
      'BookingService'
    );

    try {
      const booking = await this.repository.save(dto);

      // Log successful creation
      this.logger.log(
        `Booking created: ${booking.bookingNumber}`,
        'BookingService'
      );

      // Log for audit trail
      this.logger.audit('BOOKING_CREATED', userId, {
        bookingId: booking.id,
        amount: booking.totalAmount,
      });

      return booking;
    } catch (error) {
      // Log error with stack trace
      this.logger.error(
        `Failed to create booking: ${error.message}`,
        error.stack,
        'BookingService'
      );
      throw error;
    }
  }
}


## Frontend Logging

### Automatic Logging

The frontend automatically logs:

✅ **Application Lifecycle**
- App start/initialization
- Route changes
- User login/logout

✅ **API Errors**
- Failed HTTP requests
- Network timeouts
- Validation errors

✅ **React Errors**
- Component crashes (caught by ErrorBoundary)
- Render errors
- Hook errors

### Manual Logging

Import and use the logger in your React components:

```typescript
import { logger } from '../lib/logging/logger';

function BookingForm() {
  const handleSubmit = async (data) => {
    // Log user action
    logger.info('Booking form submitted', 'BookingForm', { 
      guestName: data.guestName 
    });

    try {
      const response = await createBooking(data);
      
      logger.info('Booking created successfully', 'BookingForm', {
        bookingId: response.id
      });
      
    } catch (error) {
      // Log errors
      logger.error(
        'Failed to create booking',
        error as Error,
        'BookingForm'
      );
    }
  };
}
```

### Frontend Log Levels

```typescript
// INFO - User actions, navigation
logger.info('User clicked checkout button', 'CheckoutPage');

// WARN - Unusual behavior
logger.warn('Form submission took >3s', 'PaymentForm');

// ERROR - Failures
logger.error('API call failed', error, 'ComponentName');

// DEBUG - Detailed debugging (dev only)
logger.debug('Form state updated', 'BookingForm', { formData });
```

### Viewing Frontend Logs

**In Browser Console:**

```javascript
// View all stored logs
logger.getLogs()

// Filter by level
logger.getLogs().filter(log => log.level === 'error')

// View as table
console.table(logger.getLogs())

// Clear logs
logger.clearLogs()
```

**Logs are stored in browser localStorage** (last 50 entries)

---
## Best Practices

### DO ✅

**1. Always Include Context**
```typescript
// Good
this.logger.log('User logged in', 'AuthService');
logger.info('Form submitted', 'BookingForm');

// Bad
this.logger.log('User logged in');
console.log('Something happened');
```

**2. Use Appropriate Log Levels**
```typescript
// Good - Use ERROR for actual errors
this.logger.error('Database connection failed', error.stack, 'DatabaseService');

// Bad - Don't use ERROR for warnings
this.logger.error('API response slow');  // Should be WARN
```

**3. Include Relevant IDs**
```typescript
// Good
this.logger.audit('BOOKING_UPDATED', userId, {
  bookingId: booking.id,
  roomId: room.id,
  guestId: guest.id
});

// Bad - Missing context
this.logger.audit('BOOKING_UPDATED', userId, {});
```

**4. Log Important Business Actions**
```typescript
// Always log these:
- Bookings created/updated/cancelled
- Payments processed/refunded
- Room status changes
- User role changes
- System configuration updates
```

**5. Use Audit Logs for Compliance**
```typescript
// Financial transactions
this.logger.audit('PAYMENT_RECEIVED', userId, {
  bookingId,
  amount,
  paymentMethod
});

// Access control changes
this.logger.audit('USER_ROLE_CHANGED', adminId, {
  targetUserId,
  oldRole: 'staff',
  newRole: 'manager'
});
```

### DON'T ❌

**1. Never Log Sensitive Data**
```typescript
// BAD - Never log passwords
this.logger.log(`User password: ${password}`);

// BAD - Don't log full credit card numbers
this.logger.log(`Card: ${cardNumber}`);

// GOOD - Log masked data
this.logger.log(`Card ending: ****${cardNumber.slice(-4)}`);
```

**2. Don't Use console.log Directly**
```typescript
// Bad
console.log('Something happened');

// Good
logger.info('Something happened', 'ComponentName');
```

**3. Don't Log in Tight Loops**
```typescript
// Bad - Creates thousands of logs
rooms.forEach(room => {
  this.logger.log(`Processing room ${room.id}`);
});

// Good - Log summary
this.logger.log(`Processing ${rooms.length} rooms`, 'RoomService');
```

**4. Don't Ignore Errors Silently**
```typescript
// Bad
try {
  await riskyOperation();
} catch (error) {
  // Silent failure
}

// Good
try {
  await riskyOperation();
} catch (error) {
  this.logger.error('Operation failed', error.stack, 'ServiceName');
  throw error; // or handle appropriately
}
```

---

## Troubleshooting

### No Log Files Being Created

**Check directory permissions:**
```bash
ls -la logs/
chmod 755 logs/
```

**Check disk space:**
```bash
df -h
```

**Manually test logging:**
```bash
echo "test" >> logs/test.log
```

### Log Files Too Large

**Check current sizes:**
```bash
du -h logs/
```

**Manual cleanup (keep last 7 days):**
```bash
find logs/ -name "*.log" -mtime +7 -delete
```

### Can't Find Specific Log Entry

**Search across all files:**
```bash
grep -r "search-term" logs/

# With line numbers
grep -rn "search-term" logs/

# With context (3 lines before/after)
grep -rn -C 3 "search-term" logs/
```

**Search by date range:**
```bash
# All logs from March 7th
cat logs/*-2026-03-07.log | grep "search-term"
```

### Frontend Logs Not Appearing

**Check localStorage:**
```javascript
// In browser console
localStorage.getItem('app_logs')
```

**Clear and restart:**
```javascript
logger.clearLogs()
// Refresh page
```

**Check console for errors:**
- Open DevTools (F12)
- Look for red errors
- Ensure logger is imported correctly

---
## Best Practices

### DO ✅

**1. Always Include Context**
```typescript
// Good
this.logger.log('User logged in', 'AuthService');
logger.info('Form submitted', 'BookingForm');

// Bad
this.logger.log('User logged in');
console.log('Something happened');
```

**2. Use Appropriate Log Levels**
```typescript
// Good - Use ERROR for actual errors
this.logger.error('Database connection failed', error.stack, 'DatabaseService');

// Bad - Don't use ERROR for warnings
this.logger.error('API response slow');  // Should be WARN
```

**3. Include Relevant IDs**
```typescript
// Good
this.logger.audit('BOOKING_UPDATED', userId, {
  bookingId: booking.id,
  roomId: room.id,
  guestId: guest.id
});

// Bad - Missing context
this.logger.audit('BOOKING_UPDATED', userId, {});
```

**4. Log Important Business Actions**
```typescript
// Always log these:
- Bookings created/updated/cancelled
- Payments processed/refunded
- Room status changes
- User role changes
- System configuration updates
```

**5. Use Audit Logs for Compliance**
```typescript
// Financial transactions
this.logger.audit('PAYMENT_RECEIVED', userId, {
  bookingId,
  amount,
  paymentMethod
});

// Access control changes
this.logger.audit('USER_ROLE_CHANGED', adminId, {
  targetUserId,
  oldRole: 'staff',
  newRole: 'manager'
});
```

### DON'T ❌

**1. Never Log Sensitive Data**
```typescript
// BAD - Never log passwords
this.logger.log(`User password: ${password}`);

// BAD - Don't log full credit card numbers
this.logger.log(`Card: ${cardNumber}`);

// GOOD - Log masked data
this.logger.log(`Card ending: ****${cardNumber.slice(-4)}`);
```

**2. Don't Use console.log Directly**
```typescript
// Bad
console.log('Something happened');

// Good
logger.info('Something happened', 'ComponentName');
```

**3. Don't Log in Tight Loops**
```typescript
// Bad - Creates thousands of logs
rooms.forEach(room => {
  this.logger.log(`Processing room ${room.id}`);
});

// Good - Log summary
this.logger.log(`Processing ${rooms.length} rooms`, 'RoomService');
```

**4. Don't Ignore Errors Silently**
```typescript
// Bad
try {
  await riskyOperation();
} catch (error) {
  // Silent failure
}

// Good
try {
  await riskyOperation();
} catch (error) {
  this.logger.error('Operation failed', error.stack, 'ServiceName');
  throw error; // or handle appropriately
}
```

---

## Troubleshooting

### No Log Files Being Created

**Check directory permissions:**
```bash
ls -la logs/
chmod 755 logs/
```

**Check disk space:**
```bash
df -h
```

**Manually test logging:**
```bash
echo "test" >> logs/test.log
```

### Log Files Too Large

**Check current sizes:**
```bash
du -h logs/
```

**Manual cleanup (keep last 7 days):**
```bash
find logs/ -name "*.log" -mtime +7 -delete
```

### Can't Find Specific Log Entry

**Search across all files:**
```bash
grep -r "search-term" logs/

# With line numbers
grep -rn "search-term" logs/

# With context (3 lines before/after)
grep -rn -C 3 "search-term" logs/
```

**Search by date range:**
```bash
# All logs from March 7th
cat logs/*-2026-03-07.log | grep "search-term"
```

### Frontend Logs Not Appearing

**Check localStorage:**
```javascript
// In browser console
localStorage.getItem('app_logs')
```

**Clear and restart:**
```javascript
logger.clearLogs()
// Refresh page
```

**Check console for errors:**
- Open DevTools (F12)
- Look for red errors
- Ensure logger is imported correctly

---
## Quick Reference Commands

### Viewing Logs

**Real-time monitoring (all logs):**
```bash
tail -f logs/application-$(date +%Y-%m-%d).log
```

**Real-time monitoring (errors only):**
```bash
tail -f logs/error-$(date +%Y-%m-%d).log
```

**Real-time monitoring (audit trail):**
```bash
tail -f logs/audit-$(date +%Y-%m-%d).log
```

**View last 100 lines:**
```bash
tail -100 logs/application-$(date +%Y-%m-%d).log
```

**View first 50 lines:**
```bash
head -50 logs/application-$(date +%Y-%m-%d).log
```

### Searching Logs

**Search for specific term:**
```bash
grep "booking-123" logs/application-$(date +%Y-%m-%d).log
```

**Search across all log files:**
```bash
grep -r "booking-123" logs/
```

**Search with line numbers:**
```bash
grep -n "ERROR" logs/application-$(date +%Y-%m-%d).log
```

**Search with context (5 lines before/after):**
```bash
grep -C 5 "booking-123" logs/application-$(date +%Y-%m-%d).log
```

**Case-insensitive search:**
```bash
grep -i "payment" logs/application-$(date +%Y-%m-%d).log
```

### Filtering Logs

**Show only ERROR logs:**
```bash
grep "ERROR" logs/application-$(date +%Y-%m-%d).log
```

**Show only logs from specific service:**
```bash
grep "\[BookingService\]" logs/application-$(date +%Y-%m-%d).log
```

**Show only audit logs for specific user:**
```bash
grep "userId=\"user-123\"" logs/audit-$(date +%Y-%m-%d).log
```

**Count occurrences:**
```bash
grep -c "ERROR" logs/application-$(date +%Y-%m-%d).log
```

### Log Analysis

**Count errors today:**
```bash
grep -c "ERROR" logs/error-$(date +%Y-%m-%d).log
```

**Show unique error messages:**
```bash
grep "ERROR" logs/error-$(date +%Y-%m-%d).log | sort | uniq
```

**Find slowest API calls (>1000ms):**
```bash
grep "duration=[1-9][0-9][0-9][0-9]" logs/application-$(date +%Y-%m-%d).log
```

**List all actions by user:**
```bash
grep "userId=\"user-123\"" logs/audit-$(date +%Y-%m-%d).log
```

### Log Maintenance

**Check log directory size:**
```bash
du -sh logs/
```

**List logs by size:**
```bash
ls -lhS logs/
```

**Remove logs older than 30 days:**
```bash
find logs/ -name "*.log" -mtime +30 -delete
```

**Archive old logs:**
```bash
tar -czf logs-archive-$(date +%Y-%m).tar.gz logs/*.log
```

**Clear today's logs (caution!):**
```bash
> logs/application-$(date +%Y-%m-%d).log
```

### Frontend Logs (Browser Console)

**View all logs:**
```javascript
logger.getLogs()
```

**View as table:**
```javascript
console.table(logger.getLogs())
```

**Filter errors only:**
```javascript
logger.getLogs().filter(log => log.level === 'error')
```

**Filter by context:**
```javascript
logger.getLogs().filter(log => log.context === 'BookingForm')
```

**Export logs to JSON:**
```javascript
JSON.stringify(logger.getLogs(), null, 2)
```

**Clear all logs:**
```javascript
logger.clearLogs()
```

**Count logs by level:**
```javascript
const logs = logger.getLogs();
const counts = logs.reduce((acc, log) => {
  acc[log.level] = (acc[log.level] || 0) + 1;
  return acc;
}, {});
console.log(counts);
```

---

## Common Log Patterns

### Booking Created
```
2026-03-07T10:30:00.000Z LOG [BookingService] Creating booking for guest John Doe
2026-03-07T10:30:00.050Z AUDIT action="BOOKING_CREATED" userId="user-123" details={"bookingId":"booking-456","amount":12000}
2026-03-07T10:30:00.055Z LOG [BookingService] Booking booking-456 created successfully
```

### Payment Processed
```
2026-03-07T11:45:00.000Z LOG [PaymentService] Processing payment for booking-456
2026-03-07T11:45:02.500Z AUDIT action="PAYMENT_PROCESSED" userId="user-123" details={"amount":12000,"method":"card"}
2026-03-07T11:45:02.505Z LOG [PaymentService] Payment completed successfully
```

### Error Occurred
```
2026-03-07T14:20:00.000Z ERROR [BookingService] Failed to create booking: Guest not found
Stack trace:
  at BookingService.createBooking (booking.service.ts:45:10)
  ...
```

### Room Status Changed
```
2026-03-07T15:30:00.000Z AUDIT action="ROOM_STATUS_CHANGED" userId="housekeeping-789" details={"roomId":"101","oldStatus":"CLEANING","newStatus":"AVAILABLE"}
```

---

## Support

**For issues with logging system:**
- Check this documentation
- Review logs in `logs/` directory
- Contact: Technical Team (Mattel Group)

**Project:** Blueberry HMS  
**Organization:** Mattel Group  
**Property:** Blueberry Hills Resort, Munnar  
**Last Updated:** March 2026  
**Version:** 1.0.0

---
