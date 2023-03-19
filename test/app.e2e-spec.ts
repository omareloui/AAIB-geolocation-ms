import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ProvidedAtm, ProvidedAtmsWDistance } from 'src/types';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /atm gets all atms', async () => {
    const response = await request(app.getHttpServer()).get('/atm');

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThan(400);
  });

  it('GET /atm?function=full%20function gets atms with "Full Function" functionality', async () => {
    const response = await request(app.getHttpServer()).get(
      '/atm?function=full%20function',
    );

    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtm[] = response.body;

    expect(
      atms
        .map((x) => x.functionality.every((x) => x === 'Full Function'))
        .every((x: boolean) => x === true),
    ).toBeTruthy();
  });

  it("GET /atm?function=full will ignore the search value as it's not valid functionality", async () => {
    const response = await request(app.getHttpServer()).get(
      '/atm?function=full',
    );

    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtm[] = response.body;

    expect(
      atms
        .map((x) => x.functionality.every((x) => x === 'Full Function'))
        .some((x: boolean) => x === false),
    ).toBeTruthy();
  });

  it('GET /atm?any=october searches every field for october', async () => {
    const response = await request(app.getHttpServer()).get('/atm?any=october');
    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtm[] = response.body;
    const regex = /october/i;
    expect(
      atms
        .map(
          (x) =>
            !!x.name.match(regex) ||
            !!x.governorateName.match(regex) ||
            !!x.location.match(regex),
        )
        .every((x) => x === true),
    ).toBeTruthy();
  });

  it('GET /atm?name=October&function=Cash%20Dispenser&type=payroll will filter with those values', async () => {
    const response = await request(app.getHttpServer()).get(
      '/atm?name=October&function=Cash%20Dispenser&type=payroll',
    );
    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtm[] = response.body;
    expect(
      atms
        .map(
          (x) =>
            x.name.match(/october/i) &&
            x.functionality.every((f) => f === 'Cash Dispenser') &&
            x.type === 'Payroll',
        )
        .every((x) => x === true),
    ).toBeTruthy();
  });

  it('GET /atm/:id gets the atm with that id', async () => {
    const response = await request(app.getHttpServer()).get('/atm/216');
    expect(response.statusCode).toEqual(200);

    const atm: ProvidedAtm = response.body;

    expect(atm.name).toEqual('Oberoi Hotel Sahl Hashish');
    expect(atm.location).toEqual('Sahl Hashish');
    expect(atm.governorateName).toEqual('Hurghada');
    expect(atm.functionality[0]).toEqual('Full Function');
    expect(atm.type).toEqual('Off-site');
  });

  it('GET /atm/:id/nearest will get the nearest atms to that atm with a range of 5', async () => {
    const response = await request(app.getHttpServer()).get('/atm/216/nearest');
    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtmsWDistance = response.body;
    expect(
      atms.map((x) => x.distance <= 5).every((x) => x === true),
    ).toBeTruthy();
  });

  it('GET /atm/:id/nearest?range=10 will get the nearest atms to that atm with a range of 10', async () => {
    const response = await request(app.getHttpServer()).get('/atm/216/nearest');
    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtmsWDistance = response.body;
    expect(
      atms.map((x) => x.distance <= 10).every((x) => x === true),
    ).toBeTruthy();
  });

  it('POST /atm creates the provided atm', async () => {
    const testingId = 18000000000;
    // To make sure it doesn't exist
    await request(app.getHttpServer()).delete(`/atm/${testingId}`);
    try {
      const response = await request(app.getHttpServer())
        .post('/atm')
        .send({
          sr: 10000,
          atmId: testingId,
          name: {
            en: 'some name in English',
            ar: 'some name in arabic',
          },
          location: {
            en: 'some location in English',
            ar: 'some location in arabic',
          },
          governorateName: {
            en: 'some gov in English',
            ar: 'some gov in arabic',
          },
          googleLatitude: 1.0,
          googleLongitude: 1.0,
          type: 'Branch',
          functionality: 'Full Function',
        });

      expect(response.statusCode).toEqual(201);

      const createdAtmResponse = await request(app.getHttpServer()).get(
        `/atm/${testingId}`,
      );

      expect(createdAtmResponse.statusCode).toEqual(200);

      const atm: ProvidedAtm = createdAtmResponse.body;

      expect(atm.sr).toEqual(10000);
      expect(atm.atmId).toEqual(testingId);
      expect(atm.name).toEqual('some name in English');
      expect(atm.location).toEqual('some location in English');
      expect(atm.governorateName).toEqual('some gov in English');
      expect(atm.googleLatitude).toEqual(1.0);
      expect(atm.googleLongitude).toEqual(1.0);
      expect(atm.type).toEqual('Branch');
      expect(atm.functionality[0]).toEqual('Full Function');
    } finally {
      await request(app.getHttpServer()).delete(`/atm/${testingId}`);
    }
  });

  it('GET /nearest?long=29.9758463498444&lat=31.140855486405 will get the nearest atms with a range of 5', async () => {
    const response = await request(app.getHttpServer()).get(
      '/nearest?long=29.9758463498444&lat=31.140855486405',
    );

    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtmsWDistance = response.body;
    expect(
      atms.map((x) => x.distance <= 5).every((x) => x === true),
    ).toBeTruthy();
  });

  it('GET /nearest?long=29.9758463498444&lat=31.140855486405 will get the nearest atms with a range of 10', async () => {
    const response = await request(app.getHttpServer()).get(
      '/nearest?long=29.9758463498444&lat=31.140855486405',
    );

    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtmsWDistance = response.body;
    expect(
      atms.map((x) => x.distance <= 10).every((x) => x === true),
    ).toBeTruthy();
  });

  it('GET /nearest/:id will get the nearest atms to that atm', async () => {
    const response = await request(app.getHttpServer()).get('/nearest/214');

    expect(response.statusCode).toEqual(200);

    const atms: ProvidedAtmsWDistance = response.body;
    expect(
      atms.map((x) => x.distance <= 5).every((x) => x === true),
    ).toBeTruthy();
  });

  it('DELETE /atm/:id deletes the atm with that id', async () => {
    const testingId = 100000000000000;
    await request(app.getHttpServer())
      .post('/atm')
      .send({
        sr: 1000990,
        atmId: testingId,
        name: {
          en: 'some name in English',
          ar: 'some name in arabic',
        },
        location: {
          en: 'some location in English',
          ar: 'some location in arabic',
        },
        governorateName: {
          en: 'some gov in English',
          ar: 'some gov in arabic',
        },
        googleLatitude: 1.0,
        googleLongitude: 1.0,
        type: 'Branch',
        functionality: 'Full Function',
      });

    const res = await request(app.getHttpServer()).delete(`/atm/${testingId}`);
    expect(res.statusCode).toEqual(200);

    const getAfterDeleteRes = await request(app.getHttpServer()).get(
      `/atm/${testingId}`,
    );
    expect(getAfterDeleteRes.statusCode).toEqual(404);
  });

  it.todo('PUT /atm/:id updates the atm with that id');
});
