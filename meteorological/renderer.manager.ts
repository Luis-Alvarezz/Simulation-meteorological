import { Scene, WebGLRenderer, ACESFilmicToneMapping  } from "three";
import SceneManager from "./scene.manager";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class RendererManager {
    private static renderer : WebGLRenderer;
    public static canvas : HTMLCanvasElement;
    private static controls: OrbitControls


    private constructor() {
        // console.log('Ejecutando Instancia');
        RendererManager.init();
        SceneManager.init(RendererManager.renderer).then(() => { // * Inicia el loop cuando todo este cargado
            RendererManager.controls = new OrbitControls(
                SceneManager.camera,
                RendererManager.renderer.domElement
            );
            RendererManager.configureControls();

            window.addEventListener("resize", RendererManager.resize);
            RendererManager.renderLoop();
        });
    }

    // * Metodo 1. para iniciar el loop de renderizado
    private static init() : void {
        RendererManager.getCanvas();
        RendererManager.createRenderer();
    }

    // * Metodo 2. Crear el loop:
    private static renderLoop() : void {
        requestAnimationFrame(RendererManager.renderLoop);

        RendererManager.controls.update(); // ? Actualizar los controles

        if (SceneManager.scene && SceneManager.camera)
            RendererManager.renderer.render(SceneManager.scene, SceneManager.camera);
    }

    // * Metodo 3. Renderizar el frame:
    private static resize() : void {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        SceneManager.camera.aspect = width / height; // ? Aspecto de la camara
        SceneManager.camera.updateProjectionMatrix(); // ? Actualizar la matriz de proyeccion
        
        RendererManager.renderer.setSize(width, height); // ? Cambiar el tamaño del renderizador
        RendererManager.renderer.setPixelRatio(2); // ? Cambiar la relacion de aspecto del renderizador
    }

    // * Metodo 4. Aplicando singleton de la clase mediante constructor:
    public static startGame() : void {
        if (!RendererManager.renderer) {
            new RendererManager
        }
    }

    private static getCanvas(): void {
        if (!RendererManager.canvas) {
            RendererManager.canvas = document.getElementById("simulation") as HTMLCanvasElement;
        }
    }

    private static createRenderer() : void {
        RendererManager.renderer = new WebGLRenderer({ antialias: true, canvas: RendererManager.canvas });
        RendererManager.renderer.setPixelRatio(window.devicePixelRatio);
        RendererManager.renderer.setSize(window.innerWidth, window.innerHeight);
        RendererManager.renderer.toneMappingExposure = .5; // ? Exposicion
        RendererManager.renderer.toneMapping = ACESFilmicToneMapping
    }

    private static configureControls(): void {
        // * Configuración opcional de los controles
        RendererManager.controls.enableDamping = true; // Suavizado de movimiento
        RendererManager.controls.dampingFactor = 0.13;
        RendererManager.controls.screenSpacePanning = false;
        RendererManager.controls.minDistance = 5;
        RendererManager.controls.maxDistance = 10;
    }

}