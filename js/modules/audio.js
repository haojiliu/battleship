export function createAudioSystem() {
    let audioContext = null;
    let sounds = {};
    let soundsLoaded = [];
    let audioEnabled = true;
    let volumeMultiplier = 1.0;
    
    let backgroundMusic = null;
    let introMusic = null;
    
    function init() {
        try {
            // Create audio context
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            
            // Load sound effects
            loadSound('laser', 'sounds/laser.mp3');
            loadSound('explosion', 'sounds/explosion.mp3');
            loadSound('background', 'sounds/background.mp3');
            loadSound('intro', 'sounds/intro.mp3');
            loadSound('gameover', 'sounds/gameover.mp3');
            loadSound('flyby', 'sounds/explosion2.mp3');
            
            return true;
        } catch (e) {
            console.error("Audio context not supported", e);
            return false;
        }
    }
    
    function loadSound(name, url) {
        console.log(`Loading sound: ${name} from ${url}`);
        
        // Check if sound is already loaded
        const existingSound = soundsLoaded.find(s => s.name === name);
        if (existingSound && existingSound.loaded && sounds[name] && sounds[name].buffer) {
            console.log(`Sound ${name} already loaded, skipping fetch`);
            return;
        }
        
        // Add to loaded sounds tracking if not already there
        if (!existingSound) {
            soundsLoaded.push({
                name,
                loaded: false
            });
        }
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load sound: ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                sounds[name] = {
                    buffer: audioBuffer
                };
                
                // Update loaded status
                const soundStatus = soundsLoaded.find(s => s.name === name);
                if (soundStatus) {
                    soundStatus.loaded = true;
                }
                
                console.log(`Sound loaded: ${name}`);
            })
            .catch(error => {
                console.error(`Error loading sound ${name}:`, error);
            });
    }
    
    function playSound(soundName, options = {}) {
        if (!audioContext || !audioEnabled) {
            return null;
        }
        
        const soundData = sounds[soundName];
        if (!soundData || !soundData.buffer) {
            console.warn(`Sound "${soundName}" not loaded yet`);
            return null;
        }
        
        try {
            const source = audioContext.createBufferSource();
            source.buffer = soundData.buffer;
            
            // Apply looping if specified
            if (options.loop) {
                source.loop = true;
            }
            
            // Create gain node for volume
            const gainNode = audioContext.createGain();
            // Apply volume multiplier to all sounds
            gainNode.gain.value = (options.volume || 0.5) * volumeMultiplier;
            
            // Connect nodes
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Start playing
            source.start(0);
            
            // Return a controller object
            return {
                source,
                gainNode,
                stop: function() {
                    try {
                        source.stop();
                    } catch (e) {
                        console.warn("Error stopping sound", e);
                    }
                }
            };
        } catch (error) {
            console.error("Error playing sound:", error);
            return null;
        }
    }
    
    function resumeAudio() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume()
                .then(() => console.log("AudioContext resumed successfully"))
                .catch(error => console.error("Error resuming AudioContext:", error));
        }
    }
    
    function enableSound(enable) {
        audioEnabled = enable;
        
        if (!enable) {
            // Stop all current sounds if disabling
            stopBackgroundMusic();
            stopIntroMusic();
        }
    }
    
    function playBackgroundMusic(volume = 0.3) {
        console.log("playBackgroundMusic called with volume:", volume);
        console.log("Current audio state:", JSON.stringify({
            audioEnabled,
            backgroundMusicExists: !!backgroundMusic,
            soundsAvailable: Object.keys(sounds),
            backgroundSoundLoaded: !!sounds['background']
        }));
        
        // Stop existing background music if it exists
        stopBackgroundMusic();
        
        // Start new background music
        if (sounds['background'] && audioEnabled) {
            try {
                backgroundMusic = playSound('background', { 
                    volume: volume,
                    loop: true 
                });
                console.log("Background music started successfully");
                
                // Store the original volume
                if (backgroundMusic) {
                    backgroundMusic.originalVolume = volume;
                }
            } catch (error) {
                console.error("Error starting background music:", error);
            }
        } else {
            console.warn("Cannot play background music - sound not loaded or audio disabled", {
                soundLoaded: !!sounds['background'],
                audioEnabled
            });
        }
        
        return !!backgroundMusic;
    }
    
    function stopBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.stop();
            backgroundMusic = null;
        }
    }
    
    function playIntroMusic(volume = 0.3) {
        console.log("playIntroMusic called with volume:", volume);
        
        // Stop existing intro music if it exists
        stopIntroMusic();
        
        // Start new intro music
        if (sounds['intro'] && audioEnabled) {
            try {
                introMusic = playSound('intro', { 
                    volume: volume,
                    loop: true 
                });
                console.log("Intro music started successfully");
                
                // Store the original volume
                if (introMusic) {
                    introMusic.originalVolume = volume;
                }
            } catch (error) {
                console.error("Error starting intro music:", error);
            }
        } else {
            console.warn("Cannot play intro music - sound not loaded or audio disabled", {
                soundLoaded: !!sounds['intro'],
                audioEnabled
            });
        }
        
        return !!introMusic;
    }
    
    function stopIntroMusic() {
        if (introMusic) {
            introMusic.stop();
            introMusic = null;
        }
    }
    
    function getStatus() {
        return {
            audioContextState: audioContext ? audioContext.state : 'not created',
            audioEnabled,
            soundsLoaded,
            backgroundMusicActive: !!backgroundMusic,
            introMusicActive: !!introMusic
        };
    }
    
    function setVolumeMultiplier(value) {
        volumeMultiplier = value;
        
        // Update background music volume if playing
        if (backgroundMusic && backgroundMusic.gainNode) {
            const originalVolume = backgroundMusic.originalVolume || 0.3;
            backgroundMusic.gainNode.gain.value = originalVolume * volumeMultiplier;
        }
        
        // Update intro music volume if playing
        if (introMusic && introMusic.gainNode) {
            const originalVolume = introMusic.originalVolume || 0.3;
            introMusic.gainNode.gain.value = originalVolume * volumeMultiplier;
        }
    }
    
    return {
        init,
        resumeAudio,
        enableSound,
        playSound,
        playBackgroundMusic,
        stopBackgroundMusic,
        playIntroMusic,
        stopIntroMusic,
        getStatus,
        setVolumeMultiplier
    };
} 