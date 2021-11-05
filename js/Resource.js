import MatterEntity from "./MatterEntity.js";

export default class Resource extends MatterEntity {
  static preload(scene){
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');

    scene.load.audio('bush', 'assets/sounds/bush.mp3');

    scene.load.audio('tree1', 'assets/sounds/tree1.mp3');
    scene.load.audio('tree2', 'assets/sounds/tree2.mp3');
    scene.load.audio('tree3', 'assets/sounds/tree3.mp3');
    scene.load.audio('tree-fall', 'assets/sounds/tree-fall.mp3');

    scene.load.audio('rock1', 'assets/sounds/rock1.mp3');
    scene.load.audio('rock2', 'assets/sounds/rock2.mp3');
    scene.load.audio('rock3', 'assets/sounds/rock3.mp3');
    scene.load.audio('rock4', 'assets/sounds/rock4.mp3');
    scene.load.audio('rock5', 'assets/sounds/rock5.mp3');
    scene.load.audio('rock-break', 'assets/sounds/rock-break.mp3');

    scene.load.audio('pickup', 'assets/sounds/pickup.mp3');
  }

  constructor(data){
    const { scene, resource } = data;
    const drops = JSON.parse(resource.properties.find(p=>p.name==='drops').value);
    const depth = resource.properties.find(p=>p.name==='depth').value;
    super({scene, x: resource.x, y: resource.y, texture: 'resources', frame: resource.type, name: resource.type, drops, depth, health: 5});

    const { Bodies } = Phaser.Physics.Matter.Matter;
    const yOrigin = resource.properties.find(p => p.name === 'yOrigin').value;

    this.y += this.height*(yOrigin - 0.5);
    const circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });
    this.setExistingBody(circleCollider);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);
  }
}
