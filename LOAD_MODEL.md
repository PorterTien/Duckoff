# Loading the 3D Goose Model

The app currently uses a placeholder 3D goose. To load the actual model from Sketchfab:

## Option 1: Download and Use GLTF File

1. Download the model from Sketchfab: https://sketchfab.com/models/fdc0d2f24a4c422dba503f2b9f445e24
2. Export as GLTF or GLB format
3. Place the file in the project directory (e.g., `goose-model.gltf`)
4. Update `goose.js` in the `loadModel()` function:

```javascript
loader.load(
    'goose-model.gltf',  // or 'goose-model.glb'
    (gltf) => {
        this.gooseModel = gltf.scene;
        this.gooseModel.scale.set(1, 1, 1);
        this.gooseModel.position.set(0, 0, 0);
        
        // Remove knife if it exists
        this.gooseModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Hide knife if name contains "knife"
                if (child.name && child.name.toLowerCase().includes('knife')) {
                    child.visible = false;
                }
            }
        });
        
        this.scene.add(this.gooseModel);
        
        // Setup animations if available
        if (gltf.animations && gltf.animations.length) {
            this.mixer = new THREE.AnimationMixer(this.gooseModel);
            gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
            });
        }
    },
    undefined,
    (error) => {
        console.error('Error loading model:', error);
        this.createPlaceholderGoose();
    }
);
```

5. Comment out or remove the `createPlaceholderGoose()` call

## Option 2: Use Sketchfab API

If you have a Sketchfab API key, you can load the model directly:

```javascript
// Requires Sketchfab API setup
const api = new SketchfabAPI('your-api-key');
api.getModel('fdc0d2f24a4c422dba503f2b9f445e24', (model) => {
    // Load model data
});
```

## Option 3: Use Model Viewer (Simpler Alternative)

For a simpler approach, you could use `<model-viewer>` web component:

```html
<model-viewer 
    src="goose-model.gltf" 
    alt="White Goose"
    auto-rotate
    camera-controls
    touch-action="pan-y">
</model-viewer>
```

## Notes

- The placeholder goose will work for testing all functionality
- State animations will work with any 3D model once loaded
- Make sure the model is optimized for web (under 5MB recommended)
- GLB format is preferred over GLTF for single-file distribution

