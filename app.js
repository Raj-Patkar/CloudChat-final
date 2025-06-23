const auth = firebase.auth();
const db = firebase.database();

let currentRoom = 'general';
let messagesRef = null;

// ✅ Signup with Email/Password
function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert('Signup successful! Please log in.');
    })
    .catch((error) => {
      alert(error.message);
    });
}

// ✅ Login with Email/Password
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .catch((error) => {
      alert(error.message);
    });
}

// ✅ Sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch((error) => {
      alert(error.message);
    });
}

// ✅ Logout
function logout() {
  if (messagesRef) {
    messagesRef.off();
  }

  auth.signOut().then(() => {
    // Handle all page cases
    const loginSection = document.getElementById('login-section');
    const chatSection = document.getElementById('chat-section');
    const appSection = document.getElementById('app-section');
    const messagesDiv = document.getElementById('messages');

    if (loginSection) loginSection.style.display = 'block';
    if (chatSection) chatSection.style.display = 'none';
    if (appSection) appSection.style.display = 'none';
    if (messagesDiv) messagesDiv.innerHTML = '';

    // Redirect user to index.html (home/login page)
    window.location.href = "index.html";
  });
}


// ✅ Toggle Send Button
function toggleSendButton() {
  const messageInput = document.getElementById('message-input');
  const fileInput = document.getElementById('image-input');
  const sendBtn = document.getElementById('send-btn');

  if (messageInput.value.trim() || fileInput.files.length > 0) {
    sendBtn.disabled = false;
  } else {
    sendBtn.disabled = true;
  }
}

// ✅ Switch Room
function switchRoom() {
  const roomSelect = document.getElementById('room-select');
  currentRoom = roomSelect.value;
  listenForMessages();
}

// ✅ Create Room
function createRoom() {
  const roomInput = document.getElementById('new-room-name');
  const roomName = roomInput.value.trim();

  if (roomName) {
    db.ref('rooms-list/' + roomName).set(true).then(() => {
      const roomSelect = document.getElementById('room-select');
      const option = document.createElement('option');
      option.value = roomName;
      option.textContent = roomName;
      roomSelect.appendChild(option);

      roomSelect.value = roomName;
      switchRoom();
    });

    roomInput.value = '';
  } else {
    alert('Please enter a valid room name.');
  }
}

// ✅ Send Message (Image Upload Disabled for Now)
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const fileInput = document.getElementById('image-input');
  const message = messageInput.value.trim();
  const file = fileInput.files[0];
  const user = auth.currentUser;

  if (user && (message || file)) {
    if (file) {
      alert('Image upload is temporarily disabled.');
    }

    db.ref(`rooms/${currentRoom}/messages`).push({
      sender: user.uid,
      text: message,
      timestamp: Date.now()
    });

    messageInput.value = '';
    fileInput.value = '';
    toggleSendButton();
  }
}

// ✅ Listen for Messages — now with Profile Info
function listenForMessages() {
  const messagesDiv = document.getElementById('messages');
  if (!messagesDiv) return;

  messagesDiv.innerHTML = '';

  if (messagesRef) {
    messagesRef.off();
  }

  messagesRef = db.ref(`rooms/${currentRoom}/messages`);
  const currentUser = auth.currentUser;

  messagesRef.on('child_added', (snapshot) => {
    const msg = snapshot.val();
    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgEl = document.createElement('div');
    const isOwn = msg.sender === currentUser.uid;
    msgEl.className = `message ${isOwn ? 'own' : 'other'}`;

    db.ref(`users/${msg.sender}`).once('value').then((userSnap) => {
      const userData = userSnap.val() || {};
      const name = userData.displayName || 'Anonymous';
      const photo = userData.photoURL || 'https://via.placeholder.com/40';

      msgEl.innerHTML = `
        <div class="bubble ${isOwn ? 'own' : ''}">
          <div class="profile">
            <img src="${photo}" class="profile-pic">
            <span class="msg-sender">${isOwn ? 'You' : name}</span>
          </div>
          ${msg.text ? `<div class="msg-text">${msg.text}</div>` : ''}
          ${msg.imageUrl ? `<img src="${msg.imageUrl}" class="msg-image">` : ''}
          <span class="msg-time">${time}</span>
        </div>
      `;

      messagesDiv.appendChild(msgEl);
      messagesDiv.scrollTo({
        top: messagesDiv.scrollHeight,
        behavior: 'smooth'
      });
    });
  });
}

// ✅ Auth State Handler — adaptive for index.html and chat.html
auth.onAuthStateChanged((user) => {
  if (user) {
    const userRef = db.ref(`users/${user.uid}`);
    userRef.once('value').then((snapshot) => {
      if (!snapshot.exists()) {
        const displayName = user.displayName || prompt("Enter your name:");
        const avatarURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.uid}`;
        userRef.set({
          displayName: displayName,
          photoURL: avatarURL
        });
      }
    });

    const path = window.location.pathname;

    if (document.getElementById('login-section')) {
      document.getElementById('login-section').style.display = 'none';
    }

    if (path.includes("chat.html")) {
      // In Chat Page
      if (document.getElementById('chat-section')) {
        document.getElementById('chat-section').style.display = 'block';
        document.getElementById('welcome-message').textContent = `Welcome, ${user.email}`;
        listenForMessages();
      }
    } else if (document.getElementById('app-section')) {
      // In Portal Menu (index.html)
      document.getElementById('app-section').style.display = 'block';
      document.getElementById('welcome-message').textContent = `Welcome, ${user.email}`;
    }

  } else {
    // Not logged in
    if (document.getElementById('login-section')) {
      document.getElementById('login-section').style.display = 'block';
    }
    if (document.getElementById('chat-section')) {
      document.getElementById('chat-section').style.display = 'none';
    }
    if (document.getElementById('app-section')) {
      document.getElementById('app-section').style.display = 'none';
    }
  }
});
