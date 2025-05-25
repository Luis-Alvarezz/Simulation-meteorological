import {
    AdditiveBlending,
    BufferGeometry,
    Float32BufferAttribute,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    // OrthographicCamera, // No se usa directamente aquí, pero es conceptualmente importante para el overlay
    PlaneGeometry,
    Points,
    PointsMaterial,
    Texture,
    TextureLoader,
    Vector3,
    Scene, // Importar Scene y OrthographicCamera para el ejemplo de SceneManager
    OrthographicCamera
} from 'three';

import Meteorological from '../types/Meteorological'; // Asegúrate que este path sea correcto
import SceneManager from '../scene.manager';     // Asegúrate que este path sea correcto

export default class Storm extends Meteorological {
    // --- Lluvia ---
    static particleCount = 15000; // Conteo de partículas de lluvia
    static rain: Points;
    static rainSpeeds: Float32Array;
    private rainTexture: Texture; // Textura para las gotas de lluvia

    // --- Relámpagos ---
    static lightningLines: LineSegments;    // Líneas principales del relámpago
    static lightningGlowLines: LineSegments; // Líneas para el efecto de resplandor del relámpago
    static lightningTimer = 0;              // Temporizador para el próximo relámpago
    static lightningIntervalMin = 700;      // Intervalo mínimo entre relámpagos (ms)
    static lightningIntervalMax = 2500;     // Intervalo máximo entre relámpagos (ms)
    static currentLightningInterval = Storm.lightningIntervalMin + Math.random() * (Storm.lightningIntervalMax - Storm.lightningIntervalMin); // Intervalo actual

    // --- Flash Overlay (Destello en Pantalla) ---
    static flashOverlay: Mesh;               // El plano que se usará para el destello blanco
    static isFlashing = false;              // Estado: ¿Está ocurriendo un destello?
    static flashProgress = 0;               // Progreso de la animación del destello
    static flashAppearDuration = 40;        // Duración de la aparición del destello (ms)
    static flashHoldDuration = 50;          // Duración del destello en su máxima intensidad (ms)
    static flashFadeDuration = 180;         // Duración del desvanecimiento del destello (ms)

    constructor() {
        super();
    }

    public async init(): Promise<void> {
        try {
            this.rainTexture = await this.loadTexture('/textures/rain-preview.png'); // Cargar textura de lluvia
        } catch (error) {
            console.error("Storm init: Failed to load rain texture, proceeding without it or with fallback.");
        }
        await this.createRain();        // Crear efecto de lluvia
        this.createLightning();     // Crear efecto de relámpagos
        this.createFlashOverlay();  // Crear el plano para el destello en pantalla
    }

