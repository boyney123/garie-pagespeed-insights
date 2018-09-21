const logger = require('../utils/logger');
const request = require('request-promise');

const getData = async url => {
    return new Promise(async (resolve, reject) => {
        logger.info(`Getting data for ${url}`);

        if (process.env.PAGESPEED_INSIGHTS_KEY === undefined) {
            return reject('Missing PAGESPEED_INSIGHTS_KEY');
        }

        try {
            const data = await request({
                uri: `https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=${url}&strategy=mobile&key=${process.env.PAGESPEED_INSIGHTS_KEY}`,
                json: true
            });
            const { pageStats } = data;
            const insightData = {};

            // convert any string values into ints
            Object.keys(pageStats).forEach(item => {
                const val = typeof pageStats[item] === 'string' ? parseInt(pageStats[item]) : pageStats[item];
                insightData[item] = val;
            });

            logger.info(`Successfull got data for ${url}`);
            resolve(insightData);
        } catch (err) {
            logger.warn(`Failed to get data for ${url}`, err);
            reject(`Failed to get data for ${url}`);
        }
    });
};

module.exports = {
    getData
};
