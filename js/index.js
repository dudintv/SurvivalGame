import MainScene from "./MainScene.js";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
  backgroundColor: '#666',
  parent: 'survival-game',
  scene: [MainScene],
  scale: 2,
  physics: {
      default: 'matter',
      matter: {
        debug: false,
        gravity: {y:0},
      }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin.default,
        key: 'matterCollision',
        mapping: 'matterCollision',
      }
    ]
  }
};

new Phaser.Game(config);
