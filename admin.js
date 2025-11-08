function cmdBan(args, sender, isGroup, isOwner) {
  if (!isOwner) return "🔒 Apenas o dono do bot pode usar este comando.";
  if (!isGroup) return "🚫 Este comando só funciona em grupos.";
  if (!args.length) return "UsageId: /ban @membro";

  const alvo = args[0].replace(/\D/g, '');
  return `🔨 *${sender}* baniu ${alvo} do grupo (simulado — implemente com .removeParticipant())`;
}

function cmdKick(args, sender, isGroup, isOwner) {
  if (!isOwner) return "🔒 Apenas o dono do bot pode usar este comando.";
  if (!isGroup) return "🚫 Este comando só funciona em grupos.";
  const alvo = args[0]?.replace(/\D/g, '') || 'alguém';
  return `🦵 *${sender}* chutou ${alvo} do grupo.`;
}

module.exports = { cmdBan, cmdKick };