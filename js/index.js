import MainScene from "./MainScene.js";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
  backgroundColor: '#333',
  parent: 'survival-game',
  scene: [MainScene],
  scale: 2,
  physics: {
      default: 'matter',
      matter: {
        debug: true,
        gravity: {y:0},

      }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision',
      }
    ]
  }
};

new Phaser.Game(config);