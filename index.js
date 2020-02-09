/* jshint esversion: 6 */
const ping = require('./ping');

const pkg = require('./package');
const tc = require('./timeconvert');
const cooldown = new Map();

const mysql = require('mysql2');
const config = require('config-yml');
const Rcon = require('modern-rcon');
const request = require('request');
const VK = require('node-vk-bot-api');
const execute = require('executive');

const db = mysql.createConnection(config.mysql);
db.connect(function(err) {
  if(err) {
  const log4js = require('log4js');
        log4js.configure({
        appenders: { database: { type: 'file', filename: './logs/mysql.log' } },
        categories: { default: { appenders: ['database'], level: 'error' } }
        });
  const logger = log4js.getLogger('database');
  logger.error(err);
  console.error("[!] Произошла ошибка при попытке подключиться к БД.");
  process.exit();
}
  else return console.info("[!] Успешное подключение к БД.");
});

const server1 = new Rcon(config.rcon.server1.host, port = config.rcon.server1.port, config.rcon.server1.pass);
const server2 = new Rcon(config.rcon.server2.host, port = config.rcon.server1.port, config.rcon.server2.pass);
const server3 = new Rcon(config.rcon.server3.host, port = config.rcon.server1.port, config.rcon.server3.pass);
const server4 = new Rcon(config.rcon.server4.host, port = config.rcon.server1.port, config.rcon.server4.pass);
const server5 = new Rcon(config.rcon.server5.host, port = config.rcon.server1.port, config.rcon.server5.pass);
const server6 = new Rcon(config.rcon.server6.host, port = config.rcon.server1.port, config.rcon.server6.pass);

const bot = new VK(config.vk);

