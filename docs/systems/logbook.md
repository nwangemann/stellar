# Logbook

The Identify button saves a capture (the name used in code and storage): target name, kind and id, time, pose and last known location. After time travel it also saves `skyTime`, the time the sky showed; `capturedAt` is always the real time. SQLite on native, in memory on web. No photos yet.

A row opens the target's details, for the time the sky shows now rather than the time of the capture, so Find in sky matches the sky it returns to. Captures saved before the kind and id were stored still list, but do not open.
