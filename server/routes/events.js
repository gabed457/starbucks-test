var express = require('express');
var router = express.Router();
const {readFile} = require('fs/promises');
/* GET home page. */

const getAllEvents = async (_, res) => {
    res.send(JSON.parse(await readFile('./server/routes/events.json')))
}

const getEventType = async (req, res) => {
    const { eventType } = req.params;
    const data = JSON.parse(await readFile('./server/routes/events.json'));
    const result = data.filter((event) => {
        return event.type.toLowerCase() === eventType.toLowerCase();
    });
    return result.length ?
        res.send(result) :
        res.send({
            "error": `event type ${eventType} doesnt exist`
        })
}

router.route('/events/raw').get(getAllEvents);
router.route('/events/type/:eventType').get(getEventType);
module.exports = router;
