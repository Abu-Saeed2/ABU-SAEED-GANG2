const { createCanvas, loadImage } = require("canvas");
const path = require("path");

/**
 * @param {Array} sprays [{ x, y, color }]
 * @param {Boolean} showNumbers
 * @returns {Object} { buffer, width, height }
 */
module.exports = async (sprays = [], showNumbers = false) => {
  const img = await loadImage(path.join(__dirname, "../assets/map.png"));

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);

  sprays.forEach((s, i) => {
    const radius = 8;

    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (showNumbers) {
      const text = String(i + 1);

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillText(text, s.x + 1, s.y + 1);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, s.x, s.y);
      ctx.restore();
    }
  });

  return {
    buffer: canvas.toBuffer(),
    width: img.width,
    height: img.height
  };
};