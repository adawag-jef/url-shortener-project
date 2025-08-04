/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from 'supertest';
import { server } from './setup';

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request(server)
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toEqual([]);
      });
  });
});
