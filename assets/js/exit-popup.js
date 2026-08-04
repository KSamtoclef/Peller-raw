window.setupWhiteWeddingExitPopup = function setupWhiteWeddingExitPopup(config) {
  let allowExit = false;
  const modal = document.getElementById('exitModal');
  const stay = document.getElementById('stayButton');
  const leave = document.getElementById('leaveButton');

  history.pushState({stay:true},'',location.href);
  window.addEventListener('popstate',() => {
    if (allowExit) return;
    history.pushState({stay:true},'',location.href);
    modal.classList.add('show');
  });

  stay.addEventListener('click',() => modal.classList.remove('show'));
  leave.addEventListener('click',() => {
    allowExit = true;
    const url = (config.facebookExitUrl || '').trim();
    if (url) location.href = url;
    else history.go(-2);
  });
};
