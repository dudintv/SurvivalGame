import Player from "./Player.js";
import Resource from "./Resource.js";

export default class MainScene extends Phaser.Scene{
  constructor(){
    super("MainScene");
  }

  preload(){
    console.log('PRELOAD');
    Player.preload(this);
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

    this.player = new Player({scene: this, x: 220, y: 180, texture: 'male', frame:'townsfolk_m_idle_1'});
    const testPlayer = new Player({scene: this, x: 330, y: 80, texture: 'male', frame:'townsfolk_m_idle_1'});
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  addResources(){
    const resources = this.map.getObjectLayer('Resources');
    resources.objects.forEach(resource => {
      const item = new Resource({ scene: this, resource });
    });
  }

  update(){
    this.player.update();
  }
}
