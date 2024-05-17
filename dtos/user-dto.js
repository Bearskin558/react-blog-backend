export class UserDto {
  id;
  email;
  // password;
  name;
  avatarUrl;
  dateOfBirth;
  createdAt;
  updatedAt;
  bio;
  location;
  posts;
  following;
  followers;
  like;
  comments;
  isFollowing;
  constructor(model) {
    for (let key of Object.keys(this)) {
      this[key] = model[key];
    }
  }
}
