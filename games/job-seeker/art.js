(function (root) {
  "use strict";

  const icons = {
    case: [[5,3,6,1],[5,4,1,2],[10,4,1,2],[2,6,12,1],[2,7,1,6],[13,7,1,6],[2,13,12,1],[3,9,10,1],[7,9,2,3]],
    bolt: [[8,1,3,2],[7,3,3,2],[6,5,3,2],[5,7,7,2],[7,9,4,2],[7,11,3,2],[6,13,2,2]],
    heart: [[3,3,4,1],[9,3,4,1],[2,4,6,2],[8,4,6,2],[2,6,12,2],[3,8,10,2],[5,10,6,2],[7,12,2,2]],
    star: [[7,1,2,2],[6,3,4,3],[2,6,12,2],[4,8,8,2],[5,10,6,2],[4,12,3,2],[9,12,3,2]],
    chat: [[3,3,10,1],[2,4,1,7],[13,4,1,7],[3,11,10,1],[4,12,2,1],[3,13,2,1],[5,7,1,1],[8,7,1,1],[11,7,1,1]],
    pen: [[11,2,2,1],[10,3,4,2],[8,5,5,1],[7,6,5,1],[6,7,5,1],[5,8,5,1],[4,9,5,1],[3,10,5,1],[3,11,3,2],[3,13,2,1]],
    folder: [[2,4,6,1],[2,5,1,8],[7,5,2,1],[8,6,6,1],[13,7,1,6],[3,8,10,1],[2,13,12,1]],
    mic: [[6,2,4,1],[5,3,6,6],[6,9,4,1],[3,7,1,4],[12,7,1,4],[4,11,8,1],[7,12,2,2],[5,14,6,1]],
    moon: [[7,2,4,1],[5,3,4,2],[4,5,4,3],[4,8,5,2],[5,10,9,1],[6,11,7,1],[8,12,4,1],[12,3,1,3],[11,4,3,1]],
    people: [[4,3,3,1],[3,4,5,3],[4,7,3,1],[10,4,3,1],[9,5,5,3],[10,8,3,1],[3,9,5,1],[2,10,7,3],[10,10,4,1],[10,11,5,2]],
    camera: [[2,5,8,1],[2,6,1,5],[9,6,1,5],[2,11,8,1],[10,7,2,2],[12,6,2,1],[12,7,2,4],[11,10,2,1],[5,7,2,2]],
    paper: [[4,2,7,1],[3,3,1,10],[11,3,1,2],[12,5,1,8],[4,13,8,1],[9,4,1,2],[10,6,2,1],[5,8,6,1],[5,10,5,1]],
    film: [[2,4,12,1],[2,5,1,8],[13,5,1,8],[2,13,12,1],[3,7,10,1],[5,5,1,2],[8,5,1,2],[11,5,1,2],[6,9,1,3],[7,10,2,1]],
    wallet: [[3,4,9,1],[2,5,1,7],[3,6,10,1],[12,7,1,2],[12,11,1,1],[3,12,10,1],[10,9,5,1],[10,10,1,1],[14,10,1,2],[11,11,3,1]],
    sound: [[2,6,3,4],[5,5,2,6],[7,3,2,10],[11,5,1,1],[12,6,1,4],[11,10,1,1],[13,4,1,2],[14,6,1,4],[13,10,1,2]],
    muted: [[2,6,3,4],[5,5,2,6],[7,3,2,10],[11,6,1,1],[13,6,1,1],[12,7,1,1],[11,8,1,1],[13,8,1,1]],
    envelope: [[2,4,12,1],[2,5,1,7],[13,5,1,7],[2,12,12,1],[3,5,2,1],[5,6,2,1],[7,7,2,1],[9,6,2,1],[11,5,2,1]],
    trophy: [[4,2,8,1],[4,3,1,5],[11,3,1,5],[5,8,6,1],[7,9,2,3],[5,12,6,2],[2,4,2,1],[2,5,1,3],[3,8,2,1],[12,4,2,1],[13,5,1,3],[11,8,2,1]],
    music: [[6,4,8,1],[6,5,8,2],[6,7,1,5],[13,7,1,4],[3,11,4,3],[10,10,4,3]],
    musicOff: [[5,3,9,1],[5,4,1,3],[13,4,1,3],[5,10,1,2],[13,9,1,2],[2,11,4,3],[10,11,4,3],[2,3,1,2],[3,5,2,1],[5,6,2,2],[7,8,2,1],[9,9,1,2],[10,11,1,1]],
    bowl: [[2,8,12,2],[3,10,10,2],[5,12,6,1],[4,14,8,1],[6,3,1,3],[9,2,1,3],[11,4,1,2]],
    house: [[7,2,2,2],[5,4,6,2],[3,6,10,2],[1,8,14,1],[3,9,1,5],[12,9,1,5],[3,13,10,1],[7,9,2,4]],
    leaf: [[11,2,3,2],[9,3,4,2],[7,5,6,2],[5,6,5,2],[11,6,2,2],[5,8,3,2],[9,8,3,2],[4,10,6,2],[3,12,2,2]],
  };

  function drawIcon(canvas, name) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 16, 16);
    ctx.fillStyle = getComputedStyle(canvas).color;
    for (const shape of icons[name] ?? icons.star) ctx.fillRect(...shape);
  }

  const dimensions = { width: 300, height: 200 };
  const spawn = { x: 145, y: 154 };
  const familyPosition = { x: 256, y: 166 };
  const targets = {
    rest: { position: { x: 74, y: 122 }, rect: [41, 94, 54, 61], label: "침대", intent: "낮잠 자기", color: "#f3b6a2" },
    desk: { position: { x: 128, y: 116 }, rect: [130, 83, 61, 37], label: "책상", intent: "취업 준비", color: "#b7dbe9" },
    decorate: { position: { x: 182, y: 117 }, rect: [185, 77, 37, 55], label: "옷장", intent: "방 꾸미기", color: "#e2b3dd" },
    walk: { position: { x: 278, y: 92 }, rect: [278, 54, 34, 55], label: "현관", intent: "동네 산책", color: "#b3dfb1" },
    meal: { position: { x: 226, y: 137 }, rect: [237, 105, 55, 34], label: "식탁", intent: "집밥 먹기", color: "#f8d685" },
    family: { position: { x: 228, y: 162 }, rect: [256, 149, 35, 33], label: "엄마", intent: "말 걸기", color: "#d7df9c" },
  };

  const themes = {
    mint: { label: "민트 소다", left: "#b8d9b5", stripe: "#a9caa5", wallTop: "#e6edc6", rug: ["#326a75", "#68aab1", "#a1d3d1", "#f0e3b4"] },
    peach: { label: "복숭아 우유", left: "#edb7a1", stripe: "#e1a690", wallTop: "#fae3bc", rug: ["#ac6265", "#e3927e", "#ffcb9d", "#fff0ba"] },
    lavender: { label: "라벤더 사탕", left: "#cebade", stripe: "#bca9d6", wallTop: "#f5e4ed", rug: ["#755b91", "#a083b8", "#d7bbdc", "#fff2c7"] },
  };

  const ink = "#5b403a";
  const trim = "#a9714b";
  const fixtures = {
    oak: ["#eaaa70", "#c48253", "#9f643f"],
    pine: ["#f6cc89", "#d99b63", "#a16b47"],
    ivory: ["#fff2c7", "#e5cd9d", "#b4987f"],
    lavender: ["#d4b5d8", "#a477a6", "#775578"],
    blue: ["#8ed0dc", "#529da9", "#386d82"],
  };
  const sprites = {
    male: { hair: "#383042", hairShade: "#262436", hairLight: "#625066", shirt: "#82c5b1", shade: "#459793", trim: "#ffe5bc", pants: "#4d5b83" },
    female: { hair: "#654252", hairShade: "#3f2b42", hairLight: "#a46877", shirt: "#ffe3a9", shade: "#e6a16b", trim: "#fa938f", pants: "#6e567d", ties: true },
    family: { hair: "#513b37", hairShade: "#332f38", hairLight: "#895951", shirt: "#e8eba7", shade: "#9dad68", trim: "#fff0c2", pants: "#745466", bun: true },
  };
  const backdrops = new Map();

  function floorPoint(x, y) {
    return x >= 12 && x <= 288 && y >= 77 && y <= 192 ? { x, y } : null;
  }

  function positionFor(action) {
    if (Object.hasOwn(targets, action)) return { ...targets[action].position };
    if (action === "shift") return { ...targets.walk.position };
    if (action && action !== "fandom") return { ...targets.desk.position };
    return { ...spawn };
  }

  function fill(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  // Square corner cuts and flat shaded faces keep the artwork on the pixel grid.
  function softRect(ctx, x, y, w, h, color) {
    fill(ctx, x + 2, y, w - 4, h, color);
    fill(ctx, x, y + 2, w, h - 4, color);
    fill(ctx, x + 1, y + 1, w - 2, h - 2, color);
  }

  function box(ctx, x, y, w, h, [top, front, edge], depth = 4) {
    fill(ctx, x, y + depth, w, h - depth, ink);
    fill(ctx, x + 1, y + depth, w - 2, h - depth - 1, front);
    for (let step = 0; step < depth; step++) fill(ctx, x + depth - step, y + step, w - 2, 1, top);
    fill(ctx, x + depth, y, w - 2, 1, edge);
    fill(ctx, x + 1, y + depth, w - 2, 1, edge);
    fill(ctx, x + w - 3, y + depth + 1, 2, h - depth - 2, edge);
  }

  function pixelStar(ctx, x, y, color) {
    fill(ctx, x - 2, y, 5, 1, color);
    fill(ctx, x, y - 2, 1, 5, color);
    fill(ctx, x - 1, y - 1, 3, 3, color);
  }

  function plant(ctx, x, y, size = 1) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(size, size);
    fill(ctx, -6, -7, 13, 7, "#875345");
    fill(ctx, -5, -8, 11, 7, "#db8b63");
    fill(ctx, -4, -4, 3, 3, "#f5b281");
    fill(ctx, -7, -9, 15, 2, "#f1a76d");
    fill(ctx, 0, -22, 2, 14, "#4a7751");
    fill(ctx, -6, -20, 7, 3, "#54844f");
    fill(ctx, -9, -22, 8, 3, "#83ad60");
    fill(ctx, -9, -23, 4, 1, "#aecc77");
    fill(ctx, 2, -17, 6, 3, "#558e59");
    fill(ctx, 5, -20, 6, 3, "#99b969");
    fill(ctx, 1, -24, 3, 5, "#66955b");
    fill(ctx, -1, -27, 5, 3, "#a7bf72");
    ctx.restore();
  }

  function windowFrame(ctx, x, y, w) {
    fill(ctx, x - 2, y - 2, w + 4, 36, "#a57451");
    fill(ctx, x, y, w, 32, "#f6d5a1");
    fill(ctx, x + 3, y + 3, w - 6, 26, "#7ac0d7");
    fill(ctx, x + 3, y + 21, w - 6, 8, "#a8d8d8");
    fill(ctx, x + 9, y + 12, 13, 3, "#e7f3d4");
    fill(ctx, x + 11, y + 10, 8, 2, "#eff8df");
    fill(ctx, x + w - 18, y + 7, 9, 2, "#b9e6e3");
    const skyline = ["#79a5ab", "#6899a7", "#95bbae"];
    for (let column = 3; column + 8 < w; column += 7) {
      const height = 4 + column % 8;
      fill(ctx, x + column, y + 29 - height, 6, height, skyline[column % skyline.length]);
      fill(ctx, x + column + 2, y + 31 - height, 2, 2, "#dce2ad");
    }
    fill(ctx, x + Math.floor(w / 2) - 1, y + 1, 3, 29, "#e2b680");
    fill(ctx, x + 2, y + 17, w - 4, 2, "#f2d0a1");
    fill(ctx, x - 4, y + 31, w + 8, 4, "#b97f58");
    fill(ctx, x - 4, y + 31, w + 8, 1, "#f8d2a0");
  }

  function wallClock(ctx) {
    softRect(ctx, 130, 17, 19, 19, "#926453");
    softRect(ctx, 132, 19, 15, 15, "#fceecc");
    fill(ctx, 139, 21, 1, 7, ink);
    fill(ctx, 140, 27, 4, 1, ink);
    fill(ctx, 139, 31, 1, 1, "#b4825d");
    fill(ctx, 134, 26, 1, 1, "#b4825d");
  }

  function framedPhoto(ctx, x, y) {
    box(ctx, x, y, 20, 16, fixtures.pine, 1);
    fill(ctx, x + 3, y + 3, 14, 9, "#d5e1be");
    fill(ctx, x + 3, y + 9, 14, 3, "#9da579");
    fill(ctx, x + 7, y + 6, 4, 5, "#728959");
    fill(ctx, x + 10, y + 4, 4, 2, "#e3bf76");
  }

  function rug(ctx, x, y, colors) {
    const [outline, base, inset, detail] = colors;
    softRect(ctx, x + 1, y + 2, 109, 62, "#a97758");
    softRect(ctx, x, y, 108, 61, outline);
    softRect(ctx, x + 2, y + 2, 104, 57, base);
    softRect(ctx, x + 5, y + 5, 98, 51, inset);
    for (let k = 0; k < 9; k++) {
      fill(ctx, x + 6 + 12 * k, y + 9, 4, 2, detail);
      fill(ctx, x + 6 + 12 * k, y + 49, 4, 2, detail);
    }
    for (const [dx, dy] of [[18, 19], [91, 19], [18, 41], [91, 41], [54, 30]]) {
      pixelStar(ctx, x + dx, y + dy, detail);
    }
  }

  function floorboards(ctx) {
    const planks = ["#e4ad76", "#edb982", "#f0c18a", "#e8b078"];
    for (let y = 69, row = 0; y < dimensions.height; y += 12, row++) {
      fill(ctx, 0, y, 300, 12, planks[row % planks.length]);
      fill(ctx, 0, y, 300, 1, "#ba8258");
      fill(ctx, 0, y + 1, 300, 1, "#ffcf96");
      for (let x = 8 + row % 4 * 15; x < 300; x += 67) {
        fill(ctx, x, y + 2, 1, 10, "#c48a59");
        fill(ctx, x + 2, y + 7, 3 + (x + y) % 11, 1, "#e0a36d");
        fill(ctx, x + 25, y + 9, 8, 1, "#fbd099");
        fill(ctx, x + 38, y + 4, 14, 1, "#daa170");
        fill(ctx, x + 39, y + 5, 4, 1, "#f3c48d");
      }
    }
  }

  function roomBackdrop(ctx, theme) {
    fill(ctx, 0, 0, 300, 200, theme.left);
    fill(ctx, 0, 0, 300, 9, theme.wallTop);
    for (let x = 11; x < 300; x += 14) {
      fill(ctx, x, 9, 2, 55, theme.stripe);
      fill(ctx, x + 6, 34 + x % 7, 2, 2, theme.wallTop);
    }
    floorboards(ctx);
    fill(ctx, 0, 62, 300, 8, trim);
    fill(ctx, 0, 62, 300, 2, "#edc38f");
    fill(ctx, 0, 70, 300, 3, "#c99167");
    fill(ctx, 0, 0, 4, 200, "#ad7c59");
    fill(ctx, 0, 0, 2, 200, "#c79870");
    fill(ctx, 296, 0, 4, 200, "#9d7154");
    fill(ctx, 298, 0, 2, 200, "#bf9065");
    fill(ctx, 1, 196, 298, 4, "#bb865e");
    fill(ctx, 1, 196, 298, 1, "#f3c591");
    windowFrame(ctx, 24, 20, 61);
    windowFrame(ctx, 215, 17, 45);
    wallClock(ctx);
    framedPhoto(ctx, 169, 21);
    framedPhoto(ctx, 193, 27);
    rug(ctx, 91, 122, theme.rug);
    softRect(ctx, 257, 75, 34, 14, "#a57960");
    softRect(ctx, 259, 77, 30, 10, "#cba388");
    for (let x = 261; x < 288; x += 4) fill(ctx, x, 78, 1, 8, "#e5bd9a");
  }

  function doorway(ctx) {
    box(ctx, 266, 22, 32, 54, fixtures.oak, 1);
    fill(ctx, 269, 25, 24, 49, "#bd794f");
    fill(ctx, 271, 27, 20, 47, "#e5a96d");
    fill(ctx, 274, 30, 14, 19, "#f2bc79");
    fill(ctx, 275, 31, 12, 16, "#d99560");
    fill(ctx, 274, 57, 14, 12, "#edb275");
    fill(ctx, 275, 58, 12, 9, "#ce8d5c");
    softRect(ctx, 286, 51, 5, 5, "#a05b39");
    fill(ctx, 287, 52, 3, 2, "#ffdd8b");
  }

  function bookshelf(ctx) {
    box(ctx, 78, 46, 23, 44, fixtures.pine, 3);
    fill(ctx, 81, 51, 15, 37, "#aa724d");
    const covers = ["#758d77", "#d68172", "#eace8b", "#6d9ab1", "#b588b7"];
    for (const shelf of [61, 72, 85]) {
      for (let book = 0; book < 4; book++) {
        const h = 5 + (shelf + book * 4) % 5;
        fill(ctx, 82 + book * 3, shelf - h, 3, h, covers[(shelf + book) % covers.length]);
        fill(ctx, 82 + book * 3, shelf - 3, 2, 1, "#e7d5ad");
      }
      fill(ctx, 81, shelf, 15, 2, "#f0b97e");
    }
  }

  function bed(ctx, profile, sleeping, time) {
    softRect(ctx, 16, 117, 49, 16, "#ba825f");
    box(ctx, 15, 65, 52, 63, fixtures.oak, 6);
    box(ctx, 19, 74, 44, 49, fixtures.ivory, 4);
    softRect(ctx, 22, 76, 38, 14, "#c29583");
    softRect(ctx, 22, 75, 38, 13, "#fff4d5");
    fill(ctx, 25, 84, 31, 1, "#efdec2");
    box(ctx, 19, 89, 44, 30, ["#f4ae9b", "#dd827d", "#b06869"], 3);
    fill(ctx, 21, 90, 39, 3, "#ffe4b8");
    fill(ctx, 21, 114, 38, 2, "#f5aa96");
    for (const dy of [98, 108]) {
      for (let x = 25; x < 59; x += 9) pixelStar(ctx, x + dy % 4, dy, "#ffc8a3");
    }
    if (!sleeping) return;
    const hair = (sprites[profile.gender] ?? sprites.female).hair;
    softRect(ctx, 33, 78, 14, 11, hair);
    softRect(ctx, 35, 82, 11, 7, "#f7c8a3");
    fill(ctx, 36, 85, 3, 1, "#81555a");
    fill(ctx, 42, 85, 3, 1, "#81555a");
    const z = time > 0 ? Math.floor(time / 300) % 4 : 0;
    fill(ctx, 49, 76 - z, 5, 1, "#784e72");
    fill(ctx, 51, 78 - z, 2, 1, "#784e72");
    fill(ctx, 49, 80 - z, 5, 1, "#784e72");
  }

  function workstation(ctx, active, time) {
    fill(ctx, 105, 90, 4, 11, "#84543e");
    fill(ctx, 151, 90, 5, 11, "#84543e");
    box(ctx, 101, 73, 60, 22, fixtures.pine, 7);
    fill(ctx, 104, 84, 54, 1, "#f7cc92");
    box(ctx, 111, 56, 25, 22, fixtures.ivory, 3);
    fill(ctx, 113, 60, 20, 13, "#4d666f");
    fill(ctx, 115, 62, 16, 9, "#81bcce");
    fill(ctx, 116, 63, 8, 1, "#d4eef0");
    fill(ctx, 116, 66, 12, 1, "#a9dee1");
    fill(ctx, 116, 69, 4, 1, "#e7edd2");
    if (active && (time === 0 || Math.floor(time / 280) % 2)) fill(ctx, 122, 69, 3, 1, "#f9f4d6");
    fill(ctx, 121, 77, 6, 3, "#97887e");
    fill(ctx, 116, 80, 16, 2, "#f6e3ba");
    fill(ctx, 113, 83, 22, 4, "#e8dcc0");
    for (let x = 115; x < 134; x += 3) fill(ctx, x, 84, 1, 2, "#af9d90");
    box(ctx, 142, 78, 12, 8, fixtures.blue, 2);
    fill(ctx, 143, 80, 6, 2, "#dee7c6");
    fill(ctx, 147, 65, 2, 13, "#61726a");
    fill(ctx, 143, 63, 8, 3, "#fff8d9");
    fill(ctx, 144, 60, 6, 3, "#f4d78e");
    fill(ctx, 147, 86, 5, 5, "#e9c99c");
    box(ctx, 119, 100, 22, 13, fixtures.blue, 3);
    fill(ctx, 120, 111, 2, 7, "#536d6b");
    fill(ctx, 138, 111, 2, 7, "#536d6b");
  }

  function wardrobe(ctx) {
    box(ctx, 166, 49, 37, 52, fixtures.lavender, 5);
    fill(ctx, 169, 57, 29, 36, "#694c68");
    fill(ctx, 170, 58, 13, 33, "#c29ec8");
    fill(ctx, 184, 58, 13, 33, "#be91bc");
    fill(ctx, 171, 60, 10, 18, "#d6b5d2");
    fill(ctx, 186, 60, 9, 18, "#d3aad0");
    fill(ctx, 180, 77, 2, 4, "#fff0a5");
    fill(ctx, 185, 77, 2, 4, "#fff0a5");
    fill(ctx, 170, 94, 27, 4, "#9e75a5");
    fill(ctx, 180, 95, 7, 1, "#ebcbab");
    fill(ctx, 169, 101, 3, 3, "#714f64");
    fill(ctx, 196, 101, 3, 3, "#714f64");
  }

  function bowl(ctx, x, y, size = 1) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(size, size);
    softRect(ctx, -5, -3, 11, 6, "#8c6d66");
    fill(ctx, -4, -2, 9, 3, "#e2d7af");
    fill(ctx, -3, -4, 7, 2, "#fff6d8");
    fill(ctx, -2, -5, 4, 1, "#f5e4ba");
    ctx.restore();
  }

  function diningTable(ctx, serving, time) {
    for (const x of [217, 255]) fill(ctx, x, 114, 4, 13, "#83593e");
    softRect(ctx, 211, 94, 53, 26, ink);
    softRect(ctx, 212, 94, 51, 23, "#d4975c");
    softRect(ctx, 213, 93, 49, 21, "#f4bf7e");
    fill(ctx, 217, 94, 42, 1, "#ffe0a0");
    fill(ctx, 215, 111, 45, 1, "#edaf74");
    bowl(ctx, 232, 102);
    bowl(ctx, 249, 103);
    fill(ctx, 238, 100, 5, 4, "#e7817b");
    fill(ctx, 239, 99, 3, 2, "#fff0b7");
    fill(ctx, 225, 97, 1, 7, "#a96d46");
    if (serving) {
      const wave = Math.floor(time / 230) % 3;
      fill(ctx, 231, 96 - wave, 1, 3, "#fff5dc");
      fill(ctx, 234, 94 - wave, 1, 3, "#fff5dc");
    }
    box(ctx, 239, 121, 19, 11, fixtures.oak, 3);
  }

  function nightstand(ctx) {
    box(ctx, 17, 151, 28, 22, fixtures.oak);
    fill(ctx, 19, 158, 22, 8, "#d19768");
    fill(ctx, 27, 160, 6, 2, "#f6d090");
    box(ctx, 23, 144, 14, 9, fixtures.blue, 2);
    fill(ctx, 25, 145, 4, 2, "#d8e6b8");
    fill(ctx, 26, 142, 1, 3, "#5e7171");
    fill(ctx, 20, 173, 3, 2, "#9c6649");
    fill(ctx, 39, 173, 3, 2, "#9c6649");
  }

  function sprite(ctx, x, y, variant, { time = 0, moving = false, facing = 1, action = "", portrait = false } = {}) {
    const { hair, hairShade, hairLight, shirt, shade, trim: cuff, pants, ties, bun } = sprites[variant] ?? sprites.female;
    const stride = moving ? Math.floor(time / 100) % 2 : 0;
    const blink = time > 0 && Math.floor(time / 120) % 33 === 29;
    const skin = "#ffd0a4";
    const skinShade = "#c48576";
    const outline = "#352e3f";

    if (!portrait) softRect(ctx, x - 10, y - 3, 21, 6, "#654a4560");
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y) - stride);
    ctx.scale(facing, 1);
    if (bun) {
      softRect(ctx, -4, -36, 9, 7, outline);
      softRect(ctx, -3, -35, 7, 6, hair);
    }
    softRect(ctx, -12, -32, 25, 20, outline);
    softRect(ctx, -11, -31, 23, 19, hair);
    fill(ctx, -9, -30, 17, 2, hairLight);
    fill(ctx, -12, -26, 2, 10, hairShade);
    fill(ctx, 10, -26, 2, 11, hairShade);
    if (ties) {
      softRect(ctx, -14, -21, 7, 10, outline);
      softRect(ctx, 8, -21, 7, 10, outline);
      fill(ctx, -13, -19, 4, 6, hair);
      fill(ctx, 10, -19, 4, 6, hair);
      fill(ctx, -13, -20, 4, 2, "#e49098");
      fill(ctx, 10, -20, 4, 2, "#e49098");
    }

    fill(ctx, -8 + stride, -7, 7, 6 - stride, outline);
    fill(ctx, 2 - stride, -7, 7, 5 + stride, outline);
    fill(ctx, -7 + stride, -6, 5, 3, pants);
    fill(ctx, 3 - stride, -6, 5, 3, pants);
    fill(ctx, -8 + stride, -3 - stride, 7, 2, "#e7d5ba");
    fill(ctx, 2 - stride, -3, 8, 2, "#e7d5ba");
    softRect(ctx, -10, -16, 21, 10, outline);
    softRect(ctx, -9, -15, 19, 8, shirt);
    fill(ctx, -8, -9, 17, 2, shade);
    fill(ctx, -7, -14, 3, 4, cuff);
    fill(ctx, 5, -14, 3, 4, cuff);
    fill(ctx, -10, -12 + stride, 3, 3, skin);
    fill(ctx, 8, -12 - stride, 3, 3, skin);
    fill(ctx, -3, -16, 7, 3, "#e9a78a");
    fill(ctx, -2, -13, 5, 2, "#fff0bf");

    softRect(ctx, -9, -26, 19, 12, skinShade);
    softRect(ctx, -8, -26, 17, 11, skin);
    fill(ctx, -9, -28, 8, 4, hair);
    fill(ctx, -9, -25, 3, 2, hair);
    fill(ctx, 2, -28, 8, 3, hair);
    fill(ctx, 6, -25, 3, 2, hair);
    fill(ctx, -2, -28, 3, 2, hairLight);
    fill(ctx, -5, -23, 2, blink ? 1 : 4, outline);
    fill(ctx, 4, -23, 2, blink ? 1 : 4, outline);
    if (!blink) {
      fill(ctx, -5, -23, 1, 1, "#fff1db");
      fill(ctx, 4, -23, 1, 1, "#fff1db");
    }
    fill(ctx, -8, -19, 3, 1, "#ed9a8d");
    fill(ctx, 6, -19, 3, 1, "#ed9a8d");
    fill(ctx, -1, -18, 3, 1, "#af6e71");
    if (action === "meal") bowl(ctx, 5, -10, 1);
    if (action === "shift") box(ctx, 7, -11, 8, 9, fixtures.oak, 1);
    ctx.restore();
  }

  function sceneImage(key, draw) {
    if (!backdrops.has(key)) {
      const canvas = document.createElement("canvas");
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      draw(canvas.getContext("2d"));
      backdrops.set(key, canvas);
    }
    return backdrops.get(key);
  }

  function tree(ctx, x, y) {
    softRect(ctx, x - 19, y - 6, 39, 11, "#76966e");
    fill(ctx, x - 3, y - 26, 7, 25, "#896747");
    fill(ctx, x - 1, y - 26, 2, 25, "#b38b5d");
    softRect(ctx, x - 18, y - 43, 36, 27, "#437763");
    softRect(ctx, x - 17, y - 45, 33, 20, "#6da477");
    softRect(ctx, x - 11, y - 50, 23, 19, "#7fb584");
    fill(ctx, x - 6, y - 47, 8, 2, "#adcb8b");
    fill(ctx, x - 13, y - 39, 6, 2, "#9dc58a");
    fill(ctx, x + 7, y - 35, 6, 2, "#96bc83");
  }

  function parkBackdrop(ctx) {
    fill(ctx, 0, 0, 300, 200, "#8dbf82");
    fill(ctx, 0, 0, 300, 48, "#75a58b");
    fill(ctx, 0, 0, 300, 28, "#8abcc4");
    fill(ctx, 0, 25, 300, 11, "#a2c7b4");
    fill(ctx, 0, 104, 300, 54, "#cda17c");
    fill(ctx, 0, 110, 300, 42, "#e6c190");
    fill(ctx, 0, 112, 300, 2, "#f1d09a");
    for (let x = 0; x < 300; x += 13) {
      const y = 118 + x % 25;
      fill(ctx, x, y, 5, 1, "#ceb085");
      fill(ctx, x + 7, 173 + x % 14, 2, 2, x % 2 ? "#fbdf93" : "#f2acaa");
      fill(ctx, x + 5, 70 + x % 17, 3, 3, "#a8cc8c");
    }
    for (const [x, y] of [[19, 87], [53, 72], [95, 77], [194, 72], [238, 78], [284, 91]]) tree(ctx, x, y);
    for (const x of [204, 247]) fill(ctx, x, 97, 3, 11, "#6f6053");
    box(ctx, 199, 82, 56, 18, fixtures.oak, 4);
    fill(ctx, 204, 89, 45, 2, "#e4bb8b");
    fill(ctx, 204, 94, 45, 1, "#d6986b");
    softRect(ctx, 17, 159, 60, 28, "#639dad");
    softRect(ctx, 19, 160, 56, 23, "#87c3c5");
    fill(ctx, 25, 166, 28, 1, "#bee4d9");
    fill(ctx, 47, 175, 23, 1, "#b9e0d4");
  }

  function parkPosition(time) {
    const offset = Math.floor(time / 55) % 146;
    return { x: 113 + (offset < 73 ? offset : 146 - offset), y: 143, facing: offset < 73 ? 1 : -1 };
  }

  function drawRoom(canvas, state, visual = {}) {
    const { time = 0, position = spawn, moving = false, facing = 1, outside = false } = visual;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    if (outside) {
      ctx.drawImage(sceneImage("park", parkBackdrop), 0, 0);
      const walker = parkPosition(time);
      sprite(ctx, walker.x, walker.y, state.profile.gender, { time, moving: time > 0, facing: walker.facing });
      return;
    }

    const theme = Object.hasOwn(themes, visual.theme) ? visual.theme : "mint";
    ctx.drawImage(sceneImage(theme, (surface) => roomBackdrop(surface, themes[theme])), 0, 0);
    const action = moving || visual.roaming ? "" : state.lastAction;
    doorway(ctx);
    const fixturesByDepth = [
      { depth: 90, draw: () => bookshelf(ctx) },
      { depth: 101, draw: () => wardrobe(ctx) },
      { depth: 114, draw: () => workstation(ctx, action && position.x === targets.desk.position.x, time) },
      { depth: 128, draw: () => bed(ctx, state.profile, action === "rest", time) },
      { depth: 132, draw: () => diningTable(ctx, action === "meal", time) },
      { depth: 165, draw: () => plant(ctx, 282, 165) },
      { depth: 166, draw: () => sprite(ctx, familyPosition.x, familyPosition.y, "family", { time: time ? time + 450 : 0 }) },
      { depth: 175, draw: () => nightstand(ctx) },
      { depth: 191, draw: () => plant(ctx, 67, 191) },
    ];
    if (action !== "rest") fixturesByDepth.push({
      depth: position.y,
      draw: () => sprite(ctx, position.x, position.y, state.profile.gender, { time, moving, facing, action }),
    });
    fixturesByDepth.sort((a, b) => a.depth - b.depth).forEach(({ draw }) => draw());
  }

  function drawPortrait(canvas, profile, time) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    softRect(ctx, 2, 2, 36, 35, "#ffeabc");
    pixelStar(ctx, 6, 10, "#e6ad69");
    pixelStar(ctx, 34, 22, "#e9aa9e");
    sprite(ctx, 20, 37, profile.gender, { time, portrait: true });
  }

  root.JobArt = { drawIcon, drawRoom, drawPortrait, dimensions, targets, themes, spawn, floorPoint, positionFor, familyPosition, parkPosition };
})(globalThis);
