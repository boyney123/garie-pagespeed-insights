const cron = require('cron');
const { main } = require('./');
const influx = require('./influx');
const config = require('../config');
const pageSpeedInsights = require('./pagespeed-insights');

jest.mock('./influx', () => {
    return {
        init: jest.fn(),
        saveData: jest.fn(() => Promise.resolve())
    };
});

jest.mock('../config', () => {
    return {
        cron: '*/2 * * * *',
        urls: [{ url: 'https://www.test.com' }]
    };
});

jest.mock('./pagespeed-insights', () => {
    return {
        getData: jest.fn(() => Promise.resolve())
    };
});

jest.mock('cron', () => {
    return {
        CronJob: jest.fn()
    };
});

describe('main', () => {
    beforeEach(() => {
        influx.init.mockClear();
        cron.CronJob.mockClear();
        pageSpeedInsights.getData.mockClear();
    });

    it('calls to bootstrap the influx setup', async () => {
        await main();
        expect(influx.init).toBeCalled();
    });

    it('creates a cron job when cron is enabled', async () => {
        await main();

        const cronJobArgs = cron.CronJob.mock.calls[0];

        const cronValue = cronJobArgs[0];
        const timeZone = cronJobArgs[4];
        const startCronOnLoad = cronJobArgs[6];

        expect(cronValue).toEqual('*/2 * * * *');
        expect(timeZone).toEqual('Europe/London');
        expect(startCronOnLoad).toEqual(true);
    });

    it('cron calls to get data for all configured urls and saves the data into influxdb', async done => {
        await main();

        const cronJobArgs = cron.CronJob.mock.calls[0];
        const callback = cronJobArgs[1];

        // trigger cron
        callback();

        //Tidy this up?
        setTimeout(() => {
            expect(pageSpeedInsights.getData).toHaveBeenCalledWith('https://www.test.com');
            expect(influx.saveData).toHaveBeenCalled();
            done();
        }, 500);
    });
});
