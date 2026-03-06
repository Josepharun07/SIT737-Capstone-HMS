import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RoomStatus } from '../../../common/enums/room-status.enum';
import { RoomType } from '../../room-type/entities/room-type.entity';

@Entity('rooms')
@Index(['roomNumber'], { unique: true })
export class Room extends BaseEntity {
  @Column({ name: 'room_number', type: 'varchar', length: 20, unique: true })
  roomNumber: string;

  @Column({ name: 'floor_number', type: 'int' })
  floorNumber: number;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @Column({ name: 'room_type_id', type: 'uuid' })
  roomTypeId: string;

  @ManyToOne(() => RoomType)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;

  @Column({ name: 'custom_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  customRate: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'last_cleaned_at', type: 'timestamp', nullable: true })
  lastCleanedAt: Date;

  @Column({ name: 'last_inspected_at', type: 'timestamp', nullable: true })
  lastInspectedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
