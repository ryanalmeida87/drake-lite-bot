const { nanoid } = require('nanoid');

function cmdDado(args) {
  const lados = args[0] && !isNaN(args[0]) ? Math.max(4, Math.min(100, parseInt(args[0]))) : 6;
  const resultado = Math.floor(Math.random() * lados) + 1;
  return `🎲 *Dado de ${lados} lados*: _${resultado}_`;
}

function cmdDrake(args) {
  const op1 = args[0] || "usar Drake Bot";
  const op2 = args[1] || "usar bot genérico";
  return `
*DRK-CHOICE™*

⬆️ ${op2}
⬇️ ${op1}
`.trim();
}

function cmd8ball(args) {
  if (!args.length) return "🎱 Faça uma pergunta! Ex: /8ball vou ganhar na loteria?";
  const respostas = [
    "Sim", "Não", "Talvez", "Provavelmente", "Improvável",
    "Concentre-se e pergunte novamente", "Não conte com isso", "Sim, definitivamente",
    "Minhas fontes dizem que não", "Melhor não te dizer agora"
  ];
  return `🎱 *${args.join(' ')}*\n→ _${respostas[Math.floor(Math.random() * respostas.length)]}_`;
}

function cmdRoubo(args, sender) {
  const alvo = args[0] || "alguém";
  const sucesso = Math.random() > 0.5;
  return sucesso
    ? `👮 *${sender}* roubou 💰150 de *${alvo}*! Fugiu sem ser pego!`
    : `🚨 *${sender}* tentou roubar *${alvo}*... mas foi pego! Multa de 💰50.`;
}

module.exports = { cmdDado, cmdDrake, cmd8ball, cmdRoubo };