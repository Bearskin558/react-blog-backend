export const schemaRegistration = {
  email: {
    errorMessage: 'Необходимо ввести корректный email',
    isEmail: true,
  },
  password: {
    isLength: {
      options: { min: 6, max: 20 },
      errorMessage: 'Пароль должен быть от 6 до 20 символов',
    },
  },
  name: {
    errorMessage: 'Необходимо ввести имя',
    isLength: {
      options: { min: 3 },
      errorMessage: 'Имя должно быть больше 3 символов',
    },
  },
};

export const schemaLogin = {
  email: {
    errorMessage: 'Необходимо ввести корректный email',
    isEmail: true,
  },
  password: {
    isLength: {
      options: { min: 6, max: 20 },
      errorMessage: 'Пароль должен быть от 6 до 20 символов',
    },
  },
};
