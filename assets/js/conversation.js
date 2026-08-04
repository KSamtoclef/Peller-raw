window.createWhiteWeddingConversation = function createWhiteWeddingConversation({state,save,sharePage}) {
  const library = window.WHITE_WEDDING_CONVERSATION;
  let timer = null;
  let typingTimer = null;

  const esc = value => String(value || '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[char]));
  const pick = list => list[Math.floor(Math.random() * list.length)];

  function nextPerson() {
    const person = library.people[state.nextPerson % library.people.length];
    state.nextPerson = (state.nextPerson + 1) % library.people.length;
    return person;
  }

  function freshTopic() {
    const groups = Object.values(library.topics);
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const text = pick(pick(groups));
      if (!state.usedComments.includes(text)) {
        state.usedComments.push(text);
        state.usedComments = state.usedComments.slice(-300);
        return text;
      }
    }
    return pick(pick(groups));
  }

  function freshReply() {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const text = pick(library.replies);
      if (!state.usedComments.includes('reply:' + text)) {
        state.usedComments.push('reply:' + text);
        return text;
      }
    }
    return pick(library.replies);
  }

  function makeComment() {
    const latest = state.liveComments.find(comment => !comment.replyTo);
    const isReply = latest && Math.random() < 0.34;
    return {
      id: 'live-' + Date.now() + Math.random().toString(36).slice(2,6),
      name: nextPerson(),
      text: isReply ? freshReply() : freshTopic(),
      replyTo: isReply ? latest.name : '',
      likes: Math.floor(Math.random() * 46) + 2,
      timestamp: Date.now(),
      fresh: true
    };
  }

  function age(timestamp) {
    const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (seconds < 50) return 'now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm';
    return Math.floor(minutes / 60) + 'h';
  }

  function allComments() {
    return [...state.userComments, ...state.liveComments].sort((a,b) => b.timestamp - a.timestamp);
  }

  function commentHtml(comment) {
    const liked = Boolean(state.commentLikes[comment.id]);
    const initials = comment.name.split(' ').map(part => part[0]).join('').slice(0,2);
    return `
      <div class="comment-row ${comment.replyTo ? 'reply' : ''} ${comment.fresh ? 'new-comment' : ''}">
        <div class="avatar">${esc(initials)}</div>
        <div>
          <div class="comment-bubble">
            ${comment.replyTo ? `<small>Replying to ${esc(comment.replyTo)}</small>` : ''}
            <strong>${esc(comment.name)}</strong>
            <span>${esc(comment.text)}</span>
          </div>
          <div class="comment-meta">
            <button data-comment-like="${comment.id}">${liked ? 'Liked' : 'Like'} · ${(comment.likes || 0) + (liked ? 1 : 0)}</button>
            <button data-comment-reply="${esc(comment.name)}">Reply</button>
            <span>${age(comment.timestamp)}</span>
          </div>
        </div>
      </div>
    `;
  }

  function conversationHtml(compact = false) {
    const comments = allComments();
    const list = comments.slice(0, compact ? 10 : 160);
    return `
      <section class="conversation">
        <div class="conversation-head">
          <h3>White Wedding Fan Conversation</h3>
          <p>New celebration and gift messages keep appearing while this page remains open.</p>
        </div>
        <div class="conversation-stats">
          <span>👍 ❤️ ${(241000 + state.localLikes).toLocaleString()}</span>
          <span>${(7800 + comments.length).toLocaleString()} comments · ${(68000 + state.localShares).toLocaleString()} shares</span>
        </div>
        <div class="conversation-actions">
          <button class="page-like ${state.pageLiked ? 'active' : ''}">Like</button>
          <button class="focus-comment">Comment</button>
          <button class="page-share">Share</button>
        </div>
        <div class="comment-list">${list.map(commentHtml).join('')}</div>
        <div class="typing-line">Someone is typing…</div>
        <div class="comment-composer">
          <input class="comment-input" placeholder="Write a comment…">
          <button class="comment-send">➤</button>
        </div>
      </section>
    `;
  }

  function render() {
    const landing = document.getElementById('landingConversation');
    const final = document.getElementById('finalConversation');
    if (landing) landing.innerHTML = conversationHtml(true);
    if (final && document.getElementById('finalScreen').classList.contains('active')) final.innerHTML = conversationHtml(false);
    bind();
  }

  function bind() {
    document.querySelectorAll('.page-like').forEach(button => {
      button.addEventListener('click', () => {
        state.pageLiked = !state.pageLiked;
        state.localLikes += state.pageLiked ? 1 : -1;
        save(); render();
      });
    });

    document.querySelectorAll('.focus-comment').forEach((button,index) => {
      button.addEventListener('click', () => document.querySelectorAll('.comment-input')[index]?.focus());
    });

    document.querySelectorAll('.page-share').forEach(button => button.addEventListener('click', sharePage));

    document.querySelectorAll('.comment-send').forEach((button,index) => {
      button.addEventListener('click', () => addComment(index));
    });

    document.querySelectorAll('.comment-input').forEach((input,index) => {
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          addComment(index);
        }
      });
    });

    document.querySelectorAll('[data-comment-like]').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.commentLike;
        state.commentLikes[id] = !state.commentLikes[id];
        save(); render();
      });
    });

    document.querySelectorAll('[data-comment-reply]').forEach(button => {
      button.addEventListener('click', () => {
        const input = document.querySelector('.comment-input');
        if (!input) return;
        input.value = '@' + button.dataset.commentReply + ' ';
        input.focus();
      });
    });
  }

  function addComment(index = 0) {
    const input = document.querySelectorAll('.comment-input')[index] || document.querySelector('.comment-input');
    if (!input || !input.value.trim()) return;
    state.userComments.unshift({
      id: 'user-' + Date.now(),
      name: state.name || 'Guest',
      text: input.value.trim(),
      replyTo: '',
      likes: 0,
      timestamp: Date.now(),
      fresh: true
    });
    save(); render();
  }

  function schedule() {
    clearTimeout(timer);
    clearTimeout(typingTimer);
    const delay = 12000 + Math.floor(Math.random() * 26000);
    timer = setTimeout(() => {
      const typingName = nextPerson();
      document.querySelectorAll('.typing-line').forEach(el => el.textContent = `${typingName} is typing…`);
      typingTimer = setTimeout(() => {
        state.liveComments.forEach(comment => comment.fresh = false);
        state.liveComments.unshift(makeComment());
        state.liveComments = state.liveComments.slice(0,320);
        save(); render(); schedule();
      }, 1800 + Math.floor(Math.random() * 2200));
    }, delay);
  }

  if (!state.liveComments.length) {
    library.seed.forEach((entry,index) => {
      state.liveComments.push({
        id: 'seed-' + index,
        name: entry[0],
        text: entry[1],
        replyTo: entry[2],
        likes: 7 + index * 3,
        timestamp: Date.now() - index * 52000,
        fresh: false
      });
    });
    save();
  }

  render();
  schedule();
  setInterval(render, 60000);

  return {render};
};
