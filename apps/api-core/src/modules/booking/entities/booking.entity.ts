import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BookingStatus } from '../../../common/enums/booking-status.enum';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';
import { Guest } from '../../guest/entities/guest.entity';
import { Room } from '../../room/entities/room.entity';
import { RoomType } from '../../room-type/entities/room-type.entity';

/**
 * Booking Entity
 * Core reservation system
 */
@Entity('bookings')
@Index(['checkInDate', 'checkOutDate'])
@Index(['status'])
@Index(['guestId'])
export class Booking extends BaseEntity {
  @Column({ name: 'booking_number', type: 'varchar', length: 20, unique: true })
  bookingNumber: string;

  @Column({ name: 'guest_id', type: 'uuid' })
  guestId: string;

  @ManyToOne(() => Guest)
  @JoinColumn({ name: 'guest_id' })
  guest: Guest;

  @Column({ name: 'room_id', type: 'uuid', nullable: true })
  roomId: string | null;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ name: 'room_type_id', type: 'uuid' })
  roomTypeId: string;

  @ManyToOne(() => RoomType)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;

  @Column({ name: 'check_in_date', type: 'date' })
  checkInDate: Date;

  @Column({ name: 'check_out_date', type: 'date' })
  checkOutDate: Date;

  @Column({ name: 'number_of_guests', type: 'int' })
  numberOfGuests: number;

  @Column({ name: 'number_of_nights', type: 'int' })
  numberOfNights: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.DRAFT,
  })
  status: BookingStatus;

  @Column({ name: 'room_rate', type: 'decimal', precision: 10, scale: 2 })
  roomRate: number;

  @Column({ name: 'subtotal', type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'paid_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod | null;

  @Column({ name: 'special_requests', type: 'text', nullable: true })
  specialRequests: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'checked_in_at', type: 'timestamp', nullable: true })
  checkedInAt: Date | null;

  @Column({ name: 'checked_out_at', type: 'timestamp', nullable: true })
  checkedOutAt: Date | null;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date | null;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string | null; // FIX: Make type explicitly nullable
}
