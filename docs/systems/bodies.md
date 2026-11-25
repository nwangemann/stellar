# Body screen

`BodyScreen` is a modal for the Sun, Moon and planets. It and the sky card show the facts in `src/features/bodies/facts.ts`.

`bodyDetails` gives distance from the observer, magnitude, lit fraction and the next rise and set within two days. Rise and set mean the upper limb on a flat horizon with standard refraction, while `toAltAz` ignores refraction, so a body is drawn rising a few minutes after its listed time. Times use the device's time zone. Cards receive the sky's `Moment`, so they match what is drawn. During time travel the sky passes its time to the screen as the `at` parameter.
