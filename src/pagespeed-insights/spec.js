const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const { getData } = require('./');
const pageSpeedInsightData = require('../../test/mock-data/pagespeed-insights.json');

const nock = require('nock');

nock('https://www.googleapis.com')
    .get('/pagespeedonline/v4/runPagespeed?url=www.test.co.uk&strategy=mobile&key=1234')
    .reply(200, pageSpeedInsightData);

describe('pagespeed-insights', () => {
    describe('getData', () => {
        it('should reject if no API key is defined', async () => {
            delete process.env.PAGESPEED_INSIGHTS_KEY;
            await expect(getData('www.test.co.uk')).rejects.toEqual('Missing PAGESPEED_INSIGHTS_KEY');
            process.env.PAGESPEED_INSIGHTS_KEY = '1234';
        });

        it('should make a request to get page speed data from google and return pageStats data', async () => {
            const data = await getData('www.test.co.uk');
            expect(data).toEqual(pageSpeedInsightData.pageStats);
        });

        it('should reject when failing to make the request to get page speed insight data', async () => {
            nock('https://www.googleapis.com')
                .get('/pagespeedonline/v4/runPagespeed?url=www.test.co.uk&strategy=mobile&key=1234')
                .reply(500);

            await expect(getData('www.test.co.uk')).rejects.toEqual('Failed to get data for www.test.co.uk');
        });
    });
});
