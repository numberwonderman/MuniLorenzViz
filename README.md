

# MuniLorenzViz

### A Numerical Exploration of the 3D Sinusoidal Map

**MuniLorenzViz** is a high-performance WebGL visualizer built to investigate the complex dynamical behavior, bifurcations, and hyperchaos of the 3D Sinusoidal Map. This project serves as a numerical validation and pedagogical companion tool for the research presented by **Sishu Shankar Muni** regarding discrete-time Lorenz-like attractors.

## 📐 The Mathematics

This engine simulates a system of nonlinear difference equations. Unlike a continuous Lorenz system defined by differential equations, this **discrete map** reveals a unique "braided" internal structure due to the iterative nature of its state transitions.

The system is defined by:

$$x_{n+1} = y_n$$

$$y_{n+1} = \sin(z_n)$$

$$z_{n+1} = a + (b \cdot x_n) + (c \cdot y_n) - \sin(z_n^2)$$

### Key Topological Features

* **The "Twisted" Manifold:** The $\sin(z^2)$ term acts as a nonlinear folding mechanism. As $z$ increases, the frequency of the fold increases quadratically, creating a non-orientable, Möbius-like geometry.
* **Period-Doubling Bifurcations:** By varying parameter $a$, the system transitions from simple limit cycles to complex strange attractors.
* **Hyperchaos:** In high-energy states (e.g., $b=3.9$), the attractor exhibits multiple positive Lyapunov exponents, causing the trajectory to saturate a 3D volume (the "Hyperchaotic Cube").
* **Discrete Torsion Mapping (Twist Mode):** The explorer calculates the discrete torsion $\tau$ at each iteration. Using the triple scalar product of displacement vectors between four consecutive points ($P_{i-3}$ to $P_i$), we approximate how the manifold "lifts" out of its local osculating plane:

$$\tau \approx (\mathbf{v}_1 \times \mathbf{v}_2) \cdot \mathbf{v}_3$$

This is visualized using a CVD-safe (Color Vision Deficiency) palette:
- **Gold (#E69F00) — Positive Torsion:** Represents clockwise/upward twisting.
- **Ocean Blue (#0072B2) — Negative Torsion:** Represents counter-clockwise/downward twisting.

## 🚀 Research Replication

This tool successfully replicates key findings from the Muni (2025) paper. Use these presets to observe the evolution of the attractor:

| State | Parameter $a$ | Parameter $b$ | Parameter $c$ | Fig Ref |
| --- | --- | --- | --- | --- |
| **Stable Limit Cycle** | 0.0 | 0.8 | 0.99 | Fig 10(a) |
| **The Twisted Ribbon** | 0.015 | 0.8 | 0.99 | Fig 10(h) |
| **Hyperchaotic Cube** | 0.3 | 3.9 | 0.99 | Fig 6(a) |

For best results when generating figures, use **50,000–100,000 iterations** to reveal finer manifold structure. 20,000 iterations is sufficient for initial exploration.

## 🖼️ Exporting Journal-Quality Figures

MuniLorenzViz includes a built-in image export system designed to produce publication-ready figures directly from the current viewport.

### How to Export

1. Generate your attractor and rotate to the desired viewing angle using the mouse.
2. In the **Export** strip below the main controls, configure your options.
3. Click **Export Image** to download a PNG.

### Export Options

| Option | Choices | Notes |
| --- | --- | --- |
| **Resolution** | 2× / 4× / 6× | 4× is recommended for journal figures; 6× for print or poster |
| **Background** | Black / White / Transparent | Check journal style guidelines; transparent PNG works in any context |
| **Hide Axes** | Yes / No | Yes (default) produces a clean figure without coordinate axes |

### Output Filenames

Exported files are automatically named to encode all relevant parameters, making figure tracking in Overleaf straightforward. Example:

```
MuniLorenz_a0.015_b0.79_c0.9_n20000_twist_4x_black.png
```

This encodes: parameter values, iteration count, visualization mode (lines/points/twist), resolution multiplier, and background color.

## 🛠️ Technical Stack

* **Core:** JavaScript (ES6+)
* **Rendering:** [Three.js](https://threejs.org/) (WebGL, r128)
* **Geometry:** `THREE.BufferGeometry` with `Float32BufferAttribute` for efficient GPU-side rendering of 100,000+ iterations at 60 FPS.
* **Export:** Off-screen `THREE.WebGLRenderer` with `preserveDrawingBuffer: true`, rendering at user-selected pixel multiplier independently of the display renderer.
* **UI:** Tailwind CSS for a responsive, research-oriented interface.
* **Accessible Design:** CVD-safe Wong (2011) color palette ensuring the torsion visualization is legible across all forms of color vision.

## 📚 References & Citation

This software is a numerical implementation of the models and figures presented in:

**Muni, S. S.** (2025). *Complexity and Chaos in the 3D Sinusoidal Map: A Discrete Lorenz-like Attractor.* [arXiv:2506.10788](https://arxiv.org/pdf/2506.10788).

**Wong, B.** (2011). Points of view: Color blindness. *Nature Methods*, 8(6), 441.

> **Note:** This project was developed by Franklin Loeb (B.S. Mathematics, Arcadia University) as an interactive medium for studying topological "twistedness" in discrete-time dynamical systems, in collaboration with Dr. Sishu Shankar Muni.

---

### How to Run

1. Clone the repository: `git clone https://github.com/numberwonderman/MuniLorenzViz.git`
2. Open `index.html` in any modern web browser.
3. Use the control panel to input research parameters and click **Generate Attractor**.
4. Interact with the 3D phase space using the mouse to rotate, zoom, and pan.
5. Use the **Export Image** button to save publication-ready figures.
