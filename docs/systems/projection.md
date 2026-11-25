# Projection

`src/core/projection/projection.ts` does a gnomonic projection and reticle hit-testing. Functions are worklets with no React imports. A `Lens` holds the pose's trigonometry for a frame; `starLens` turns it into J2000, so each star costs three dot products. Hit-testing skips marks below the horizon.

Without the camera the field of view is 60°, a free choice. With it, the overlay must match the picture, so `fieldOfView.ts` works out the width left after the 4:3 picture is cropped to cover the screen: about 34° on a tall phone. It uses the camera's 35mm-equivalent focal length where iOS 26 gives one, and 26 mm otherwise. It ignores distortion, stabilization crop and other picture shapes, so check it on a phone (backlog step 8.4).
