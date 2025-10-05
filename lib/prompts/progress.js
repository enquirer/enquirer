'use strict';

const Prompt = require('../prompt');

/**
 * Progress prompt - displays animated progress bars and spinners for background tasks.
 * Supports both determinate (0-100%) and indeterminate (spinner) modes.
 * Includes automatic time estimation based on progress rate.
 */

class ProgressPrompt extends Prompt {
  constructor(options) {
    super(options);
    this.cursorHide();

    // Progress state
    this.total = options.total;
    this.current = options.initial || 0;
    this.barLength = options.barLength || 40;
    this.showPercentage = options.showPercentage !== false;
    this.showValue = options.showValue === true;
    this.showETA = options.showETA !== false;
    this.statusText = options.status || '';

    // Bar characters
    this.completeChar = options.completeChar || '█';
    this.incompleteChar = options.incompleteChar || '░';
    this.spinnerFrames = options.spinner || ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.spinnerIndex = 0;

    // Determine mode: indeterminate (no total) vs determinate (with total)
    this.indeterminate = !this.total || this.total <= 0;
    if (!this.indeterminate && !this.total) {
      this.total = 100;
    }

    // Time estimation
    this.startTime = null;
    this.lastUpdate = null;
    this.estimatedTotal = null;

    // Setup animation timer
    if (this.indeterminate || options.animate !== false) {
      this.timers = this.timers || {};
      this.setupTimer();
    }
  }

  setupTimer() {
    const timer = this.timers.spinner = {
      name: 'spinner',
      start: Date.now(),
      ms: 0,
      tick: 0
    };

    const interval = setInterval(() => {
      timer.ms = Date.now() - timer.start;
      timer.tick++;
      this.spinnerIndex = timer.tick % this.spinnerFrames.length;
      if (!this.state.submitted) {
        this.render();
      }
    }, 80);

    timer.stop = () => clearInterval(interval);
    this.once('close', () => timer.stop());
  }

  /**
   * Update progress value and/or status
   */
  update(value) {
    const now = Date.now();

    if (!this.startTime) {
      this.startTime = now;
    }

    if (typeof value === 'object') {
      if (value.value !== undefined) this.current = value.value;
      if (value.message !== undefined) this.state.message = value.message;
      if (value.status !== undefined) this.statusText = value.status;
      if (value.total !== undefined) this.total = value.total;
    } else if (typeof value === 'number') {
      this.current = value;
    }

    this.lastUpdate = now;

    if (!this.state.submitted) {
      this.render();
    }
  }

  /**
   * Complete the progress
   */
  complete(message) {
    if (!this.indeterminate) {
      this.current = this.total;
    }
    if (message) {
      this.state.message = message;
    }
    this.render();
    return this.submit();
  }

  /**
   * Calculate estimated time remaining
   */
  getETA() {
    if (this.indeterminate || !this.startTime || !this.lastUpdate || this.current === 0) {
      return null;
    }

    const elapsed = this.lastUpdate - this.startTime;
    const rate = this.current / elapsed; // units per ms
    const remaining = this.total - this.current;
    const eta = remaining / rate; // ms remaining

    return eta;
  }

  /**
   * Format time in human readable format
   */
  formatTime(ms) {
    if (ms < 1000) return '<1s';
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }

  /**
   * Render the progress bar
   */
  renderBar() {
    if (this.indeterminate) {
      const spinner = this.spinnerFrames[this.spinnerIndex];
      return this.styles.primary(spinner + ' ') + this.styles.muted('Processing...');
    }

    const percentage = Math.min(100, Math.max(0, (this.current / this.total) * 100));
    const completed = Math.round((percentage / 100) * this.barLength);
    const remaining = this.barLength - completed;

    const completeBar = this.styles.primary(this.completeChar.repeat(completed));
    const incompleteBar = this.styles.muted(this.incompleteChar.repeat(remaining));

    let parts = [completeBar + incompleteBar];

    if (this.showPercentage) {
      const pct = percentage.toFixed(0).padStart(3) + '%';
      parts.push(this.styles.primary(pct));
    }

    if (this.showValue) {
      const valueStr = `${this.current}/${this.total}`;
      parts.push(this.styles.muted(valueStr));
    }

    if (this.showETA && !this.state.submitted) {
      const eta = this.getETA();
      if (eta && eta > 0 && isFinite(eta)) {
        const etaStr = `ETA ${this.formatTime(eta)}`;
        parts.push(this.styles.muted(etaStr));
      }
    }

    return parts.join(' ');
  }

  async render() {
    let size = this.state.size;

    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = this.state.message || await this.message();

    let header = await this.header();
    let footer = await this.footer();

    let bar = this.renderBar();
    let status = this.statusText ? ' ' + this.styles.muted(this.statusText) : '';

    let prompt = '';
    if (!this.state.submitted) {
      prompt = [prefix, message, separator].filter(Boolean).join(' ');
      this.state.prompt = prompt;
    } else {
      prompt = [this.styles.submitted(this.symbols.check), message].filter(Boolean).join(' ');
    }

    let output = bar + status;
    let lines = [header, prompt, output, footer].filter(Boolean);

    this.clear(size);
    this.write(lines.join('\n'));

    if (!this.state.submitted) {
      this.restore();
    }
  }

  async submit() {
    this.state.submitted = true;
    await this.render();
    await this.close();
    this.emit('submit', this.current);
  }

  async run() {
    return new Promise(async(resolve, reject) => {
      this.once('submit', resolve);
      this.once('cancel', reject);
      await this.render();
      this.emit('run');
    });
  }
}

module.exports = ProgressPrompt;
