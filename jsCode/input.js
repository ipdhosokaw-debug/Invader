class InputHandler {
  constructor(canvas, shootButtonId = 'shootBtn') {
    this.canvas = canvas;
    this.shootButton = document.getElementById(shootButtonId);

    this.left = false;
    this.right = false;
    this.mouseX = null;
    this.touchActive = false;
    this.touchStartX = 0;
    this.touchCurrentX = 0;

    // 発射状態（押しっぱなし判定 と 単発トリガー用）
    this.shootHeld = false;
    this.shootPressed = false;

    this.initListeners();
  }

  // 1フレーム分の「今押されたか（単発）」を取得してリセットする
  consumeShoot() {
    if (this.shootPressed) {
      this.shootPressed = false;
      return true;
    }
    return this.shootHeld; // 連射・押しっぱなしにしたい場合は true を返す
  }

  getTouchX(e) {
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    return touch.clientX - rect.left;
  }

  initListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') this.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') this.right = true;

      // スペースキーで発射（キーリピートは無視して単発扱い）
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault(); // 画面スクロール防止
        if (!e.repeat) {
          this.shootPressed = true;
        }
        this.shootHeld = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') this.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') this.right = false;

      if (e.code === 'Space' || e.key === ' ') {
        this.shootHeld = false;
      }
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

    // ★ 発射ボタンのイベント（マウス＆スマホタッチ両対応）
    if (this.shootButton) {
      this.shootButton.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.shootPressed = true;
        this.shootHeld = true;
      });

      const releaseShoot = () => {
        this.shootHeld = false;
      };

      this.shootButton.addEventListener('pointerup', releaseShoot);
      this.shootButton.addEventListener('pointerleave', releaseShoot);
      this.shootButton.addEventListener('pointercancel', releaseShoot);
    }
  }

  calculateTargetX(currentPlayerX, playerWidth, canvasWidth, keyboardSpeed) {
    if (this.mouseX !== null) {
      return this.mouseX - playerWidth / 2;
    }
    if (this.touchActive) {
      return this.touchCurrentX - playerWidth / 2;
    }
    let newX = currentPlayerX;
    if (this.left) newX -= keyboardSpeed;
    if (this.right) newX += keyboardSpeed;

    return newX;
  }
}
