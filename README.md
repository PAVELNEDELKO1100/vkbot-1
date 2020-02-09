# KingVK

Многофункциональный бот для группы ВК на NodeJS

## Описание

Данный бот был создан командой KingNetwork для удалённого контроля VDS сервера, а также Minecraft-серверов по RCON. В нём существуют 3 группы пользователей - Игрок, Донатер и Администратор. Названия групп можно изменить в файле config.yml

## Используемые модули

* [mysql2](https://www.npmjs.com/package/mysql2) - Хранение данных о пользователях в MySQL
* [config-yml](https://www.npmjs.com/package/config-yml) - Хранение конфигурации в yml
* [modern-rcon](http://npmjs.com/package/modern-rcon) - Связь с Minecraft-сервером по RCON
* [request](https://www.npmjs.com/package/request) - Получение информации о сайте
* [node-vk-bot-api](https://www.npmjs.com/package/node-vk-bot-api) - API для ботов ВКонтакте
* [executive](https://www.npmjs.com/package/executive) - Используется в каждой команде
* [log4js](https://www.npmjs.com/package/log4js) - Логирование команд


### Быстрая установка модулей

Для установки модулей можно использовать npm

```
npm install
```

### Конфигурация

Все нужные значения можно сменить в файле config.yml
