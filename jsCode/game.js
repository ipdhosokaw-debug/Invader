class SimpleGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.player = {
      x: this.canvas.width / 2 - (13 * 4) / 2,
      y: this.canvas.height - 100,
      speed: 5
    };

    this.input = new InputHandler(this.canvas);
    this.run();
  }

  update() {
    const playerWidth = 13 * 4;

    this.player.x = this.input.calculateTargetX(
      this.player.x,
      playerWidth,
      this.canvas.width,
      this.player.speed
    );

    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > this.canvas.width - playerWidth) {
      this.player.x = this.canvas.width - playerWidth;
    }
  }

  drawSprite(sprite, x, y, pixelSize, color) {
    this.ctx.fillStyle = color;
    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        if (sprite[r][c] === 1) {
          this.ctx.fillRect(
            x + c * pixelSize,
            y + r * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }

  render() {
    this.ctx.fillStyle = '#111111';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (typeof spritePlayer !== 'undefined') {
      this.drawSprite(spritePlayer, this.player.x, this.player.y, 4, '#00ff66');
    }
  }

  run() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.run());
  }
}
