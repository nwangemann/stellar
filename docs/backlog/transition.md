# 7. Zoom transition to details

Goal: a fun transition from the sky to the details modal and back. Tapping Star details or Explore constellation zooms in on the object in its place in the sky, and the modal appears from that spot. Closing it returns from the zoom to the original view.

This is an investigation first: explore a couple of versions before choosing one.

Proof: the user picks a version after seeing it on the simulator.

- [ ] **7.1 Investigate.** Compare ways to do it, such as zooming the field of view, scaling the sky layer, and a custom or shared-element modal transition. Cover stars, constellations and bodies, the camera backdrop (it must zoom too, or fade), sensors pausing while covered, closing by swipe, and Reduce Motion. Record the options here. Read: `SkyScreen.tsx`, `SkyCanvas.tsx`, `app/_layout.tsx`, the detail screens in `app/`.
- [ ] **7.2 Prototype.** Build two versions and show them to the user.
- [ ] **7.3 Finish.** Polish the chosen version, including the return, and remove the other. Record an ADR if it changes how modals or the field of view work.
