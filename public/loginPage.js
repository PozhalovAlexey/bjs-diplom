"use strict";

if (!UserForm) {
  class UserForm {
    constructor() {}
  }
}

const newForm = new UserForm();

newForm.loginFormCallback = function ({ login, password }) {
  ApiConnector.login(
    { login, password },
    (result) => {
      console.log(result, "resultresult");
      if (result.success) {
        console.log(`Пользователь ${result.userId} авторизирован`);
        location.reload();
      } else {
        console.error(result.error);
      }
    },
    (e) => {
      console.log(e, "ZHOPA");
    }
  );
};

newForm.registerFormCallback = function ({ login, password }) {
  ApiConnector.register({ login, password }, (result) => {
    if (result.success) {
      console.log(`Пользователь ${result.data.login} уже зарегистрирован`);
      location.reload();
    } else {
      console.error(result.error);
    }
  });
};
