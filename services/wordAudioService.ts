import * as Speech from 'expo-speech';

export class WordAudioService {
  private static instance: WordAudioService;
  private isSpeaking: boolean = false;

  static getInstance(): WordAudioService {
    if (!WordAudioService.instance) {
      WordAudioService.instance = new WordAudioService();
    }
    return WordAudioService.instance;
  }

  async speakWord(word: string): Promise<void> {
    if (this.isSpeaking) {
      await this.stop();
    }

    try {
      this.isSpeaking = true;
      
      // Filter out non-alphabetic characters for spelling
      const letters = word.split('').filter(char => /[a-zA-Z]/.test(char));
      
      // Spell out each letter
      for (let i = 0; i < letters.length; i++) {
        await this.speakSingleLetter(letters[i]);
        // Add a small pause between letters (200ms)
        await this.delay(200);
      }
      
      // Add a longer pause before speaking the full word (500ms)
      await this.delay(500);
      
      // Speak the full word
      await this.speakFullWord(word);
      
      this.isSpeaking = false;
    } catch (error) {
      this.isSpeaking = false;
      console.error(`Error in spell-then-speak for word "${word}":`, error);
      throw new Error(`Failed to speak word: ${error}`);
    }
  }

  private async speakSingleLetter(letter: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Speech.speak(letter, {
        language: 'en-US',
        pitch: 0.9, // Slightly lower pitch for letters
        rate: 0.6, // Slower rate for individual letters
        voice: undefined,
        onDone: () => resolve(),
        onStopped: () => resolve(),
        onError: (error) => {
          console.error(`Error speaking letter "${letter}":`, error);
          reject(error);
        }
      });
    });
  }

  private async speakFullWord(word: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Speech.speak(word, {
        language: 'en-US',
        pitch: 0.85, // Lower pitch for full word
        rate: 0.75,
        voice: undefined,
        onDone: () => resolve(),
        onStopped: () => resolve(),
        onError: (error) => {
          console.error(`Error speaking word "${word}":`, error);
          reject(error);
        }
      });
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async stop(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('Error stopping speech:', error);
      this.isSpeaking = false;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}