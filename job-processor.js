const axios = require('axios').default;

/**
 * makes a HTTP Get call to hit localhost:port/events/raw
 * @param {string} eventUrl - raw event API url
 * @return {object} response.data
 */
async function getRawEvents(url) {
    let result = await axios.get(url);
    return result.data;
    // await axios.get('http://localhost:8000/events/raw');
}

/**
 * makes a HTTP Get call to hit localhost:port/events/raw
 * @param {string} eventUrl - raw event API url
 * @return {object} response.data
 */
async function getEventsByType(url, eventType) {
    let result = await axios.get(url);
    return result.data;

}

/**
 * Special job to transform and return the following
 *
 *  {
 *      "SUCCEEDED": {
 *          "total_time": 1241,
 *          "catalog_items": [1, 3, 4, 5]
 *      },
 *      FAILED: {
 *          "total_time": 1650,
 *          "catalog_items": [2, 11, 12]
 *      }
 *  }
 *
 * Runtime:
 * Space:
 * @param {string} eventUrl - raw event API url
 * @return {object} transformed objects
 */
async function specialJob(eventUrl) {
    let result = await axios.get(eventUrl);
    result = result.data;
    const successItems = result.filter(getSuccessItems)

    function getSuccessItems(el) {
        let type = el.type;
        return type.toLowerCase() === 'AUTOMATIC'.toLowerCase() && el.payload.status === "SUCCEEDED";
    }
    let successTotalTime = 0;
    let successCatalogIds = [];
    for (let i = 0; i < successItems.length; i++) {
        let time = successItems[i].payload.time;
        time = time.replace(/\D+/g, '');
        if (time.length > 0) {
            successTotalTime += parseInt(time);
        }
        successCatalogIds.push(successItems[i].payload.catalog_id);
    }
    successCatalogIds.sort((a,b) => a-b);
    const failedItems = result.filter(getFailedItems);
    let failedTotalTime = 0;
    let failedCatalogIds = [];
    for (let i = 0; i < failedItems.length; i++) {
        let time = failedItems[i].payload.time;
        time = time.replace(/\D+/g, '');
        if (time.length > 0) {
            failedTotalTime += parseInt(time);
        }
        failedCatalogIds.push(failedItems[i].payload.catalog_id);
    }
    function getFailedItems(el) {
        let type = el.type;
        return type.toLowerCase() === 'AUTOMATIC'.toLowerCase() && el.payload.status === "FAILED";
    }
    failedCatalogIds.sort((a,b) => a-b);
    let resJSON = {
        "SUCCEEDED": {
            "total_time": successTotalTime,
            "catalog_items": successCatalogIds
        },
        "FAILED": {
            "total_time": failedTotalTime,
            "catalog_items": failedCatalogIds
        }
    }
    return resJSON

}

module.exports = {
    getRawEvents: getRawEvents,
    getEventsByType: getEventsByType,
    specialJob: specialJob
}
