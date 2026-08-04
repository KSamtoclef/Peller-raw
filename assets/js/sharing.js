window.createWhiteWeddingSharing = function createWhiteWeddingSharing({config,state,save,showScreen,showResult}) {
  let openedAt = 0;
  let opened = false;
  let lastTap = 0;

  function update() {
    const required = config.requiredShares;
    const percent = Math.min(100, Math.round((state.shareProgress / required) * 100));
    state.shareComplete = state.shareProgress >= required;

    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressCount').textContent = `${state.shareProgress} of ${required} completed`;
    document.getElementById('progressMessage').textContent = state.shareComplete
      ? 'Sharing completed. Your gift page is ready.'
      : state.shareProgress > 0
        ? 'Progress saved. Continue sharing and return here.'
        : 'Share on WhatsApp to begin.';

    document.getElementById('progressRing').style.setProperty('--progress', `${percent * 3.6}deg`);
    document.getElementById('progressBarFill').style.width = percent + '%';

    const openButton = document.getElementById('openGiftPage');
    openButton.disabled = !state.shareComplete;
    openButton.textContent = state.shareComplete ? 'OPEN MY GIFT PAGE' : 'COMPLETE SHARING TO UNLOCK';
    save();
  }

  function openWhatsApp() {
    const now = Date.now();
    if (now - lastTap < config.shareCooldownMs) return;
    lastTap = now;
    opened = true;
    openedAt = now;
    const url = location.href.split('#')[0];
    location.href = `https://wa.me/?text=${encodeURIComponent(config.shareMessage + '\n' + url)}`;
  }

  function handleReturn() {
    if (!opened) return;
    const away = Date.now() - openedAt;
    opened = false;

    if (away < config.minimumWhatsAppAwayMs) {
      showResult('⚠️','Share Not Counted','Complete the WhatsApp step before returning to update your progress.',false);
      return;
    }

    if (state.shareProgress < config.requiredShares) {
      state.shareProgress += 1;
      update();
      showResult(
        state.shareComplete ? '✓' : '↗',
        state.shareComplete ? 'Sharing Completed' : 'Progress Updated',
        state.shareComplete
          ? 'Your selected gift page is ready.'
          : `${state.shareProgress} of ${config.requiredShares} celebration shares completed.`,
        !state.shareComplete
      );
    }
  }

  document.getElementById('shareTopButton').addEventListener('click', openWhatsApp);
  document.getElementById('shareStickyButton').addEventListener('click', openWhatsApp);
  document.getElementById('openGiftPage').addEventListener('click', () => {
    if (state.shareComplete) showScreen('finalScreen');
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) handleReturn();
  });
  window.addEventListener('focus', handleReturn);

  return {update,openWhatsApp};
};
