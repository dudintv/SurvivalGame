import MatterEntity from './MatterEntity.js'

export default class Enemy extends MatterEntity {
  static preload(scene) {
    scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
    scene.load.animation('enemies_anim', 'assets/images/enemies_anim.json');

    scene.load.audio('bear', 'assets/sounds/bear.mp3');
    scene.load.audio('bear-died', 'assets/sounds/bear-died.mp3');
    scene.load.audio('ent', 'assets/sounds/ent.mp3');
    scene.load.audio('ent-died', 'assets/sounds/ent-died.mp3');
    scene.load.audio('wolf', 'assets/sounds/wolf.mp3');
    scene.load.audio('wolf-died', 'assets/sounds/wolf-died.mp3');
  }

  constructor(data) {
    const { scene, enemy } = data;
    const drops = JSON.parse(enemy.properties.find(p=>p.name==='drops').value);
    const health = enemy.properties.find(p=>p.name==='health').value;
    super({ scene, x: enemy.x, y: enemy.y, texture: 'enemies', frame: `${enemy.type}_idle_1`, drops, health, name: enemy.type });

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const enemyCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'enemyCollider' });
    const enemySensor = Bodies.circle(this.x, this.y, 70, { isSensor: true, label: 'enemySensor' });
    const compoundBody = Body.create({
      parts: [enemyCollider, enemySensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    this.scene.matterCollision.addOnCollideStart({
      context: this.scene,
      objectA: enemySensor,
      callback: eventData => {
        if(eventData.gameObjectB?.name === 'player') {
          this.attacking = eventData.gameObjectB
        }
      }
    });
  }

  attack(target) {
    if(target.isDead || this.isDead){
      window.clearInterval(this,this.attackTimer);
      return;
    }

    target.hit();
  }

  onDead() {
    window.clearInterval(this.attackTimer);
  }

  update() {
    if(this.isDead) return;

    if(this.attacking) {
      const direction = this.attacking.position.subtract(this.position);
      if(direction.length() > 24) {
        const normDir = direction.normalize();
        this.setVelocityX(direction.x);
        this.setVelocityY(direction.y);
        if(this.attackTimer) {
          window.clearInterval(this.attackTimer);
          this.attackTimer = null;
        }
      } else {
        if(this.attackTimer == null) {
          this.attack(this.attacking);
          this.attackTimer = window.setInterval(this.attack, 800, this.attacking);
        }
      }
    }

    this.setFlipX(this.velocity.x < 0);

    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play(`${this.name}_walk`, true);
    } else {
      this.anims.play(`${this.name}_idle`, true);
    }
  }
}
