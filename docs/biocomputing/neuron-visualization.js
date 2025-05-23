// Configuration
const numNeurons = 12;
const neurons = [];
const connections = [];
let neuronField;
let activateBtn;
let resetBtn;

// Initialize function to be called once the document is loaded
function initNeuronVisualization() {
    neuronField = document.getElementById('neuronField');
    activateBtn = document.getElementById('activateBtn');
    resetBtn = document.getElementById('resetBtn');
    
    if (!neuronField || !activateBtn || !resetBtn) {
        console.error("Neuron visualization elements not found");
        return;
    }
    
    // Event listeners
    activateBtn.addEventListener('click', activateNeurons);
    resetBtn.addEventListener('click', resetSimulation);
    
    // Initialize
    createNeurons();
    
    // Responsive behavior
    window.addEventListener('resize', createNeurons);
}

// Create neurons
function createNeurons() {
    const fieldWidth = neuronField.offsetWidth;
    const fieldHeight = neuronField.offsetHeight;
    
    // Clear previous
    while (neuronField.firstChild) {
        neuronField.removeChild(neuronField.firstChild);
    }
    neurons.length = 0;
    connections.length = 0;
    
    // Input layer neurons (left side)
    for (let i = 0; i < 4; i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron';
        neuron.textContent = 'I' + (i+1);
        const x = fieldWidth * 0.1;
        const y = fieldHeight * (0.2 + i * 0.2);
        neuron.style.left = `${x}px`;
        neuron.style.top = `${y}px`;
        neuron.dataset.id = i;
        neuron.dataset.active = 'false';
        neuron.dataset.layer = 'input';
        neuronField.appendChild(neuron);
        neurons.push({
            element: neuron,
            x: x + 35, // center
            y: y + 35, // center
            connections: []
        });
    }
    
    // Hidden layer neurons (middle)
    for (let i = 0; i < 4; i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron';
        neuron.textContent = 'H' + (i+1);
        const x = fieldWidth * 0.5;
        const y = fieldHeight * (0.2 + i * 0.2);
        neuron.style.left = `${x}px`;
        neuron.style.top = `${y}px`;
        neuron.dataset.id = i + 4;
        neuron.dataset.active = 'false';
        neuron.dataset.layer = 'hidden';
        neuronField.appendChild(neuron);
        neurons.push({
            element: neuron,
            x: x + 35,
            y: y + 35,
            connections: []
        });
    }
    
    // Output layer neurons (right side)
    for (let i = 0; i < 4; i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron';
        neuron.textContent = 'O' + (i+1);
        const x = fieldWidth * 0.9;
        const y = fieldHeight * (0.2 + i * 0.2);
        neuron.style.left = `${x}px`;
        neuron.style.top = `${y}px`;
        neuron.dataset.id = i + 8;
        neuron.dataset.active = 'false';
        neuron.dataset.layer = 'output';
        neuronField.appendChild(neuron);
        neurons.push({
            element: neuron,
            x: x + 35,
            y: y + 35,
            connections: []
        });
    }
    
    // Create connections
    // From input to hidden
    for (let i = 0; i < 4; i++) {
        for (let j = 4; j < 8; j++) {
            createConnection(i, j);
        }
    }
    
    // From hidden to output
    for (let i = 4; i < 8; i++) {
        for (let j = 8; j < 12; j++) {
            createConnection(i, j);
        }
    }
}

function createConnection(fromIdx, toIdx) {
    const from = neurons[fromIdx];
    const to = neurons[toIdx];
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    const dendrite = document.createElement('div');
    dendrite.className = 'dendrite';
    dendrite.style.width = `${distance}px`;
    dendrite.style.left = `${from.x}px`;
    dendrite.style.top = `${from.y - 2}px`; // -2 to center the line
    dendrite.style.transform = `rotate(${angle}deg)`;
    dendrite.dataset.from = fromIdx;
    dendrite.dataset.to = toIdx;
    dendrite.dataset.active = 'false';
    
    neuronField.appendChild(dendrite);
    
    connections.push({
        element: dendrite,
        from: fromIdx,
        to: toIdx
    });
    
    from.connections.push({
        to: toIdx,
        element: dendrite
    });
}

function activateNeurons() {
    // First, activate input neurons with delay
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            setNeuronActive(i, true);
            
            // Activate connections after a short delay
            setTimeout(() => {
                activateConnectionsFrom(i);
            }, 300);
        }, i * 200);
    }
}

function activateConnectionsFrom(neuronIdx) {
    const neuron = neurons[neuronIdx];
    
    neuron.connections.forEach((connection, index) => {
        setTimeout(() => {
            // Activate the connection
            connection.element.style.backgroundColor = '#ff7e79';
            connection.element.dataset.active = 'true';
            
            // After a delay, activate the target neuron
            setTimeout(() => {
                setNeuronActive(connection.to, true);
                
                // If not at output layer, continue propagation
                if (neurons[connection.to].element.dataset.layer !== 'output') {
                    setTimeout(() => {
                        activateConnectionsFrom(connection.to);
                    }, 200);
                }
            }, 300);
        }, index * 100);
    });
}

function setNeuronActive(idx, active) {
    const neuron = neurons[idx].element;
    neuron.style.backgroundColor = active ? '#ff5252' : '#888';
    neuron.dataset.active = active ? 'true' : 'false';
}

function resetSimulation() {
    // Reset all neurons
    neurons.forEach((neuron, idx) => {
        setNeuronActive(idx, false);
    });
    
    // Reset all connections
    connections.forEach(connection => {
        connection.element.style.backgroundColor = '#aaa';
        connection.element.dataset.active = 'false';
    });
}

// Call init function when the document is loaded
document.addEventListener('DOMContentLoaded', initNeuronVisualization);