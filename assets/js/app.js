(()=>{'use strict';
const config=window.WHITE_WEDDING_CONFIG;
const gifts=window.WHITE_WEDDING_GIFTS;
const $=id=>document.getElementById(id);
let state={
  name:'',phone:'',gift:'',network:'',stage:'landingScreen',shareProgress:0,shareComplete:false,
  pageLiked:false,localLikes:0,localShares:0,userComments:[],liveComments:[],commentLikes:{},
  nextPerson:0,usedComments:[]
};
function load(){try{const saved=JSON.parse(localStorage.getItem(config.storageKey)||'null');if(saved)state={...state,...saved}}catch(e){}}
function save(){try{localStorage.setItem(config.storageKey,JSON.stringify(state))}catch(e){}}
function firstName(){return state.name.trim().split(/\s+/)[0]||'Friend'}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));state.stage=id;save();$('stickyShare').style.display=id==='shareScreen'?'block':'none';scrollTo({top:0,behavior:'smooth'});if(id==='shareScreen')renderShare();if(id==='finalScreen')renderFinal();conversation?.render()}
function giftImage(g,className='gift-image'){return `<img class="${className}" src="${g.image}" alt="${g.imageAlt}">`}
function giftSummary(id,compact=false){const g=gifts[id];return `<div class="gift-icon">${giftImage(g)}</div><div><strong>${g.title}</strong><span>${compact?'Selected gift':g.description}</span></div>`}
function renderLandingBadges(){
  const badges=$('giftBadges');if(!badges)return;
  badges.innerHTML=Object.entries(gifts).map(([id,g])=>`<button class="visual-badge" data-quick-gift="${id}"><span class="gift-badge-image">${giftImage(g,'badge-gift-image')}</span><strong>${id==='data'?'Up to 100GB':id==='cash'?'Up to ₦50,000':g.title}</strong></button>`).join('');
  badges.querySelectorAll('[data-quick-gift]').forEach(button=>button.onclick=()=>selectGift(button.dataset.quickGift));
}
function selectGift(id){state.gift=id;save();$('giftSheet').classList.remove('show');$('giftSheet').setAttribute('aria-hidden','true');$('selectedGiftSummary').innerHTML=giftSummary(id);showScreen('registerScreen')}
function runTransition(next){$('transitionOverlay').classList.add('show');const titles=['Saving Your Selection…','Preparing Your Next Step…','Ready to Continue'];let i=0;$('transitionTitle').textContent=titles[0];const timer=setInterval(()=>{i+=1;$('transitionTitle').textContent=titles[i]||titles[2];if(i===2){clearInterval(timer);setTimeout(()=>{$('transitionOverlay').classList.remove('show');next()},500)}},650)}
function submitRegistration(){const name=$('fullName').value.trim(),phone=$('phoneNumber').value.replace(/\s+/g,'');const validName=name.length>=3,validPhone=/^(?:\+?234|0)[789][01]\d{8}$/.test(phone);$('fullNameError').classList.toggle('show',!validName);$('phoneError').classList.toggle('show',!validPhone);if(!validName||!validPhone)return;state.name=name;state.phone=phone;save();runTransition(()=>state.gift==='data'?showScreen('dataScreen'):showScreen('shareScreen'))}
function renderNetworks(){const networks=['MTN','Airtel','Glo','9mobile'];$('networkOptions').innerHTML=networks.map(n=>`<button class="network-option ${state.network===n?'selected':''}" data-network="${n}">${n}</button>`).join('');document.querySelectorAll('[data-network]').forEach(b=>b.onclick=()=>{state.network=b.dataset.network;save();renderNetworks();$('dataProceed').disabled=false})}
function renderShare(){const g=gifts[state.gift];$('sharePersonalCopy').textContent=`${firstName()}, complete the WhatsApp sharing step to continue with your selected gift.`;$('shareGiftBadge').innerHTML=giftSummary(state.gift,true);sharing.update()}
function showShareResult(icon,title,text,again){$('shareResultIcon').textContent=icon;$('shareResultTitle').textContent=title;$('shareResultText').textContent=text;$('shareResultAgain').style.display=again?'block':'none';$('shareResultPrimary').textContent=state.shareComplete?'OPEN MY GIFT PAGE':'CONTINUE';$('shareResultModal').classList.add('show')}
function renderFinal(){const selected=state.gift;$('finalPersonalCopy').textContent=`${firstName()}, continue below with the gift option you selected.`;const order=[selected,...Object.keys(gifts).filter(id=>id!==selected),'status'];$('giftDestinationList').innerHTML=order.map(id=>{if(id==='status')return `<div class="destination-card"><div class="destination-head"><div class="destination-icon status-icon">✓</div><div><h3>Request Status</h3></div></div><p>Check the current status of your gift request.</p><button class="btn btn-burgundy" data-destination="status">CHECK MY REQUEST STATUS</button><div id="destination-note-status" class="destination-note">This destination will be added during setup.</div></div>`;const g=gifts[id];return `<div class="destination-card ${id===selected?'selected':''}"><div class="destination-head"><div class="destination-icon">${giftImage(g,'destination-gift-image')}</div><div><h3>${g.title}</h3>${id===selected?'<small>YOUR SELECTED GIFT</small>':''}</div></div><p>${g.description}</p><button class="btn btn-burgundy" data-destination="${id}">${g.action}</button><div id="destination-note-${id}" class="destination-note">This destination will be added during setup.</div></div>`}).join('');document.querySelectorAll('[data-destination]').forEach(b=>b.onclick=()=>{const url=config.giftLinks[b.dataset.destination];if(url)location.href=url;else{const note=$(`destination-note-${b.dataset.destination}`);note.classList.add('show');setTimeout(()=>note.classList.remove('show'),2600)}})}
async function sharePage(){state.localShares+=1;save();const data={title:'Peller & Jarvis White Wedding Fan Gifts',text:'Peller & Jarvis White Wedding Fan Gifts',url:location.href.split('#')[0]};try{if(navigator.share)await navigator.share(data);else sharing.openWhatsApp()}catch(e){}conversation.render()}
load();
$('demoBanner').textContent=config.demoBanner;$('demoBanner').style.display=config.demoBanner?'block':'none';
$('heroImage').addEventListener('error',()=>{$('heroImage').style.display='none';$('heroFallback').style.display='grid'});
renderLandingBadges();
window.renderGiftSelector(selectGift);
$('openGiftSelector').onclick=()=>{$('giftSheet').classList.add('show');$('giftSheet').setAttribute('aria-hidden','false')};
$('closeGiftSelector').onclick=()=>{$('giftSheet').classList.remove('show');$('giftSheet').setAttribute('aria-hidden','true')};
$('giftSheet').addEventListener('click',e=>{if(e.target===$('giftSheet'))$('closeGiftSelector').click()});
$('registrationProceed').onclick=submitRegistration;
renderNetworks();$('dataProceed').onclick=()=>runTransition(()=>showScreen('shareScreen'));
document.addEventListener('click',e=>{const target=e.target.closest('[data-screen]');if(target)showScreen(target.dataset.screen)});
const sharing=window.createWhiteWeddingSharing({config,state,save,showScreen,showResult:showShareResult});
$('shareResultPrimary').onclick=()=>{$('shareResultModal').classList.remove('show');if(state.shareComplete)showScreen('finalScreen')};
$('shareResultAgain').onclick=()=>{$('shareResultModal').classList.remove('show');sharing.openWhatsApp()};
const conversation=window.createWhiteWeddingConversation({state,save,sharePage});
window.setupWhiteWeddingExitPopup(config);
if(state.name){$('fullName').value=state.name;$('phoneNumber').value=state.phone}
if(state.gift)$('selectedGiftSummary').innerHTML=giftSummary(state.gift);
if(state.network){renderNetworks();$('dataProceed').disabled=false}
const restored=state.shareComplete?'finalScreen':state.stage||'landingScreen';showScreen(restored);
window.resetWhiteWeddingGiftPreview=()=>{localStorage.removeItem(config.storageKey);location.reload()};
})();
