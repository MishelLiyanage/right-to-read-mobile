import { SpeechMark, TextBlock } from '@/types/book';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { AudioResolver } from './audioResolver';

export interface TTSServiceCallbacks {
  onPlaybackStart?: () => void;
  onPlaybackComplete?: () => void;
  onPlaybackError?: (error: string) => void;
  onBlockStart?: (blockIndex: number, text: string) => void;
  onBlockComplete?: (blockIndex: number) => void;
  onPlaybackProgress?: (position: number, duration: number, blockIndex: number) => void;
  onWordPlaybackStart?: (word: string) => void;
  onWordPlaybackComplete?: (word: string) => void;
}

export class TTSService {
  private currentSound: Audio.Sound | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentBlockIndex: number = 0;
  private blocks: TextBlock[] = [];
  private callbacks: TTSServiceCallbacks = {};
  private isInitialized: boolean = false;
  private playbackRate: number = 1.0; // Default speed (1.0 = normal speed)

  constructor(callbacks?: TTSServiceCallbacks) {
    if (callbacks) {
      this.callbacks = callbacks;
    }
  }

  setCallbacks(callbacks: TTSServiceCallbacks) {
    this.callbacks = callbacks;
  }

  // Get current playback rate
  getPlaybackRate(): number {
    return this.playbackRate;
  }

  // Set playback rate (0.5 = half speed, 1.0 = normal speed, 2.0 = double speed)
  async setPlaybackRate(rate: number): Promise<void> {
    console.log(`[TTS] Setting playback rate to: ${rate}`);
    
    // Clamp rate between 0.25x and 3.0x
    this.playbackRate = Math.max(0.25, Math.min(3.0, rate));
    console.log(`[TTS] Clamped playback rate: ${this.playbackRate}`);
    
    // If currently playing, update the current sound's playback rate
    if (this.currentSound && this.isPlaying) {
      try {
        // First check if sound is loaded and available
        const status = await this.currentSound.getStatusAsync();
        console.log('[TTS] Current sound status:', status);
        
        if (status.isLoaded) {
          // Try multiple approaches for setting playback rate
          let success = false;
          
          // Approach 1: Standard rate setting with pitch correction
          try {
            await this.currentSound.setStatusAsync({
              rate: this.playbackRate,
              shouldCorrectPitch: true
            });
            success = true;
            console.log('[TTS] Successfully set rate with pitch correction');
          } catch (pitchError) {
            console.warn('[TTS] Failed with pitch correction, trying without:', pitchError);
            
            // Approach 2: Rate setting without pitch correction
            try {
              await this.currentSound.setStatusAsync({
                rate: this.playbackRate,
                shouldCorrectPitch: false
              });
              success = true;
              console.log('[TTS] Successfully set rate without pitch correction');
            } catch (noPitchError) {
              console.warn('[TTS] Failed without pitch correction, trying rate only:', noPitchError);
              
              // Approach 3: Rate only
              try {
                await this.currentSound.setStatusAsync({
                  rate: this.playbackRate
                });
                success = true;
                console.log('[TTS] Successfully set rate only');
              } catch (rateOnlyError) {
                console.error('[TTS] All rate setting approaches failed:', rateOnlyError);
              }
            }
          }
          
          if (success) {
            // Verify the rate was actually applied
            const newStatus = await this.currentSound.getStatusAsync();
            if (newStatus.isLoaded && 'rate' in newStatus) {
              console.log(`[TTS] Verified rate applied: ${(newStatus as any).rate}`);
            }
          } else {
            // If all methods fail, try to restart the current sound with new rate
            console.log('[TTS] Attempting to restart sound with new rate');
            const currentPosition = status.positionMillis || 0;
            await this.currentSound.stopAsync();
            await this.currentSound.setPositionAsync(currentPosition);
            await this.currentSound.setStatusAsync({
              rate: this.playbackRate,
              shouldCorrectPitch: true
            });
            await this.currentSound.playAsync();
            console.log('[TTS] Successfully restarted with new rate');
          }
        } else {
          console.warn('[TTS] Sound not loaded, cannot set playback rate');
        }
      } catch (error) {
        console.error('[TTS] Failed to set playback rate:', error);
        console.error('[TTS] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        
        // Notify callbacks about the error
        this.callbacks.onPlaybackError?.(`Failed to change playback speed: ${error}`);
      }
    } else {
      console.log(`[TTS] Not currently playing, rate will be applied to next playback. Current sound: ${!!this.currentSound}, Is playing: ${this.isPlaying}`);
    }
  }

  async initialize(): Promise<void> {
    try {
      // Set audio mode for optimal playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      this.isInitialized = true;

    } catch (error) {
      console.error('TTS Service initialization failed:', error);
      this.callbacks.onPlaybackError?.(`Initialization failed: ${error}`);
    }
  }

  loadContent(blocks: TextBlock[]): void {
    this.blocks = blocks;
    this.currentBlockIndex = 0;

  }

  async startReading(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.blocks.length === 0) {
      this.callbacks.onPlaybackError?.('No content to read');
      return;
    }

    try {
      // If resuming from pause, don't reset block index
      if (!this.isPaused) {
        this.currentBlockIndex = 0;
      }
      
      this.isPlaying = true;
      this.isPaused = false;
      
      this.callbacks.onPlaybackStart?.();
      
      await this.playSequentially();
      
    } catch (error) {
      console.error('TTS Service: Error starting reading:', error);
      this.callbacks.onPlaybackError?.(`Failed to start reading: ${error}`);
      this.isPlaying = false;
    }
  }

