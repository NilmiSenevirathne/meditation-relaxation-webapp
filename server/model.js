const {ObjectId} = require('mongodb');

function getModels(db) {
  return {
    users: db.collection('users'),
    sessions: db.collection('sessions'),
    history: db.collection('history'),
    feedback: db.collection('feedback'),
  };
}

module.exports = {
  getModels,
  ObjectId,
};