// ========== AUTHENTICATION ==========

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Email et mot de passe requis');
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        authToken = await currentUser.getIdToken();
        showMainScreen();
    } catch (error) {
        console.error('Login error:', error);
        showError('Identifiants invalides. Utilisez demo@unimindai.com / demo123');
    }
}

function signupMode() {
    showError('Inscription désactivée en mode demo. Utilisez: demo@unimindai.com / demo123');
}

async function logout() {
    await auth.signOut();
    currentUser = null;
    authToken = null;
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function showError(message) {
    document.getElementById('login-error').textContent = message;
}

function showMainScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    loadNotes();
    loadMCPTools();
}

// ========== NAVIGATION ==========

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName + '-tab').classList.remove('hidden');
    document.getElementById('tab-' + tabName).classList.add('active');

    if (tabName === 'notes') loadNotes();
    if (tabName === 'mcp') loadMCPTools();
}

// ========== CHAT ==========

async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();

    if (!message) return;

    input.value = '';
    addMessageToChat('user', message);

    try {
        const response = await fetch(API_URL + '/api/chat/send-message', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (data.success) {
            addMessageToChat('assistant', data.response);
        } else {
            addMessageToChat('assistant', 'Erreur: ' + (data.error || 'Inconnue'));
        }
    } catch (error) {
        console.error('Send message error:', error);
        addMessageToChat('assistant', 'Erreur de connexion au backend');
    }
}

function addMessageToChat(role, content) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + role;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// ========== NOTES ==========

async function loadNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '<div class="loading">Chargement...</div>';

    try {
        const response = await fetch(API_URL + '/api/mcp/tools/call', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/call',
                params: {
                    name: 'list_notes',
                    arguments: { limit: 50 }
                },
                id: 1
            })
        });

        const data = await response.json();

        if (data.result && data.result.success) {
            displayNotes(data.result.notes);
        } else {
            notesList.innerHTML = '<div class="loading">Aucune note</div>';
        }
    } catch (error) {
        console.error('Load notes error:', error);
        notesList.innerHTML = '<div class="loading">Erreur de chargement</div>';
    }
}

function displayNotes(notes) {
    const notesList = document.getElementById('notes-list');

    if (!notes || notes.length === 0) {
        notesList.innerHTML = '<div class="loading">Aucune note. Créez-en une!</div>';
        return;
    }

    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = '<h3>' + (note.title || 'Sans titre') + '</h3>' +
            '<p>' + (note.content || '').substring(0, 150) + '...</p>' +
            '<div class="note-tags">' + 
            ((note.tags || []).map(tag => '<span class="tag">' + tag + '</span>').join('')) +
            '</div>';
        notesList.appendChild(noteCard);
    });
}

function showCreateNote() {
    document.getElementById('create-note').classList.remove('hidden');
}

function cancelNote() {
    document.getElementById('create-note').classList.add('hidden');
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('note-tags').value = '';
}

async function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const tagsText = document.getElementById('note-tags').value;
    const tags = tagsText ? tagsText.split(',').map(t => t.trim()) : [];

    if (!title || !content) {
        alert('Titre et contenu requis');
        return;
    }

    try {
        const response = await fetch(API_URL + '/api/mcp/tools/call', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/call',
                params: {
                    name: 'save_note',
                    arguments: { title, content, tags }
                },
                id: 1
            })
        });

        const data = await response.json();

        if (data.result && data.result.success) {
            cancelNote();
            loadNotes();
        }
    } catch (error) {
        console.error('Save note error:', error);
        alert('Erreur lors de la sauvegarde');
    }
}

async function searchNotes() {
    const query = document.getElementById('search-notes').value.trim();

    if (!query) {
        loadNotes();
        return;
    }

    try {
        const response = await fetch(API_URL + '/api/mcp/tools/call', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/call',
                params: {
                    name: 'search_notes',
                    arguments: { query, limit: 20 }
                },
                id: 1
            })
        });

        const data = await response.json();
        if (data.result && data.result.success) {
            displayNotes(data.result.notes);
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

// ========== MCP TOOLS ==========

async function loadMCPTools() {
    const toolsList = document.getElementById('mcp-tools-list');
    toolsList.innerHTML = '<div class="loading">Chargement...</div>';

    try {
        const response = await fetch(API_URL + '/api/mcp/tools/list', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/list',
                id: 1
            })
        });

        const data = await response.json();

        if (data.result && data.result.tools) {
            displayMCPTools(data.result.tools);
        }
    } catch (error) {
        console.error('Load MCP tools error:', error);
        toolsList.innerHTML = '<div class="loading">Erreur</div>';
    }
}

function displayMCPTools(tools) {
    const toolsList = document.getElementById('mcp-tools-list');
    const toolSelect = document.getElementById('tool-select');

    toolsList.innerHTML = '';
    toolSelect.innerHTML = '<option value="">Sélectionner...</option>';

    tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.innerHTML = '<h3>🛠️ ' + tool.name + '</h3>' +
            '<p>' + tool.description + '</p>';
        toolsList.appendChild(card);

        const option = document.createElement('option');
        option.value = JSON.stringify(tool);
        option.textContent = tool.name;
        toolSelect.appendChild(option);
    });
}

function updateToolParams() {
    const select = document.getElementById('tool-select');
    const paramsDiv = document.getElementById('tool-params');

    if (!select.value) {
        paramsDiv.innerHTML = '';
        return;
    }

    const tool = JSON.parse(select.value);
    const schema = tool.inputSchema;

    paramsDiv.innerHTML = '<h4>Paramètres:</h4>';

    if (schema.properties) {
        Object.keys(schema.properties).forEach(key => {
            const prop = schema.properties[key];
            const input = document.createElement('input');
            input.id = 'param-' + key;
            input.placeholder = key + ' (' + prop.type + ')';
            paramsDiv.appendChild(input);
        });
    }
}

async function testTool() {
    const select = document.getElementById('tool-select');
    const resultDiv = document.getElementById('tool-result');

    if (!select.value) {
        alert('Sélectionnez un tool');
        return;
    }

    const tool = JSON.parse(select.value);
    const args = {};

    if (tool.inputSchema.properties) {
        Object.keys(tool.inputSchema.properties).forEach(key => {
            const input = document.getElementById('param-' + key);
            if (input && input.value) {
                args[key] = input.value;
            }
        });
    }

    resultDiv.textContent = 'Exécution...';

    try {
        const response = await fetch(API_URL + '/api/mcp/tools/call', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/call',
                params: {
                    name: tool.name,
                    arguments: args
                },
                id: 1
            })
        });

        const data = await response.json();
        resultDiv.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        resultDiv.textContent = 'Erreur: ' + error.message;
    }
}

// ========== INIT ==========

auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        authToken = await user.getIdToken();
        showMainScreen();
    }
});

console.log('UnimindAI Web App loaded');
console.log('API URL:', API_URL);
