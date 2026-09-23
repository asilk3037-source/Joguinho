import DialogueChapterScene from './DialogueChapterScene.js';
import { chapter1Steps } from '../data/chapter1Dialogue.js';

export default class Chapter1Scene extends DialogueChapterScene {
  constructor() {
    super('Chapter1');
  }

  getBackgroundColor() {
    return '#241f2e';
  }

  getCardInfo() {
    return { kicker: 'Capítulo 1', title: 'Dois Julius', date: '01 · 05 · 2024 · a conversa não parou' };
  }

  getSteps() {
    return chapter1Steps;
  }

  getNextSceneKey() {
    return 'Chapter2';
  }

  onBackgroundCreate() {
    const { width, height } = this.scale;
    this.add.sprite(width * 0.24, height * 0.22, 'line_sheet', 0).setScale(1.4).setAlpha(0.35);
    this.add.sprite(width * 0.76, height * 0.22, 'bell_sheet', 0).setScale(1.4).setAlpha(0.35);
  }
}