bot.on(function(ctx) {
    var user = String(ctx.message.user_id || ctx.message.from_id);

    let donatstatus;
    db.query("SELECT * FROM rcon WHERE userid = ?", [user], (err, res) => {
      if(err) throw err;
      if(res.length < 1) { db.query("INSERT INTO rcon (userid) VALUES (?)", [user]); return; }
      donatstatus = res[0].accesslevel;

    const prfx = config.prefix;
  const message = ctx.message.body || ctx.message.text;
  const slicer = message.slice(prfx.length);
  if(message.indexOf(prfx) !== 0) return;
  const args = slicer.split(' ');
  const command = args.shift().toLowerCase();

  if(command === "help") {
  let chooseddonatstatus;
  if(donatstatus === "0") chooseddonatstatus = `${config.groups.player}`;
  if(donatstatus === "1") chooseddonatstatus = `${config.groups.donate}`;
  if(donatstatus === "2") chooseddonatstatus = `${config.groups.admin}`;

  let modecontrol;
  if(donatstatus === "1" || donatstatus === "2") modecontrol = `💥 Управление режимами:`;
  let modelist;
  if(donatstatus === "1" || donatstatus === "2") modelist = `🔥 Посмотреть список серверов - ${config.prefix}cmd`;
  let modesend;
  if(donatstatus === "1" || donatstatus === "2") modesend = `🔥 Отправить команду - ${config.prefix}cmd [сервер] [команда]`;

  let admincommands;
  if(donatstatus === "2") admincommands = `🚀 Команды администратора:`;
  let giveadmaccess;
  if(donatstatus === "2") giveadmaccess = `⛔ Выдать права администратора в боте - ${config.prefix}giveadmaccess`;
  let giveaccess;
  if(donatstatus === "2") giveaccess = `🔥 Выдать доступ к боту - ${config.prefix}giveaccess`;
  let remaccess;
  if(donatstatus === "2") remaccess = `🔥 Забрать доступ к боту - ${config.prefix}remaccess`;
  let remuser;
  if(donatstatus === "2") remuser = `🔥 Удалить пользователя из БД - ${config.prefix}remuser`;
  let logs;
  if(donatstatus === "2") logs = `🔥 Посмотреть лог-файлы бота - ${config.prefix}logs`;
  let clearlogs;
  if(donatstatus === "2") clearlogs = `🔥 Удалить лог-файлы бота - ${config.prefix}clearlogs`;
  let vdscontrol;
  if(donatstatus === "2") vdscontrol = `🔧 Управление сервером (VDS):`;
  let sendcommand;
  if(donatstatus === "2") sendcommand = `🔥 Отправить команду - ${config.prefix}send`;
  let vdsuptime;
  if(donatstatus === "2") vdsuptime = `🔥 Посмотреть время работы - ${config.prefix}uptime`;
  let vdsnmap;
  if(donatstatus === "2") vdsnmap = `🔥 Сканировать открытые порты - ${config.prefix}nmap [IP]`;
  let version;
  if(donatstatus === "2") version = `🔥 Узнать версию системы - ${config.prefix}version`;
  let users;
  if(donatstatus === "2") users = `🔥 Посмотреть список пользователей - ${config.prefix}users`;
  let activeusers;
  if(donatstatus === "2") activeusers = `🔥 Посмотреть список активных сессий - ${config.prefix}activeusers`;
  
  let webcontrol;
  if(donatstatus === "2") webcontrol = `🍁 Управление веб-сервером:`;
  let webstart;
  if(donatstatus === "2") webstart = `🔥 Запустить вебсервер - ${config.prefix}webstart`;
  let webstop;
  if(donatstatus === "2") webstop = `🔥 Остановить вебсервер - ${config.prefix}webstop`;
  let webkill;
  if(donatstatus === "2") webkill = `🔥 Аварийно остановить вебсервер - ${config.prefix}webkill`;
  
  

  let cw = cooldown.get(`${user}-srv1`);
  if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
  if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
        ctx.reply(`
⚡ Команды для игроков:

🔥 Купить донат - ${config.prefix}donate
🔥 Как зайти на сервер - ${config.prefix}join
🔥 Информация о сервере - ${config.prefix}ping
🔥 Информация о сайте - ${config.prefix}ip
🔥 Сгенерировать пароль - ${config.prefix}genpass

🤣 Фан-команды для игроков:

🔥 Узнать точность инфы - ${config.prefix}инфа
🔥 Узнать, да или нет - ${config.prefix}вариант

${modecontrol || ""}

${modelist || ""}
${modesend || ""}

${vdscontrol || ""}

${sendcommand || ""}
${vdsuptime || ""}
${vdsnmap || ""}
${version || ""}

${users || ""}
${activeusers || ""}

${webcontrol || ""}

${webstart || ""}
${webstop || ""}
${webkill || ""}

${admincommands || ""}

${logs || ""}
${clearlogs || ""}

${giveaccess || ""}
${remaccess || ""}
${remuser || ""}

🔒 Дополнительная защита аккаунта:

🔥 Привязать аккаунт к ВК - Привязать
🔥 Восстановить аккаунт - Восстановить

✳ Ваш доступ к боту: ${chooseddonatstatus}

${giveadmaccess || ""}

🌍 Со временем все команды будут дополняться!
        `);
    }
  if(command === "kick") {      
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);
        let id = args[0];
        if(!id) return ctx.reply(`⚠ Вы не указали ID пользователя.`);
    let chatid = String(ctx.message.peer_id);
        let chatidrel = chatid.replace('200000000', '');
        let chatiddone = Number(chatidrel);
    bot.execute("messages.getConversationMembers", { peer_id: 1 }, { group_id: 156372234 }, (result) => {
      console.log(result.is_admin)
    });
    bot.execute("utils.resolveScreenName", { screen_name: id }, (result) => {
      var numberid = result.object_id
    bot.execute("messages.removeChatUser", { user_id: numberid, chat_id: chatiddone }, (result) => {
      if(result == false) ctx.reply(`error`)
          console.log(result)
          });
        });
  }
  if(command === "info") {
    let cw = cooldown.get(`${user}-srv1`);
    if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
    if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
        ctx.reply(`
✍️ Кодеры: [id179175035|Влад] и [id391812762|Алексей]

ℹ️ Версия бота: ${config.version}

🙏 Данный бот выполнен для сервера ${config.information.name}
        `);
    }
  if(command === "donate") {
    let cw = cooldown.get(`${user}-srv1`);
    if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
    if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
        ctx.reply(`
⚡ Донат покупается только на сайте: ${config.information.site}
        `);
    }
  if(command === "join") {
    let cw = cooldown.get(`${user}-srv1`);
    if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
    if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
        ctx.reply(`
⚡ IP-адрес сервера: ${config.information.ip}
        `);
    }
    if(command === "ping") {
      let cw = cooldown.get(`${user}-srv1`);
      if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
      if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
        let addr = args[0];
        if(!addr) return ctx.reply('⚠ Вы не указали IP сервера.');
        let port = args[1];
        if(!port) {
            ping(addr, 25565, function(err, res) {
                if(err) return ctx.reply(`
❌ Произошла ошибка при выполнении команды.
Возможная причина ошибки: неверный порт, или сервера не существует.
`);
                ctx.reply(`
⚡ Запрос выполнен.

🔥 Имя сервера: ${res.server_name}
🔥 Версия сервера: ${res.minecraft_version}
🔥 Игроков на сервере: ${res.num_players}/${res.max_players}
🔥 Версия протокола: ${res.protocol_version}
🔥 Полный IP сервера: ${addr}:25565

⚠ Вы не указали порт, поэтому запрос отправился со стандартным портом (25565).
                `);
            }, 3000);
        } else {
          let cw = cooldown.get(`${user}-srv1`);
          if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
          if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
            ping(addr, port, function(err, res) {
                if(err) return ctx.reply(`
❌ Произошла ошибка при выполнении команды.
Возможная причина ошибки: неверный порт, или сервера не существует.
`);
                ctx.reply(`
⚡ Запрос выполнен.

🔥 Имя сервера: ${res.server_name}
🔥 Версия сервера: ${res.minecraft_version}
🔥 Игроков на сервере: ${res.num_players}/${res.max_players}
🔥 Версия протокола: ${res.protocol_version}
🔥 Полный IP сервера: ${addr}:${port}
                `);
            }, 3000);
        }
    }
    if(command === "ip") {
      let cw = cooldown.get(`${user}-srv1`);
      if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
      if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
        let addrsite = args.join(" ");
        if(!addrsite) return ctx.reply("⚠ Вы не указали IP/домен.");
        request(`http://ip-api.com/json/${addrsite}`, { json: true }, (err, res, body) => {
          if(body.status === "fail") return ctx.reply("❌ Данного ресурса не существует");
ctx.reply(`
⚡ Информация о ${addrsite}:

🔥 Айпи: ${body.query}
🔥 Страна: ${body.country}
🔥 Регион: ${body.regionName}
🔥 Город: ${body.city}
🔥 Провайдер: ${body.isp}
🔥 Организация: ${body.org}
🔥 Часовой пояс: ${body.timezone}
🔥 ZIP: ${body.zip || "Не указан"}
`);
      //console.log(body);
        });
    }
    if(command === "вариант") {
      let cw = cooldown.get(`${user}-srv1`);
      if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
      if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
         if(!args[0]) return ctx.reply(`⚠ Вы забыли указать аргумент.`);
         else {
         let choosed;
         var chtest = Math.floor(Math.random() * (2 - 1)) + 1;
         if(chtest === 1) choosed === "да";
         else choosed = "нет";
         return ctx.reply(`⚡ Я думаю что ${choosed}.`);
    }
  }
    if(command === "инфа") {
      let cw = cooldown.get(`${user}-srv1`);
      if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
      if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
        if(!args[0]) return ctx.reply(`⚠ Вы забыли указать аргумент.`);
        else return ctx.reply(`⚡ Это точно на ${Math.floor(Math.random() * (100 - 1)) + 1}%`);
    }
    if(command === "remuser") {
        if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);
        let useridforaccess = args[0];
        if(!useridforaccess) return ctx.reply(`⚠ Вы не указали ID пользователя.`);
        if(useridforaccess.includes('179175035') || useridforaccess.includes('391812762')) return ctx.reply(`❌ Данный пользователь имеет защиту.`);

        db.query("DELETE * FROM rcon WHERE userid = ?", [useridforaccess], (e, r) => {
        if(e) return ctx.reply(`❌ Данного пользователя невозможно удалить из базы данных`);
        return ctx.reply(`⚡ Из базы данных удалён пользователь @id${useridforaccess}`);
     });
    }
    if(command === "giveaccess") {
        if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);
        let useridforaccess = args[0];
        if(!useridforaccess) return ctx.reply(`⚠ Вы не указали ID пользователя.`);
        if(useridforaccess.includes('179175035') || useridforaccess.includes('391812762')) return ctx.reply(`❌ Данный пользователь имеет защиту.`);

        db.query("SELECT * FROM rcon WHERE userid = ?", [useridforaccess], (e, r) => {
          if(e) throw e;
          if(r.length < 1) { db.query("INSERT INTO rcon (userid) VALUES (?)", [useridforaccess]); return ctx.reply(`⚡ В базу данных добавлен пользователь @id${useridforaccess}\n\n⚡ Для выдачи прав, напишите команду повторно.`); }
          else { db.query("UPDATE rcon SET accesslevel = '1' WHERE userid = ?", [useridforaccess]); return ctx.reply(`⚡ Доступ выдан пользователю @id${useridforaccess}`); }
        });
    }
    if(command === "giveadmaccess") {
        if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);
        let useridforaccess = args[0];
        if(!useridforaccess) return ctx.reply(`⚠ Вы не указали ID пользователя.`);
        if(useridforaccess.includes('179175035') || useridforaccess.includes('391812762')) return ctx.reply(`❌ Данный пользователь имеет защиту.`);

        db.query("SELECT * FROM rcon WHERE userid = ?", [useridforaccess], (e, r) => {
          if(e) throw e;
          if(r.length < 1) { db.query("INSERT INTO rcon (userid) VALUES (?)", [useridforaccess]); return; }
          else { db.query("UPDATE rcon SET accesslevel = '2' WHERE userid = ?", [useridforaccess]); return ctx.reply(`⚡ Права администратора выданы пользователю @id${useridforaccess}`); }
        });
    }
    if(command === "remaccess") {
        if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);
        let useridforaccess = args[0];
        if(!useridforaccess) return ctx.reply(`⚠ Вы не указали ID пользователя.`);
        if(useridforaccess.includes('179175035') || useridforaccess.includes('391812762')) return ctx.reply(`❌ Данный пользователь имеет защиту.`);

        db.query("SELECT * FROM rcon WHERE userid = ?", [useridforaccess], (e, r) => {
          if(e) throw e;
          if(r.length < 1) { db.query("INSERT INTO rcon (userid) VALUES (?)", [useridforaccess]); return; }
          else { db.query("UPDATE rcon SET accesslevel = '0' WHERE userid = ?", [useridforaccess]); return ctx.reply(`⚡ Доступ отобран у пользователя @id${useridforaccess}`); }
        });
    }

    if(command === "cmd") {
        let chooseddonatstatus;
        if(donatstatus === "0") chooseddonatstatus = `${config.groups.player}`;
        if(donatstatus === "1") chooseddonatstatus = `${config.groups.donate}`;
        if(donatstatus === "2") chooseddonatstatus = `${config.groups.admin}`;

        let servers;
        if(donatstatus === "2") servers = `🔥 Доступные сервера: ${config.rcon.server1.name}, ${config.rcon.server2.name}, ${config.rcon.server3.name}, ${config.rcon.server4.name}, ${config.rcon.server5.name}, ${config.rcon.server6.name}`;
        if(donatstatus === "1") servers = `🔥 Доступные сервера: ${config.rcon.server1.name}, ${config.rcon.server2.name}, ${config.rcon.server3.name}`;
        if(donatstatus === "0") servers = "🔥 Доступные сервера: нет";

        if(!args[0] || args[0] === "") return ctx.reply(`
💥 Управление режимами:

🔥 Отправить команду: ${config.prefix + command} [сервер] [команда]

${servers}

✳ Ваш статус: ${chooseddonatstatus}
            `);
        if(args[0] === "status") {
                return ctx.reply(`✳ Ваш статус: ${chooseddonatstatus}`)
            }
        if(args[0] === "servers") {
            if(donatstatus === "2") return ctx.reply(`
⚡ Доступные сервера: sb, surv, prc, bungee, auth, lobby

✳ Ваш статус: ${chooseddonatstatus}
`);
            if(donatstatus === "1") return ctx.reply(`
⚡ Доступные сервера: sb, surv, prc

✳ Ваш статус: ${chooseddonatstatus}
`);
        if(args[0] === `${config.rcon.server1.name}`) {
            if(donatstatus < "1") return ctx.reply(`${config.errors.admin}`);
            const log4js = require('log4js');
              log4js.configure({
                appenders: { server1: { type: 'file', filename: './logs/commands.log' } },
                categories: { default: { appenders: ['server1'], level: 'info' } }
              });
            const logger = log4js.getLogger('server1');
            var consolestring = args.slice(1).join(" ");
            var currentdate = Date.now;
            if(!consolestring) return ctx.reply(`⚠ Вы не указали команду.`);
            if(consolestring.includes('sudo') || consolestring.includes('pex') || consolestring.includes('op') || consolestring.includes('deop') || consolestring.includes('stop') || consolestring.includes('restart') || consolestring.includes('reload') || consolestring.includes('save-off') || consolestring.includes('save-on') || consolestring.includes('save-all')) return ctx.reply(`❌ Данная команда запрещена.`);

            let cw = cooldown.get(`${user}-srv1`);
            if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
            if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);

            server1.connect().then(() => {
                logger.info(`Пользователь ${user} использовал команду ${consolestring}`);
                // console.info(`Authed to ${config.rcon.host}:${config.rcon.port}`);
                return server1.send(consolestring);
            }).then(res => {
              let otvet = res.replace(/§./g, '');
ctx.reply(`
⚡ Запрос выполнен.

${otvet || "Сервер вернул пустой ответ."}
`);
            }).then(() => {
                // console.info(`Command has been sended. Disconnecting..\n`);
                return rcon.disconnect();
            });
        }
        if(args[0] === `${config.rcon.server2.name}`) {
            if(donatstatus < "1") return ctx.reply(`${config.errors.admin}`);
            const log4js = require('log4js');
                log4js.configure({
                  appenders: { server2: { type: 'file', filename: './logs/commands.log' } },
                  categories: { default: { appenders: ['server2'], level: 'info' } }
                });
            const logger = log4js.getLogger('server2');
            var consolestring = args.slice(1).join(" ");
            if(!consolestring) return ctx.reply(`⚠ Вы не указали команду.`);
            if(consolestring.includes('sudo') || consolestring.includes('pex') || consolestring.includes('op') || consolestring.includes('deop') || consolestring.includes('stop') || consolestring.includes('restart') || consolestring.includes('reload') || consolestring.includes('save-off') || consolestring.includes('save-on') || consolestring.includes('save-all')) return ctx.reply(`❌ Данная команда запрещена.`);

            let cw = cooldown.get(`${user}-srv1`);
            if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
            if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);

            server2.connect().then(() => {
              logger.info(`Пользователь ${user} использовал команду ${consolestring}`);
                // console.info(`Authed to ${config.rcon.host}:${config.rcon.port}`);
                return server2.send(consolestring);
            }).then(res => {
              let otvet = res.replace(/§./g, '');
ctx.reply(`
⚡ Запрос выполнен.

${otvet || "Сервер вернул пустой ответ."}
`);
            }).then(() => {
                // console.info(`Command has been sended. Disconnecting..\n`);
                return server2.disconnect();
            });
        }
        if(args[0] === `${config.rcon.server3.name}`) {
            if(donatstatus < "1") return ctx.reply(`${config.errors.admin}`);
            const log4js = require('log4js');
                  log4js.configure({
                    appenders: { server3: { type: 'file', filename: './logs/commands.log' } },
                    categories: { default: { appenders: ['server3'], level: 'info' } }
                  });
            const logger = log4js.getLogger('server3');
            var consolestring = args.slice(1).join(" ");
            if(!consolestring) return ctx.reply(`⚠ Вы не указали команду.`);
            if(consolestring.includes('sudo') || consolestring.includes('pex') || consolestring.includes('op') || consolestring.includes('deop') || consolestring.includes('stop') || consolestring.includes('restart') || consolestring.includes('reload') || consolestring.includes('save-off') || consolestring.includes('save-on') || consolestring.includes('save-all')) return ctx.reply(`❌ Данная команда запрещена.`);

            let cw = cooldown.get(`${user}-srv1`);
            if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
            if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);

            server3.connect().then(() => {
              logger.info(`Пользователь ${user} использовал команду ${consolestring}`);
                // console.info(`Authed to ${config.rcon.host}:${config.rcon.port}`);
                return server3.send(consolestring);
            }).then(res => {
              let otvet = res.replace(/§./g, '');
ctx.reply(`
⚡ Запрос выполнен.

${otvet || "Сервер вернул пустой ответ."}
`);
            }).then(() => {
                // console.info(`Command has been sended. Disconnecting..\n`);
                return server3.disconnect();
            });
        }

        if(args[0] === `${config.rcon.server4.name}`) {
            if(donatstatus === "0") return ctx.reply(`${config.errors.donate}`);
            if(donatstatus === "1") return ctx.reply(`${config.errors.server}`);

            const log4js = require('log4js');
                  log4js.configure({
                    appenders: { server4: { type: 'file', filename: './logs/commands.log' } },
                    categories: { default: { appenders: ['server4'], level: 'info' } }
                  });
            const logger = log4js.getLogger('server4');
            var consolestring = args.slice(1).join(" ");
            if(!consolestring) return ctx.reply(`⚠ Вы не указали команду.`);
            // if(consolestring.includes('sudo') || consolestring.includes('pex') || consolestring.includes('op') || consolestring.includes('deop') || consolestring.includes('stop') || consolestring.includes('restart') || consolestring.includes('reload') || consolestring.includes('save-off') || consolestring.includes('save-on') || consolestring.includes('save-all')) return ctx.reply(`❌ Данная команда запрещена.`);

            // let cw = cooldown.get(user);
            // if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
            // if(status !== true) cooldown.set(user, Date.now() + 1000 * 900);

            server4.connect().then(() => {
              logger.info(`Пользователь ${user} использовал команду ${consolestring}`);
                // console.info(`Authed to ${config.rcon.host}:${config.rcon.port}`);
                return server4.send(consolestring);
            }).then(res => {
              let otvet = res.replace(/§./g, '');
ctx.reply(`
⚡ Запрос выполнен.

${otvet || "Сервер вернул пустой ответ."}
`);
            }).then(() => {
                // console.info(`Command has been sended. Disconnecting..\n`);
                return bungee.disconnect();
            });
        }
        if(args[0] === "auth") {
            if(donatstatus === "0") return ctx.reply(`${config.errors.donate}`);
            if(donatstatus === "1") return ctx.reply(`${config.errors.server}`);

            const log4js = require('log4js');
                  log4js.configure({
                    appenders: { Auth: { type: 'file', filename: './logs/commands.log' } },
                    categories: { default: { appenders: ['Auth'], level: 'info' } }
                  });
            const logger = log4js.getLogger('Auth');
            var consolestring = args.slice(1).join(" ");
            if(!consolestring) return ctx.reply(`⚠ Вы не указали команду.`);
            // if(consolestring.includes('sudo') || consolestring.includes('pex') || consolestring.includes('op') || consolestring.includes('deop') || consolestring.includes('stop') || consolestring.includes('restart') || consolestring.includes('reload') || consolestring.includes('save-off') || consolestring.includes('save-on') || consolestring.includes('save-all')) return ctx.reply(`❌ Данная команда запрещена.`);

            // let cw = cooldown.get(user);
            // if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
            // if(status !== true) cooldown.set(user, Date.now() + 1000 * 900);

            auth.connect().then(() => {
              logger.info(`Пользователь ${user} использовал команду ${consolestring}`);
                // console.info(`Authed to ${config.rcon.host}:${config.rcon.port}`);
                return auth.send(consolestring);
            }).then(res => {
              let otvet = res.replace(/§./g, '');
ctx.reply(`
⚡ Запрос выполнен.

${otvet || "Сервер вернул пустой ответ."}
`);
            }).then(() => {
                // console.info(`Command has been sended. Disconnecting..\n`);
                return auth.disconnect();
            });
        }
        if(args[0] === "lobby") {
            if(donatstatus === "0") return ctx.reply(`${config.errors.donate}`);
            if(donatstatus === "1") return ctx.reply(`${config.errors.server}`);

            const log4js = require('log4js');
                  log4js.configure({
                    appenders: { Lobby: { type: 'file', filename: './logs/commands.log' } },
                    categories: { default: { appenders: ['Lobby'], level: 'info' } }
                  });
            const logger = log4js.getLogger('Lobby');
            var consolestring = args.slice(1).join(" ");
            if(!consolestring) return ctx.reply(`⚠ Вы не указали команду.`);
            // if(consolestring.includes('sudo') || consolestring.includes('pex') || consolestring.includes('op') || consolestring.includes('deop') || consolestring.includes('stop') || consolestring.includes('restart') || consolestring.includes('reload') || consolestring.includes('save-off') || consolestring.includes('save-on') || consolestring.includes('save-all')) return ctx.reply(`❌ Данная команда запрещена.`);

            // let cw = cooldown.get(user);
            // if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
            // if(status !== true) cooldown.set(user, Date.now() + 1000 * 900);

            lobby.connect().then(() => {
              logger.info(`Пользователь ${user} использовал команду ${consolestring}`);
                // console.info(`Authed to ${config.rcon.host}:${config.rcon.port}`);
                return lobby.send(consolestring);
            }).then(res => {
              let otvet = res.replace(/§./g, '');
ctx.reply(`
⚡ Запрос выполнен.

${otvet || "Сервер вернул пустой ответ."}
`);
            }).then(() => {
                // console.info(`Command has been sended. Disconnecting..\n`);
                return lobby.disconnect();
            });
        }
    }
    //Команда для генерации пароля:
    if(command === "genpass") {
      let cw = cooldown.get(`${user}-srv1`);
      if(cw !== undefined && (cw - Date.now()) / 1000 > 0) return ctx.reply(`❌ Воу-воу! Полегче! Подождите ${tc((cw - Date.now()) / 1000 | 0)} чтобы дальше использовать команду!`);
      if(donatstatus < "2") cooldown.set(`${user}-srv1`, Date.now() + 1000 * 60);
      if(!args[0]) return ctx.reply(`⚠ Необходимо указать число от 6 до 20`);
      else {
         let length = args[0];
         let dict = `${config.genpass.dict}`;
         for(var i = 0; i < 18; i++){
         let gen1 = dict.charAt(Math.floor(Math.random() * dict.length));
         let gen2 = gen1 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen3 = gen2 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen4 = gen3 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen5 = gen4 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen6 = gen5 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen7 = gen6 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen8 = gen7 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen9 = gen8 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen10 = gen9 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen11 = gen10 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen12 = gen11 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen13 = gen12 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen14 = gen13 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen15 = gen14 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen16 = gen15 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen17 = gen16 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen18 = gen17 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen19 = gen18 + dict.charAt(Math.floor(Math.random() * dict.length));
         let gen20 = gen19 + dict.charAt(Math.floor(Math.random() * dict.length));

         if(length === "6") return ctx.reply(`⚡ Сгенерированный пароль: ${gen6}`);
         if(length === "7") return ctx.reply(`⚡ Сгенерированный пароль: ${gen7}`);
         if(length === "8") return ctx.reply(`⚡ Сгенерированный пароль: ${gen8}`);
         if(length === "9") return ctx.reply(`⚡ Сгенерированный пароль: ${gen9}`);
         if(length === "10") return ctx.reply(`⚡ Сгенерированный пароль: ${gen10}`);
         if(length === "11") return ctx.reply(`⚡ Сгенерированный пароль: ${gen11}`);
         if(length === "12") return ctx.reply(`⚡ Сгенерированный пароль: ${gen12}`);
         if(length === "13") return ctx.reply(`⚡ Сгенерированный пароль: ${gen13}`);
         if(length === "14") return ctx.reply(`⚡ Сгенерированный пароль: ${gen14}`);
         if(length === "15") return ctx.reply(`⚡ Сгенерированный пароль: ${gen15}`);
         if(length === "16") return ctx.reply(`⚡ Сгенерированный пароль: ${gen16}`);
         if(length === "17") return ctx.reply(`⚡ Сгенерированный пароль: ${gen17}`);
         if(length === "18") return ctx.reply(`⚡ Сгенерированный пароль: ${gen18}`);
         if(length === "19") return ctx.reply(`⚡ Сгенерированный пароль: ${gen19}`);
         if(length === "20") return ctx.reply(`⚡ Сгенерированный пароль: ${gen20}`);
       }
    }
  }
    //Команда для просмотра версии ОС на VDS:
    if(command === "version") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);

       execute('lsb_release -a', (err, res, body) => {
       if(err) return ctx.reply(`❌ Произошла ошибка.`);
       let otvet = res.replace('Distributor ID', '🔥 Дистрибутив');
       let otvet1 = otvet.replace('Description', '🔥 Описание');
       let otvet2 = otvet1.replace('Release', '🔥 Версия');
       let otvet3 = otvet2.replace('Codename', '🔥 Кодовое имя');
       ctx.reply(`${otvet3 || "⚠ Превышено время ожидания."}`);
     });
    }
    //Команда для просмотра времени бесперерывной работы VDS:
    if(command === "uptime") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);

       execute('uptime', (err, res, body) => {
       if(err) return ctx.reply(`❌ Произошла ошибка при выполнении команды.`);
       let otvet = res.replace(' up', ', бесперерывная работа -');
       let otvet1 = otvet.replace('days', 'дней');
       let otvet2 = otvet1.replace('day', 'день');
       let otvet3 = otvet2.replace('min', 'минут');
       let otvet4 = otvet3.replace('user', 'пользователь');
       let otvet5 = otvet4.replace('users', 'пользователей');
       let otvet6 = otvet5.replace('load average', 'средняя загрузка');
       ctx.reply(`🔥 Текущее время - ${otvet6}`);
     });
    }
    //Команда для сканирования портов через nmap:
    if(command === "nmap") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);
       var ip = args.join(" ");
       if(!ip) return ctx.reply("⚠ Вы не указали IP сервера.");

       execute("nmap " + ip, (err, res, body) => {
       if(err) return ctx.reply(`⚠ Превышено время ожидания.`);
       let otvet = res.replace('Starting Nmap', 'Запускаем Nmap версии');
       let otvet1 = otvet.replace('( https://nmap.org ) at', '');
       let otvet2 = otvet1.replace('Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn', 'Предупреждение: сервер недоступен');
       let otvet3 = otvet2.replace('Nmap scan report for', 'Результат сканирования по');
       let otvet4 = otvet3.replace('Host is up', 'Сервер работает');
       let otvet5 = otvet4.replace('s latency', ' секунд задержки');
       let otvet6 = otvet5.replace('Other addresses for', 'Остальные адреса по');
       let otvet7 = otvet6.replace('not scanned', 'не сканируются');
       let otvet8 = otvet7.replace('Not shown:', 'Не показываются');
       let otvet9 = otvet8.replace('closed ports', 'закрытых портов');
       let otvet10 = otvet9.replace('PORT', ' ');
       let otvet11 = otvet10.replace('STATE', ' ');
       let otvet12 = otvet11.replace('SERVICE', ' ');
       let otvet13 = otvet12.replace('Nmap done', 'Сканирование завершено');
       let otvet14 = otvet13.replace('addresses', 'адресов');
       let otvet15 = otvet14.replace('address', 'адрес');
       let otvet16 = otvet15.replace('hosts up', 'хостов');
       let otvet17 = otvet16.replace('host up', 'хост');
       let otvet18 = otvet17.replace('scanned in', 'сканирован за');
       let otvet19 = otvet18.replace('seconds', 'секунд');
       ctx.reply(`${otvet19 || "⚠ Превышено время ожидания."}`);
     });
    }
    //Команда для просмотра всех пользователей на VDS:
    if(command === "users") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);

       execute(`sed 's/:.*//' /etc/passwd`, (err, res, body) => {
       if(err) return ctx.reply(`❌ Произошла ошибка при выполнении команды.`);
       ctx.reply(`
⚡ Ниже выведен список всех пользователей:
  
${res || "⚠ Не найдено ни одного пользователя."}
`);
     });
    }
    //Команда для просмотра активных пользователей на VDS:
    if(command === "activeusers") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);

       execute('who', (err, res, body) => {
       if(err) return ctx.reply(`❌ Произошла ошибка при выполнении команды.`);
       ctx.reply(`
⚡ Ниже выведен список активных сессий:

${res || "⚠ Не найдено ни одного активного пользователя."}
`);
     });
    }
    //Команда для запуска apache2:
    if(command === "webstart") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);

       execute('systemctl start apache2', (err, res, body) => {
       if(err) return ctx.reply(`❌ Произошла ошибка.`);
       ctx.reply(`✔ Веб-сервер успешно запущен.`);
     });
    }
    //Команда для остановки apache2:
    if(command === "webstop") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);

       execute('systemctl stop apache2', (err, res, body) => {
       if(err) return ctx.reply(`❌ Произошла ошибка.`);
       ctx.reply(`✔ Веб-сервер успешно остановлен.`);
     });
    }
    //Команда для очистки логов RCON:
    if(command === "clearlogs") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);

       execute('cd logs && rm -rf commands.log', (err, res, body) => {
       if(err) return ctx.reply(`❌ Файла с логами не существует.`);
       ctx.reply(`✔ Лог-файлы бота успешно очищены.`);
     });
    }
    //Команда для просмотра логов RCON:
    if(command === "logs") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);

       execute('cd logs && cat commands.log', (err, res, body) => {
       if(err) return ctx.reply(`❌ Файла с логами не существует.`);
       ctx.reply(`${res || "⚠ В логах не найдено ни одной записи."}`);
     });
    }
    //Выполнить команду на VDS:
    /*if(command === "send") {
    if(donatstatus < "2") return ctx.reply(`${config.errors.donate}`);
    const log4js = require('log4js');
              log4js.configure({
                appenders: { VDS: { type: 'file', filename: './logs/send.log' } },
                categories: { default: { appenders: ['VDS'], level: 'info' } }
        });
        const logger = log4js.getLogger('VDS');
        var consolestring = args.join(" ");
        if(!consolestring) return ctx.reply("⚠ Не указан код выполнения");
    if(consolestring.includes('user') || consolestring.includes('add')) return ctx.reply(`❌ Данная команда запрещена.`);

        execute(consolestring, (err, res, body) => {
      logger.info(`Пользователь ${user} использовал команду ${consolestring}`);
            if(err) return ctx.reply(`
❌ Произошла ошибка при выполнении команды:

${err || "Сервер вернул пустой ответ."}
            `);
            ctx.reply(`
⚡ Запрос выполнен.

${res || "Сервер вернул пустой ответ."}
            `);
        });*/
    }
    });
});

bot.startPolling(() => console.info('[!] Бот успешно запущен!'));
