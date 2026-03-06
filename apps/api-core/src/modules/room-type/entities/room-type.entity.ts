import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BedType } from '../../../common/enums/bed-type.enum';
import { ViewType } from '../../../common/enums/view-type.enum';
import { Amenity } from '../../amenity/entities/amenity.entity';

@Entity('room_types')
export class RoomType extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  tagline: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ name: 'max_occupancy', type: 'int' })
  maxOccupancy: number;

  @Column({ name: 'size_sqft', type: 'int', nullable: true })
  sizeSqft: number;

  @Column({
    name: 'bed_type',
    type: 'enum',
    enum: BedType,
  })
  bedType: BedType;

  @Column({
    name: 'view_type',
    type: 'enum',
    enum: ViewType,
    nullable: true,
  })
  viewType: ViewType;

  @Column({ name: 'has_balcony', type: 'boolean', default: false })
  hasBalcony: boolean;

  @Column({ name: 'has_kitchen', type: 'boolean', default: false })
  hasKitchen: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToMany(() => Amenity)
  @JoinTable({
    name: 'room_type_amenities',
    joinColumn: { name: 'room_type_id' },
    inverseJoinColumn: { name: 'amenity_id' },
  })
  amenities: Amenity[];
}
