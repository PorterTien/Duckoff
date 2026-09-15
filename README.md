# White Goose 🪿

An emotional core character for applications. The goose is a silent presence that reflects user behavior through restrained animation and posture.

## Core Philosophy

- **Never speaks** - No text, dialogue, or narration
- **Communication through movement** - Posture, eye contact, timing
- **Restraint** - Fewer movements are better than more
- **Intentional** - Every animation is earned and emotionally grounded
- **Mirror** - Users should feel their state the moment they see it

## States

### IDLE (Default)
Baseline presence with slow, steady breathing and occasional blinks.  
**Message:** "You're okay. Keep going."

### FLEX (Achievement)
Brief acknowledgment of meaningful effort. Posture straightens, chest expands.  
**Message:** "That mattered."  
**Rules:** Rare, short, must feel earned

### JUDGMENT (Disappointment)
Silent accountability through stillness and eye contact.  
**Message:** "You know what this means."  
**Rules:** No aggression, stillness is the weapon

### BEATEN (Low State)
Reflects failure or neglect with uneven breathing and lowered head.  
**Message:** "That hurt. We're still here."  
**Rules:** Never cartoonish, never pathetic - hurt, not broken

## Usage

### Web App

Open `index.html` in a web browser, or serve it with a local server:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve

# Then open http://localhost:8000
```

### Mobile App (PWA)

1. Open the app in a mobile browser
2. Use "Add to Home Screen" to install as an app
3. The app will work offline and feel native

### Interactive Controls

**Touch/Swipe:**
- Swipe left/right to rotate the goose 360°
- Tap and drag on desktop to rotate

**Keyboard:**
- Press **C** to toggle the control panel
- **Ctrl/Cmd + F** - Trigger flex
- **Ctrl/Cmd + J** - Trigger judgment
- **Ctrl/Cmd + B** - Trigger beaten
- **Ctrl/Cmd + I** - Return to idle

### Programmatic Control

The goose exposes a global `goose` object for state control:

```javascript
// Trigger achievement acknowledgment
goose.flex();

// Trigger judgment stare
goose.judge();

// Enter beaten state
goose.beat();

// Return to idle
goose.idle();

// Get current state
goose.getState(); // Returns: 'idle', 'flex', 'judgment', or 'beaten'

// Get state history
goose.getHistory(); // Returns array of state changes

// Get personality score (-100 to +100)
goose.getPersonality(); // Returns number

// Get personality description
goose.getPersonalityDescription(); // Returns: 'cold', 'distant', 'neutral', 'friendly', or 'warm'

// Run demo sequence
goose.runDemo(); // Cycles through all states
```

### Direct State Control

```javascript
// Direct state change (use sparingly)
goose.setState('flex');
goose.setState('judgment');
goose.setState('beaten');
goose.setState('idle');
```

## Design

- **Goose:** 3D model (currently placeholder, see `LOAD_MODEL.md` to load actual model)
- **Background:** Soft baby blue (#B3E5FC)
- **Lighting:** Soft ambient and directional lighting
- **Interaction:** Swipe to rotate, fully touch-optimized
- **Minimal:** No visual clutter, goose is always the focal point

## State Transitions

- Transitions are slow and believable
- No instant emotional flips
- Recovery takes time
- Improvement is gradual
- The goose does not "reset" instantly

## Personality System

The goose maintains a relationship with the user through a personality scale:

- **Warm (30+)**: Slightly brighter, more responsive
- **Friendly (10-30)**: Positive baseline
- **Neutral (-10 to 10)**: Default state
- **Distant (-30 to -10)**: Slightly dimmer, slower response
- **Cold (-100 to -30)**: Dim, reserved

**Personality Changes:**
- Flex: +5 points (warms relationship)
- Judgment: -3 points (cools slightly)
- Beaten: -8 points (cools significantly)
- Idle: Maintains current level

**Decay:** Personality gradually returns to neutral at 0.5 points per minute.

## Integration

To integrate into your application:

1. Copy `index.html`, `styles.css`, and `goose.js` into your project
2. Include the files in your HTML
3. Connect your application's logic to the goose state machine:

```javascript
// Example: Track user behavior and trigger states
if (userAchievedGoal) {
    goose.flex();
}

if (userFailedTask) {
    goose.beat();
}

if (userInactiveTooLong) {
    goose.judge();
}
```

## Files

- `index.html` - Main HTML structure with 3D viewer
- `styles.css` - Styling and mobile optimizations
- `goose.js` - 3D state machine with Three.js
- `manifest.json` - PWA manifest for app installation
- `TRIGGERS.md` - Detailed trigger system documentation
- `LOAD_MODEL.md` - Instructions for loading the actual 3D model
- `README.md` - This file

## Next Steps

- ✅ Define exact triggers (see `TRIGGERS.md`)
- ✅ Design state decay timing
- ✅ Create personality scale (cold → warm)
- ⏳ Translate into game loop or productivity loop
- ⏳ Add data persistence for state history
- ⏳ Create onboarding flow (first meeting with goose)
- ⏳ Add analytics to track goose effectiveness

---

The goose has been unleashed 🪿🗿

