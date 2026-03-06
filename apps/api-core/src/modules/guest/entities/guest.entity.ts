import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/**
 * Guest Entity
 * Stores customer information for bookings
 */
@Entity('guests')
@Index(['email'])
@Index(['phoneNumber'])
export class Guest extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pincode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ name: 'id_type', type: 'varchar', length: 50, nullable: true })
  idType: string; // Passport, Aadhar, Driving License

  @Column({ name: 'id_number', type: 'varchar', length: 50, nullable: true })
  idNumber: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nationality: string;

  @Column({ type: 'jsonb', default: {} })
  preferences: Record<string, any>; // Dietary, pillow type, etc.

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'total_bookings', type: 'int', default: 0 })
  totalBookings: number;

  @Column({ name: 'total_spent', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSpent: number;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
