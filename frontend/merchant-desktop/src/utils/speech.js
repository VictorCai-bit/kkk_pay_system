// 语音播报工具
export const speak = (text) => {
  if ('speechSynthesis' in window) {
    // 停止之前的播报
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('浏览器不支持语音合成');
  }
};

// 播报收款金额
export const speakPayment = (amount) => {
  const text = `收款到账 ${amount} 元`;
  speak(text);
};
