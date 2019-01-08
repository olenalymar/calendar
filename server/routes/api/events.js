const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// get events
router.get('/', async (req, res) => {
  const events = await loadEventsCollection();
  res.send(await events.find({}).toArray());
});

// add an event
router.post('/', async (req, res) => {
  const events = await loadEventsCollection();
  await events.insertOne({
    start: req.body.start,
    duration: req.body.duration,
    title: req.body.title
  });
  res.status(201).send();
});

// delete the event
router.delete('/:id', async (req, res) => {
  const events = await loadEventsCollection();
  await events.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

async function loadEventsCollection() {
  const client = await mongodb.MongoClient.connect(
    'mongodb://lena:abc123@ds147033.mlab.com:47033/calendar',
    {
      useNewUrlParser: true
    }
  );

  return client.db('calendar').collection('events');
}

module.exports = router;
