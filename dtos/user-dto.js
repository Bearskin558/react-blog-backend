export class UserDto {
  id;
  // email;
  name;
  avatarUrl;
  dateOfBirth;
  createdAt;
  bio;
  location;
  followers;
  following;
  constructor(model) {
    for (let key of Object.keys(this)) {
      this[key] = model[key];
    }
  }
}
