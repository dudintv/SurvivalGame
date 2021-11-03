export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    const {scene, x, y, texture, frame} = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);

    // weapon
    this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 50, 50, 'items', 162);
    this.spriteWeapon.setOrigin(0.25, 0.75);
    this.spriteWeapon.setScale(0.8);
    this.scene.add.existing(this.spriteWeapon);

    const {Body, Bodies} = Phaser.Physics.Matter.Matter;
    const playerCollider = Bodies.circle(this.x, this.y, 12, {isSensor: false, label: 'playerCollider'});
    const playerSensor = Bodies.circle(this.x, this.y, 24, {isSensor: true, label: 'playerSensor'});
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x));
  }

  static preload(scene){
    scene.load.atlas('male', 'assets/images/male.png', 'assets/images/male_atlas.json');
    scene.load.animation('male_anim', 'assets/images/male_anim.json');
    scene.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
  }

  get velocity(){
    return this.body.velocity;
  }

  update(){

    const speed = 2.5;
    let playerVelocity = new Phaser.Math.Vector2();
    if(this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
    }
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }
    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);

    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play('male_walk', true);
    } else {
      this.anims.play('male_idle', true);
    }

    // weapon
    this.spriteWeapon.setPosition(this.x, this.y);
    this.weaponRotate();
  }

  weaponRotate(){
    const pointer = this.scene.input.activePointer;
    if (pointer.isDown) {
      this.weaponRotation += 6;
    } else {
      this.weaponRotation = 0;
    }
    if (this.weaponRotation > 100) {
      this.weaponRotation = 0;
    }

    if (this.flipX) {
      this.spriteWeapon.setAngle(-this.weaponRotation - 90);
    } else {
      this.spriteWeapon.setAngle(this.weaponRotation);
    }

  }
}