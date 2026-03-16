# Logging System Usage Guide

## Automatic Logging (Already Active)

The following are logged automatically:
- ✅ All HTTP requests (method, URL, IP, duration)
- ✅ All HTTP responses (status code, duration)
- ✅ All errors with stack traces
- ✅ All data changes (via AuditLogInterceptor)

## Manual Logging in Your Code

### Import the Logger

```typescript
import { CustomLoggerService } from '../common/logging/logger.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: CustomLoggerService) {}
}
```

### Log Levels

```typescript
// Info: General information
this.logger.log('User successfully logged in', 'AuthService');

// Warning: Something unusual but not an error
this.logger.warn('Payment gateway response delayed', 'PaymentService');

// Error: Something went wrong
this.logger.error('Failed to send email', error.stack, 'EmailService');

// Debug: Detailed information for debugging
this.logger.debug('Processing booking calculation', 'BookingService');
```

### Audit Logging

```typescript
// Log important business actions
this.logger.audit(
  'BOOKING_CREATED',
  user.id,
  {
    bookingId: booking.id,
    guestName: guest.name,
    totalAmount: booking.totalAmount,
  }
);

this.logger.audit(
  'ROOM_STATUS_CHANGED',
  user.id,
  {
    roomId: room.id,
    oldStatus: 'AVAILABLE',
    newStatus: 'OCCUPIED',
  }
);
```

### Performance Logging

```typescript
// Log slow operations
const startTime = Date.now();
const result = await this.heavyOperation();
const duration = Date.now() - startTime;

if (duration > 1000) {
  this.logger.warn(
    `Slow operation detected: ${duration}ms`,
    'PerformanceMonitor'
  );
}
```

## Log File Locations

All logs are stored in the `/logs` directory:

```
logs/
├── application-2026-03-07.log     # All info logs
├── error-2026-03-07.log           # Errors only
├── audit-2026-03-07.log           # Audit trail
├── exceptions-2026-03-07.log      # Uncaught exceptions
└── rejections-2026-03-07.log      # Promise rejections
```

## Log Rotation

- Files rotate daily (new file each day)
- Old files are compressed (`.gz`)
- Retention:
  - Application logs: 30 days
  - Error logs: 90 days
  - Audit logs: 365 days (1 year)

## Viewing Logs

```bash
# View live logs
tail -f logs/application-$(date +%Y-%m-%d).log

# View errors only
tail -f logs/error-$(date +%Y-%m-%d).log

# Search for specific user actions
grep "user-id-here" logs/audit-$(date +%Y-%m-%d).log

# Count errors in last hour
grep "$(date +%Y-%m-%d\ %H)" logs/error-$(date +%Y-%m-%d).log | wc -l
```

## Best Practices

1. **Always include context:** `this.logger.log(message, 'ServiceName')`
2. **Log at appropriate levels:** Don't use `error` for warnings
3. **Include relevant IDs:** User ID, Booking ID, Room ID
4. **Don't log passwords or tokens:** Already sanitized in audit interceptor
5. **Use audit logs for compliance:** Financial transactions, status changes

## Example: Complete Service with Logging

```typescript
import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../common/logging/logger.service';

@Injectable()
export class BookingService {
  constructor(private readonly logger: CustomLoggerService) {}

  async create(dto: CreateBookingDto, userId: string) {
    this.logger.log(
      `Creating booking for guest: ${dto.guestId}`,
      'BookingService'
    );

    try {
      // Business logic here
      const booking = await this.repository.save(dto);

      // Log successful creation
      this.logger.audit('BOOKING_CREATED', userId, {
        bookingId: booking.id,
        amount: booking.totalAmount,
      });

      this.logger.log(
        `Booking created successfully: ${booking.bookingNumber}`,
        'BookingService'
      );

      return booking;
    } catch (error) {
      this.logger.error(
        `Failed to create booking: ${error.message}`,
        error.stack,
        'BookingService'
      );
      throw error;
    }
  }
}
```
