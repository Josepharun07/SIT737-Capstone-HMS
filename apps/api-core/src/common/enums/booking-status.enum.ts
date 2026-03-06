/**
 * Booking Status Enumeration
 * State machine for booking lifecycle
 */
export enum BookingStatus {
  DRAFT = 'DRAFT',                     // Incomplete booking
  PENDING_PAYMENT = 'PENDING_PAYMENT', // Awaiting payment confirmation
  CONFIRMED = 'CONFIRMED',             // Payment received, booking confirmed
  CHECKED_IN = 'CHECKED_IN',           // Guest has checked in
  CHECKED_OUT = 'CHECKED_OUT',         // Guest has checked out
  CANCELLED = 'CANCELLED',             // Booking cancelled
  NO_SHOW = 'NO_SHOW',                 // Guest didn't arrive
}
