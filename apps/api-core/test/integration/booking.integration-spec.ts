import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { TestDatabaseHelper } from '../utils/test-database.helper';
import { TestDataFactory } from '../utils/test-data.factory';

describe('Booking Integration Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let guestId: string;
  let roomTypeId: string;
  let roomId: string;

  beforeAll(async () => {
    dataSource = await TestDatabaseHelper.setupTestDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Create test user and login
    const user = TestDataFactory.createUser({ role: 'FRONT_DESK' });
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(user);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });

    authToken = loginResponse.body.access_token;

    // Create test guest
    const guest = TestDataFactory.createGuest();
    const guestResponse = await request(app.getHttpServer())
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${authToken}`)
      .send(guest);
    guestId = guestResponse.body.id;

    // Create test room type
    const roomType = TestDataFactory.createRoomType();
    const roomTypeResponse = await request(app.getHttpServer())
      .post('/api/v1/room-types')
      .set('Authorization', `Bearer ${authToken}`)
      .send(roomType);
    roomTypeId = roomTypeResponse.body.id;

    // Create test room
    const room = TestDataFactory.createRoom(roomTypeId);
    const roomResponse = await request(app.getHttpServer())
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${authToken}`)
      .send(room);
    roomId = roomResponse.body.id;
  });

  afterAll(async () => {
    await TestDatabaseHelper.closeDatabase(dataSource);
    await app.close();
  });

  afterEach(async () => {
    // Clean booking data after each test
    await dataSource.getRepository('Booking').delete({});
  });

  describe('POST /api/v1/bookings', () => {
    it('should create a booking successfully', async () => {
      const booking = TestDataFactory.createBooking(guestId, roomTypeId);

      const response = await request(app.getHttpServer())
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(booking)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        bookingNumber: expect.stringMatching(/^BH\d{10}$/),
        guestId,
        roomTypeId,
        status: 'DRAFT',
        totalAmount: expect.any(Number),
      });
    });

    it('should fail without authentication', async () => {
      const booking = TestDataFactory.createBooking(guestId, roomTypeId);

      await request(app.getHttpServer())
        .post('/api/v1/bookings')
        .send(booking)
        .expect(401);
    });

    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/v1/bookings', () => {
    it('should return all bookings', async () => {
      const booking = TestDataFactory.createBooking(guestId, roomTypeId);
      await request(app.getHttpServer())
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(booking);

      const response = await request(app.getHttpServer())
        .get('/api/v1/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Complete Booking Flow', () => {
    it('should complete full check-in checkout flow', async () => {
      // 1. Create booking
      const booking = TestDataFactory.createBooking(guestId, roomTypeId);
      const bookingResponse = await request(app.getHttpServer())
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(booking)
        .expect(201);

      const bookingId = bookingResponse.body.id;

      // 2. Update payment status
      await request(app.getHttpServer())
        .patch(`/api/v1/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          paidAmount: bookingResponse.body.totalAmount,
          paymentMethod: 'CREDIT_CARD',
          status: 'CONFIRMED',
        })
        .expect(200);

      // 3. Assign room
      await request(app.getHttpServer())
        .patch(`/api/v1/bookings/${bookingId}/assign-room/${roomId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // 4. Check in
      const checkInResponse = await request(app.getHttpServer())
        .post(`/api/v1/bookings/${bookingId}/check-in`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(checkInResponse.body.status).toBe('CHECKED_IN');

      // 5. Check out
      const checkOutResponse = await request(app.getHttpServer())
        .post(`/api/v1/bookings/${bookingId}/check-out`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(checkOutResponse.body.status).toBe('CHECKED_OUT');
    });
  });
});
