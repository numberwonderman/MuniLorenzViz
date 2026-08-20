let scene, camera, renderer, controls, attractorObject;
let lineState = true;
let twistMode = false;

// --- Math Engine (Updated for Initial Conditions & Transient Burn-In) ---
const generateLorenzPath = (a, b, c, iterations, x0, y0, z0) => {
    // Set system entry point to the user's initial boundary conditions
    let x = x0, y = y0, z = z0;
    
    const points = [];
    const colors = [];
    
    // Aesthetic Gradient Colors
    const colorStart = new THREE.Color(0x6366f1);
    const colorEnd = new THREE.Color(0x22d3ee);
    
    // Twist Mode Colors (Wong CVD-safe palette)
    const twistColorPos = new THREE.Color(0xE69F00); // Gold
    const twistColorNeg = new THREE.Color(0x0072B2); // Ocean Blue

    const burnIn = 1000; // Throw away the first 1000 iterations to settle onto the attractor
    const epsilon = 0.005; // Noise gate: ignore torsion smaller than this

    for (let i = 0; i < iterations + burnIn; i++) {
        let nextX = y;
        let nextY = Math.sin(z);
        let nextZ = a + (b * x) + (c * y) - Math.sin(z * z);

        x = nextX; y = nextY; z = nextZ;

        // Only record and color points after the burn-in period has passed
        if (i >= burnIn) {
            const p = new THREE.Vector3(x * 25, y * 25, z * 25);
            points.push(p);

            const idx = points.length - 1;

            if (twistMode && points.length > 3) {
                // Discrete Torsion calculation using the triple scalar product
                const v1 = new THREE.Vector3().subVectors(points[idx], points[idx - 1]);
                const v2 = new THREE.Vector3().subVectors(points[idx - 1], points[idx - 2]);
                const v3 = new THREE.Vector3().subVectors(points[idx - 2], points[idx - 3]);
                
                let torsion = new THREE.Vector3().crossVectors(v1, v2).dot(v3);

                // Noise Gate: Clean up the "Stable" ring tension
                if (Math.abs(torsion) < epsilon) torsion = 0;

                const twistFactor = Math.tanh(torsion * 15); 
                const vColor = new THREE.Color().copy(twistColorNeg).lerp(twistColorPos, (twistFactor + 1) / 2);
                colors.push(vColor.r, vColor.g, vColor.b);
            } else {
                // Default aesthetic gradient maps relative to stabilized indexing
                const lerpFactor = (i - burnIn) / iterations;
                const vColor = new THREE.Color().copy(colorStart).lerp(colorEnd, lerpFactor);
                colors.push(vColor.r, vColor.g, vColor.b);
            }
        }
    }
    return { points, colors };
};

function buildAttractorObject(data) {
    const geometry = new THREE.BufferGeometry().setFromPoints(data.points);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.colors, 3));

    const matSettings = { vertexColors: true, transparent: true, opacity: 0.8 };

    if (lineState) {
        return new THREE.Line(geometry, new THREE.LineBasicMaterial(matSettings));
    } else {
        return new THREE.Points(geometry, new THREE.PointsMaterial({ ...matSettings, size: 0.15, opacity: 0.9 }));
    }
}

function initThreeJS() {
    console.log("Initializing Three.js...");
    const canvas = document.getElementById('lorenzCanvas');
    if (!canvas) { console.error("Canvas not found!"); return; }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(30, 30, 30);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    scene.add(new THREE.AxesHelper(5));
}

function renderAttractor() {
    console.log("Generating Attractor...");
    
    // Read System Parameters
    const a = parseFloat(document.getElementById('paramA').value);
    const b = parseFloat(document.getElementById('paramB').value);
    const c = parseFloat(document.getElementById('paramC').value);
    
    // Read Initial Boundary Conditions
    const x0 = parseFloat(document.getElementById('initX').value);
    const y0 = parseFloat(document.getElementById('initY').value);
    const z0 = parseFloat(document.getElementById('initZ').value);
    
    const iters = parseInt(document.getElementById('iterCount').value);

    // Update real-time textual numerical values next to sliders
    if(document.getElementById('valA')) document.getElementById('valA').textContent = a.toFixed(3);
    if(document.getElementById('valB')) document.getElementById('valB').textContent = b.toFixed(2);
    if(document.getElementById('valC')) document.getElementById('valC').textContent = c.toFixed(2);
    if(document.getElementById('valX0')) document.getElementById('valX0').textContent = x0.toFixed(2);
    if(document.getElementById('valY0')) document.getElementById('valY0').textContent = y0.toFixed(2);
    if(document.getElementById('valZ0')) document.getElementById('valZ0').textContent = z0.toFixed(2);
    if(document.getElementById('valIters')) document.getElementById('valIters').textContent = iters.toLocaleString();

    // Clean up memory before calculation loop runs
    if (attractorObject) {
        scene.remove(attractorObject);
        attractorObject.geometry.dispose();
        attractorObject.material.dispose();
    }

    const data = generateLorenzPath(a, b, c, iters, x0, y0, z0);
    attractorObject = buildAttractorObject(data);
    scene.add(attractorObject);
}

// Global programmatic bridge for loading professor presets instantly
window.loadPreset = function(a, b, c, x0, y0, z0) {
    document.getElementById('paramA').value = a;
    document.getElementById('paramB').value = b;
    document.getElementById('paramC').value = c;
    document.getElementById('initX').value = x0;
    document.getElementById('initY').value = y0;
    document.getElementById('initZ').value = z0;
    renderAttractor();
};

window.onload = () => {
    initThreeJS();

    // Dynamically bind every input range slider to re-compute on active drag
    const dynamicInputIDs = ['paramA', 'paramB', 'paramC', 'initX', 'initY', 'initZ', 'iterCount'];
    dynamicInputIDs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            // .oninput executes on every single tick value shift during drag
            inputEl.oninput = renderAttractor;
        }
    });

    const genBtn = document.getElementById('generateBtn');
    if (genBtn) genBtn.onclick = renderAttractor;

    const toggleBtn = document.getElementById('toggleModeBtn');
    if (toggleBtn) {
        toggleBtn.onclick = (e) => {
            lineState = !lineState;
            toggleBtn.classList.toggle('active');
            document.getElementById('toggleLabel').textContent = lineState ? 'Lines' : 'Points';
            if (attractorObject) renderAttractor();
        };
    }

    const twistBtn = document.getElementById('toggleTwistBtn');
    if (twistBtn) {
        twistBtn.onclick = () => {
            twistMode = !twistMode;
            twistBtn.classList.toggle('active');
            if (attractorObject) renderAttractor();
        };
    }

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (attractorObject) {
                scene.remove(attractorObject);
                attractorObject = null;
            }
        };
    }

    function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }
    animate();

    // Trigger an initial automatic drawing calculation run on loading completion
    renderAttractor();
};
