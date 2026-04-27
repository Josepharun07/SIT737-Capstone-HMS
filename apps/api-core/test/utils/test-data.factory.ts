import { faker } from '@faker-js/faker';
import { BookingStatus, PaymentStatus, PaymentMethod } from '../../src/common/enums/booking-status.enum';
import { RoomStatus } from '../../src/common/enums/room-status.enum';
import { UserRole, UserStatus } from '../../src/common/enums/user-role.enum';

export class TestDataFactory {
  static createUser(overrides?: any) {
    return {
      email: faker.internet.email(),
      password: 'password123',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      role: UserRole.FRONT_DESK,
      status: UserStatus.ACTIVE,
      ...overrides,
    };
  }

  static createGuest(overrides?: any) {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'India',
      pincode: faker.location.zipCode(),
      ...overrides,
    };
  }

  static createRoomType(overrides?: any) {
    return {
      name: `${faker.word.adjective()} Suite`,
      description: faker.lorem.paragraph(),
      basePrice: faker.number.int({ min: 3000, max: 10000 }),
      maxOccupancy: faker.number.int({ min: 1, max: 4 }),
      sizeSqft: faker.number.int({ min: 200, max: 600 }),
      bedType: 'KING',
      viewType: 'VALLEY',
      hasBalcony: true,
      hasKitchen: false,
      ...overrides,
    };
  }

  static createRoom(roomTypeId: string, overrides?: any) {
    return {
      roomNumber: faker.number.int({ min: 100, max: 999 }).toString(),
      floorNumber: faker.number.int({ min: 1, max: 5 }),
      roomTypeId,
      status: RoomStatus.AVAILABLE,
      ...overrides,
    };
  }

  static createBooking(guestId: string, roomTypeId: string, overrides?: any) {
    const checkInDate = faker.date.future();
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + faker.number.int({ min: 1, max: 7 }));

    return {
      guestId,
      roomTypeId,
      checkInDate: checkInDate.toISOString().split('T')[0],
      checkOutDate: checkOutDate.toISOString().split('T')[0],
      numberOfGuests: faker.number.int({ min: 1, max: 4 }),
      ...overrides,
    };
  }

  static createProperty(overrides?: any) {
    return {
      name: 'Test Resort',
      tagline: 'A test property',
      domainUrl: 'test-resort.com',
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      email: faker.internet.email(),
      phone: faker.phone.number(),
      ...overrides,
    };
  }
}
