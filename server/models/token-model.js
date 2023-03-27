const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  // User link
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  // refresh token
  refreshToken: { type: String, required: true },
});

model.export = model('Token', UserSchema);
