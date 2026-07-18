// Configuration Routing - Change this IP:Port to match your hosting server .env allocation
const API_BASE_URL = 'http://your_server_ip_here:3000';

// Helper function to extract Guild/Server ID directly from the browser URL parameter queries
function getGuildIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guildId') || '123456789012345678'; // Fallback sample target
}

const activeGuildId = getGuildIdFromURL();

// ==========================================
// 🔄 ASYNCHRONOUS DATA ACQUISITION ENGINE
// ==========================================
async function fetchLiveTelemetry() {
    toggleLoadingState(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/guilds/${activeGuildId}`);
        if (!response.ok) throw new Error(`Gateway returned HTTP Error Status: ${response.status}`);
        
        const payload = await response.json();
        
        if (payload.success) {
            updateDashboardDOM(payload.guildData);
            showSystemToast('Telemetry profiles synchronized seamlessly.', 'success');
        } else {
            showSystemToast(`Data Sync Refused: ${payload.error}`, 'error');
        }
    } catch (err) {
        console.error('❌ [Dashboard Network Error]:', err.message);
        showSystemToast('Failed to connect to Bot Express Gateway Node.', 'error');
    } finally {
        toggleLoadingState(false);
    }
}

// ==========================================
// 🎛️ DOM STRUCTURAL MUTATION ROUTINE
// ==========================================
function updateDashboardDOM(data) {
    // 1. Counter Widgets Updates
    document.getElementById('widget-members').innerText = Number(data.memberCount).toLocaleString();
    document.getElementById('widget-backups').innerText = data.totalBackups;
    document.getElementById('widget-priority').innerText = data.totalPrioritySaved;

    // 2. Identity Nodes Assignments
    document.getElementById('guild-name').innerText = data.name;
    document.getElementById('guild-id-display').innerText = `ID: ${data.id}`;
    document.getElementById('guild-avatar').src = data.icon;

    // 3. Protection Sliders & Checks Hydration
    document.getElementById('nukeThreshold').value = data.nukeThreshold;
    document.getElementById('nuke-threshold-val').innerText = data.nukeThreshold;
    document.getElementById('autoBan').checked = data.autoBan;
    document.getElementById('autoRecovery').checked = data.autoRecovery;

    // 4. State Telemetry Format Mapping
    const statusBadge = document.getElementById('guild-status');
    statusBadge.innerText = data.systemStatus;
    
    if (data.systemStatus === 'OPERATIONAL') {
        statusBadge.className = "px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    } else {
        statusBadge.className = "px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
    }

    document.getElementById('guild-last-backup').innerText = data.lastBackup 
        ? new Date(data.lastBackup).toLocaleString() 
        : 'Never Synchronized';

    // 5. Whitelist Array Rendering
    const container = document.getElementById('whitelist-container');
    container.innerHTML = ''; // Wipe trace fallbacks

    if (data.whitelist.length === 0) {
        container.innerHTML = `<p class="text-xs text-gray-500 italic font-medium p-2">No emergency bypass configurations mapped.</p>`;
    } else {
        data.whitelist.forEach(userId => {
            const element = document.createElement('div');
            element.className = "flex items-center justify-between p-2.5 bg-black/40 border border-white/5 rounded-xl text-xs font-mono font-medium text-gray-300";
            element.innerHTML = `
                <span class="truncate">👤 User (${userId})</span>
                <span class="text-[10px] text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Trusted</span>
            `;
            container.appendChild(element);
        });
    }
}

// ==========================================
// 💾 CONFIGURATION PAYLOAD COMMIT ACTIONS
// ==========================================
async function pushConfigurationPayload() {
    const payload = {
        nukeThreshold: parseInt(document.getElementById('nukeThreshold').value),
        autoBan: document.getElementById('autoBan').checked,
        autoRecovery: document.getElementById('autoRecovery').checked
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/guilds/${activeGuildId}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (result.success) {
            showSystemToast('Security matrix rule variations committed to PostgreSQL execution targets.', 'success');
        } else {
            showSystemToast(`Commit Denied: ${result.error}`, 'error');
        }
    } catch (err) {
        showSystemToast('Communication fault encountered during dynamic system patching.', 'error');
    }
}

// ==========================================
// 🛠️ ANIMATION SWITCH & SKELETON CONTROLLERS
// ==========================================
function toggleLoadingState(isLoading) {
    const targets = ['members', 'backups', 'priority', 'avatar', 'name', 'id', 'whitelist'];
    
    targets.forEach(id => {
        const skeleton = document.getElementById(`skeleton-${id}`);
        const realElement = document.getElementById(`widget-${id}`) || document.getElementById(`guild-${id}`) || document.getElementById(`${id}-container`);
        
        if (skeleton && realElement) {
            if (isLoading) {
                skeleton.classList.remove('hidden');
                realElement.classList.add('hidden');
            } else {
                skeleton.classList.add('hidden');
                realElement.classList.remove('hidden');
            }
        }
    });
}

function showSystemToast(message, type) {
    const toast = document.getElementById('status-toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');

    toast.classList.remove('hidden');
    msg.innerText = message;

    if (type === 'success') {
        toast.className = "mb-8 p-4 rounded-xl premium-glass border-emerald-500/30 flex items-center space-x-3 neon-glow-emerald bg-emerald-950/20";
        icon.innerText = "⚡";
        icon.className = "text-emerald-400";
    } else {
        toast.className = "mb-8 p-4 rounded-xl premium-glass border-rose-500/30 flex items-center space-x-3 neon-glow-rose bg-rose-950/20";
        icon.innerText = "🚨";
        icon.className = "text-rose-400";
    }

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4500);
}

// Boot Sequence Trigger
window.addEventListener('DOMContentLoaded', fetchLiveTelemetry);
          
