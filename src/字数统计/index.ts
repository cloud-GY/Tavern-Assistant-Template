// 配置开关
const IGNORE_TAGS = true; // 是否忽略 <标签>内容</标签> 格式
const COUNT_REASONING = true; // 是否统计思考内容

function updateWordCount(messageId: number) {
  const messageElement = $(`.mes[mesid="${messageId}"]`);
  if (messageElement.length === 0) return;
  
  const tokenElement = messageElement.find('.tokenCounterDisplay');
  if (tokenElement.length === 0) return;
  
  const tokenMatch = tokenElement.text().match(/(\d+)t/);
  if (!tokenMatch) return;
  
  const mesText = messageElement.find('.mes_text').clone();
  mesText.find('details').remove();
  let content = mesText.text();
  
  if (IGNORE_TAGS) {
    content = content.replace(/<[^>]+>.*?<\/[^>]+>/gs, '');
  }
  
  const contentCount = content.length;
  let reasoningCount = 0;
  
  if (COUNT_REASONING) {
    let reasoning = messageElement.find('.mes_reasoning').text();
    if (IGNORE_TAGS) {
      reasoning = reasoning.replace(/<[^>]+>.*?<\/[^>]+>/gs, '');
    }
    reasoningCount = reasoning.length;
  }
  
  const tokenCount = tokenMatch[1];
  const newText = COUNT_REASONING && reasoningCount > 0
    ? `${tokenCount}t(${reasoningCount}+${contentCount})`
    : `${tokenCount}t(${contentCount})`;
  
  tokenElement.text(newText);
}

$(() => {
  eventOn(tavern_events.MESSAGE_RECEIVED, (messageId) => {
    setTimeout(() => updateWordCount(Number(messageId)), 200);
  });
  
  eventOn(tavern_events.MESSAGE_UPDATED, (messageId) => {
    setTimeout(() => updateWordCount(Number(messageId)), 200);
  });
  
  eventOn(tavern_events.STREAM_REASONING_DONE, (_, __, messageId) => {
    setTimeout(() => updateWordCount(messageId), 200);
  });
});