  private async playSequentially(): Promise<void> {
    for (let i = this.currentBlockIndex; i < this.blocks.length; i++) {
      if (!this.isPlaying) break;
      
      this.currentBlockIndex = i;
      const block = this.blocks[i];
      
      this.callbacks.onBlockStart?.(i, block.text);
      
      await this.playBlock(block);
      
      // Wait for block to complete (this will wait during pause)
      await this.waitForCompletion();
      
      if (!this.isPlaying) break;
      
      this.callbacks.onBlockComplete?.(i);
    }
    
    if (this.isPlaying && !this.isPaused) {
      this.isPlaying = false;
      this.callbacks.onPlaybackComplete?.();
    }
  }

  private async playBlock(block: TextBlock): Promise<void> {
    try {
      console.log(`[TTS] Starting playBlock with rate: ${this.playbackRate}, block:`, block.id);
      
      // Cleanup previous sound
      if (this.currentSound) {
        console.log('[TTS] Cleaning up previous sound');
        await this.currentSound.unloadAsync();
      }

      // Load and play new audio
      console.log('[TTS] Creating new sound from block audio');
      
      // Resolve audio using AudioResolver for dynamic paths
      const resolvedAudio = block.pageNumber && block.blockId ? 
        AudioResolver.resolveAudio(block.pageNumber, block.blockId.toString()) : null;
      
      if (!resolvedAudio) {
        console.warn('[TTS] No audio available for this block');
        this.callbacks.onPlaybackError?.('No audio available for this block');
        return;
      }
      
      const { sound } = await Audio.Sound.createAsync(resolvedAudio);
      this.currentSound = sound;
      console.log('[TTS] Sound created successfully');

      // Set up playback status monitoring
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {

          } else if (status.positionMillis !== undefined && status.durationMillis !== undefined) {
            // Provide real-time progress updates
            this.callbacks.onPlaybackProgress?.(
              status.positionMillis,
              status.durationMillis,
              this.currentBlockIndex
            );
          }
        }
      });

      // Set playback rate with robust error handling
      console.log(`[TTS] Setting initial playback rate for new block: ${this.playbackRate}`);
      
      let rateSetSuccessfully = false;
      
      // Try multiple approaches for setting playback rate
      try {
        await sound.setStatusAsync({
          rate: this.playbackRate,
          shouldCorrectPitch: true
        });
        rateSetSuccessfully = true;
        console.log('[TTS] Block rate set with pitch correction');
      } catch (pitchError) {
        console.warn('[TTS] Block rate failed with pitch correction, trying without:', pitchError);
        
        try {
          await sound.setStatusAsync({
            rate: this.playbackRate,
            shouldCorrectPitch: false
          });
          rateSetSuccessfully = true;
          console.log('[TTS] Block rate set without pitch correction');
        } catch (noPitchError) {
          console.warn('[TTS] Block rate failed without pitch correction, trying rate only:', noPitchError);
          
          try {
            await sound.setStatusAsync({
              rate: this.playbackRate
            });
            rateSetSuccessfully = true;
            console.log('[TTS] Block rate set with rate only');
          } catch (rateOnlyError) {
            console.error('[TTS] All block rate setting attempts failed:', rateOnlyError);
            // Continue without rate adjustment
          }
        }
      }
      
      if (rateSetSuccessfully) {
        // Verify the rate was set
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && 'rate' in status) {
            console.log(`[TTS] Verified block playback rate: ${(status as any).rate}`);
          }
        } catch (statusError) {
          console.warn('[TTS] Could not verify block playback rate:', statusError);
        }
      }
      
      await sound.playAsync();
      console.log('[TTS] Block playback started successfully');
      
    } catch (error) {
      console.error('[TTS] Error playing block:', error);
      console.error('[TTS] Block error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      this.callbacks.onPlaybackError?.(`Failed to play audio: ${error}`);
      throw error;
    }
  }

  private async waitForCompletion(): Promise<void> {
    return new Promise((resolve) => {
      const checkStatus = async () => {
        if (!this.currentSound || !this.isPlaying) {
          resolve();
          return;
        }

        // If paused, keep waiting without resolving
        if (this.isPaused) {
          setTimeout(checkStatus, 100);
          return;
        }

        try {
          const status = await this.currentSound.getStatusAsync();
          if (status.isLoaded && status.didJustFinish) {
            resolve();
          } else if (status.isLoaded && !status.isPlaying && !this.isPaused) {
            resolve();
          } else {
            setTimeout(checkStatus, 100);
          }
        } catch (error) {
          console.error('Error checking status:', error);
          resolve();
        }
      };
      checkStatus();
    });
  }

  async stop(): Promise<void> {
    try {
      this.isPlaying = false;
      this.isPaused = false;
      
      if (this.currentSound) {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }
      
      this.currentBlockIndex = 0;

    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  }

  async pause(): Promise<void> {
    try {
      if (this.currentSound && this.isPlaying && !this.isPaused) {
        await this.currentSound.pauseAsync();
        this.isPaused = true;

      }
    } catch (error) {
      console.error('Error pausing TTS:', error);
    }
  }

  async resume(): Promise<void> {
    try {
      if (this.currentSound && this.isPlaying && this.isPaused) {
        // Ensure correct playback rate is set when resuming
        await this.currentSound.setStatusAsync({
          rate: this.playbackRate,
          shouldCorrectPitch: true
        });
        await this.currentSound.playAsync();
        this.isPaused = false;

      }
    } catch (error) {
      console.error('Error resuming TTS:', error);
    }
  }

  async cleanup(): Promise<void> {
    await this.stop();
    this.isPaused = false;
  }

  // Word-level audio methods for dictionary functionality
  async playWordFromPage(word: string, allBlocks: TextBlock[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const normalizedWord = word.toLowerCase().trim();


      // Search through all blocks to find the word
      for (const block of allBlocks) {
        if (block.speechMarks) {
          const wordMark = block.speechMarks.find((mark: SpeechMark) => {
            if (mark.type !== 'word') return false;
            
            const markValue = mark.value.toLowerCase().replace(/[^\w]/g, '');
            const searchWord = normalizedWord.replace(/[^\w]/g, '');
            
            // Try exact match first
            if (markValue === searchWord) return true;
            
            // Try partial match for plurals, verb forms, etc.
            return markValue.includes(searchWord) || searchWord.includes(markValue);
          });

          if (wordMark) {
            // Resolve audio using AudioResolver for dynamic paths
            const resolvedAudio = block.pageNumber && block.blockId ?
              AudioResolver.resolveAudio(block.pageNumber, block.blockId.toString()) : null;
            
            if (resolvedAudio) {
              await this.playWordFromBlock(word, resolvedAudio, block.speechMarks, wordMark);
            } else {
              console.warn('[TTS] No audio available for word playback');
            }
            return;
          }
        }
      }

      throw new Error(`Word "${word}" not found in current page`);
    } catch (error) {
      console.error(`Error playing word "${word}":`, error);
      this.callbacks.onPlaybackError?.(`Failed to play word: ${error}`);
      throw error;
    }
  }

  private async playWordFromBlock(
    word: string, 
    blockAudio: any, 
    speechMarks: SpeechMark[], 
    wordMark: SpeechMark
  ): Promise<void> {
    try {
      this.callbacks.onWordPlaybackStart?.(word);

      // Find the next word mark to determine end time
      const currentIndex = speechMarks.findIndex(mark => mark === wordMark);
      let endTime = wordMark.time + 800; // Default 800ms duration

      // Look for the next word mark
      for (let i = currentIndex + 1; i < speechMarks.length; i++) {
        if (speechMarks[i].type === 'word') {
          endTime = speechMarks[i].time;
          break;
        }
      }



      // Create a new sound instance for word playback
      const { sound } = await Audio.Sound.createAsync(blockAudio);
      
      // Set position to word start time, set playback rate, and play
      await sound.setPositionAsync(wordMark.time);
      await sound.setStatusAsync({
        rate: this.playbackRate,
        shouldCorrectPitch: true
      });
      await sound.playAsync();

      // Stop playback after word duration
      const playDuration = Math.max(endTime - wordMark.time, 500); // Minimum 500ms
      setTimeout(async () => {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
          this.callbacks.onWordPlaybackComplete?.(word);

        } catch (error) {
          console.error('Error stopping word playback:', error);
          this.callbacks.onWordPlaybackComplete?.(word);
        }
      }, playDuration);

    } catch (error) {
      console.error(`Error playing word "${word}" from block:`, error);
      this.callbacks.onWordPlaybackComplete?.(word);
      throw error;
    }
  }

  // Play specific block by ID
  async playSpecificBlock(blockId: number): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.blocks.length === 0) {
      this.callbacks.onPlaybackError?.('No content loaded');
      return;
    }

    try {
      // Find the block by ID
      const blockIndex = this.blocks.findIndex(block => block.id === blockId);
      if (blockIndex === -1) {
        throw new Error(`Block with ID ${blockId} not found`);
      }

      const block = this.blocks[blockIndex];
      
      // Stop any current playback
      await this.stop();
      
      // Set playing state
      this.isPlaying = true;
      this.isPaused = false;
      this.currentBlockIndex = blockIndex;
      
      // Notify callback
      this.callbacks.onBlockStart?.(blockIndex, block.text);
      this.callbacks.onPlaybackStart?.();
      

      
      // Play the specific block
      await this.playBlock(block);
      
      // Wait for completion
      await this.waitForCompletion();
      
      // Reset state after completion
      this.isPlaying = false;
      this.isPaused = false;
      
      // Notify completion
      this.callbacks.onBlockComplete?.(blockIndex);
      this.callbacks.onPlaybackComplete?.();
      

      
    } catch (error) {
      console.error('TTS Service: Error playing specific block:', error);
      this.callbacks.onPlaybackError?.(`Failed to play block: ${error}`);
      this.isPlaying = false;
      this.isPaused = false;
    }
  }

  // Status getters
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  getCurrentBlockIndex(): number {
    return this.currentBlockIndex;
  }

  getTotalBlocks(): number {
    return this.blocks.length;
  }
}
