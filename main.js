const fs = require('fs-extra');
const path = require('path');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { initDB } = require('./utils/database');

// Caminhos
const CONFIG_FILE = path.join(__dirname, 'config', 'settings.json');
const SESSION_DIR = path.join(__dirname, 'sessions');

// Carrega config
let config = require(CONFIG_FILE);

// Verifica/define dono
async function setupOwner() {
  if (!config.owner) {
    console.log(chalk.bold.blue('\n👋 Bem-vindo ao Drake Lite Bot!'));
    const { number } = await inquirer.prompt([
      {
        type: 'input',
        name: 'number',
        message: 'Digite seu número (ex: 5511912345678):',
        validate: input => (/^\d{10,15}$/.test(input) ? true : 'Número inválido!')
      }
    ]);
    config.owner = number;
    fs.writeJSONSync(CONFIG_FILE, config, { spaces: 2 });
    console.log(chalk.green(`✅ Número salvo: ${number}`));
  }
}

// Carrega comandos dinamicamente
function loadCommands() {
  const commands = {};
  const cmdDir = path.join(__dirname, 'commands');
  const files = fs.readdirSync(cmdDir).filter(f => f.endsWith('.js'));

  files.forEach(file => {
    const module = require(path.join(cmdDir, file));
    Object.keys(module).forEach(key => {
      if (key.startsWith('cmd')) {
        const cmdName = key.substring(3).toLowerCase(); // cmdPing → ping
        commands[cmdName] = module[key];
      }
    });
  });

  console.log(chalk.yellow(`📦 ${Object.keys(commands).length} comandos carregados.`));
  return commands;
}

// Inicia
(async () => {
  await setupOwner();
  await initDB();

  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: SESSION_DIR }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    }
  });

  const commands = loadCommands();

  client.on('qr', (qr) => {
    console.log(chalk.red('\n📸 QR CODE gerado. Escaneie com o WhatsApp:'));
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', async () => {
    console.log(chalk.green.bold('\n🟢 WhatsApp conectado!'));
    await client.sendMessage(`${config.owner}@c.us`, `✅ *${config.botName}* está online!\nDigite \`${config.prefix}menu\` para começar.`);
  });

  client.on('message', async msg => {
    const body = msg.body;
    const sender = msg.from.split('@')[0];
    const isGroup = msg.from.endsWith('@g.us');
    const isOwner = sender === config.owner;

    // Ignora mensagens do próprio bot
    if (msg.fromMe) return;

    // Comando?
    if (body.startsWith(config.prefix)) {
      const args = body.slice(config.prefix.length).trim().split(/ +/);
      const cmd = args.shift()?.toLowerCase();

      if (cmd && commands[cmd]) {
        try {
          const handler = commands[cmd];
          const reply = handler(
            args,
            sender,
            isGroup,
            isOwner
          );

          if (typeof reply === 'string' && reply) {
            await msg.reply(reply);
          }
        } catch (e) {
          await msg.reply(`❌ Erro no comando ${cmd}: ${e.message}`);
        }
      } else if (config.autoReplyUnknown) {
        await msg.reply(`❓ Comando \`${cmd}\` não encontrado. Use \`${config.prefix}menu\`.`);
      }
    }
  });

  client.initialize();
})();