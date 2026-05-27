const REDSTONE_TICK_MS = 100;

const grid = document.getElementById('grid');
const  blockSidebar = document.getElementById('blockSidebar');

let width = 17;
let height = 11;

const NOTE_NAMES = [
    "F♯3","G3","G♯3","A3","A♯3","B3",
    "C4","C♯4","D4","D♯4","E4","F4",
    "F♯4","G4","G♯4","A4","A♯4","B4",
    "C5","C♯5","D5","D♯5","E5","F5","F♯5"
];

// Preload notes with AudioContext
// Google servers were getting DDoSed with how much searching was done
const context = new (window.AudioContext || window.webkitAudioContext)();
const noteBuffers = {};

async function loadNote(note) {
    const response = await fetch(`note/${note}.wav`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    noteBuffers[note] = audioBuffer;
}

async function preloadAllNotes() {
    const promises = NOTE_NAMES.map(note => loadNote(note));
    await Promise.all(promises);
}

function playNote(note) {
    const buffer = noteBuffers[note];
    if (!buffer) {
        return;
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
}

async function initNotes() {
    await preloadAllNotes();
}

initNotes();


const BLOCK_BASES = new Map(); {
    const blockBaseArr = [
        { id: 'BLANK', src: 'block_bases/blank.png', name: 'Erase', construct: (x, y) => new Blank(x, y) },
        { id: 'REDSTONE_DUST', src: 'block_bases/redstone_dust.png', name: 'Redstone Dust', construct: (x, y) => new RedstoneDust(x, y) },
        { id: 'REDSTONE_TORCH', src: 'block_bases/redstone_torch.png', name: 'Redstone Torch', construct: (x, y) => new RedstoneTorch(x, y) },
        { id: 'COBBLESTONE', src: 'block_bases/cobblestone.png', name: 'Cobblestone', construct: (x, y) => new Cobblestone(x, y) },
        { id: 'OBSIDIAN', src: 'block_bases/obsidian.png', name: 'Obsidian', construct: (x, y) => new Obsidian(x, y) },
        { id: 'REPEATER', src: 'block_bases/repeater.png', name: 'Repeater', construct: (x, y) => new Repeater(x, y) },
        { id: 'COMPARATOR', src: 'block_bases/comparator.png', name: 'Comparator', construct: (x, y) => new Comparator(x, y) },
        { id: 'PISTON', src: 'block_bases/piston.png', name: 'Piston', construct: (x, y) => new Piston(x, y) },
        { id: 'STICKY_PISTON', src: 'block_bases/sticky_piston.png', name: 'Sticky Piston', construct: (x, y) => new StickyPiston(x, y)}, // UNDER CONSTRUCTION!!
        { id: 'SLIME_BLOCK', src: 'block_bases/slime_block.png', name: 'Slime Block', construct: (x, y) => new SlimeBlock(x, y)},
        { id: 'OBSERVER', src: 'block_bases/observer.png', name: 'Observer', construct: (x, y) => new Observer(x, y) },
        { id: 'REDSTONE_BLOCK', src: 'block_bases/redstone_block.png', name: 'Block of Redstone', construct: (x, y) => new RedstoneBlock(x, y) },
        { id: 'LEVER', src: 'block_bases/lever.png', name: 'Lever', construct: (x, y) => new Lever(x, y) },
        { id: 'TARGET', src: 'block_bases/target.png', name: 'Target Block', construct: (x, y) => new Target(x, y) },
        { id: 'REDSTONE_LAMP', src: 'block_bases/redstone_lamp.png', name: 'Redstone Lamp', construct: (x, y) => new RedstoneLamp(x, y) },
        { id: 'NOTE_BLOCK', src: 'block_bases/note_block.png', name: 'Note Block', construct: (x, y) => new NoteBlock(x, y) },
        { id: 'TNT', src: 'block_bases/tnt.png', name: 'TNT', construct: (x, y) => new TNT(x, y) },
    ];

    for (const blockBase of blockBaseArr) {
        BLOCK_BASES.set(blockBase.id, blockBase);
    }
}
const BLOCK_TYPES = new Map(); {
    BLOCK_TYPES.set('COBBLESTONE', {
        'base': 'COBBLESTONE',
        'piston_touch': 'move',
        'src': './blocks/cobblestone.png'
    });
    BLOCK_TYPES.set('OBSIDIAN', {
        'base': 'OBSIDIAN',
        'piston_touch': 'immoble',
        'src': './blocks/obsidian.png'
    });

    for (let i = 0; i <= 15; i++) {
        BLOCK_TYPES.set(`REDSTONEDUST_DISCONNECTED_SIGNAL${i}`, {
            'base': 'REDSTONE_DUST',
            'piston_touch': 'break',
            'src': `./blocks/dust/REDSTONEDUST_DISCONNECTED_SIGNAL${i}.png`
        });
    }

    for (let i = 0; i <= 15; i++) {
        BLOCK_TYPES.set(`REDSTONEDUST_STRAIGHT_SIGNAL${i}`, {
            'base': 'REDSTONE_DUST',
            'piston_touch': 'break',
            'src': `./blocks/dust/REDSTONEDUST_STRAIGHT_SIGNAL${i}.png`
        });
    }

    for (let i = 0; i <= 15; i++) {
        BLOCK_TYPES.set(`REDSTONEDUST_CURVED_SIGNAL${i}`, {
            'base': 'REDSTONE_DUST',
            'piston_touch': 'break',
            'src': `./blocks/dust/REDSTONEDUST_CURVED_SIGNAL${i}.png`
        });
    }

    for (let i = 0; i <= 15; i++) {
        BLOCK_TYPES.set(`REDSTONEDUST_3WAY_SIGNAL${i}`, {
            'base': 'REDSTONE_DUST',
            'piston_touch': 'break',
            'src': `./blocks/dust/REDSTONEDUST_3WAY_SIGNAL${i}.png`
        });
    }

    for (let i = 0; i <= 15; i++) {
        BLOCK_TYPES.set(`REDSTONEDUST_4WAY_SIGNAL${i}`, {
            'base': 'REDSTONE_DUST',
            'piston_touch': 'break',
            'src': `./blocks/dust/REDSTONEDUST_4WAY_SIGNAL${i}.png`
        });
    }


    BLOCK_TYPES.set(`REDSTONE_TORCH_WALL_ON`, {
        'base': 'REDSTONE_TORCH',
        'piston_touch': 'break',
        'src': './blocks/rtorch/redstone_torch_wall_on.png'
    });
    BLOCK_TYPES.set(`REDSTONE_TORCH_WALL_OFF`, {
        'base': 'REDSTONE_TORCH',
        'piston_touch': 'break',
        'src': './blocks/rtorch/redstone_torch_wall_off.png'
    });
    BLOCK_TYPES.set(`REDSTONE_TORCH_GROUND_ON`, {
        'base': 'REDSTONE_TORCH',
        'piston_touch': 'break',
        'src': './blocks/rtorch/redstone_torch_ground_on.png'
    });
    BLOCK_TYPES.set(`REDSTONE_TORCH_GROUND_OFF`, {
        'base': 'REDSTONE_TORCH',
        'piston_touch': 'break',
        'src': './blocks/rtorch/redstone_torch_ground_off.png'
    });


    for (let i = 1; i <= 4; i++) {
        BLOCK_TYPES.set(`REPEATER_DELAY${i}_OFF`, {
            'base': 'REPEATER',
            'piston_touch': 'break',
            'src': `./blocks/repeater/repeater_delay${i}_off.png`
        });
        BLOCK_TYPES.set(`REPEATER_DELAY${i}_ON`, {
            'base': 'REPEATER',
            'piston_touch': 'break',
            'src': `./blocks/repeater/repeater_delay${i}_on.png`
        });
    }

    BLOCK_TYPES.set('PISTON', {
        'base': 'PISTON',
        'piston_touch': 'move',
        'src': './blocks/piston/piston.png'
    });
    BLOCK_TYPES.set('STICKY_PISTON', {
        'base': 'STICKY_PISTON',
        'piston_touch': 'move',
        'src': './blocks/piston/sticky_piston.png'
    });
    BLOCK_TYPES.set('PISTON_ACTIVATED', {
        'base': 'PISTON',
        'piston_touch': 'immoble',
        'src': './blocks/piston/piston_activated.png'
    });
    BLOCK_TYPES.set('STICKY_PISTON_ACTIVATED', {
        'base': 'STICKY_PISTON',
        'piston_touch': 'immoble',
        'src': './blocks/piston/piston_activated.png'
    });
    BLOCK_TYPES.set('PISTON_ARM', {
        'base': 'PISTON_ARM',
        'piston_touch': 'immoble',
        'src': './blocks/piston/piston_arm.png'
    });
    BLOCK_TYPES.set('STICKY_PISTON_ARM', {
        'base': 'STICKY_PISTON_ARM',
        'piston_touch': 'immoble',
        'src': './blocks/piston/sticky_piston_arm.png'
    });

    BLOCK_TYPES.set('SLIME_BLOCK', {
        'base': 'SLIME_BLOCK',
        'piston_touch': 'move',
        'src': './blocks/slime_block.png'
    });


    BLOCK_TYPES.set('OBSERVER_ON', {
        'base': 'OBSERVER',
        'piston_touch': 'move',
        'src': 'blocks/observer_on.png'
    });
    BLOCK_TYPES.set('OBSERVER_OBSERVES', {
        'base': 'OBSERVER',
        'piston_touch': 'move',
        'src': 'blocks/observer_observes.png'
    });
    BLOCK_TYPES.set('OBSERVER_OFF', {
        'base': 'OBSERVER',
        'piston_touch': 'move',
        'src': 'blocks/observer_off.png'
    });

    BLOCK_TYPES.set('REDSTONE_BLOCK', {
        'base': 'REDSTONE_BLOCK',
        'piston_touch': 'move',
        'src': 'blocks/redstone_block.png'
    });


    BLOCK_TYPES.set('LEVER_ON', {
        'base': 'LEVER',
        'piston_touch': 'break',
        'src': 'blocks/lever_on.png'
    });
    BLOCK_TYPES.set('LEVER_OFF', {
        'base': 'LEVER',
        'piston_touch': 'break',
        'src': 'blocks/lever_off.png'
    });

    BLOCK_TYPES.set('REDSTONE_LAMP_ON', {
        'base': 'REDSTONE_LAMP',
        'piston_touch': 'move',
        'src': 'blocks/redstone_lamp_on.png'
    });
    BLOCK_TYPES.set('REDSTONE_LAMP_OFF', {
        'base': 'REDSTONE_LAMP',
        'piston_touch': 'move',
        'src': 'blocks/redstone_lamp_off.png'
    });

    for (let i = 0; i < NOTE_NAMES.length; i++) {
        const note_name = NOTE_NAMES[i];
        BLOCK_TYPES.set('NOTE_BLOCK_' + note_name, {
            'base': 'NOTE_BLOCK',
            'piston_touch': 'move',
            'src': `blocks/noteblock/${i}_${note_name}.png`
        });
    }

    BLOCK_TYPES.set('COMPARATOR_COMPARE_OFF', {
        'base': 'COMPARATOR',
        'piston_touch': 'break',
        'src': 'blocks/comparator/comparator_compare_off.png'
    });
    BLOCK_TYPES.set('COMPARATOR_COMPARE_ON', {
        'base': 'COMPARATOR',
        'piston_touch': 'break',
        'src': 'blocks/comparator/comparator_compare_on.png'
    });
    BLOCK_TYPES.set('COMPARATOR_SUBTRACT_OFF', {
        'base': 'COMPARATOR',
        'piston_touch': 'break',
        'src': 'blocks/comparator/comparator_subtract_off.png'
    });
    BLOCK_TYPES.set('COMPARATOR_SUBTRACT_ON', {
        'base': 'COMPARATOR',
        'piston_touch': 'break',
        'src': 'blocks/comparator/comparator_subtract_on.png'
    });

    BLOCK_TYPES.set('BLANK', {
        'base': 'BLANK',
        'piston_touch': 'break',
        'src': 'blocks/blank.png'
    });
    BLOCK_TYPES.set('TARGET', {
        'base': 'TARGET',
        'piston_touch': 'move',
        'src': 'blocks/target.png'
    });
    BLOCK_TYPES.set('TNT', {
        'base': 'TNT',
        'piston_touch': 'move',
        'src': 'blocks/tnt.png'
    });
    BLOCK_TYPES.set('TNT_PRIMED', {
        'base': 'TNT',
        'piston_touch': 'move',
        'src': 'blocks/tnt_primed.gif'
    });
}

const POWER_TYPES = Object.freeze({
    HARD: { name: 'Hard', activates: true },
    SOFT: { name: 'Soft', activates: true },
    NONE: { name: 'None', activates: false }
});

const DIRECTIONS = Object.freeze({
    UP: { x: 0, y: -1, horizontal: false },
    RIGHT: { x: 1, y: 0, horizontal: true },
    DOWN: { x: 0, y: 1, horizontal: false },
    LEFT: { x: -1, y: 0, horizontal: true }
});
function locationInDirection(x, y, direction) {
    return { x: x + direction.x, y: y + direction.y };
}
function getDirection(fromX, fromY, toX, toY) {
    let xDiff = toX - fromX;
    let yDiff = toY - fromY;

    if (Math.abs(xDiff) + Math.abs(yDiff) !== 1) {
        throw Error(`(${toX}, ${toY}) is not directly adjacent to (${fromX}, ${fromY})`);
    }

    if (xDiff === 1) return DIRECTIONS.RIGHT;
    if (xDiff === -1) return DIRECTIONS.LEFT;
    if (yDiff === 1) return DIRECTIONS.DOWN;
    if (yDiff === -1) return DIRECTIONS.UP;
}

function getFarDirection(fromX, fromY, toX, toY) {
    const xDiff = toX - fromX;
    const yDiff = toY - fromY;

    if (xDiff !== 0 && yDiff !== 0) {
        throw Error(`(${toX}, ${toY}) may not be diagonal to (${fromX}, ${fromY})`);
    }

    if (xDiff > 0) return DIRECTIONS.RIGHT;
    if (xDiff < 0) return DIRECTIONS.LEFT;
    if (yDiff > 0) return DIRECTIONS.DOWN;
    if (yDiff < 0) return DIRECTIONS.UP;

    throw Error(`(${toX}, ${toY}) is the same as (${fromX}, ${fromY})`);
}

function getOppositeDirection(direction) { // don't like doing this, but they must match references
    switch (direction) {
        case DIRECTIONS.LEFT: return DIRECTIONS.RIGHT;
        case DIRECTIONS.RIGHT: return DIRECTIONS.LEFT;
        case DIRECTIONS.DOWN: return DIRECTIONS.UP;
        case DIRECTIONS.UP: return DIRECTIONS.DOWN;
    }
}

function rotateLeftDirection(direction) {
    switch (direction) {
        case DIRECTIONS.LEFT: return DIRECTIONS.UP;
        case DIRECTIONS.RIGHT: return DIRECTIONS.DOWN;
        case DIRECTIONS.DOWN: return DIRECTIONS.LEFT;
        case DIRECTIONS.UP: return DIRECTIONS.RIGHT;
    }
}

function rotateRightDirection(direction) {
    switch (direction) {
        case DIRECTIONS.LEFT: return DIRECTIONS.DOWN;
        case DIRECTIONS.RIGHT: return DIRECTIONS.UP;
        case DIRECTIONS.DOWN: return DIRECTIONS.RIGHT;
        case DIRECTIONS.UP: return DIRECTIONS.LEFT;
    }
}

let selectedBlock = null;
let ghostImg = null;

let toolRotations = {
    'REPEATER': 'Up',
    'COMPARATOR': 'Up',
    'PISTON': 'Right',
    'STICKY_PISTON': 'Right',
    'OBSERVER': 'Right',
    'REDSTONE_TORCH': 'Ground'
};

function updateGhostRotation() {
    if (!ghostImg || !selectedBlock) return;
    
    let rot = 0;
    if (['REPEATER', 'COMPARATOR'].includes(selectedBlock)) {
        const dir = toolRotations[selectedBlock];
        if (dir === 'Right') rot = 90;
        else if (dir === 'Down') rot = 180;
        else if (dir === 'Left') rot = 270;
    } else if (['PISTON', 'STICKY_PISTON', 'OBSERVER'].includes(selectedBlock)) {
        const dir = toolRotations[selectedBlock];
        if (dir === 'Down') rot = 90;
        else if (dir === 'Left') rot = 180;
        else if (dir === 'Up') rot = 270;
    } else if (selectedBlock === 'REDSTONE_TORCH') {
        const pos = toolRotations.REDSTONE_TORCH;
        if (pos === 'Down') rot = 180;
        else if (pos === 'Left') rot = 270;
        else if (pos === 'Right') rot = 90;
    }
    
    ghostImg.style.transform = `rotate(${rot}deg)`;
}
let hoveredCell = null; // tracks the cell currently under the mouse

// Track hovered cell globally
grid.addEventListener('mouseover', e => {
    const cell = e.target.closest('.cell');
    if (cell) hoveredCell = cell;
});
grid.addEventListener('mouseleave', () => {
    hoveredCell = null;
});

// All widgets in order for hotkey binding
const allWidgets = [];

// Function to update visual selection of tools
let currentToolIndex = 0;
function setToolSelected(index) {
    if (index === 1) return; // skip info widget
    currentToolIndex = index;
    allWidgets.forEach((w, i) => {
        if (i === index) {
            w.element.classList.add('selected');
        } else if (i !== 1) {
            w.element.classList.remove('selected');
        }
    });
}

// add cursor to ui
const cursorWidget = document.getElementById('cursorWidget');
cursorWidget.addEventListener('click', () => {
    setToolSelected(0);
    if (ghostImg) {
        ghostImg.style.display = 'none';
        ghostImg.src = '';
    }
    selectedBlock = null;
});
allWidgets.push({ element: cursorWidget, blockKey: null, blockBase: null });

// add "?" info widget (replaces Erase)
const infoWidget = document.createElement('div');
infoWidget.classList.add('widget');
{
    const infoIcon = document.createElement('span');
    infoIcon.textContent = '?';
    infoIcon.style.fontSize = '32px';
    infoIcon.style.fontWeight = 'bold';
    infoIcon.style.color = '#555';
    infoIcon.style.lineHeight = '48px';
    infoIcon.style.display = 'block';
    infoIcon.style.textAlign = 'center';
    infoWidget.appendChild(infoIcon);

    const infoLabel = document.createElement('span');
    infoLabel.textContent = 'Help';
    infoWidget.appendChild(infoLabel);
}
infoWidget.addEventListener('click', () => {
    showInfoModal();
});
blockSidebar.appendChild(infoWidget);
allWidgets.push({ element: infoWidget, blockKey: null, blockBase: null });

// add blocks to ui (skip BLANK — breaking is done with left click)
BLOCK_BASES.forEach((block, key) => {
    if (key === 'BLANK') return; // erase is now left-click

    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.dataset.block_base = key;

    const img = document.createElement('img');
    img.src = block.src;
    img.alt = block.name;
    widget.appendChild(img);

    const label = document.createElement('span');
    label.textContent = block.name;
    widget.appendChild(label);

    widget.addEventListener('click', () => {
        const myIndex = allWidgets.findIndex(w => w.element === widget);
        if (myIndex !== -1) setToolSelected(myIndex);

        selectedBlock = key;

        if (!ghostImg) {
            ghostImg = document.createElement('img');
            ghostImg.style.position = 'absolute';
            ghostImg.style.pointerEvents = 'none';
            ghostImg.style.width = '64px';
            ghostImg.style.height = '64px';
            ghostImg.style.zIndex = '1000';
            ghostImg.style.transition = 'transform 0.1s ease';
            document.body.appendChild(ghostImg);
        }

        ghostImg.src = block.src;
        ghostImg.style.display = 'block';
        updateGhostRotation();
    });

    blockSidebar.appendChild(widget);
    allWidgets.push({ element: widget, blockKey: key, blockBase: block });
});

// Initialize cursor as selected
setToolSelected(0);

// Add hotkey badges to all widgets following 2-column grid layout
// Left column (even indices) = N, Right column (odd indices) = ⇧N
allWidgets.forEach((w, i) => {
    const badge = document.createElement('span');
    badge.classList.add('hotkey-badge');
    const row = Math.floor(i / 2) + 1; // 1-based row number
    if (i % 2 === 0) {
        badge.textContent = String(row); // left column: 1, 2, 3...
    } else {
        badge.textContent = '⇧' + String(row); // right column: ⇧1, ⇧2, ⇧3...
    }
    w.element.appendChild(badge);
});

// Info modal
function showInfoModal() {
    let modal = document.getElementById('info-modal');
    if (modal) { modal.style.display = 'flex'; return; }

    modal = document.createElement('div');
    modal.id = 'info-modal';
    modal.classList.add('info-modal-overlay');
    modal.innerHTML = `
        <div class="info-modal-content">
            <h2>⌨️ Controls</h2>
            <table>
                <tr><td><kbd>Left Click</kbd></td><td>Break block</td></tr>
                <tr><td><kbd>Right Click</kbd></td><td>Place block / Interact</td></tr>
                <tr><td><kbd>Shift</kbd> + <kbd>Right Click</kbd></td><td>Context menu</td></tr>
                <tr><td><kbd>R</kbd></td><td>Rotate block under cursor</td></tr>
                <tr><td><kbd>1</kbd> – <kbd>9</kbd></td><td>Select tool (left column)</td></tr>
                <tr><td><kbd>⇧1</kbd> – <kbd>⇧9</kbd></td><td>Select tool (right column)</td></tr>
            </table>
            <h3>🖱️ Right Click interactions</h3>
            <table>
                <tr><td><b>Lever</b></td><td>Toggle on/off</td></tr>
                <tr><td><b>Note Block</b></td><td>Advance note</td></tr>
                <tr><td><b>Repeater</b></td><td>Cycle delay (1-4)</td></tr>
                <tr><td><b>Comparator</b></td><td>Toggle mode</td></tr>
            </table>
            <button id="info-modal-close">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.id === 'info-modal-close') {
            modal.style.display = 'none';
        }
    });
}


document.addEventListener('mousemove', e => {
    if (ghostImg) {
        ghostImg.style.left = e.pageX - 32 + 'px';
        ghostImg.style.top = e.pageY - 32 + 'px';
    }
});

// --- Minecraft-style controls ---
// Left click = break, Right click = place/interact, Shift+Right = context menu

let isBreaking = false;
let lastBrokenKey = null;
let isPlacing = false;
let lastPlacedKey = null;

function breakFromEvent(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const x = parseInt(cell.dataset.x, 10);
    const y = parseInt(cell.dataset.y, 10);
    const key = `${x},${y}`;
    if (key === lastBrokenKey) return;
    lastBrokenKey = key;
    const block = getBlock(x, y);
    if (!(block instanceof Blank)) {
        setBlockUI('BLANK', x, y);
    }
}

function applyToolRotation(x, y) {
    const newBlock = getBlock(x, y);
    if (toolRotations[selectedBlock]) {
        if (selectedBlock === 'REDSTONE_TORCH') {
            newBlock.applyContext('Position', toolRotations.REDSTONE_TORCH);
        } else {
            newBlock.applyContext('Direction', toolRotations[selectedBlock]);
        }
    }
}

function placeFromEvent(e) {
    const cell = e.target.closest('.cell');
    if (!cell || !selectedBlock) return;
    const x = parseInt(cell.dataset.x, 10);
    const y = parseInt(cell.dataset.y, 10);
    const key = `${x},${y}`;
    if (key === lastPlacedKey) return;
    lastPlacedKey = key;
    const block = getBlock(x, y);
    if (block instanceof Blank) {
        setBlockUI(selectedBlock, x, y);
        applyToolRotation(x, y);
    }
}

grid.addEventListener('dragstart', e => e.preventDefault());

grid.addEventListener('pointerdown', e => {
    if (e.button === 0) {
        // Left click = break
        isBreaking = true;
        breakFromEvent(e);
    } else if (e.button === 2 && !e.shiftKey) {
        // Right click = place or interact
        const cell = e.target.closest('.cell');
        if (!cell) return;
        const x = parseInt(cell.dataset.x, 10);
        const y = parseInt(cell.dataset.y, 10);
        const block = getBlock(x, y);

        // Interactive blocks take priority
        if (block instanceof Lever || block instanceof NoteBlock ||
            block instanceof Repeater || block instanceof Comparator) {
            interactWithBlock(block);
        } else if (block instanceof Blank && selectedBlock) {
            // Place on empty tile
            isPlacing = true;
            lastPlacedKey = `${x},${y}`;
            setBlockUI(selectedBlock, x, y);
            applyToolRotation(x, y);
        }
    }
});

grid.addEventListener('pointermove', e => {
    // Left drag = break
    if (isBreaking) {
        if ((e.buttons & 1) === 0) { isBreaking = false; lastBrokenKey = null; return; }
        breakFromEvent(e);
    }
    // Right drag = place
    if (isPlacing) {
        if ((e.buttons & 2) === 0) { isPlacing = false; lastPlacedKey = null; return; }
        placeFromEvent(e);
    }
});

window.addEventListener('pointerup', (e) => {
    if (e.button === 0) {
        isBreaking = false;
        lastBrokenKey = null;
    }
    if (e.button === 2) {
        isPlacing = false;
        lastPlacedKey = null;
    }
});


// context menu stuff
class ContextMenu {
    /**
     * 
     * @param {Map} contextListMap a map associating title and the list of options to display
     */
    constructor(contextListMap) {
        this.contextListMap = contextListMap;
    }
}

function createDirectionalContextList(excluded) {
    let list = ['Left', 'Right', 'Up', 'Down'];
    switch (excluded) {
        case DIRECTIONS.LEFT:   return list.filter(d => (d !== 'Left'));
        case DIRECTIONS.RIGHT:  return list.filter(d => (d !== 'Right'));
        case DIRECTIONS.UP:     return list.filter(d => (d !== 'Up'));
        case DIRECTIONS.DOWN:   return list.filter(d => (d !== 'Down'));
    }
}

// context menu UI stuff
{
    const contextMenuEl = document.createElement('div');
    contextMenuEl.classList.add('context-menu');
    document.body.appendChild(contextMenuEl);

    document.addEventListener('click', () => {
        contextMenuEl.style.display = 'none';
    });

    function showContextMenu(block, x, y) {
        const menu = block.getContextMenu();
        if (!menu) return;

        contextMenuEl.innerHTML = ''; // reset

        menu.contextListMap.forEach((options, title) => {
            const titleEl = document.createElement('div');
            titleEl.classList.add('section-title');
            titleEl.textContent = title;
            contextMenuEl.appendChild(titleEl);

            options.forEach(opt => {
                const optEl = document.createElement('div');
                optEl.classList.add('option');
                optEl.textContent = opt;
                optEl.addEventListener('click', e => {
                    e.stopPropagation();
                    block.applyContext(title, opt);
                    contextMenuEl.style.display = 'none';
                });
                contextMenuEl.appendChild(optEl);
            });
        });

        contextMenuEl.style.left = `${x}px`;
        contextMenuEl.style.top = `${y}px`;
        contextMenuEl.style.display = 'block';
    }

    // Context menu: Shift + Right Click only
    grid.addEventListener('contextmenu', e => {
        e.preventDefault();
        if (!e.shiftKey) return; // plain right-click is handled by pointerdown

        const cell = e.target.closest('.cell');
        if (!cell) return;

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const block = getBlock(x, y);

        const menu = block.getContextMenu();
        if (menu && menu.contextListMap.size > 0) {
            showContextMenu(block, e.pageX, e.pageY);
        }
    });
}

// Right-click interaction: toggles levers, advances noteblock, increments repeater delay, toggles comparator mode
function interactWithBlock(block) {
    if (block instanceof Lever) {
        block.on = !block.on;
        block.setBlockType(BLOCK_TYPES.get('LEVER_' + (block.on ? 'ON' : 'OFF')));
        block.updateSelf();
    } else if (block instanceof NoteBlock) {
        const currentIndex = NOTE_NAMES.indexOf(block.note_name);
        const nextIndex = (currentIndex + 1) % NOTE_NAMES.length;
        const nextNote = NOTE_NAMES[nextIndex];
        block.setBlockType(BLOCK_TYPES.get('NOTE_BLOCK_' + nextNote));
        block.note_name = nextNote;
        playNote(nextNote); // play the new note so the user hears it
    } else if (block instanceof Repeater) {
        block.lastSignalChangeTick = -10;
        removeFromTickQueue(block.queuedId);
        block.queuedId = -1;
        block.delay = (block.delay % 4) + 1;
        block.updateSelf();
        const behindLoc = locationInDirection(block.x, block.y, getOppositeDirection(block.facing));
        if (!outOfBounds(behindLoc.x, behindLoc.y)) update(behindLoc.x, behindLoc.y);
        const frontLoc = locationInDirection(block.x, block.y, block.facing);
        if (!outOfBounds(frontLoc.x, frontLoc.y)) update(frontLoc.x, frontLoc.y);
    } else if (block instanceof Comparator) {
        block.lastSignalChangeTick = -10;
        removeFromTickQueue(block.queuedId);
        block.queuedId = -1;
        block.mode = (block.mode === 'COMPARE') ? 'SUBTRACT' : 'COMPARE';
        block.setBlockType(BLOCK_TYPES.get(`COMPARATOR_${block.mode}_${block.signal > 0 ? 'ON' : 'OFF'}`));
        block.updateSelf();
    }
}

// R key => rotate the block under the mouse (cycles direction for directional blocks)
function rotateBlockUnderMouse() {
    if (!hoveredCell) return;
    const x = parseInt(hoveredCell.dataset.x);
    const y = parseInt(hoveredCell.dataset.y);
    if (outOfBounds(x, y)) return;

    const block = getBlock(x, y);

    if (block instanceof Blank && selectedBlock) {
        // Rotate the tool in hand
        const DIRECTION_ORDER = ['Up', 'Right', 'Down', 'Left'];
        if (['REPEATER', 'COMPARATOR', 'PISTON', 'STICKY_PISTON', 'OBSERVER'].includes(selectedBlock)) {
            const current = toolRotations[selectedBlock];
            const nextIdx = (DIRECTION_ORDER.indexOf(current) + 1) % 4;
            toolRotations[selectedBlock] = DIRECTION_ORDER[nextIdx];
            updateGhostRotation();
        } else if (selectedBlock === 'REDSTONE_TORCH') {
            const torchPositions = ['Ground', 'Down', 'Left', 'Up', 'Right'];
            const curIdx = torchPositions.indexOf(toolRotations.REDSTONE_TORCH);
            toolRotations.REDSTONE_TORCH = torchPositions[(curIdx + 1) % 5];
            updateGhostRotation();
        }
        return;
    }

    const DIRECTION_ORDER = [DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT];

    function nextDirection(current) {
        const idx = DIRECTION_ORDER.indexOf(current);
        return DIRECTION_ORDER[(idx + 1) % 4];
    }

    if (block instanceof Repeater) {
        block.applyContext('Direction', directionToName(nextDirection(block.facing)));
    } else if (block instanceof Comparator) {
        block.applyContext('Direction', directionToName(nextDirection(block.facing)));
    } else if (block instanceof Piston && !block.extended) {
        block.applyContext('Direction', directionToName(nextDirection(block.facing)));
    } else if (block instanceof StickyPiston && !block.extended) {
        block.applyContext('Direction', directionToName(nextDirection(block.facing)));
    } else if (block instanceof Observer) {
        block.applyContext('Direction', directionToName(nextDirection(block.facing)));
    } else if (block instanceof RedstoneTorch) {
        // Cycle through valid torch positions: Ground + adjacent solid walls
        const validPositions = ['Ground'];
        const posMap = [
            { dir: DIRECTIONS.DOWN, pos: 'Down' },
            { dir: DIRECTIONS.LEFT, pos: 'Left' },
            { dir: DIRECTIONS.UP, pos: 'Up' },
            { dir: DIRECTIONS.RIGHT, pos: 'Right' }
        ];
        for (const { dir, pos } of posMap) {
            const loc = locationInDirection(block.x, block.y, dir);
            if (!outOfBounds(loc.x, loc.y) && getBlock(loc.x, loc.y).isSolid()) {
                validPositions.push(pos);
            }
        }
        const curIdx = validPositions.indexOf(block.torchPosition);
        const nextIdx = (curIdx + 1) % validPositions.length;
        block.applyContext('Position', validPositions[nextIdx]);
    }
}

function directionToName(dir) {
    switch (dir) {
        case DIRECTIONS.UP: return 'Up';
        case DIRECTIONS.DOWN: return 'Down';
        case DIRECTIONS.LEFT: return 'Left';
        case DIRECTIONS.RIGHT: return 'Right';
    }
}

// Keyboard hotkeys
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    // Chiudi Help Menu con ESC
    if (e.key === 'Escape') {
        const modal = document.getElementById('info-modal');
        if (modal && modal.style.display !== 'none') {
            modal.style.display = 'none';
        }
        return;
    }

    // Salva (CTRL+S) e Apri (CTRL+O) 
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault(); // Previene il salvataggio della pagina web del browser
        saveState();
        return;
    }

    if (e.ctrlKey && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault(); // Previene l'apertura file nativa del browser
        document.getElementById('file-input').click();
        return;
    }

    // R key => rotate block under mouse
    if (e.key === 'r' || e.key === 'R') {
        rotateBlockUnderMouse();
        return;
    }

    // Number keys 1-9 for tool selection (2-column grid: N=left, ⇧N=right)
    const digitMatch = e.code && e.code.match(/^Digit([1-9])$/);
    if (digitMatch) {
        const num = parseInt(digitMatch[1]);
        // row = num, left col = (num-1)*2, right col = (num-1)*2+1
        const index = e.shiftKey ? ((num - 1) * 2 + 1) : ((num - 1) * 2);
        if (index < allWidgets.length) {
            allWidgets[index].element.click();
        }
    }
});

// Mouse wheel to cycle selected tool
let lastWheelTime = 0;
document.addEventListener('wheel', e => {
    // let sidebar or info modal scroll naturally
    if (e.target.closest('.sidebar') || e.target.closest('.info-modal-overlay')) return;
    
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastWheelTime < 150) return; // Throttle to prevent hyper-fast cycling
    lastWheelTime = now;
    
    let nextIndex = currentToolIndex;
    
    if (e.deltaY > 0) {
        nextIndex++;
        if (nextIndex === 1) nextIndex = 2; // skip info modal
        if (nextIndex >= allWidgets.length) nextIndex = 0;
    } else if (e.deltaY < 0) {
        nextIndex--;
        if (nextIndex === 1) nextIndex = 0; // skip info modal
        if (nextIndex < 0) nextIndex = allWidgets.length - 1;
    }
    
    if (nextIndex !== currentToolIndex) {
        allWidgets[nextIndex].element.click();
    }
}, { passive: false });


class Thing {
    /**
     * @param {number} rotation How many times to rotate clockwise
     */
    constructor(x, y, blockType, rotation = 0) {
        this.#rotation = rotation;
        this.x = x;
        this.y = y;
        this.setBlockType(blockType, rotation, false);
    }

    getLocation() {
        return { x: this.x, y: this.y };
    }

    updateSelf() {}
    destroy() {}

    #blockType;
    getBlockBase() {
        return this.#blockType.base;
    }

    getBlockType() {
        return this.#blockType;
    }

    resetImage() {
        setImage(this.#blockType.src, this.x, this.y, this.#rotation);
    }

    getImageRotation() {
        return this.#rotation;
    }

    /**
     * Protected.
     */
    #rotation = 0;
    setBlockType(blockType, rotation = this.#rotation, activatesObservers = true) {
        let shouldEmitObserverUpdate = activatesObservers && (blockType !== this.#blockType || rotation !== this.#rotation);

        this.#blockType = blockType;
        this.#rotation = rotation;
        setImage(this.#blockType.src, this.x, this.y, rotation, blockType === this.block && rotation !== this.#rotation);

        if (shouldEmitObserverUpdate) emitObserverUpdate(this.x, this.y, false);
    }

    isPowerableFrom(x, y) {
        return false;
    }

    attractsRedstone(x, y) {
        return false;
    }

    transmitsPowerTo(x, y) {
        return this.transmitsSoftPowerTo(x, y) || this.transmitsHardPowerTo(x, y);
    }

    transmitsSoftPowerTo(x, y) {
        return false;
    }

    transmitsHardPowerTo(x, y) {
        return false;
    }

    /**
     * 
     * Returns a POWER_TYPE.
     */
    getTransmittingPowerTo(x, y) {
        if (this.isTransmittingHardPowerTo(x, y)) return POWER_TYPES.HARD;
        if (this.isTransmittingSoftPowerTo(x, y)) return POWER_TYPES.SOFT;
        return POWER_TYPES.NONE;
    }

    isTransmittingPowerTo(x, y) {
        return this.isOn() && this.transmitsPowerTo(x, y);
    }

    isTransmittingSoftPowerTo(x, y) {
        return this.isOn() && this.transmitsSoftPowerTo(x, y);
    }

    isTransmittingHardPowerTo(x, y) {
        return this.isOn() && this.transmitsHardPowerTo(x, y);
    }

    getHardOutputLevelTo(x, y) {
        return this.isTransmittingHardPowerTo(x, y) ? 15 : 0;
    }

    getSoftOutputLevelTo(x, y) {
        return this.isTransmittingSoftPowerTo(x, y) ? 15 : 0;
    }

    getOutputLevelTo(x, y) {
        return Math.max(this.getHardOutputLevelTo(x, y), this.getSoftOutputLevelTo(x, y));
    }

    isOn() {
        return false;
    }

    getContextMenu() {
        return undefined;
    }

    applyContext(title, selectedOption) {}

    /**
     * Removes queued updates related to this block
     */
    destroy() {}

    isSolid() { return false; }

    getGreatestAdjacentPower() {
        let greatestPowerType = POWER_TYPES.NONE;
        for (const direction of Object.values(DIRECTIONS)) {
            const loc = locationInDirection(this.x, this.y, direction);
            if (outOfBounds(loc.x, loc.y)) continue;
            if (!this.isPowerableFrom(loc.x, loc.y)) continue;

            const block = getBlock(loc.x, loc.y);
            const transmittingPower = block.getTransmittingPowerTo(this.x, this.y);
            if (transmittingPower !== POWER_TYPES.NONE && transmittingPower !== greatestPowerType) {
                greatestPowerType = transmittingPower;
                if (greatestPowerType === POWER_TYPES.HARD) break;
            }
        }

        return greatestPowerType;
    }

    setSelfLoc(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
}

class OpaqueThing extends Thing {
    constructor(x, y, blockType, rotation = 0) {
        super(x, y, blockType, rotation);
        this.powerType = POWER_TYPES.NONE;
    }

    updateSelf() {
        let currentPower = this.getGreatestAdjacentPower();
        
        if (currentPower !== this.powerType) {
            this.powerType = currentPower;

            for (const direction of Object.values(DIRECTIONS)) { // Soft Power
                const loc = locationInDirection(this.x, this.y, direction);
                if (!outOfBounds(loc.x, loc.y)) update(loc.x, loc.y);
            }
        }
    }

    isPowerableFrom(x, y) {
        return areAdjacent(this.x, this.y, x, y);
    }

    transmitsSoftPowerTo(x, y) {
        return this.powerType === POWER_TYPES.HARD && areAdjacent(this.x, this.y, x, y);
    }

    isOn() {
        return this.powerType.activates;
    }

    isSolid() {
        return true;
    }
}

class Blank extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('BLANK'));
    }
}

class RedstoneDust extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('REDSTONEDUST_DISCONNECTED_SIGNAL0'));
        this.connections = [];
        this.signalStrength = 0;
    }

    updateSelf() {
        const connectionsUpdated = this.updateConnections();
        
        let newSignalStrength = 0;
        for (let connection of this.connections) {
            let inputStrength = 0;
            if (!connection.isOn()) continue;
                if (connection instanceof RedstoneDust || connection instanceof Comparator) {
                inputStrength = connection.getHardOutputLevelTo(this.x, this.y);
            } else if (connection.isTransmittingHardPowerTo(this.x, this.y)
                || connection instanceof RedstoneBlock
                || (connection instanceof RedstoneTorch && connection.isOn())) {
                inputStrength = 15;
            }

            newSignalStrength = Math.max(inputStrength, newSignalStrength);
            if (newSignalStrength === 15) break;
        }

        const signalStrengthChanged = (newSignalStrength !== this.signalStrength);
        this.signalStrength = newSignalStrength;

        // ugly thing holding together rendering of redstone dust
        if (connectionsUpdated || signalStrengthChanged) {
            switch (this.connections.length) {
                case 0:
                    this.setBlockType(BLOCK_TYPES.get(`REDSTONEDUST_DISCONNECTED_SIGNAL${this.signalStrength}`));
                break;
                case 1:
                    // get direction of connection (horizontal/vertical)
                    if (this.x === this.connections[0].x) { // vertical
                        this.setBlockType(BLOCK_TYPES.get(`REDSTONEDUST_STRAIGHT_SIGNAL${this.signalStrength}`), 0);
                    } else { // horizontal
                        this.setBlockType(BLOCK_TYPES.get(`REDSTONEDUST_STRAIGHT_SIGNAL${this.signalStrength}`), 1);
                    }
                break;
                case 2:
                    const loc0 = this.connections[0].getLocation();
                    const loc1 = this.connections[1].getLocation();
                    const direction0 = getDirection(this.x, this.y, loc0.x, loc0.y);
                    const direction1 = getDirection(this.x, this.y, loc1.x, loc1.y);

                    if (direction0.horizontal && direction1.horizontal) { // horizontal
                        this.setBlockType(BLOCK_TYPES.get(`REDSTONEDUST_STRAIGHT_SIGNAL${this.signalStrength}`), 1);
                    } else if (!direction0.horizontal && !direction1.horizontal) { // vertical
                        this.setBlockType(BLOCK_TYPES.get(`REDSTONEDUST_STRAIGHT_SIGNAL${this.signalStrength}`), 0);
                    } else {
                        let rotations = 0;
                        const dirs = [direction0, direction1];
                        if (dirs.includes(DIRECTIONS.LEFT) && dirs.includes(DIRECTIONS.UP))         rotations = 0;
                        else if (dirs.includes(DIRECTIONS.UP) && dirs.includes(DIRECTIONS.RIGHT))   rotations = 1;
                        else if (dirs.includes(DIRECTIONS.RIGHT) && dirs.includes(DIRECTIONS.DOWN)) rotations = 2;
                        else if (dirs.includes(DIRECTIONS.DOWN) && dirs.includes(DIRECTIONS.LEFT))  rotations = 3;
                        else throw Error(`Invalid curve rotation for directions: ${d0}, ${d1}`);
                        this.setBlockType(BLOCK_TYPES.get(`REDSTONEDUST_CURVED_SIGNAL${this.signalStrength}`), rotations);
                    }
                break;
                case 3:
                    const dirs = this.connections.map(val => getDirection(this.x, this.y, val.x, val.y));
                    const missing = Object.values(DIRECTIONS).find(d => !dirs.includes(d));

                    let rotations;
                    if (missing === DIRECTIONS.RIGHT) rotations = 0;
                    else if (missing === DIRECTIONS.DOWN) rotations = 1;
                    else if (missing === DIRECTIONS.LEFT) rotations = 2;
                    else if (missing === DIRECTIONS.UP) rotations = 3;
                    else throw Error('Invalid missing direction: ' + missing);

                    this.setBlockType(BLOCK_TYPES.get(`REDSTONEDUST_3WAY_SIGNAL${this.signalStrength}`), rotations);
                break;
                case 4:
                    this.setBlockType(BLOCK_TYPES.get(`REDSTONEDUST_4WAY_SIGNAL${this.signalStrength}`), 0);
                    break;
                default:
                    throw Error(`Counted more connections than possible ${this.connections.length}`)
            }

            for (const direction of Object.values(DIRECTIONS)) {
                const loc = locationInDirection(this.x, this.y, direction);
                if (outOfBounds(loc.x, loc.y)) continue;
                update(loc.x, loc.y);
            }
        }
    }

    // returns all adjacent blocks that are redstone connection-worthy
    updateConnections() {
        let currentConnections = [];
        for (const direction of Object.values(DIRECTIONS)) {
            const loc = locationInDirection(this.x, this.y, direction);
            if (outOfBounds(loc.x, loc.y)) continue;
            const block = getBlock(loc.x, loc.y);
            if (block.attractsRedstone(this.x, this.y)) {
                currentConnections.push(block);
            }
        }

        if (arraysEqualContents(currentConnections, this.connections)) {
            return false;
        }

        this.connections = currentConnections;
        return true;
    }

    /*** OVERRIDE */
    isOn() {
        return this.signalStrength > 0;
    }

    transmitsHardPowerTo(x, y) {
        if (!areAdjacent(this.x, this.y, x, y)) return false;

        const block = getBlock(x, y);
        const blockBase = getBlock(x, y).base;
        
        if (!block.isPowerableFrom(this.x, this.y)) return false;
        if (block.attractsRedstone(this.x, this.y)) return true;
        
        if (blockBase === 'REDSTONE_DUST') return false;
        // Get whether redstone dust is facing that location
        const direction = getDirection(this.x, this.y, x, y);
        if (this.connections.length === 1) {
            const connectionDirection = getDirection(this.x, this.y, this.connections[0].x, this.connections[0].y);
            return connectionDirection.horizontal === direction.horizontal;
        } else {
            return false;
        }
    }

    getHardOutputLevelTo(x, y) {
        if (!areAdjacent(x, y, this.x, this.y)) return 0;
        if (!this.transmitsHardPowerTo(x, y)) return 0;
        return this.signalStrength - 1;
    }

    attractsRedstone() {
        return true;
    }

    isPowerableFrom(x, y) {
        return true;
    }
}

class Repeater extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('REPEATER_DELAY1_OFF'));
        this.lastSignalChangeTick = -1;
        this.delay = 1;
        this.facing = DIRECTIONS.UP;
        this.on = false;
        this.queuedId = -1;
    }

    updateSelf() {
        if (this.queuedId !== -1) return; // no point in caring if the repeater can't do anything

        const behindDir = getOppositeDirection(this.facing);
        const behindLoc = locationInDirection(this.x, this.y, behindDir);
        let behindBlock;
        if (outOfBounds(behindLoc.x, behindLoc.y)) behindBlock = null;
        else behindBlock = getBlock(behindLoc.x, behindLoc.y);

        const shouldBeOn = behindBlock !== null && behindBlock.isTransmittingPowerTo(this.x, this.y);
        // unnecessary most the time, but is required to accomodate for applyContext
        this.setBlockType(BLOCK_TYPES.get(`REPEATER_DELAY${this.delay}_${shouldBeOn ? 'ON' : 'OFF'}`), this.#getFacingRotations());

        if (shouldBeOn !== this.on) {
            this.lastSignalChangeTick = ticks;
            const frontLoc = locationInDirection(this.x, this.y, this.facing);
            this.queuedId = enqueueInTicks(() => {
                this.on = shouldBeOn;
                this.queuedId = -1;

                if (!outOfBounds(frontLoc.x, frontLoc.y)) update(frontLoc.x, frontLoc.y);
                update(this.x, this.y);
            }, this.delay);
        }
    }

    isPowerableFrom(x, y) {
        return getDirection(this.x, this.y, x, y) === getOppositeDirection(this.facing);
    }

    attractsRedstone(x, y) {
        return areAdjacent(this.x, this.y, x, y) && getDirection(this.x, this.y, x, y).horizontal === this.facing.horizontal;
    }

    isOn() {
        return this.on;
    }

    transmitsHardPowerTo(x, y) {
        return areAdjacent(this.x, this.y, x, y) && getDirection(this.x, this.y, x, y) === this.facing;
    }

    getContextMenu() {
        let contextMap = new Map();
        contextMap.set('Direction', createDirectionalContextList(this.facing));
        contextMap.set('Delay', [ '1', '2', '3', '4' ].filter(d => (d !== String(this.delay))));
        return new ContextMenu(contextMap);
    }

    applyContext(title, selectedOption) {
        this.lastSignalChangeTick = -10;
        removeFromTickQueue(this.queuedId); // demolish bugs before they appear
        this.queuedId = -1;

        if (title === 'Direction') {
            this.facing = DIRECTIONS[selectedOption.toUpperCase()];
            this.updateSelf();

            for (const direction of Object.values(DIRECTIONS)) {
                const loc = locationInDirection(this.x, this.y, direction);
                if (!outOfBounds(loc.x, loc.y)) update(loc.x, loc.y);
            }
        } else {
            this.delay = parseInt(selectedOption);
            this.updateSelf();
            const behindLoc = locationInDirection(this.x, this.y, getOppositeDirection(this.facing));
            if (!outOfBounds(behindLoc.x, behindLoc.y)) update(behindLoc.x, behindLoc.y);
            const frontLoc = locationInDirection(this.x, this.y, this.facing);
            if (!outOfBounds(frontLoc.x, frontLoc.y)) update(frontLoc.x, frontLoc.y);
        }
    }

    #getFacingRotations() {
        switch (this.facing) {
            case DIRECTIONS.UP:    return 0;
            case DIRECTIONS.LEFT:  return 3;
            case DIRECTIONS.DOWN:  return 2;
            case DIRECTIONS.RIGHT: return 1;
            default: throw Error('Invalid facing direction ', this.facing);
        }
    }

    destroy() {
        removeFromTickQueue(this.queuedId);
        this.queuedId = -1; // shouldn't do anything, but it's nice to make sure
    }
}

class Comparator extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('COMPARATOR_COMPARE_OFF'));
        this.lastSignalChangeTick = -1;
        this.facing = DIRECTIONS.UP;
        this.queuedId = -1;
        this.mode = 'COMPARE';
        this.signal = 0;
    }

    updateSelf() {
        const rearLoc = locationInDirection(this.x, this.y, getOppositeDirection(this.facing));
        const rearSignal = outOfBounds(rearLoc.x, rearLoc.y) ? 0 : getBlock(rearLoc.x, rearLoc.y).getOutputLevelTo(this.x, this.y);

        const sideLocs = [locationInDirection(this.x, this.y, rotateLeftDirection(this.facing)), locationInDirection(this.x, this.y, rotateRightDirection(this.facing))];
        let sideSignal = 0;
        for (const loc of sideLocs) {
            if (outOfBounds(loc.x, loc.y)) continue;
            const block = getBlock(loc.x, loc.y);
            sideSignal = Math.max(sideSignal, block.getOutputLevelTo(this.x, this.y));
        }

        let newSignal;

        if (this.mode === 'COMPARE') {
            newSignal = (rearSignal >= sideSignal) ? rearSignal : 0;
        } else {
            newSignal = Math.max(0, rearSignal - sideSignal);
        }
        
        if (this.signal !== newSignal) {
            this.lastSignalChangeTick = ticks;
            this.setBlockType(BLOCK_TYPES.get(`COMPARATOR_${this.mode}_${newSignal !== 0 ? 'ON' : 'OFF'}`));
            const frontLoc = locationInDirection(this.x, this.y, this.facing);
            this.queuedId = enqueueNextTick(() => {
                this.signal = newSignal;
                this.queuedId = -1;

                if (!outOfBounds(frontLoc.x, frontLoc.y)) update(frontLoc.x, frontLoc.y);
            });
        }
    }

    isPowerableFrom(x, y) {
        return getDirection(this.x, this.y, x, y) !== this.facing;
    }

    attractsRedstone(x, y) {
        return areAdjacent(this.x, this.y, x, y);
    }

    isOn() {
        return this.signal > 0;
    }

    transmitsHardPowerTo(x, y) {
        return areAdjacent(this.x, this.y, x, y) && getDirection(this.x, this.y, x, y) === this.facing;
    }

    getHardOutputLevelTo(x, y) {
        return this.transmitsHardPowerTo(x, y) ? this.signal : 0;
    }

    getContextMenu() {
        let contextMap = new Map();
        contextMap.set('Direction', createDirectionalContextList(this.facing));
        contextMap.set('Mode', [this.mode === 'COMPARE' ? 'Subtract' : 'Compare']);
        return new ContextMenu(contextMap);
    }

    applyContext(title, selectedOption) {
        this.lastSignalChangeTick = -10;
        removeFromTickQueue(this.queuedId); // demolish bugs before they appear
        this.queuedId = -1;

        if (title === 'Direction') {
            this.facing = DIRECTIONS[selectedOption.toUpperCase()];
            this.setBlockType(this.getBlockType(), this.#getFacingRotations())
            this.updateSelf();
        } else {
            this.mode = selectedOption.toUpperCase();
            this.setBlockType(BLOCK_TYPES.get(`COMPARATOR_${this.mode}_${this.signalStrength > 0 ? 'ON' : 'OFF'}`));
            this.updateSelf();
        }
    }

    #getFacingRotations() {
        switch (this.facing) {
            case DIRECTIONS.UP:    return 0;
            case DIRECTIONS.LEFT:  return 3;
            case DIRECTIONS.DOWN:  return 2;
            case DIRECTIONS.RIGHT: return 1;
            default: throw Error('Invalid facing direction ', this.facing);
        }
    }

    destroy() {
        removeFromTickQueue(this.queuedId);
        this.queuedId = -1; // shouldn't do anything, but it's nice to make sure
    }
}

class RedstoneBlock extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('REDSTONE_BLOCK'));
    }

    updateSelf() {
        for (const direction of Object.values(DIRECTIONS)) {
            const loc = locationInDirection(this.x, this.y, direction);
            if (outOfBounds(loc.x, loc.y)) continue;
            const block = getBlock(loc.x, loc.y);

            if (block.isPowerableFrom(this.x, this.y)) update(block.x, block.y);
        }
    }

    transmitsSoftPowerTo(x, y) {
        return areAdjacent(x, y, this.x, this.y) && getBlock(x, y).isPowerableFrom(this.x, this.y);
    }

    attractsRedstone(x, y) {
        return true;
    }

    isOn(x, y) {
        return true;
    }

    isSolid() {
        return true;
    }
}

class Lever extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('LEVER_OFF'));
        this.on = false;
    }

    updateSelf() {
        for (const direction of Object.values(DIRECTIONS)) {
            const loc = locationInDirection(this.x, this.y, direction);
            if (outOfBounds(loc.x, loc.y)) continue;
            const block = getBlock(loc.x, loc.y);

            if (block.isPowerableFrom(this.x, this.y)) update(loc.x, loc.y);
        }
    }

    transmitsHardPowerTo(x, y) {
        return areAdjacent(x, y, this.x, this.y);
    }

    attractsRedstone(x, y) {
        return true;
    }

    isOn(x, y) {
        return this.on;
    }

    getContextMenu() {
        const contextMap = new Map();
        contextMap.set('Power', [ 'Toggle (' + (this.on ? 'off' : 'on') + ')' ]);
        return new ContextMenu(contextMap);
    }

    applyContext(title, selectedOption) {
        this.on = (selectedOption === 'Toggle (on)');
        this.setBlockType(BLOCK_TYPES.get('LEVER_' + (this.on ? 'ON' : 'OFF')));
        this.updateSelf();
    }

    isSolid() {
        return true;
    }
}

class RedstoneLamp extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('REDSTONE_LAMP_OFF'), 0);
        this.powerType = POWER_TYPES.NONE;
    }

    updateSelf() {
        let currentPower = this.getGreatestAdjacentPower();        
        if (currentPower !== this.powerType) {
            this.powerType = currentPower;
            let status = (this.powerType.activates ? 'ON' : 'OFF');

            this.setBlockType(BLOCK_TYPES.get('REDSTONE_LAMP_' + status), 0);

            for (const direction of Object.values(DIRECTIONS)) { // Soft Power + repeater debug
                const loc = locationInDirection(this.x, this.y, direction);
                if (!outOfBounds(loc.x, loc.y)) update(loc.x, loc.y);
            }
        }
    }

    isPowerableFrom(x, y) {
        return areAdjacent(this.x, this.y, x, y);
    }

    isOn() {
        return this.powerType.activates;
    }

    isSolid() {
        return true;
    }

    transmitsSoftPowerTo(x, y) {
        return areAdjacent(this.x, this.y, x, y) && this.powerType === POWER_TYPES.HARD;
    }
}

class RedstoneTorch extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('REDSTONE_TORCH_GROUND_ON'), 0);
        this.torchPosition = 'Ground';
        this.on = true;
        this.queuedId = -1;
        this.lastUpdatedTick = -1;
    }

    updateSelf() {
        let currentPowered = false;
        
        if (this.torchPosition !== 'Ground') { // don't respond to 1-tick only updates
            // detect deletion of holder block
            const holderBlockLoc = locationInDirection(this.x, this.y, this.#directionFromTorchPosition());
            if (outOfBounds(holderBlockLoc.x, holderBlockLoc.y) || !getBlock(holderBlockLoc.x, holderBlockLoc.y).isSolid()) { // no solid attachment, destroy self
                setBlockUI('BLANK', this.x, this.y);
                return;
            }

            // if (this.queuedId < 0) {
                for (const direction of Object.values(DIRECTIONS)) {
                    const loc = locationInDirection(this.x, this.y, direction);
                    if (outOfBounds(loc.x, loc.y)) continue;
                    if (!this.isPowerableFrom(loc.x, loc.y)) continue;

                    const block = getBlock(loc.x, loc.y);

                    if (block.isTransmittingPowerTo(this.x, this.y)) {
                        currentPowered = true;
                        break;
                    }
                }
            // }
        }

        if (this.queuedId < 0 && currentPowered !== !this.on && this.lastUpdatedTick !== ticks) {
            this.on = !currentPowered;
            this.lastUpdatedTick = ticks;
            const wallStatus = (this.torchPosition === 'Ground') ? 'GROUND' : 'WALL';

            this.queuedId = enqueueNextTick(() => {
                if (currentPowered !== !this.on) {
                    return;
                }
                this.on = !currentPowered;
                this.setBlockType(BLOCK_TYPES.get('REDSTONE_TORCH_' + wallStatus + '_' + (this.on ? 'ON' : 'OFF')), this.#getRotations());
                this.queuedId = -1;
                this.updateSelf();
                for (const direction of Object.values(DIRECTIONS)) {
                    const loc = locationInDirection(this.x, this.y, direction);
                    if (this.isPowerableFrom(loc.x, loc.y)) continue; // is on the block
                    if (outOfBounds(loc.x, loc.y)) continue;

                    update(loc.x, loc.y);
                }
                this.updateSelf();
            });
        }
    }

    static TORCH_POSITIONS = ['Ground', 'Left', 'Right', 'Up', 'Down'];

    isPowerableFrom(x, y) {
        if (this.torchPosition === 'Ground') return false;
        const dir = getDirection(this.x, this.y, x, y);
        return dir === this.#directionFromTorchPosition();
    }

    attractsRedstone(x, y) {
        return true;
    }

    isOn() {
        return this.on;
    }

    transmitsSoftPowerTo(x, y) {
        return areAdjacent(this.x, this.y, x, y) && !this.isPowerableFrom(x, y);
    }

    getContextMenu() {
        const positionList = (this.torchPosition === 'Ground') ? [] : ['Ground'];
        const contextMap = new Map();
        contextMap.set('Position', positionList);

        for (const direction of Object.values(DIRECTIONS)) {
            const loc = locationInDirection(this.x, this.y, direction);
            if (outOfBounds(loc.x, loc.y)) continue;
            const positionFromTorchDir = this.#positionFromTorchDirection(direction);
            if (getBlock(loc.x, loc.y).isSolid() && this.torchPosition !== positionFromTorchDir) positionList.push(positionFromTorchDir);
        }

        return new ContextMenu(contextMap);
    }

    applyContext(title, selected) {
        if (title === 'Position' && selected !== 'Ground') {
            let dir;
            switch (selected) {
                case 'Down': dir = DIRECTIONS.DOWN; break;
                case 'Left': dir = DIRECTIONS.LEFT; break;
                case 'Up': dir = DIRECTIONS.UP; break;
                case 'Right': dir = DIRECTIONS.RIGHT; break;
            }
            const holderLoc = locationInDirection(this.x, this.y, dir);
            
            if (outOfBounds(holderLoc.x, holderLoc.y) || !getBlock(holderLoc.x, holderLoc.y).isSolid()) {
                selected = 'Ground';
            }
        }

        this.torchPosition = selected;

        const wallStatus = (this.torchPosition === 'Ground') ? 'GROUND' : 'WALL';
        this.setBlockType(BLOCK_TYPES.get('REDSTONE_TORCH_' + wallStatus + '_ON'), this.#getRotations());

        removeFromTickQueue(this.queuedId);
        this.queuedId = -1;
        this.updateSelf();
    }

    destroy() {
        removeFromTickQueue(this.queuedId);
        this.queuedId = -1;
    }

    #directionFromTorchPosition(torchPosition = this.torchPosition) {
        switch (torchPosition) {
            case 'Ground': throw Error('Cannot derive direction from Ground');
            case 'Down': return DIRECTIONS.DOWN;
            case 'Left': return DIRECTIONS.LEFT;
            case 'Up': return DIRECTIONS.UP;
            case 'Right': return DIRECTIONS.RIGHT;
            default: throw Error('Invalid torch position: ' + this.torchPosition);
        }
    }

    #positionFromTorchDirection(direction) {
        switch (direction) {
            case DIRECTIONS.DOWN: return 'Down';
            case DIRECTIONS.LEFT: return 'Left';
            case DIRECTIONS.RIGHT: return 'Right';
            case DIRECTIONS.UP: return 'Up';
            default: throw Error('Invalid direction: ' + this.torchPosition);
        }
    }

    #getRotations() {
        switch (this.torchPosition) {
            case 'Ground': return 0;
            case 'Down': return 0;
            case 'Left': return 1;
            case 'Up': return 2;
            case 'Right': return 3;
            default: throw Error('Invalid torch position: ' + this.torchPosition);
        }
    }
}

class NoteBlock extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('NOTE_BLOCK_' + NOTE_NAMES[0]), 0);
        
        let contextMap = new Map();
        contextMap.set('Note Name', NOTE_NAMES);
        this.contextMenu = new ContextMenu(contextMap);

        this.note_name = NOTE_NAMES[0];

        this.powerType = POWER_TYPES.NONE;
    }

    updateSelf() {
        let currentPower = this.getGreatestAdjacentPower();
        
        if (currentPower !== this.powerType) {
            const $previousPowerType = this.powerType;
            this.powerType = currentPower;
            for (const direction of Object.values(DIRECTIONS)) { // Soft Power
                const loc = locationInDirection(this.x, this.y, direction);
                if (!outOfBounds(loc.x, loc.y)) update(loc.x, loc.y);
            }
            if (currentPower.activates && !$previousPowerType.activates) {
                playNote(this.note_name);
                emitObserverUpdate(this.x, this.y);
            }
        }
    }

    getContextMenu() {
        return this.contextMenu;
    }

    applyContext(title, selectedOption) {
        this.setBlockType(BLOCK_TYPES.get('NOTE_BLOCK_' + selectedOption));
        this.note_name = selectedOption;
    }

    isPowerableFrom(x, y) {
        return areAdjacent(this.x, this.y, x, y);
    }

    transmitsSoftPowerTo(x, y) {
        return this.powerType === POWER_TYPES.HARD && areAdjacent(this.x, this.y, x, y);
    }

    isSolid() {
        return true;
    }

    isOn() {
        return this.powerType.activates;
    }
}

class Cobblestone extends OpaqueThing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('COBBLESTONE'), 0);
        this.powerType = POWER_TYPES.NONE;
    }
}

class Obsidian extends OpaqueThing { // same as cobble except constructor
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('OBSIDIAN'), 0);
        this.powerType = POWER_TYPES.NONE;
    }
}

class Target extends OpaqueThing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('TARGET'), 0);
        this.powerType = POWER_TYPES.NONE;
    }

    attractsRedstone(x, y) {
        return areAdjacent(x, y, this.x, this.y);
    }
}

class TNT extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('TNT'), 0);
        this.queuedId = -1;
    }

    updateSelf() {
        for (const direction of Object.values(DIRECTIONS)) {
            const loc = locationInDirection(this.x, this.y, direction);
            if (outOfBounds(loc.x, loc.y)) continue;

            const block = getBlock(loc.x, loc.y);
            if (block.isTransmittingPowerTo(this.x, this.y)) {
                this.setBlockType(BLOCK_TYPES.get('TNT_PRIMED'));
                this.queuedId = enqueueInTicks(() => {
                    createGrid(width, height);
                }, 20, true);
            }
        }
    }

    isPowerableFrom(x, y) {
        return areAdjacent(this.x, this.y, x, y);
    }

    isSolid() {
        return true; // only matters to redstone torches, but they get placed on the ground, sooo......
    }

    destroy() {
        removeFromTickQueue(this.queuedId);
        this.queuedId = -1;
    }
}

class Observer extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('OBSERVER_OFF'));
        this.updateQueued = false;
        this.on = false;
        this.queuedId = -1;
        this.facing = DIRECTIONS.RIGHT;
    }

    updateSelf() {
        if (this.updateQueued && this.queuedId < 0) {
            this.queuedId = enqueueNextTick(() => {
                this.on = true;
                this.setBlockType(BLOCK_TYPES.get('OBSERVER_ON'), this.getImageRotation(), true);
                this.updateBehind();
                this.queuedId = enqueueNextTick(() => {
                    this.on = false;
                    this.setBlockType(BLOCK_TYPES.get('OBSERVER_OFF'), this.getImageRotation(), true); //setting to true should be technically correct. test long observer clocks later
                    this.updateBehind();
                    this.updateSelf(); // temporary fix for 1-tick clocks. fix after hackathon
                    this.updateQueued = false;
                    this.queuedId = -1;
                })
            });
        }
    }

    sendUpdate() {
        if (this.queuedId > -1) return; // temporary fix for 1-tick observer clocks
        if (!this.updateQueued) {
            this.updateQueued = true;
            this.setBlockType(BLOCK_TYPES.get('OBSERVER_OBSERVES'), this.getImageRotation(), false);
            this.updateSelf();
        }
    }

    transmitsHardPowerTo(x, y) {
        return areAdjacent(this.x, this.y, x, y) && getDirection(x, y, this.x, this.y) === this.facing;
    }
    
    attractsRedstone(x, y) {
        return this.transmitsHardPowerTo(x, y);
    }

    updateBehind() {
        const behindDir = getOppositeDirection(this.facing);
        const behindLoc = locationInDirection(this.x, this.y, behindDir);
        if (!outOfBounds(behindLoc.x, behindLoc.y)) update(behindLoc.x, behindLoc.y);
    }

    isFacing(direction) {
        return this.facing === direction;
    }

    isOn() {
        return this.on;
    }

    getContextMenu() {
        let contextMap = new Map();
        contextMap.set('Direction', createDirectionalContextList(this.facing));
        return new ContextMenu(contextMap);
    }

    applyContext(title, selectedOption) {
        removeFromTickQueue(this.queuedId); // demolish bugs before they appear
        this.queuedId = -1;

        this.facing = DIRECTIONS[selectedOption.toUpperCase()];
        this.setBlockType(BLOCK_TYPES.get('OBSERVER_OFF'), this.#getRotation());
        for (const direction of Object.values(DIRECTIONS)) { // lazy
            const loc = locationInDirection(this.x, this.y, direction);
            if (!outOfBounds(loc.x, loc.y)) update(loc.x, loc.y);
        }
    }

    #getRotation() {
        switch (this.facing) {
            case DIRECTIONS.RIGHT: return 0;
            case DIRECTIONS.UP:    return 3;
            case DIRECTIONS.LEFT:  return 2;
            case DIRECTIONS.DOWN:  return 1;
            default: throw Error('Unknown facing direction: ' + this.facing);
        }
    }
}

class Piston extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('PISTON'), 0);
        this.powered = false;
        this.extended = false;
        this.facing = DIRECTIONS.RIGHT;
        this.queuedId = -1;
    }

    updateSelf() {
        const shouldBePowered = this.getGreatestAdjacentPower().activates;

        if (shouldBePowered !== this.powered) {
            this.powered = shouldBePowered;

            removeFromTickQueue(this.queuedId);
            this.queuedId = -1;
        }

        if (this.queuedId === -1) {
            if (this.powered && !this.extended) {
                this.queuedId = enqueueNextTick(() => {
                    this.extend();
                    this.queuedId = -1;
                });
            } else if (!this.powered && this.extended) {
                this.queuedId = enqueueNextTick(() => {
                    this.retract();
                    this.queuedId = -1;
                });
            }
        }
    }

    extend() {
        if (this.extended) {
            console.warn(`Tried to extend extended piston (${this.x}, ${this.y})`);
            return false;
        }
        const blocksToPush = getPushList(this.x, this.y, this.facing);
        if (blocksToPush === undefined) return false;

        this.extended = true;

        const locationInFront = locationInDirection(this.x, this.y, this.facing);
        const pistonArm = new PistonArm(locationInFront.x, locationInFront.y, this.facing, false);
        setBlock(pistonArm);

        const newLocations = new Set();
        newLocations.add(`${locationInFront.x},${locationInFront.y}`);

        for (const block of blocksToPush) {
            const originalBlockLoc = { x: block.x, y: block.y };
            const newLoc = locationInDirection(block.x, block.y, this.facing);

            block.setSelfLoc(newLoc.x, newLoc.y);
            setBlock(block);
            emitObserverUpdate(newLoc.x, newLoc.y, true);

            newLocations.add(`${newLoc.x},${newLoc.y}`);

            const origKey = `${originalBlockLoc.x},${originalBlockLoc.y}`;
            if (
                origKey !== `${this.x},${this.y}` && // don’t erase piston
                origKey !== `${locationInFront.x},${locationInFront.y}` && // don’t erase piston arm
                !newLocations.has(origKey) // don’t erase if another block moved here
            ) {
                setBlockUI('BLANK', originalBlockLoc.x, originalBlockLoc.y);
            }
        }

        this.setBlockType(BLOCK_TYPES.get('PISTON_ACTIVATED'));

        return true;
    }



    retract() {
        if (!this.extended) {
            console.warn(`Tried to retract not-extended piston (${this.x}, ${this.y})`);
            return;
        }
        this.extended = false;
        const frontLoc = locationInDirection(this.x, this.y, this.facing);
        if (!outOfBounds(frontLoc.x, frontLoc.y)) {
            const block = getBlock(frontLoc.x, frontLoc.y);
            if (block.getBlockBase() === 'PISTON_ARM') {
                setBlockUI('BLANK', frontLoc.x, frontLoc.y);
            }
        }
        this.setBlockType(BLOCK_TYPES.get('PISTON'));
    }

    isPowerableFrom(x, y) {
        return areAdjacent(this.x, this.y, x, y) && this.facing !== getDirection(this.x, this.y, x, y);
    }

    isOn() {
        return this.powered;
    }

    isExtended() {
        return this.extended;
    }

    getContextMenu() {
        if (this.extended) return;
        let contextMap = new Map();
        contextMap.set('Direction', createDirectionalContextList(this.facing));
        return new ContextMenu(contextMap);
    }

    applyContext(title, selectedOption) {
        if (this.extended) return;
        this.facing = DIRECTIONS[selectedOption.toUpperCase()];
        this.setBlockType(BLOCK_TYPES.get('PISTON'), this.#getRotation());
        for (const direction of Object.values(DIRECTIONS)) {
            const loc = locationInDirection(this.x, this.y, direction);
            if (!outOfBounds(loc.x, loc.y)) update(loc.x, loc.y);
        }
    }

    destroy() {
        removeFromTickQueue(this.queuedId);
        this.queuedId = -1;
        if (this.extended) {
            const frontLoc = locationInDirection(this.x, this.y, this.facing);
            setBlockUI('BLANK', frontLoc.x, frontLoc.y);
        }
    }

    #getRotation() {
        switch (this.facing) {
            case DIRECTIONS.RIGHT: return 0;
            case DIRECTIONS.DOWN:  return 1;
            case DIRECTIONS.LEFT:  return 2;
            case DIRECTIONS.UP:    return 3;
            default: throw Error('Unknown facing direction: ' + this.facing);
        }
    }
}

class StickyPiston extends Thing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('STICKY_PISTON'), 0);
        this.powered = false;
        this.extended = false;
        this.facing = DIRECTIONS.RIGHT;
        this.queuedId = -1;
    }

    updateSelf() {
        const shouldBePowered = this.getGreatestAdjacentPower().activates;

        if (shouldBePowered !== this.powered) {
            this.powered = shouldBePowered;

            removeFromTickQueue(this.queuedId);
            this.queuedId = -1;
        }

        if (this.queuedId === -1) {
            if (this.powered && !this.extended) {
                this.queuedId = enqueueNextTick(() => {
                    this.extend();
                    this.queuedId = -1;
                });
            } else if (!this.powered && this.extended) {
                this.queuedId = enqueueNextTick(() => {
                    this.retract();
                    this.queuedId = -1;
                });
            }
        }
    }

    extend() {
        if (this.extended) {
            console.warn(`Tried to extend extended sticky piston (${this.x}, ${this.y})`);
            return false;
        }
        const blocksToPush = getPushList(this.x, this.y, this.facing);
        if (blocksToPush === undefined) return false;

        this.extended = true;

        const locationInFront = locationInDirection(this.x, this.y, this.facing);
        const pistonArm = new PistonArm(locationInFront.x, locationInFront.y, this.facing, true);
        setBlock(pistonArm);

        const newLocations = new Set();
        newLocations.add(`${locationInFront.x},${locationInFront.y}`);

        for (const block of blocksToPush) {
            const originalBlockLoc = { x: block.x, y: block.y };
            const newLoc = locationInDirection(block.x, block.y, this.facing);

            block.setSelfLoc(newLoc.x, newLoc.y);
            setBlock(block);
            emitObserverUpdate(newLoc.x, newLoc.y, true);

            newLocations.add(`${newLoc.x},${newLoc.y}`);

            const origKey = `${originalBlockLoc.x},${originalBlockLoc.y}`;
            if (
                origKey !== `${this.x},${this.y}` &&
                origKey !== `${locationInFront.x},${locationInFront.y}` &&
                !newLocations.has(origKey)
            ) {
                setBlockUI('BLANK', originalBlockLoc.x, originalBlockLoc.y);
            }
        }

        this.setBlockType(BLOCK_TYPES.get('STICKY_PISTON_ACTIVATED'));

        return true;
    }

    retract() {
        if (!this.extended) {
            console.warn(`Tried to retract non-extended sticky piston (${this.x}, ${this.y})`);
            return false;
        }

        this.extended = false;
        const frontLoc = locationInDirection(this.x, this.y, this.facing);
        setBlockUI('BLANK', frontLoc.x, frontLoc.y);
        let pushOrigin = frontLoc;
        for (let i = 0; i < 11; i++) {
            pushOrigin = locationInDirection(pushOrigin.x, pushOrigin.y, this.facing);
            if (outOfBounds(pushOrigin.x, pushOrigin.y)) break;
            const pushBlock = getBlock(pushOrigin.x, pushOrigin.y);
            if (pushBlock.getBlockType().base !== 'SLIME_BLOCK') {
                if (pushBlock.getBlockType().piston_touch === 'move') {
                    pushOrigin = locationInDirection(pushOrigin.x, pushOrigin.y, this.facing);
                }
                break;
            }
        }

        const blocksToPull = getPushList(pushOrigin.x, pushOrigin.y, getOppositeDirection(this.facing));

        const newLocations = new Set();

        const oppositeDir = getOppositeDirection(this.facing);

        if (blocksToPull !== undefined) {
            for (const block of blocksToPull) {
                const originalBlockLoc = { x: block.x, y: block.y };
                const newLoc = locationInDirection(block.x, block.y, oppositeDir);

                block.setSelfLoc(newLoc.x, newLoc.y);
                setBlock(block);
                emitObserverUpdate(newLoc.x, newLoc.y, true);

                newLocations.add(`${newLoc.x},${newLoc.y}`);

                const origKey = `${originalBlockLoc.x},${originalBlockLoc.y}`;
                if (
                    origKey !== `${this.x},${this.y}` &&
                    origKey !== `${frontLoc.x},${frontLoc.y}` &&
                    !newLocations.has(origKey)
                ) {
                    setBlockUI('BLANK', originalBlockLoc.x, originalBlockLoc.y);
                }
            }
        }

        this.setBlockType(BLOCK_TYPES.get('STICKY_PISTON'), this.#getRotation());

        return true;
    }

    isPowerableFrom(x, y) {
        return areAdjacent(this.x, this.y, x, y) && this.facing !== getDirection(this.x, this.y, x, y);
    }

    isOn() {
        return this.powered;
    }

    isExtended() {
        return this.extended;
    }

    getContextMenu() {
        if (this.extended) return;
        let contextMap = new Map();
        contextMap.set('Direction', createDirectionalContextList(this.facing));
        return new ContextMenu(contextMap);
    }

    applyContext(title, selectedOption) {
        if (this.extended) return;
        this.facing = DIRECTIONS[selectedOption.toUpperCase()];
        this.setBlockType(BLOCK_TYPES.get('STICKY_PISTON'), this.#getRotation());
        for (const direction of Object.values(DIRECTIONS)) {
            const loc = locationInDirection(this.x, this.y, direction);
            if (!outOfBounds(loc.x, loc.y)) update(loc.x, loc.y);
        }
    }

    destroy() {
        removeFromTickQueue(this.queuedId);
        this.queuedId = -1;
        if (this.extended) {
            const frontLoc = locationInDirection(this.x, this.y, this.facing);
            setBlockUI('BLANK', frontLoc.x, frontLoc.y);
        }
    }

    #getRotation() {
        switch (this.facing) {
            case DIRECTIONS.RIGHT: return 0;
            case DIRECTIONS.DOWN:  return 1;
            case DIRECTIONS.LEFT:  return 2;
            case DIRECTIONS.UP:    return 3;
            default: throw Error('Unknown facing direction: ' + this.facing);
        }
    }
}

class SlimeBlock extends OpaqueThing {
    constructor(x, y) {
        super(x, y, BLOCK_TYPES.get('SLIME_BLOCK'));
    }
}

// cosmetic block; does not show up in selector
class PistonArm extends Thing {
    constructor(x, y, facing, sticky) {
        super(x, y, BLOCK_TYPES.get(sticky ? 'STICKY_PISTON_ARM' : 'PISTON_ARM'), (() => {
            switch (facing) {
            case DIRECTIONS.RIGHT: return 0;
            case DIRECTIONS.DOWN:  return 1;
            case DIRECTIONS.LEFT:  return 2;
            case DIRECTIONS.UP:    return 3;
            default: throw Error('Unrecognised direction: ' + facing);
        }
        })());
        this.facing = facing;
        this.destroyed = false;
    }

    #getRotations(facing = this.facing) {
        switch (facing) {
            case DIRECTIONS.RIGHT: return 0;
            case DIRECTIONS.DOWN:  return 1;
            case DIRECTIONS.LEFT:  return 2;
            case DIRECTIONS.UP:    return 3;
            default: throw Error('Unrecognised direction: ' + facing);
        }
    }

    destroy() {
        const behindLoc = locationInDirection(this.x, this.y, getOppositeDirection(this.facing));
        const behindBlock = getBlock(behindLoc.x, behindLoc.y);
        if (!this.destroyed && (behindBlock.getBlockBase() === 'PISTON' || behindBlock.getBlockBase() === 'STICKY_PISTON') && behindBlock.extended) {
            this.destroyed = true; // hacky but whatever
            setBlockUI('BLANK', behindLoc.x, behindLoc.y);
        }
    }
}

/******* PISTON UTIL ********/
/**
 * @returns a list of elements that need to be moved when pushing from a certain direction
 * @return {undefined} when list of elems > 12 or is immovable for some other reason
 */
function getPushList(x, y, dir, blocksToPush = [], visited = new Set()) {
    const start = locationInDirection(x, y, dir);
    if (!collectChain(start.x, start.y, dir, blocksToPush, visited, x, y)) return;
    return blocksToPush;
}

function collectChain(x, y, dir, blocksToPush, visited, pistonX, pistonY) {
    let current = { x, y };

    for (let i = 0; i < 13; i++) {
        if (outOfBounds(current.x, current.y)) return false;

        const block = getBlock(current.x, current.y);
        const touch = block.getBlockType().piston_touch;

        if (touch === 'move') {
            const key = `${current.x},${current.y}`;
            if (!visited.has(key)) {
                visited.add(key);
                blocksToPush.push(block);
                if (blocksToPush.length > 12) return false;
            }

            if (block.getBlockBase() === 'SLIME_BLOCK') {
                if (!expandFromSlime(current.x, current.y, dir, blocksToPush, visited, pistonX, pistonY)) return false;
            }

        } else if (touch === 'immoble') {
            return false;
        } else if (touch === 'break') {
            break;
        } else {
            throw Error('Invalid piston touch value: ' + touch);
        }

        current = locationInDirection(current.x, current.y, dir);
    }

    return true;
}
function expandFromSlime(x, y, dir, blocksToPush, visited, pistonX, pistonY) {
    for (const nd of Object.values(DIRECTIONS)) {
        const nloc = locationInDirection(x, y, nd);
        if (outOfBounds(nloc.x, nloc.y)) continue;

        if (nloc.x === pistonX && nloc.y === pistonY) continue;

        const nBlock = getBlock(nloc.x, nloc.y);
        const nTouch = nBlock.getBlockType().piston_touch;
        if (nTouch !== 'move') continue;

        const key = `${nloc.x},${nloc.y}`;
        if (visited.has(key)) continue;

        if (!collectChain(nloc.x, nloc.y, dir, blocksToPush, visited, pistonX, pistonY)) return false;
    }
    return true;
}





let updateQueue = new Map();
let nextId = 0;
let ticks = 0;

function enqueueNextTick(func, priority = false) {
    return enqueueInTicks(func, 1, priority);
}
function enqueueInTicks(func, tickCount, priority = false) {
    if (tickCount < 1) throw Error(tickCount + ' ticks is not in the future')

    let queue = updateQueue.get(ticks + tickCount);
    if (queue === undefined) { // insert new queue if there isn't one
        queue = [];
        updateQueue.set(ticks + tickCount, queue);
    }
    
    const action = { id: nextId, func: func };
    if (priority) queue.unshift(action);
    else queue.push(action);
    return nextId++;
}
/**
 * 
 * @returns {boolean} whether an action at that ID was found and removed 
 */
function removeFromTickQueue(id) {
    if (id < 0) return false;

    for (let [tick, queue] of updateQueue.entries()) {
        for (let i = 0; i < queue.length; i++) {
            if (queue[i].id === id) {
                queue.splice(i, 1);
                if (queue.length === 0) {
                    updateQueue.delete(tick);
                }
                
                return true;
            }
        }
    }

    return false;
}
setInterval(() => {
    ticks++;
    let queue = updateQueue.get(ticks);
    if (!queue) return; // no queue at this tick, skip

    while (queue.length !== 0) {
        queue.shift().func();
    }

    updateQueue.delete(ticks); // clean up after processing
}, REDSTONE_TICK_MS);

let blockGrid = [];

function createGrid(x, y) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const cellSize = Math.floor(Math.min(vw / x, vh / y));

    grid.style.gridTemplateColumns = `repeat(${x}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${y}, ${cellSize}px)`;

    grid.innerHTML = '';

    blockGrid = [];

    // reset
    updateQueue.clear();
    ticks = 0;
    nextId = 0;

    for (let col = 0; col < y; col++) {
        for (let row = 0; row < x; row++) {
            if (col === 0) blockGrid[row] = [];

            const cell = document.createElement('div');
            cell.classList.add('cell');

            const img = document.createElement('img');
            // img.src = BLOCK_TYPES.get('BLANK').src;
            img.alt = '';
            img.id = `cell-img-${row}x${col}`;

            cell.dataset.x = (row).toString();
            cell.dataset.y = (col).toString();

            cell.appendChild(img);
            grid.appendChild(cell);

            blockGrid[row][col] = new Blank(row, col);
            setImage(BLOCK_TYPES.get('BLANK').src, row, col);
        }
    }
}

function setBlockUI(base, x, y) {
    const baseObj = BLOCK_BASES.get(base);
    if (!baseObj) throw Error('Base ' + base + ' does not exist');
    setBlock(baseObj.construct(x, y));
    
    if (base === 'BLANK') { // update pistons within 13 blocks in all directions
        for (const direction of Object.values(DIRECTIONS)) {
            const dx = direction.x;
            const dy = direction.y;

            for (let dist = 1; dist <= 13; dist++) {
                const nx = x + dx * dist;
                const ny = y + dy * dist;

                if (outOfBounds(nx, ny)) break;

                const neighbor = getBlock(nx, ny);
                if (neighbor instanceof Piston || neighbor instanceof StickyPiston) {
                    if (neighbor.facing === getFarDirection(nx, ny, x, y)) {
                        update(nx, ny);
                    }
                    break;
                }
            }
        }
    }
}

function setBlock(block) {
    blockGrid[block.x][block.y].destroy();
    blockGrid[block.x][block.y] = block;
    update(block.x, block.y);
    for (const direction of Object.values(DIRECTIONS)) { // im lazy. just update all the adjacent blocks
        const loc = locationInDirection(block.x, block.y, direction);
        if (outOfBounds(loc.x, loc.y)) continue;
        update(loc.x, loc.y);
    }
    block.resetImage();
    emitObserverUpdate(block.x, block.y, false);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (x === block.x && y === block.y) continue;
            if (areAdjacent(x, y, block.x, block.y)) continue; // already updated
            const possiblePiston = getBlock(x, y);
            if (possiblePiston instanceof Piston || possiblePiston instanceof StickyPiston) {
                update(x, y);
            }
        }
    }
}

function getBlock(x, y) {
    return blockGrid[x][y];
}

function update(x, y) {
    getBlock(x, y).updateSelf();
}

function emitObserverUpdate(x, y, emitToSelf = true) {
    for (const direction of Object.values(DIRECTIONS)) {
        const loc = locationInDirection(x, y, direction);
        if (outOfBounds(loc.x, loc.y)) continue;

        const block = getBlock(loc.x, loc.y);
        if (block instanceof Observer && block.isFacing(getOppositeDirection(direction))) block.sendUpdate();
    }

    const block = getBlock(x, y);

    if (emitToSelf && block instanceof Observer) {
        block.sendUpdate();
    }
}

function setImage(src, x, y, rotations, animateRotation = false) {
    const img = document.getElementById(`cell-img-${x}x${y}`);
    img.src = src;
    img.style.transform = `rotate(${rotations * 90}deg)`; //
    if (animateRotation) img.classList.add('rotating');

    if (src === BLOCK_TYPES.get('BLANK').src) { // a bit hacky but it'll have to do
        img.classList.add('fadeout');
    } else {
        img.classList.remove('fadeout');
    }
}

function outOfBounds(x, y) {
    return x < 0 || y < 0 || !blockGrid || !blockGrid[x] || x >= blockGrid.length  || y >= blockGrid[x].length;
}

function areAdjacent(x1, y1, x2, y2) {
    const xDist = Math.abs(x1-x2);
    const yDist = Math.abs(y1-y2);
    return (xDist === 1 && yDist === 0) || (xDist === 0 && yDist === 1);
}

// Checks for array contents being equal, ignoring the sorting. Does not deal with duplicates
function arraysEqualContents(A, B) {
    let AsubB = A.every(a => B.some(b => a === b));
    let sameLength = A.length === B.length;
    return AsubB && sameLength;
}

// Esporta la griglia in un file JSON
function saveState() {
    const state = {
        width: width,
        height: height,
        blocks: []
    };

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const block = getBlock(x, y);
            
            // Ignoriamo i blocchi vuoti e le braccia dei pistoni (verranno ricreate automaticamente)
            if (!(block instanceof Blank) && block.getBlockBase() !== 'PISTON_ARM' && block.getBlockBase() !== 'STICKY_PISTON_ARM') {
                const blockData = {
                    x: x,
                    y: y,
                    base: block.getBlockBase()
                };
                
                // Salviamo le configurazioni specifiche del blocco se presenti
                if (block.facing) blockData.facing = directionToName(block.facing);
                if (block.delay) blockData.delay = block.delay;
                if (block.mode) blockData.mode = block.mode;
                if (block instanceof Lever) blockData.on = block.on;
                if (block.note_name) blockData.note_name = block.note_name;
                if (block.torchPosition) blockData.torchPosition = block.torchPosition;
                
                state.blocks.push(blockData);
            }
        }
    }

    // Creazione e download del file JSON
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'limestone_save.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Carica la griglia da un file JSON
function loadState(jsonString) {
    try {
        const state = JSON.parse(jsonString);
        if (state.width && state.height) {
            width = state.width;
            height = state.height;
        }
        
        // Ricostruiamo la griglia pulita
        createGrid(width, height);
        
        // Inseriamo i blocchi
        state.blocks.forEach(b => {
            setBlockUI(b.base, b.x, b.y);
            const block = getBlock(b.x, b.y);
            
            // Ripristiniamo le configurazioni specifiche simulando le azioni del context menu
            if (b.facing) block.applyContext('Direction', b.facing);
            if (b.delay) block.applyContext('Delay', b.delay.toString());
            if (b.mode) {
                const modeStr = b.mode === 'COMPARE' ? 'Compare' : 'Subtract';
                block.applyContext('Mode', modeStr);
            }
            if (b.base === 'LEVER' && b.on !== undefined) {
                block.applyContext('Power', b.on ? 'Toggle (on)' : 'Toggle (off)');
            }
            if (b.note_name) block.applyContext('Note Name', b.note_name);
            if (b.torchPosition) block.applyContext('Position', b.torchPosition);
        });
    } catch (e) {
        console.error("Errore nel caricamento del salvataggio:", e);
        alert("Impossibile caricare il file JSON. Il formato potrebbe essere non valido.");
    }
}

// Colleghiamo i pulsanti della UI
document.getElementById('saveWidget').addEventListener('click', saveState);

document.getElementById('openWidget').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        loadState(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = ''; // Resetta l'input per permettere di ricaricare lo stesso file in futuro
});

createGrid(width, height);
