import * as THREE from 'three';
import { BaseRenderer } from './baseRenderer';
import * as seedrandom from 'seedrandom';
import gsap from 'gsap';

const WIDTH: number = 1920 / 2;
const HEIGHT: number = 1080 / 2;

const COLORS = [0x3E606F, 0xD1DBBD];

const srandom = seedrandom();

let tl;

export default class ThreeRenderer implements BaseRenderer{
    
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    mesh: THREE.Mesh;
    renderer: THREE.Renderer;
    group: THREE.Object3D;
    completeCallback: any;

    constructor(canvas: HTMLCanvasElement, completeCallback: any) {

        this.completeCallback = completeCallback;

        this.camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 0.01, 10 );
        this.camera.position.z = 1;
    
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( COLORS[0] );

        // ADD ITEMS HERE

        let x = -1;
        let y = -.5;
        let z = 0.1;
        this.group = new THREE.Object3D();
        let size = .2;
        for (let i = 0; i < 66; i++) {
            let geometry = new THREE.BoxGeometry( size, size, size );
            let material = new THREE.MeshBasicMaterial({
                color: COLORS[1]
            });
            let mesh = new THREE.Mesh( geometry, material );
            mesh.position.set(x, y, z);
            this.group.add(mesh);

            x += size;
            if (x > 1) {
                y += size;
                x = -1;
            }
        }

        this.scene.add( this.group );
    
        // END ADD ITEMS

        this.renderer = new THREE.WebGLRenderer( { 
            canvas: canvas, 
            antialias: true
        } );
        this.renderer.setSize( WIDTH, HEIGHT );

        this.createTimeline();
    }

    createTimeline() {

        tl = gsap.timeline({
            delay: 0.1,             // delay to capture first frame
            repeat: window.DEBUG ? -1 : 1, // if debug repeat forever
            yoyo: true, 
            paused: window.THUMBNAIL,
            onComplete: () => this.handleComplete()
        });

        tl.timeScale(1);

        // BUILD TIMELINE HERE

        for (let i = 0; i < this.group.children.length; i++) {
            let item = this.group.children[i];
            tl.to(item.position, {z: -1, duration: 1}, i / 20);
        }

        // END TIMELINE

        console.log('DURATION:', tl.duration());
    }

    private handleComplete() {
        if (this.completeCallback) {
            this.completeCallback();
        }
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }
}