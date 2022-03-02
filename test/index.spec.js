const chai = require('chai');
const chaiHttp = require('chai-http');
const JobProcessor = require('../job-processor');
const PORT = process.env.PORT || 8000;
const server = require('../server/index')(PORT);
const should = chai.should();
const expect = chai.expect();
const baseURL = `http://localhost:${PORT}`;
const fs = require('fs');

chai.use(chaiHttp);

describe('Data tasks verification', () => {
    after(function () {
        server.close()
    })

    it('Calling getRawEvents() should return all raw events', (done) => {
        const storedRawEvents = require("../server/routes/events.json")
        const rawEventUrl = `${baseURL}/events/raw`;
        JobProcessor.getRawEvents(rawEventUrl).then((res) => {
            res.should.eql(storedRawEvents);
        }).catch((error) => {
            expect.fail(error);
        })
        done();
    });

    it('Calling getEventsByType() with legit event type should return data', (done) => {
        const expectedEventCountsByType = {
            'MANUAL': 2,
            'mAnuAL': 2,
            'AUTOMATIC': 7,
            'AUTOMatic': 7,
            'HYBRID': 1,
            'HybrID': 1
        }

        const eventUrl = `${baseURL}/events/type/`;

        Object.entries(expectedEventCountsByType).map(([evtType, expectedCount]) => {
            const url = eventUrl + evtType;
            JobProcessor.getEventsByType(url, evtType).then((res) => {
                res.length.should.eql(expectedCount);
            }).catch((error) => {
                expect.fail(error);
            })
        })
        done();
    })

    it('Calling getEventsByType() with bad data should return error message', (done) => {
        const badEventTypes = ["abc", "nosucheventtype"]
        const eventUrl = `${baseURL}/events/type/`;

        badEventTypes.map((evtType) => {
            const url = eventUrl + evtType;
            JobProcessor.getEventsByType(url, evtType).then((res) => {
                res.error.should.eql('event type ' + evtType.toString() + ' doesnt exist');
            }).catch((error) => {
                expect.fail(error);
            })
        })
        done();
    })

    it('Calling specialJob() should return expectedOutput', (done) => {
        const expectedOutput = {
            FAILED: {total_time: 1650, catalog_items: [2, 11, 12]},
            SUCCEEDED: {total_time: 1241, catalog_items: [1, 3, 4, 5]}
        }

        const rawEventUrl = `${baseURL}/events/raw`;
        JobProcessor.specialJob(rawEventUrl).then((res) => {
            res.should.eql(expectedOutput);
        }).catch((error) => {
            expect.fail(error);
        })
        done();
    });
});
