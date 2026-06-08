# MuniLorenzViz

### A Numerical Exploration of Chaotic Attractors and Continuous/Discrete Systems

**MuniLorenzViz** is a high-performance WebGL visualizer built to investigate complex dynamical behavior, bifurcations, and chaos across both classic continuous-time systems and discrete mappings. While providing general exploratory tools for foundational strange attractors, this engine serves specifically as a numerical validation and pedagogical companion tool for the discrete-time Lorenz-like attractor research presented by **Sishu Shankar Muni**.

[![GitHub Pages](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat-square&logo=github)](https://numberwonderman.github.io/MuniLorenzViz/)

## 📐 The Mathematics & Filter Engine

The visualizer supports multiple distinct environments, ranging from continuous differential equations to iterative discrete-time mappings, featuring custom computational filters to optimize rendering quality.

### 1. The Muni Sinusoidal Map (Core Research Focus)
This engine simulates a system of nonlinear difference equations. Unlike a continuous Lorenz system defined by differential equations, this **discrete map** reveals a unique "braided" internal structure due to the iterative nature of its state transitions.

The system is defined by:

$$x_{n+1} = y_n$$

$$y_{n+1} = \sin(z_n)$$

$$z_{n+1} = a + (b \cdot x_n) + (c \cdot y_n) - \sin(z_n^2)$$

#### Core Computational Filters
* **Transient Burn-In Filter (`burnIn = 1000`):** To ensure the visualization represents the true, stabilized geometric attractor, the engine automatically calculates and discards the first 1,000 transient iterations before recording points to the GPU buffer.
* **Discrete Torsion Mapping (Twist Mode):** The explorer calculates the discrete torsion $\tau$ at each iteration using the triple scalar product of displacement vectors between four consecutive points ($P_{i-3}$ to $P_i$), approximating how the manifold "lifts" out of its local osculating plane:

$$\tau \approx (\mathbf{v}_1 \times \mathbf{v}_2) \cdot \mathbf{v}_3$$

* **Torsion Noise Gate (`epsilon = 0.005`):** Any calculated torsion smaller than $\epsilon$ is gated to `0`. High-energy torsion values are scaled smoothly via a hyperbolic tangent function ($\tanh(\tau \cdot 15)$) and mapped using a CVD-safe (Color Vision Deficiency) palette:
  - **Gold (#E69F00) — Positive Torsion:** Represents clockwise/upward twisting.
  - **Ocean Blue (#0072B2) — Negative Torsion:** Represents counter-clockwise/downward twisting.

### 2. Lorenz Butterfly
The quintessential continuous-time chaotic attractor modeling atmospheric convection, defined by the vector field:

$$\frac{dx}{dt} = \sigma(y - x)$$

$$\frac{dy}{dt} = x(\rho - z) - y$$

$$\frac{dz}{dt} = xy - \beta z$$

### 3. Hadley Attractor
A low-order continuous model representing the long-term, large-scale behavior of the atmospheric Hadley circulation subject to heating and frictional dissipation:

$$\frac{dx}{dt} = -y^2 - z^2 - ax + aF$$

$$\frac{dy}{dt} = xy - bxz - y + G$$

$$\frac{dz}{dt} = bxy + xz - z$$

### 4. Rössler Attractor
A simpler, single-nonlinear continuous chaotic system designed to isolate the core topological properties of chaos (stretching and folding) in an analytically tractable form:

$$\frac{dx}{dt} = -y - z$$

$$\frac{dy}{dt} = x + ay$$

$$\frac{dz}{dt} = b + z(x - c)$$

### 5. Customization Settings
A flexible manual environment where users can freely manipulate variables, system coefficients, and boundary states to test arbitrary or hybrid dynamical behaviors.

---

### Key Topological Features (Muni Map)
* **The "Twisted" Manifold:** The $\sin(z^2)$ term acts as a nonlinear folding mechanism. As $z$ increases, the frequency of the fold increases quadratically, creating a non-orientable, Möbius-like geometry.
* **Period-Doubling Bifurcations:** By varying parameter $a$, the system transitions from simple limit cycles to complex strange attractors.
* **Hyperchaos:** In high-energy states (e.g., $b=3.9$), the attractor exhibits multiple positive Lyapunov exponents, causing the trajectory to saturate a 3D volume (the "Hyperchaotic Cube").

## 🚀 Research Replication

This tool successfully replicates key findings from historical literature and the Muni (2025) paper. Use these configurations to observe the evolution of the attractor:

### Muni Sinusoidal Map Presets
| State | Parameter $a$ | Parameter $b$ | Parameter $c$ | Fig Ref |
| --- | --- | --- | --- | --- |
| **Stable Limit Cycle** | 0.0 | 0.8 | 0.99 | Fig 10(a) |
| **The Twisted Ribbon** | 0.015 | 0.8 | 0.99 | Fig 10(h) |
| **Hyperchaotic Cube** | 0.3 | 3.9 | 0.99 | Fig 6(a) |

### Continuous System Presets (Standard Baselines)
* **Lorenz:** $\sigma = 10.0$, $\rho = 28.0$, $\beta = 2.667$ (Classic chaotic butterfly)
* **Rössler:** $a = 0.2$, $b = 0.2$, $c = 5.7$ (Standard strange attractor)

For best results when generating figures for the discrete map, use **50,000–100,000 iterations** to reveal finer manifold structure. 20,000 iterations is sufficient for initial exploration.

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
This encodes: parameter values, iteration count, visualization mode (lines/points/twist), resolution multiplier, and background color.

## 🛠️ Technical Stack

* **Core:** JavaScript (ES6+)
* **Numerical Solvers (Continuous Systems):** Supports selectable integration pathways for continuous differential presets, allowing users to contrast baseline computational models:
    * **Euler Method:** A first-order numerical procedure for rapid, iterative step approximations.
    * **Runge-Kutta 4th Order (RK4):** A higher-order, mathematically rigorous temporal integration method that drastically reduces truncation error propagation across extensive iteration counts.
* **Rendering:** [Three.js](https://threejs.org/) (WebGL, r128)
* **Geometry:** `THREE.BufferGeometry` with `Float32BufferAttribute` for efficient GPU-side rendering of 100,000+ iterations at 60 FPS.
* **Export:** Off-screen `THREE.WebGLRenderer` with `preserveDrawingBuffer: true`, rendering at user-selected pixel multiplier independently of the display renderer.
* **UI:** Tailwind CSS for a responsive, research-oriented interface.
* **Accessible Design:** CVD-safe Wong (2011) color palette ensuring the torsion visualization is legible across all forms of color vision.

## 📚 References & Citation

This software is a numerical implementation of the models and figures presented in:

**Muni, S. S.** (2025). *Complexity and Chaos in the 3D Sinusoidal Map: A Discrete Lorenz-like Attractor.* [arXiv:2506.10788](https://arxiv.org/pdf/2506.10788).

**Hadley, G.** (1735). Concerning the cause of the general trade-winds. *Philosophical Transactions of the Royal Society*.

**Lorenz, E. N.** (1963). Deterministic nonperiodic flow. *Journal of the Atmospheric Sciences*, 20(2), 130-141.

**Rössler, O. E.** (1976). An equation for continuous chaos. *Physics Letters A*, 57(5), 397-398.

**Wong, B.** (2011). Points of view: Color blindness. *Nature Methods*, 8(6), 441.

> **Note:** This project was developed by Franklin Loeb (B.S. Mathematics, Arcadia University) as an interactive medium for studying topological "twistedness" in discrete-time and continuous dynamical systems, in collaboration with Dr. Sishu Shankar Muni.

---

### How to Run

1. Clone the repository: `git clone https://github.com/numberwonderman/MuniLorenzViz.git`
2. Open `index.html` in any modern web browser.
3. Use the control panel to select your desired model preset, input research parameters, and click **Generate Attractor**.
4. Interact with the 3D phase space using the mouse to rotate, zoom, and pan.
5. Use the **Export Image** button to save publication-ready figures.

### Output Filenames

Exported files are automatically named to encode all relevant parameters, making figure tracking in Overleaf straightforward. Example:
Exported files are automatically named to encode all relevant parameters, making figure tracking in LaTeX or Overleaf straightforward. 

**Filename Format Structure:**
`[Model]_[Parameters]_[Iterations]_[ColorMode]_[Resolution]_[BgColor].png`

**Example Output Filename:**
`muni-map_a0.015_b0.8_c0.99_100k_twist_4x_white.png`
