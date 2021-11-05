import Player from "./Player.js";
import Resource from "./Resource.js";
import Enemy from "./Enemy.js";

export default class MainScene extends Phaser.Scene{
  constructor(){
    super("MainScene");
    this.enemies = [];
  }

  preload(){
    console.log('PRELOAD');
    Player.preload(this);
    Enemy.preload(this);
    Resource.preload(this);
    this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map.json');
  }

  create(){
    console.log('CREATE');
    const map = this.make.tilemap({key: 'map'});
    this.map = map;
    const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);

    layer1.setCollisionByProperty({collides: true});
    this.matter.world.convertTilemapLayer(layer1);

    this.addResources();

    this.player = new Player({scene: this, x: 260, y: 250, texture: 'male', frame:'townsfolk_m_idle_1'});
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    const camera = this.cameras.main;
    camera.zoom = 2;
    camera.startFollow(this.player);
    camera.setLerp(0.1, 0.1);
    camera.setBounds(0, 0, this.game.config.width, this.game.config.height);
  }

  addResources(){
    const resourcesLayer = this.map.getObjectLayer('Resources');
    resourcesLayer.objects.forEach(resource => {
      const item = new Resource({ scene: this, resource });
    });

    const enemiesLayer = this.map.getObjectLayer('Enemies');
    enemiesLayer.objects.forEach(enemy => {
      const newEnemy = new Enemy({ scene: this, enemy });
      this.enemies.push(newEnemy);
    });
  }

  update(){
    this.enemies.forEach(enemy => enemy.update());
    this.player.update();
  }
}