    private async loadTexture(path: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            new TextureLoader().load(
                path,
                texture => resolve(texture),
                undefined, // onProgress
                err => {
                    console.error(`Failed to load texture at ${path}:`, err);
                    reject(err);
                }
            );
        });
    }

    private async createRain(): Promise<void> {
        const geometry = new BufferGeometry();
        const positions = new Float32Array(Storm.particleCount * 3);
        Storm.rainSpeeds = new Float32Array(Storm.particleCount);

        for (let i = 0; i < Storm.particleCount; i++) {
            positions[i * 3] = Math.random() * 400 - 200;
            positions[i * 3 + 1] = Math.random() * 250 + 50;
            positions[i * 3 + 2] = Math.random() * 400 - 200;
            Storm.rainSpeeds[i] = 3.0 + Math.random() * 3.5; // Velocidades individuales para cada gota
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

        const materialConfig: any = {
            size: 2.5, // Tamaño base de las gotas
            transparent: true,
            opacity: 0.65,
            depthWrite: false,
            blending: AdditiveBlending, // Mezcla aditiva para un efecto más brillante
        };

        if (this.rainTexture) {
            materialConfig.map = this.rainTexture;
            materialConfig.color = 0xffffff; // No teñir la textura si existe
        } else {
            materialConfig.color = 0xaaaaaa; // Color base si no hay textura
            materialConfig.size = 1.5;       // Gotas más pequeñas si no hay textura
        }

        const material = new PointsMaterial(materialConfig);
        Storm.rain = new Points(geometry, material);
        Storm.rain.frustumCulled = false; // Evitar que se recorte si está parcialmente fuera de la vista
        SceneManager.scene.add(Storm.rain);
    }

    private createLightning(): void {
        const geometry = this._generateLightningGeometry();

        const coreMaterial = new LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1.0, // Núcleo del relámpago bien definido
            blending: AdditiveBlending,
            depthWrite: false,
        });
        Storm.lightningLines = new LineSegments(geometry, coreMaterial);
        Storm.lightningLines.frustumCulled = false;
        Storm.lightningLines.visible = false;
        SceneManager.scene.add(Storm.lightningLines);

        const glowMaterial = new LineBasicMaterial({
            color: 0xddeeff, // Tinte azulado para el resplandor
            transparent: true,
            opacity: 0.25,   // Resplandor sutil
            blending: AdditiveBlending,
            depthWrite: false,
        });
        Storm.lightningGlowLines = new LineSegments(geometry.clone(), glowMaterial); // Usar geometría clonada para el resplandor
        Storm.lightningGlowLines.frustumCulled = false;
        Storm.lightningGlowLines.visible = false;
        SceneManager.scene.add(Storm.lightningGlowLines);
    }

    private _generateLightningGeometry(): BufferGeometry {
        const vertices: number[] = [];
        const numMainBranches = 4 + Math.floor(Math.random() * 4);

        for (let i = 0; i < numMainBranches; i++) {
            let currentPoint = new Vector3(
                Math.random() * 250 - 125,
                130 + Math.random() * 70,
                Math.random() * 250 - 125
            );
            const numSegments = 6 + Math.floor(Math.random() * 6);
            for (let j = 0; j < numSegments; j++) {
                const previousPoint = currentPoint.clone();
                const yDrop = 18 + Math.random() * 22;
                currentPoint.y -= yDrop;
                currentPoint.x += (Math.random() - 0.5) * yDrop * (0.6 + Math.random() * 0.4);
                currentPoint.z += (Math.random() - 0.5) * yDrop * (0.6 + Math.random() * 0.4);
                vertices.push(previousPoint.x, previousPoint.y, previousPoint.z);
                vertices.push(currentPoint.x, currentPoint.y, currentPoint.z);
                if (Math.random() < 0.15 && j < numSegments - 1) {
                    // Lógica de bifurcaciones (como en el código anterior)
                    const forkStartPoint = currentPoint.clone();
                    let forkCurrentPoint = forkStartPoint.clone();
                    const numForkSegments = 2 + Math.floor(Math.random() * 3);
                    for(let k=0; k < numForkSegments; k++) {
                        const prevForkPoint = forkCurrentPoint.clone();
                        const forkYDrop = 10 + Math.random() * 15;
                        forkCurrentPoint.y -= forkYDrop;
                        forkCurrentPoint.x += (Math.random() - 0.5) * forkYDrop * 0.7;
                        forkCurrentPoint.z += (Math.random() - 0.5) * forkYDrop * 0.7;
                        vertices.push(prevForkPoint.x, prevForkPoint.y, prevForkPoint.z);
                        vertices.push(forkCurrentPoint.x, forkCurrentPoint.y, forkCurrentPoint.z);
                        if(forkCurrentPoint.y < -20) break;
                    }
                }
                if (currentPoint.y < -30) break;
            }
        }
        const geometry = new BufferGeometry();
        if (vertices.length > 0) {
            geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        }
        return geometry;
    }

    private createFlashOverlay(): void {
        // Un plano de 2x2 unidades es el estándar para un overlay de pantalla completa
        // cuando se usa con una cámara ortográfica configurada de -1 a 1 en X e Y.
        const geometry = new PlaneGeometry(2, 2);
        const material = new MeshBasicMaterial({
            color: 0xffffff,     // Color blanco para el destello
            transparent: true,
            opacity: 0,          // Inicia invisible
            depthTest: false,    // No necesita interactuar con la profundidad de la escena 3D
            depthWrite: false,   // No escribe en el buffer de profundidad
        });
        Storm.flashOverlay = new Mesh(geometry, material);
        Storm.flashOverlay.renderOrder = 999; // Asegurar que se renderice encima de casi todo

        // Intentar añadir a una escena de overlay dedicada si existe en SceneManager
        if (SceneManager.hasOwnProperty('overlayScene') && (SceneManager as any).overlayScene instanceof Scene) {
             (SceneManager as any).overlayScene.add(Storm.flashOverlay);
        } else {
            console.warn(
                "Storm Warning: SceneManager.overlayScene no está definido o no es una instancia de THREE.Scene. " +
                "Añadiendo flashOverlay a SceneManager.scene. " +
                "El efecto de flash de pantalla completa probablemente NO funcionará correctamente. " +
                "Se recomienda implementar una overlayScene con cámara ortográfica en SceneManager."
            );
            SceneManager.scene.add(Storm.flashOverlay); // Fallback a la escena principal (generalmente no ideal para este efecto)
        }
    }

    public update(delta: number): void {
        this._updateRain(delta);
        this._updateLightning(delta);
        this._updateFlash(delta); // Actualizar la animación del destello
    }

    private _updateRain(delta: number): void {
        if (!Storm.rain) return;
        const positions = Storm.rain.geometry.attributes.position.array as Float32Array;
        const fallSpeedMultiplier = delta * 100; // Multiplicador para la velocidad de caída

        for (let i = 0; i < Storm.particleCount; i++) {
            positions[i * 3 + 1] -= Storm.rainSpeeds[i] * fallSpeedMultiplier; // Mover partícula hacia abajo
            if (positions[i * 3 + 1] < -50) { // Si la partícula cae por debajo del límite
                positions[i * 3 + 1] = 200 + Math.random() * 50; // Reposicionar arriba
                positions[i * 3] = Math.random() * 400 - 200;     // Nueva posición X aleatoria
                positions[i * 3 + 2] = Math.random() * 400 - 200;   // Nueva posición Z aleatoria
            }
        }
        (Storm.rain.geometry.attributes.position as Float32BufferAttribute).needsUpdate = true;
    }

    private _updateLightning(delta: number): void {
        Storm.lightningTimer += delta * 1000; // Incrementar temporizador

        if (Storm.lightningTimer > Storm.currentLightningInterval) { // Si es tiempo para un nuevo relámpago
            const newGeometry = this._generateLightningGeometry(); // Generar nueva forma para el relámpago
            
            if (Storm.lightningLines.geometry) Storm.lightningLines.geometry.dispose();
            Storm.lightningLines.geometry = newGeometry;
            Storm.lightningLines.visible = true;

            if (Storm.lightningGlowLines) {
                if (Storm.lightningGlowLines.geometry) Storm.lightningGlowLines.geometry.dispose();
                Storm.lightningGlowLines.geometry = newGeometry.clone(); // Usar geometría clonada para el resplandor
                Storm.lightningGlowLines.visible = true;
            }
            
            // Activar el destello en pantalla
            Storm.isFlashing = true;
            Storm.flashProgress = 0; // Reiniciar animación del destello
            
            Storm.lightningTimer = 0; // Reiniciar temporizador del relámpago
            // Calcular cuándo será el próximo relámpago
            Storm.currentLightningInterval = Storm.lightningIntervalMin + Math.random() * (Storm.lightningIntervalMax - Storm.lightningIntervalMin);

            // Ocultar las líneas del relámpago después de un breve momento
            setTimeout(() => {
                Storm.lightningLines.visible = false;
                if (Storm.lightningGlowLines) Storm.lightningGlowLines.visible = false;
            }, 180 + Math.random() * 120);
        }
    }

    private _updateFlash(delta: number): void {
        if (!Storm.isFlashing || !Storm.flashOverlay) return; // Si no hay destello activo o no existe el overlay, salir

        const totalFlashCycleDuration = Storm.flashAppearDuration + Storm.flashHoldDuration + Storm.flashFadeDuration;
        Storm.flashProgress += (delta * 1000); // Avanzar el progreso del destello

        let opacity = 0;
        const mat = Storm.flashOverlay.material as MeshBasicMaterial;

        if (Storm.flashProgress <= Storm.flashAppearDuration) { // Fase de aparición
            opacity = Math.min(1, Storm.flashProgress / Storm.flashAppearDuration);
        } else if (Storm.flashProgress <= Storm.flashAppearDuration + Storm.flashHoldDuration) { // Fase de máxima intensidad
            opacity = 1; // EL PLANO ES COMPLETAMENTE BLANCO Y OPACADO AQUÍ
        } else if (Storm.flashProgress <= totalFlashCycleDuration) { // Fase de desvanecimiento
            const fadeProgress = Storm.flashProgress - (Storm.flashAppearDuration + Storm.flashHoldDuration);
            opacity = 1 - Math.min(1, fadeProgress / Storm.flashFadeDuration);
        } else { // Fin del ciclo del destello
            opacity = 0;
            Storm.isFlashing = false; // Marcar que el destello ha terminado
            Storm.flashProgress = 0;  // Reiniciar progreso para la próxima vez
        }
        mat.opacity = opacity; // Aplicar la opacidad calculada
    }

    public dispose(): void {
        // Lluvia
        if (Storm.rain) {
            const parent = Storm.rain.parent;
            if (parent) parent.remove(Storm.rain);
            Storm.rain.geometry.dispose();
            const rainMat = Storm.rain.material as PointsMaterial;
            if (rainMat.map) rainMat.map.dispose();
            rainMat.dispose();
        }
        // Relámpagos
        if (Storm.lightningLines) {
            const parent = Storm.lightningLines.parent;
            if (parent) parent.remove(Storm.lightningLines);
            if (Storm.lightningLines.geometry) Storm.lightningLines.geometry.dispose();
            if (Storm.lightningLines.material) (Storm.lightningLines.material as LineBasicMaterial).dispose();
        }
        if (Storm.lightningGlowLines) {
            const parent = Storm.lightningGlowLines.parent;
            if (parent) parent.remove(Storm.lightningGlowLines);
            if (Storm.lightningGlowLines.geometry) Storm.lightningGlowLines.geometry.dispose();
            if (Storm.lightningGlowLines.material) (Storm.lightningGlowLines.material as LineBasicMaterial).dispose();
        }
        // Flash Overlay
        if (Storm.flashOverlay) {
            const parent = Storm.flashOverlay.parent;
            if (parent) parent.remove(Storm.flashOverlay);
            Storm.flashOverlay.geometry.dispose();
            (Storm.flashOverlay.material as MeshBasicMaterial).dispose();
        }
    }

    public clear(): void { // Método alias para dispose
        this.dispose();
    }
}