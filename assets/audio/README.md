# Audio Implementation

Instead of using audio files, this game uses the Web Audio API to generate sounds programmatically. This approach has several benefits:

1. No external dependencies or assets to load
2. Smaller file size and faster loading
3. Sound generation is customizable at runtime
4. No licensing concerns for audio assets

The audio generation is handled in the `audio.js` file, which creates various sound effects using oscillators, gain nodes, and other Web Audio API features.

## Sound Types

The game includes the following sound effects:

- Jump sound
- Coin collection
- Death sound
- Level complete melody
- Game over sound
- Background music

These sounds are generated using different waveforms (sine, sawtooth) with frequency and gain modulation to create the desired effects.