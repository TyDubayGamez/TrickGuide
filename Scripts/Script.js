let trickData = [];
let navHistory = [];
const menuEl = document.getElementById('menu-content');
const descEl = document.getElementById('detail-desc');
const ctrlEl = document.getElementById('detail-controls');

// Updated Path
const iconBasePath = './Images/UI/Icons/Buttons%20PS/';

// --- ANALOG ICON CHECKLIST ---
const analogIconsList = [
    "O_U", "O_D", "K_TL", "K_TR", "K_BL", "K_BR", "P_TL", "P_TR", "P_BL", "P_BR",
    "3P_TL", "3P_TR", "3P_BL", "3P_BR", "V_TL", "V_TR", "V_BL", "V_BR", "H_TL", 
    "H_TR", "H_BL", "H_BR", "3F_TL", "3F_TR", "3F_BL", "3F_BR", "3H_TL", "3H_TR", 
    "3H_BL", "3H_BR", "LS_BL", "LS_BR", "KU_TL", "KU_TR", "KU_BL", "KU_BR", "PU_TL", 
    "PU_BR", "TC9_TL", "TC9_TR", "TC9_BL", "TC9_BR", "TC_TL", "TC_TR", "TC_BL", 
    "TC_BR", "T_TL", "T_T", "T_TR", "T_L", "T_R", "T_BL", "T_B", "T_BR"
];

async function loadData() {
    try {
        const response = await fetch('Data/S3TrickGuide.json');
        trickData = await response.json();
        renderMenu(trickData);
    } catch (e) {
        console.error("JSON Error: Check path to Data/S3TrickGuide.json");
    }
}

function renderMenu(items) {
    const menuZone = document.getElementById('menu-zone');
    if (menuZone) menuZone.scrollTo(0, 0);
    menuEl.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerText = item.name;

        div.onclick = () => {
            if (item.sub_items && item.sub_items.length > 0) {
                navHistory.push(items);
                renderMenu(item.sub_items);
            }
        };

        div.onmouseenter = () => {
            descEl.innerText = item.description || "";
            if (ctrlEl) {
                renderControls(item.controls || "");
                descEl.classList.add('visible');
                ctrlEl.classList.add('visible');
            }
        };

        menuEl.appendChild(div);
    });
}

function renderControls(controlString) {
    ctrlEl.innerHTML = ''; 
    if (!controlString || controlString.trim() === "") return;

    const smallIcons = ['OR', 'SQ', '+'];
    const parts = controlString.split(' ');

    parts.forEach(part => {
        const cleanPart = part.trim();
        if (cleanPart === "") return;

        const container = document.createElement('span');
        container.className = 'control-unit';

        const img = new Image();
        img.src = `${iconBasePath}${cleanPart}.png`;

        // --- NEW SIZE LOGIC ---
        const upperPart = cleanPart.toUpperCase();

        if (smallIcons.includes(upperPart)) {
            // Tiny separators (OR, SQ, +)
            img.className = 'control-icon-small';
        } else if (analogIconsList.includes(upperPart)) {
            // HUGE Analog Icons (150% size)
            img.className = 'control-icon-analog';
        } else {
            // Standard Buttons (A, B, LB, etc.)
            img.className = 'control-icon-large';
        }

        img.onload = () => {
            container.appendChild(img);
        };

        img.onerror = () => {
            container.innerText = cleanPart;
            container.className = 'control-text';
        };

        ctrlEl.appendChild(container);
    });
}

function goBack() {
    if (navHistory.length > 0) renderMenu(navHistory.pop());
}

window.addEventListener('keydown', (e) => {
    if (e.key === "Backspace") {
        e.preventDefault(); 
        goBack();
    }
});

loadData();
