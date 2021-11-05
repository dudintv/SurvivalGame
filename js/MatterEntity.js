import DropItem from "./DropItem.js";

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    const {name, scene, x, y, health, drops, texture, frame, depth} = data;
    super(scene.matter.world, x, y, texture, frame);
    this.x += this.width/2;
    this.y -= this.height/2;
    this._position = new Phaser.Math.Vector2(this.x, this.y);
    this.depth = depth || 1;

    this.name = name;
    this.health = health;
    this.drops = drops;

    if (this.name) this.setupSounds();

    this.scene.add.existing(this);
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
    if (this.name === 'bear') {
      this.sounds.push(this.scene.sound.add('bear'));
      this.destroySound = this.scene.sound.add('bear-died');
    }
    if (this.name === 'ent') {
      this.sounds.push(this.scene.sound.add('ent'));
      this.destroySound = this.scene.sound.add('ent-died');
    }
    if (this.name === 'wolf') {
      this.sounds.push(this.scene.sound.add('wolf'));
      this.destroySound = this.scene.sound.add('wolf-died');
    }
    if (this.name === 'player') {
      this.sounds.push(this.scene.sound.add('player'));
      this.destroySound = this.scene.sound.add('player');
    }
  }

  get position() {
    this._position.set(this.x, this.y);
    return this._position;
  }

  get velocity() {
    return this.body.velocity;
  }

  get isDead() {
    return this.health <= 0;
  }

  onDead() {

  }

  hit() {
    this.health--;
    if (this.sounds.length > 0 && this.destroySound) {
      if (this.isDead) {
        this.destroySound.play();
        this.drop();
        this.onDead();
      } else {
        this.sounds[this.currentSoundIndex++].play();
        if (this.currentSoundIndex >= this.sounds.length) this.currentSoundIndex = 0;
      }
    }
    // console.log(`Hitting: ${this.name} Health: ${this.health}`)
  }

  drop() {
    this.drops.forEach(drop => new DropItem({scene: this.scene, x: this.x, y: this.y, frame: drop}));
  }
}
