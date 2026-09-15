# White Goose - Trigger System Design

## Overview

The goose responds to user behavior through a trigger system. Each trigger maps specific user actions to goose states, with consideration for timing, frequency, and context.

## Trigger Categories

### Achievement Triggers → FLEX

**Purpose:** Acknowledge meaningful effort and accomplishment.

**Examples:**
- Completed a significant task
- Reached a milestone
- Maintained consistency for X days
- Overcame a challenge
- Achieved a personal best

**Rules:**
- Flex is **rare** - not every small win triggers it
- Must feel **earned** - significant effort required
- Has cooldown period (5 seconds minimum)
- Cannot stack - one flex at a time

**Implementation:**
```javascript
// Example: Task completion
if (task.isSignificant && !goose.isInCooldown('flex')) {
    goose.flex();
}

// Example: Streak milestone
if (streakDays % 7 === 0 && streakDays > 0) {
    goose.flex();
}
```

---

### Neglect Triggers → JUDGMENT

**Purpose:** Silent accountability for inaction or avoidance.

**Examples:**
- User hasn't opened app in X days
- User skipped scheduled session
- User abandoned task mid-way
- User ignored reminder multiple times
- User actively avoided the app

**Rules:**
- Delayed response (not instant)
- Requires pattern of behavior (not one-off)
- Stare holds for 2-3 seconds
- Cooldown prevents spam (8 seconds minimum)

**Implementation:**
```javascript
// Example: Inactivity detection
const daysSinceLastVisit = getDaysSinceLastVisit();
if (daysSinceLastVisit >= 3) {
    goose.judge();
}

// Example: Skipped session
if (skippedSessions >= 2) {
    goose.judge();
}
```

---

### Failure Triggers → BEATEN

**Purpose:** Reflect failure or neglect without shame.

**Examples:**
- User failed a task multiple times
- User broke a significant streak
- User gave up on important goal
- User experienced setback
- User neglected for extended period

**Rules:**
- Never cartoonish or pathetic
- Requires recovery time (minimum 4 seconds)
- Gradual return to idle (6+ seconds)
- Can stack with judgment (judgment first, then beaten)

**Implementation:**
```javascript
// Example: Streak broken
if (streakBroken && previousStreak > 7) {
    goose.beat();
}

// Example: Multiple failures
if (consecutiveFailures >= 3) {
    goose.beat();
}
```

---

### Recovery Triggers → IDLE

**Purpose:** Return to baseline after emotional states.

**Examples:**
- Automatic after flex/judgment duration
- User returns after absence
- User completes recovery action
- Time-based decay from beaten state

**Rules:**
- Gradual, not instant
- Respects minimum state durations
- Natural progression

---

## State Decay System

States naturally decay back to idle over time:

- **Flex:** 1.5 seconds (brief acknowledgment)
- **Judgment:** 3 seconds (stare duration)
- **Beaten:** 10 seconds (requires recovery time)

## Personality System

The goose maintains a personality scale (-100 to +100) that affects:

- **Warm (30+):** Slightly brighter, more responsive
- **Friendly (10-30):** Positive baseline
- **Neutral (-10 to 10):** Default state
- **Distant (-30 to -10):** Slightly dimmer, slower response
- **Cold (-100 to -30):** Dim, reserved

**Personality Changes:**
- Flex: +5 points (warms relationship)
- Judgment: -3 points (cools slightly)
- Beaten: -8 points (cools significantly)
- Idle: Maintains current level

**Decay:** Personality gradually returns to neutral at 0.5 points per minute.

---

## Integration Examples

### Productivity App

```javascript
// On task completion
function onTaskComplete(task) {
    if (task.importance === 'high' && task.difficulty === 'hard') {
        goose.flex();
    }
}

// On missed deadline
function onDeadlineMissed(task) {
    if (task.importance === 'high') {
        goose.judge();
    }
}

// On streak broken
function onStreakBroken(days) {
    if (days >= 7) {
        goose.beat();
    }
}
```

### Habit Tracker

```javascript
// Daily check-in
function checkDailyHabits() {
    const completed = getCompletedHabitsToday();
    const total = getTotalHabits();
    
    if (completed === total && total >= 3) {
        goose.flex();
    } else if (completed === 0 && total >= 3) {
        goose.judge();
    }
}

// Weekly review
function onWeeklyReview() {
    const completionRate = getWeeklyCompletionRate();
    
    if (completionRate >= 0.8) {
        goose.flex();
    } else if (completionRate < 0.3) {
        goose.beat();
    }
}
```

### Game/Challenge App

```javascript
// On level completion
function onLevelComplete(level) {
    if (level.difficulty === 'expert' && level.time < level.parTime) {
        goose.flex();
    }
}

// On failure
function onLevelFailed(level, attempts) {
    if (attempts >= 5) {
        goose.beat();
    }
}

// On inactivity
function checkInactivity() {
    const hoursSincePlay = getHoursSinceLastPlay();
    if (hoursSincePlay >= 48) {
        goose.judge();
    }
}
```

---

## Best Practices

1. **Restraint:** Not every action triggers a state change
2. **Context:** Consider user's history and patterns
3. **Timing:** Allow states to breathe before new triggers
4. **Earned:** Flex should feel special, not common
5. **Gradual:** Transitions are slow and believable
6. **Silent:** No text, no explanation, just presence

---

## Next Steps

- Define specific thresholds for your application
- Implement state persistence (localStorage/backend)
- Add analytics to track goose effectiveness
- Create user preference system (sensitivity levels)
- Design onboarding flow (first meeting with goose)

