import satori from "satori";
import { html } from "satori-html";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";

// Initialize WASM once
let wasmInitialized = false;

export const GET: APIRoute = async () => {
	if (!wasmInitialized) {
		try {
			const wasmBuffer = await readFile(
				"./node_modules/@resvg/resvg-wasm/index_bg.wasm"
			);
			await initWasm(wasmBuffer);
			wasmInitialized = true;
		} catch (e) {
			console.error(
				"Failed to load WASM via fs, trying fallback if any (unlikely in SSG)"
			);
			throw e;
		}
	}

	const fontData = await readFile(
		"./node_modules/@fontsource/roboto-slab/files/roboto-slab-latin-700-normal.woff"
	);

	const markup = html`
		<div
			style="
        display: flex;
        height: 100%;
        width: 100%;
        background-color: #f6f3eb;
        color: #333;
        font-family: 'Roboto Slab', serif;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
        position: relative;
      "
		>
			<div
				style="
          display: flex;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 10px;
          background: linear-gradient(90deg, #ff5a00 0%, #ff9e00 100%);
        "
			></div>

			<div
				style="display: flex; flex-direction: column; align-items: center; gap: 20px;"
			>
				<div
					style="
            display: flex;
            align-items: center;
            justify-content: center; 
            padding: 10px 24px;
            background-color: rgba(255, 90, 0, 0.1);
            color: #ff5a00;
            border-radius: 9999px;
            font-size: 24px;
            font-weight: 700;
            gap: 12px;
            border: 1px solid rgba(255, 90, 0, 0.2);
          "
				>
					<div
						style="
              display: flex;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: #22c55e;
            "
					></div>
					$9.99 Total Revenue in 2026
				</div>

				<h1
					style="
            display: flex;
            font-size: 80px;
            font-weight: 900;
            margin: 0;
            text-align: center;
            line-height: 1.1;
            color: #333;
          "
				>
					Michael C.
				</h1>

				<div
					style="display: flex; font-size: 32px; color: #666; font-weight: 500;"
				>
					Solo Founder & Astro Developer
				</div>
			</div>

			<div
				style="display: flex; position: absolute; bottom: 40px; font-size: 24px; color: #aaa;"
			>
				captmichael.dev
			</div>
		</div>
	`;

	const svg = await satori(markup as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "Roboto Slab",
				data: fontData,
				weight: 700,
				style: "normal",
			},
		],
	});

	const resvg = new Resvg(svg);
	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();

	return new Response(pngBuffer as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
