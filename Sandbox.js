
/**
 * sandbox.js - The Mathematical Engine for MuniLorenzViz
 * This module handles the "Free Mathematica" logic: 
 * Symbolic-style iteration, Torsion calculation, and Color Mapping.
 */

export const generateLorenzPath = (a, b, c, iterations, twistMode) => {
    let x = 0.1, y = 0.1, z = 0.1;
    const points = [];
    const colors = [];
    
    // Twist Mode Colors (Wong CVD-safe palette)
    // Gold: 0xE69F00 | Ocean Blue: 0x0072B2
    const colorGold = { r: 0.902, g: 0.624, b: 0.0 }; 
    const colorOcean = { r: 0.0, g: 0.447, b: 0.698 };
    
    // Default Aesthetic Gradient (Indigo to Cyan)
    const colorStart = { r: 0.388, g: 0.4, b: 0.945 }; 
    const colorEnd = { r: 0.133, g: 0.827, b: 0.933 };

    const burnIn = 1000; 
    const epsilon = 0.005; // The "Muni" Noise Gate for stability

    for (let i = 0; i < iterations + burnIn; i++) {
        // The core Muni 3D Sinusoidal Mapping
        let nextX = y;
        let nextY = Math.sin(z);
        let nextZ = a + (b * x) + (c * y) - Math.sin(z * z);

        x = nextX; y = nextY; z = nextZ;

        if (i >= burnIn) {
            // Store raw coordinates (script.js will scale these by 25)
            const p = { x: x, y: y, z: z };
            points.push(p);

            const idx = points.length - 1;

            if (twistMode && points.length > 3) {
                // Discrete Torsion Logic: (v1 x v2) . v3
                const v1 = { x: points[idx].x - points[idx-1].x, y: points[idx].y - points[idx-1].y, z: points[idx].z - points[idx-1].z };
                const v2 = { x: points[idx-1].x - points[idx-2].x, y: points[idx-1].y - points[idx-2].y, z: points[idx-1].z - points[idx-2].z };
                const v3 = { x: points[idx-2].x - points[idx-3].x, y: points[idx-2].y - points[idx-3].y, z: points[idx-2].z - points[idx-3].z };
                
                // Cross product (v1 x v2)
                const cp = {
                    x: v1.y * v2.z - v1.z * v2.y,
                    y: v1.z * v2.x - v1.x * v2.z,
                    z: v1.x * v2.y - v1.y * v2.x
                };

                // Dot product (cp . v3)
                let torsion = cp.x * v3.x + cp.y * v3.y + cp.z * v3.z;

                // Apply the Muni Noise Gate
                if (Math.abs(torsion) < epsilon) torsion = 0;

                // Tanh scaling for smooth "Spring" transitions
                const twistFactor = Math.tanh(torsion * 15); 
                
                // Manual Lerp for colors to avoid Three.js dependency in Sandbox
                const t = (twistFactor + 1) / 2;
                colors.push(
                    colorOcean.r + t * (colorGold.r - colorOcean.r),
                    colorOcean.g + t * (colorGold.g - colorOcean.g),
                    colorOcean.b + t * (colorGold.b - colorOcean.b)
                );
            } else {
                // Standard Linear Lerp for Default Gradient
                const t = (i - burnIn) / iterations;
                colors.push(
                    colorStart.r + t * (colorEnd.r - colorStart.r),
                    colorStart.g + t * (colorEnd.g - colorStart.g),
                    colorStart.b + t * (colorEnd.b - colorStart.b)
                );
            }
        }
    }
    return { points, colors };
};
