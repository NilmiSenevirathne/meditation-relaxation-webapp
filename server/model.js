const {ObjectId} = require('mongodb');

function getModels(db) {
  return {
    users: db.collection('users'),
    sessions: db.collection('sessions'),
    
  };
}

module.exports = {
  getModels,
  ObjectId,
};