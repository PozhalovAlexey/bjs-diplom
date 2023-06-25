"use strict";

const logout = new LogoutButton();
logout.action = function () {
  ApiConnector.logout((exit) => {
    if (exit) {
      location.reload();
    }
  });
};

function currentUser() {
  ApiConnector.current((response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    } else {
      console.error(
        "Ошибка при получении текущего авторизованного пользователя"
      );
    }
  });
}
currentUser();

const myRatesBoard = new RatesBoard();

function fetchRates() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      myRatesBoard.clearTable();
      myRatesBoard.fillTable(response.data);
    }
  });
}
fetchRates();
setInterval(fetchRates, 60000);

const myMoneyManager = new MoneyManager();

myMoneyManager.addMoneyCallback = function (data) {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      myMoneyManager.setMessage(true, "Успешно пополнен баланс");
    } else {
      myMoneyManager.setMessage(false, "Ошибка, баланс не пополнен");
    }
  });
};

myMoneyManager.conversionMoneyCallback = function ({
  fromCurrency,
  targetCurrency,
  fromAmount,
}) {
  console.log(
    fromCurrency,
    targetCurrency,
    fromAmount,
    "fromCurrency, targetCurrency, fromAmount "
  );
  ApiConnector.convertMoney(
    { fromCurrency, targetCurrency, fromAmount },
    (response) => {
      if (response.success) {
        ProfileWidget.showProfile(response.data);
        myMoneyManager.setMessage(true, "Конвертация произведена успешна");
      } else {
        myMoneyManager.setMessage(false, "Ошибка, конвертация не произведена");
      }
    }
  );
};

myMoneyManager.sendMoneyCallback = function ({ to, currency, amount }) {
  ApiConnector.transferMoney({ to, currency, amount }, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      myMoneyManager.setMessage(true, "Перевод произведен успешно");
    } else {
      myMoneyManager.setMessage(
        false,
        response.error || "Ошибка, перевод не произведен"
      );
    }
  });
};

const myFavoriteWidget = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
  if (response.success) {
    myFavoriteWidget.clearTable();
    myFavoriteWidget.fillTable(response.data);
    myMoneyManager.updateUsersList(response.data);
  }
});

myFavoriteWidget.addUserCallback = function ({ id, name }) {
  ApiConnector.addUserToFavorites({ id, name }, (response) => {
    if (response.success) {
      myFavoriteWidget.clearTable();
      myFavoriteWidget.fillTable({ id, name });
      myMoneyManager.updateUsersList({ id, name });
      myFavoriteWidget.setMessage(
        true,
        "Пользователь добавлен в список избранных"
      );
    } else {
      myFavoriteWidget.setMessage(
        false,
        "Ошибка, пользователь не добавлен в список избранных"
      );
    }
  });
};

myFavoriteWidget.removeUserCallback = function (id) {
  ApiConnector.removeUserFromFavorites(id, (response) => {
    if (response.success) {
      myFavoriteWidget.clearTable();
      myFavoriteWidget.fillTable(id);
      myMoneyManager.updateUsersList(id);
      myFavoriteWidget.setMessage(
        true,
        "Пользователь успешно удален из списка избранных"
      );
    } else {
      myFavoriteWidget.setMessage(
        false,
        "Ошибка, пользователь не был удален из списка избранных"
      );
    }
  });
};
