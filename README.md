
---

# Discrete Lorenz Explorer

### A Numerical Exploration of the 3D Sinusoidal Map

The **Discrete Lorenz Explorer** is a high-performance WebGL visualizer built to investigate the complex dynamical behavior, bifurcations, and hyperchaos of the 3D Sinusoidal Map. This project serves as a numerical validation tool for the research presented by **Sishu Muni** regarding discrete-time Lorenz-like attractors.

## 📐 The Mathematics

This engine simulates a system of nonlinear difference equations. Unlike a continuous Lorenz system defined by differential equations, this **discrete map** reveals a unique "braided" internal structure due to the iterative nature of its state transitions.

The system is defined by:

$$x_{n+1} = y_n$$

$$y_{n+1} = \sin(z_n)$$

$$z_{n+1} = a + (b \cdot x_n) + (c \cdot y_n) - \sin(z_n^2)$$

### Key Topological Features:

* **The "Twisted" Manifold:** The $\sin(z^2)$ term acts as a nonlinear folding mechanism. As $z$ increases, the frequency of the "fold" increases quadratically, creating a non-orientable, Möbius-like geometry.
* **Period-Doubling Bifurcations:** By varying parameter $a$, the system transitions from simple limit cycles to complex strange attractors.
* **Hyperchaos:** In high-energy states (e.g., $b=3.9$), the attractor exhibits multiple positive Lyapunov exponents, causing the trajectory to saturate a 3D volume (the "Hyperchaotic Cube").

## 🚀 Research Replication

This tool successfully replicates key findings from the Muni paper. Use these presets to observe the evolution of the attractor:

| State | Parameter $a$ | Parameter $b$ | Parameter $c$ | Fig Ref |
| --- | --- | --- | --- | --- |
| **Stable Limit Cycle** | 0.0 | 0.8 | 0.99 | Fig 10(a) |
| **The Twisted Ribbon** | 0.015 | 0.8 | 0.99 | Fig 10(h) |
| **Hyperchaotic Cube** | 0.3 | 3.9 | 0.99 | Fig 6(a) |

## 🛠️ Technical Stack

* **Core:** JavaScript (ES6+)
* **Rendering:** [Three.js](https://threejs.org/) (WebGL)
* **Geometry:** `THREE.BufferGeometry` with `Float32BufferAttribute` for efficient rendering of $100,000+$ iterations at 60 FPS.
* **UI:** Tailwind CSS for a responsive, research-oriented interface.

## 📚 References & Citation

This software is a numerical implementation of the models and figures presented in:

**Muni, S.** (2025). *Complexity and Chaos in the 3D Sinusoidal Map: A Discrete Lorenz-like Attractor.* [arXiv:2506.10788](https://arxiv.org/pdf/2506.10788).

> **Note:** This project was developed by a B.S. Mathematics graduate (Arcadia University) to provide an accessible, interactive medium for studying topological "twisted-ness" in discrete-time dynamical systems.

---

### How to Run

1. Clone the repository: `git clone https://github.com/numberwonderman/MuniLorenzViz.git`
2. Open `index.html` in any modern web browser.
3. Use the control panel to input research parameters and click **Generate Attractor**.
4. Interact with the 3D phase space using the mouse to rotate, zoom, and pan.
