"use strict";

if (!UserForm) {
  class UserForm {
    constructor() {}
  }
}

const newForm = new UserForm();

newForm.loginFormCallback = function (data) {
  ApiConnector.login(
    { data },
    (result) => {
      if (result.success) {
        console.log(`Пользователь ${result.data.login} авторизирован`);
        location.reload();
      } else {
        console.error(result.error);
      }
    },
    data
  );
};

newForm.registerFormCallback = function (data) {
  ApiConnector.register(
    { data },
    (result) => {
      if (result.success) {
        console.log(`Пользователь ${result.data.login} уже зарегистрирован`);
        location.reload();
      } else {
        console.error(result.error);
      }
    },
    data
  );
};
