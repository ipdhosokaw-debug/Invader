class InputHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this.left = false;
    this.right = false;
    this.mouseX = null;
    this.touchActive = false;
    this.touchStartX = 0;
    this.touchCurrentX = 0;
    this.initListeners();
  }

  getTouchX(e) {
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    return touch.clientX - rect.left;
  }

  initListeners() {
    // （イベントリスナーの登録部分はそのまま）
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') this.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') this.right = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') this.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') this.right = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
    });
    this.canvas.addEventListener('mouseleave', () => { this.mouseX = null; });

    this.canvas.addEventListener('touchstart', (e) => {
      this.touchActive = true;
      this.touchStartX = this.getTouchX(e);
      this.touchCurrentX = this.touchStartX;
      e.preventDefault();
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.touchActive) return;
      this.touchCurrentX = this.getTouchX(e);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', () => {
      this.touchActive = false;
    });
  }

  // ★【新規追加】「結局プレイヤーはどこに動きたいのか」を計算して返す関数
  // （main.js に書いていた複雑な if/else をここに引っ越す！）
  calculateTargetX(currentPlayerX, playerWidth, canvasWidth, keyboardSpeed) {
    // 1. マウス操作
    if (this.mouseX !== null) {
      return this.mouseX - playerWidth / 2;
    }
    // 2. タッチ操作
    if (this.touchActive) {
      return this.touchCurrentX - playerWidth / 2;
    }
    // 3. キーボード操作
    let newX = currentPlayerX;
    if (this.left) newX -= keyboardSpeed;
    if (this.right) newX += keyboardSpeed;

    return newX;
  }
}
