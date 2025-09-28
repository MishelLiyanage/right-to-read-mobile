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

    return new Promise((resolve, reject) => {
      try {
        this.isSpeaking = true;
        
        Speech.speak(word, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.75, // Slightly slower for better clarity
          voice: undefined, // Use default system voice
          onStart: () => {

          },
          onDone: () => {

            this.isSpeaking = false;
            resolve();
          },
          onStopped: () => {

            this.isSpeaking = false;
            resolve();
          },
          onError: (error) => {
            console.error(`Error speaking word "${word}":`, error);
            this.isSpeaking = false;
            reject(new Error(`Failed to speak word: ${error}`));
          }
        });
      } catch (error) {
        this.isSpeaking = false;
        console.error(`Error initiating speech for word "${word}":`, error);
        reject(new Error(`Failed to initiate speech: ${error}`));
      }
    });
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