const request = require('supertest');
const express = require('express');
const router = express.Router();
const { getData } = require('../../pagespeed-insights');
const { saveData } = require('../../influx');
// const saveReport = require('../../utils/save-report');

const { app } = require('../../');

jest.mock('../../pagespeed-insights', () => {
    return {
        getData: jest.fn(() => Promise.resolve())
    };
});

jest.mock('../../influx', () => {
    return {
        saveData: jest.fn(() => Promise.resolve())
    };
});

// jest.mock('../../utils/save-report', () => jest.fn());

describe('webhooks', () => {
    beforeEach(() => {
        getData.mockClear();
        saveData.mockClear();
        // saveReport.mockClear();
    });

    describe('/collect', () => {
        it('returns a 400 when no url is given in the payload', async () => {
            await request(app)
                .post('/collect')
                .set('Accept', 'application/json')
                .expect(400);
        });

        it('returns a 500 when trying to getData from pagespeed-insights but it fails', async () => {
            getData.mockRejectedValue();

            await request(app)
                .post('/collect')
                .send({ url: 'https://www.example.co.uk' })
                .set('Accept', 'application/json')
                .expect(500);
        });

        it('returns a 500 when trying to save pagespeed-insights data into influxdb but it fails', async () => {
            saveData.mockRejectedValue();

            await request(app)
                .post('/collect')
                .send({ url: 'https://www.example.co.uk' })
                .set('Accept', 'application/json')
                .expect(500);
        });

        it('returns a 201 with pagespeed-insights report when successfully getting data from pagespeed-insights', async done => {
            saveData.mockResolvedValue();
            getData.mockResolvedValue();

            request(app)
                .post('/collect')
                .send({ url: 'https://www.example.co.uk' })
                .set('Accept', 'application/json')
                .expect(201)
                .end(err => {
                    expect(saveData).toHaveBeenCalled();
                    done();
                });
        });
    });
});
