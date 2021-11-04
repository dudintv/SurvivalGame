export default class Resource extends Phaser.Physics.Matter.Sprite {
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
  }

  constructor(data){
    const {scene, resource} = data;
    super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);
    this.scene.add.existing(this);

    const { Bodies } = Phaser.Physics.Matter.Matter;
    const yOrigin = resource.properties.find(p => p.name === 'yOrigin').value;
    this.name = resource.type;
    this.health = 5;
    this.x += this.width/2;
    this.y -= this.height/2;
    this.y += this.height*(yOrigin - 0.5);
    const circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });
    this.setExistingBody(circleCollider);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);

    this.setupSounds();
  }

  setupSounds(){
    this.currentSoundIndex = 0;
    this.sounds = []
    if (this.name === 'bush') {
      const bushSound = this.scene.sound.add('bush');
      this.sounds.push(bushSound);
      this.destroySound = bushSound;
    }
    if (this.name === 'tree') {
      this.sounds.push(this.scene.sound.add('tree1'));
      this.sounds.push(this.scene.sound.add('tree2'));
      this.sounds.push(this.scene.sound.add('tree3'));
      this.destroySound = this.scene.sound.add('tree-fall');
    }
    if (this.name === 'rock') {
      this.sounds.push(this.scene.sound.add('rock1'));
      this.sounds.push(this.scene.sound.add('rock2'));
      this.sounds.push(this.scene.sound.add('rock3'));
      this.sounds.push(this.scene.sound.add('rock4'));
      this.destroySound = this.scene.sound.add('rock-break');
    }
  }

  get isDead() {
    return this.health <= 0;
  }

  hit() {
    this.health--;
    if (this.sounds.length > 0 && this.destroySound) {
      if (this.isDead) {
        this.destroySound.play();
      } else {
        this.sounds[this.currentSoundIndex++].play();
        if (this.currentSoundIndex >= this.sounds.length) this.currentSoundIndex = 0;
      }
    }
    console.log(`Hitting: ${this.name} Health: ${this.health}`)
  }
}
