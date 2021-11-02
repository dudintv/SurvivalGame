export default class Resource extends Phaser.Physics.Matter.Sprite {
  static preload(scene){
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
  }

  constructor(data){
    const {scene, resource} = data;
    super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);
    this.scene.add.existing(this);

    const { Bodies } = Phaser.Physics.Matter.Matter;
    const yOrigin = resource.properties.find(p => p.name === 'yOrigin').value;
    this.x += this.width/2;
    this.y -= this.height/2;
    this.y += this.height*(yOrigin - 0.5);
    const circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });
    this.setExistingBody(circleCollider);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);
  }
}
