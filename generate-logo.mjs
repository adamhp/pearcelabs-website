import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import satori from "satori";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontDir = (p) => join(__dirname, "node_modules", p);

const sg900 = readFileSync(
  fontDir(
    "@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-900-normal.woff",
  ),
);

const BG = "#F7F6F2";
const INK = "#0C0C0A";
const ACCENT = "#973c00";
const FONT_SIZE = "350px";

const tree = {
  type: "div",
  props: {
    style: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      width: "512px",
      height: "512px",
      background: BG,
    },
    children: [
      // {
      //   type: "div",
      //   props: {
      //     style: {
      //       right: "50px",
      //       position: "absolute",
      //       height: "100vh",
      //       border: "1px solid red",
      //     },
      //   },
      // },
      // {
      //   type: "div",
      //   props: {
      //     style: {
      //       left: "50px",
      //       position: "absolute",
      //       height: "100vh",
      //       border: "1px solid red",
      //     },
      //   },
      // },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          },
          children: [
            {
              type: "span",
              props: {
                style: {
                  fontFamily: "Schibsted Grotesk",
                  fontWeight: 900,
                  fontSize: FONT_SIZE,
                  lineHeight: 1,
                  color: INK,
                },
                children: "p",
              },
            },
            {
              type: "span",
              props: {
                style: {
                  fontFamily: "Schibsted Grotesk",
                  fontWeight: 900,
                  fontSize: FONT_SIZE,
                  lineHeight: 1,
                  color: ACCENT,
                },
                children: "l",
              },
            },
          ],
        },
      },
    ],
  },
};

const svg = await satori(tree, {
  width: 512,
  height: 512,
  fonts: [
    { name: "Schibsted Grotesk", data: sg900, weight: 900, style: "normal" },
  ],
});

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync("public/logo.png", png);
console.log("✓ public/logo.png written");
