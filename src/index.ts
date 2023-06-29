import '@pixi/gif';
import { Application, Assets } from 'pixi.js'
import { manifest } from './assets';
import { Keyboard } from './utils/Keyboard';
import { MainScene } from './scenes/MainScene';

// Scale mode for all textures, will retain pixelation
// BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

export const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: '#54C3FF',
	width: 720,
	height: 1280
});

Keyboard.initialize();

(globalThis as any).__PIXI_APP__ = app; // eslint-disable-line ***PIXI DEV TOOLS***

window.addEventListener("resize", () => {
	const scaleX = window.innerWidth / app.screen.width;
	const scaleY = window.innerHeight / app.screen.height;
	const scale = Math.min(scaleX, scaleY);

	const gameWidth = Math.round(app.screen.width * scale);
	const gameHeight = Math.round(app.screen.height * scale);

	const marginHorizontal = Math.floor((window.innerWidth - gameWidth) / 2);
	const marginVertical = Math.floor((window.innerHeight - gameHeight) / 2);

	const appview = app.view as HTMLCanvasElement; // added for Pixi v7

	appview.style.width = gameWidth + "px";
	appview.style.height = gameHeight + "px";
	appview.style.marginLeft = marginHorizontal + "px";
	appview.style.marginRight = marginHorizontal + "px";
	appview.style.marginTop = marginVertical + "px";
	appview.style.marginBottom = marginVertical + "px";
});

window.dispatchEvent(new Event("resize"));

Assets.init({ manifest: manifest }).then(() => {
	// to load all bundles
	// const bundleIds = manifest.bundles.map(bundle => bundle.name);
	Assets.loadBundle("mainScene").then(() => {
		const myScene = new MainScene();
		app.stage.addChild(myScene);
	});
})