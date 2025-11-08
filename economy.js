const { getUser, updateUser } = require('../utils/database');

function cmdSaldo(sender) {
  const user = getUser(sender);
  return `💰 *Saldo*: R$ ${user.balance.toLocaleString('pt-BR')}\n🌟 *Nível*: ${user.level} (${user.xp}/100 XP)`;
}

function cmdTrabalhar(sender) {
  const user = getUser(sender);
  const agora = Date.now();
  const cooldown = 300_000; // 5 minutos

  if (agora - user.lastWork < cooldown) {
    const restante = Math.ceil((cooldown - (agora - user.lastWork)) / 60_000);
    return `⏳ Você já trabalhou recentemente. Tente novamente em ${restante} minuto(s).`;
  }

  const ganho = Math.floor(Math.random() * 51) + 50; // R$50–R$100
  user.balance += ganho;
  user.xp += 10;
  user.lastWork = agora;

  // Level up
  if (user.xp >= 100) {
    user.level++;
    user.xp -= 100;
    updateUser(sender, user);
    return `👷 *${sender}* trabalhou e ganhou R$ ${ganho}!\n✨ Subiu para o nível ${user.level}!`;
  }

  updateUser(sender, user);
  return `👷 *${sender}* trabalhou e ganhou R$ ${ganho}! (+10 XP)`;
}

function cmdPagar(args, sender) {
  if (args.length < 2) return "💸 Uso: /pagar @número valor";
  const [alvoRaw, valorRaw] = args;
  const valor = parseInt(valorRaw);
  if (isNaN(valor) || valor <= 0) return "❌ Valor inválido.";

  const alvo = alvoRaw.replace(/\D/g, '');
  if (alvo.length < 8) return "❌ Número do alvo inválido.";

  const remetente = getUser(sender);
  if (remetente.balance < valor) return "📉 Saldo insuficiente.";

  remetente.balance -= valor;
  const destinatario = getUser(alvo);
  destinatario.balance += valor;

  updateUser(sender, remetente);
  updateUser(alvo, destinatario);

  return `✅ Transferência de R$ ${valor} para ${alvo} concluída!`;
}

module.exports = { cmdSaldo, cmdTrabalhar, cmdPagar };