"""Synthesize the original 16-bar theme and encode it for the game."""

import argparse
import math
from pathlib import Path
import subprocess
import tempfile
import wave

import numpy as np


RATE = 32000
BEAT = 60 / 104
BAR_COUNT = 16
ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "dist" / "bgm.mp3"

# Each bar contains a bass root and a four-note voicing (MIDI note numbers).
CHORDS = (
    (45, (57, 60, 64, 67)), (41, (53, 57, 60, 64)),
    (48, (55, 60, 64, 67)), (43, (55, 60, 62, 67)),
    (45, (57, 60, 64, 71)), (41, (53, 57, 60, 64)),
    (48, (55, 60, 64, 69)), (43, (55, 59, 62, 67)),
    (50, (57, 60, 65, 69)), (48, (57, 60, 64, 69)),
    (41, (53, 57, 60, 64)), (40, (56, 59, 62, 64)),
    (50, (57, 60, 65, 69)), (41, (53, 57, 60, 64)),
    (43, (55, 59, 62, 64)), (40, (56, 59, 62, 64)),
)

# Melody entries give the beat within the bar, MIDI note and duration in beats.
MELODY = (
    ((0.50, 76, .54), (1.25, 79, .46), (2, 81, .72), (3.25, 79, .52)),
    ((0, 76, .83), (1.25, 72, .51), (2, 74, .62), (3, 72, .65)),
    ((0.25, 76, .48), (.90, 74, .42), (1.50, 72, .75), (2.75, 67, .68)),
    ((0, 69, .48), (.75, 72, .48), (1.50, 74, .76), (2.75, 71, .69)),
    ((.50, 76, .55), (1.25, 79, .48), (2, 81, .64), (3, 83, .65)),
    ((0, 84, .70), (1, 81, .61), (2, 76, .84), (3.25, 77, .53)),
    ((0.25, 76, .54), (1, 72, .56), (2, 74, .76), (3.25, 76, .53)),
    ((0, 74, .93), (1.50, 71, .64), (2.50, 67, .60)),
    ((.25, 69, .58), (1, 72, .55), (2, 77, .68), (3.25, 76, .49)),
    ((0, 72, .76), (1.25, 69, .71), (2.50, 76, .98)),
    ((.50, 77, .52), (1.25, 79, .60), (2.25, 81, 1.17)),
    ((0, 80, .62), (1, 76, .58), (2, 74, .61), (3, 71, .65)),
    ((.25, 72, .45), (.90, 77, .53), (1.75, 81, .74), (3.25, 79, .52)),
    ((0, 77, .65), (1, 76, .67), (2, 72, .82), (3.25, 74, .52)),
    ((0, 71, .57), (.75, 74, .58), (1.50, 76, .70), (2.75, 79, .76)),
    ((.25, 76, .57), (1, 74, .55), (2, 71, .92), (3.50, 68, .34)),
)


def frequency(note):
    return 440 * 2 ** ((note - 69) / 12)


def synthesize():
    mix = np.zeros(round(BAR_COUNT * 4 * BEAT * RATE))
    random = np.random.default_rng(617)

    def add(beats, signal):
        start = round(beats * BEAT * RATE) % len(mix)
        length = min(len(mix) - start, len(signal))
        mix[start:start + length] += signal[:length]
        mix[:len(signal) - length] += signal[length:]

    def play(beats, note, duration, gain, voice):
        time = np.arange(round(duration * BEAT * RATE)) / RATE
        phase = 2 * math.pi * frequency(note) * time
        envelope = np.minimum(1, time / .012) * np.minimum(1, (time[-1] - time) / .045)
        if voice == "lead":
            waveform = np.sin(phase) + .17 * np.sin(3 * phase) + .048 * np.sin(5 * phase)
            envelope *= np.exp(-1.15 * time)
        elif voice == "bass":
            waveform = np.sin(phase) - .105 * np.sin(3 * phase) + .033 * np.sin(5 * phase)
            envelope *= np.exp(-.85 * time)
        else:
            waveform = np.sin(phase) + .38 * np.sin(2 * phase) + .12 * np.sin(3 * phase)
            envelope *= np.exp(-8 * time)
        signal = gain * envelope * waveform
        add(beats, signal)
        if voice == "lead":
            add(beats + .42, signal * .15)

    def percussion(beats, accent):
        time = np.arange(round(.082 * RATE)) / RATE
        noise = random.normal(0, 1, len(time) + 1)
        envelope = np.minimum(1, time / .004) * np.exp(-49 * time)
        envelope *= np.minimum(1, (time[-1] - time) / .008)
        add(beats, np.diff(noise) * envelope * accent)

    for bar_index, ((bass, chord), lead) in enumerate(zip(CHORDS, MELODY, strict=True)):
        bar = bar_index * 4
        play(bar, bass, 1.64, .113, "bass")
        play(bar + 2, bass + 7, 1.48, .072, "bass")
        arpeggio = (0, 2, 1, 3, 0, 2, 1, 2) if bar_index < 8 else (1, 0, 2, 3, 1, 2, 3, 2)
        for index, key in enumerate(arpeggio):
            play(bar + index * .5 + .035, chord[key], .44, .048 if index % 2 == 0 else .032, "pluck")
        for when, note, duration in lead:
            play(bar + when, note, duration, .113, "lead")
        for when in (.5, 1.5, 2.5, 3.5):
            percussion(bar + when, .011 if when in (1.5, 3.5) else .007)

    # Soft output keeps the theme in the background of the game effects.
    return (mix * (.31 / np.max(np.abs(mix))) * 32767).astype("<i2")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", nargs="?", type=Path, default=TARGET)
    target = parser.parse_args().output
    samples = synthesize()
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as parent:
        source = Path(parent) / "bgm.wav"
        with wave.open(str(source), "wb") as wav:
            wav.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
            wav.writeframes(samples.tobytes())
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-i", str(source),
            "-codec:a", "libmp3lame", "-b:a", "56k",
            "-metadata", "title=지원서를 여는 밤",
            "-metadata", "comment=Original synthesized theme for 취준생 키우기",
            str(target),
        ], check=True)


if __name__ == "__main__":
    main()
