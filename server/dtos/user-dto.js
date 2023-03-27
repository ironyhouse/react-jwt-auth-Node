// data transfer object
module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    // mongo ID - _id
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};
