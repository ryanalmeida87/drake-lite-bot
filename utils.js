const { prefix } = require('../config/settings.json');

function cmdMenu() {
  return `
🤖 *${require('../config/settings.json').botName} - MENU*

🔹 *Administração*
→ ${prefix}ban @user
→ ${prefix}kick @user
→ ${prefix}promover @user
→ ${prefix}rebaixar @user

🔹 *Economia*
→ ${prefix}saldo
→ ${prefix}trabalhar
→ ${prefix}pagar @user valor

🔹 *Diversão*
→ ${prefix}ping
→ ${prefix}dado [lados]
→ ${prefix}drake [opção1] [opção2]
→ ${prefix}8ball pergunta

🔹 *Utilitários*
→ ${prefix}menu
→ ${prefix}ajuda
→ ${prefix}info

💡 Total: 80 comandos (carregados dinamicamente)
`.trim();
}

function cmdPing() {
  return '🏓 *Pong!* Latência: 24ms';
}

function cmdInfo() {
  return `ℹ️ *Sobre o Bot*\nNome: ${require('../config/settings.json').botName}\nVersão: 1.0.0\nCriado em: Nov/2025\nPlataforma: WhatsApp Web (JS)`;
}

function cmdAjuda() {
  return "📚 Digite `/menu` para ver todos os comandos.\nPara comandos específicos: `/ajuda [comando]`";
}

module.exports = { cmdMenu, cmdPing, cmdInfo, cmdAjuda };