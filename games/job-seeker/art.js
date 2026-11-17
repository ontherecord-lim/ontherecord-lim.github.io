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

  const dimensions = { width: 768, height: 512 };
  const spawn = { x: 352, y: 385 };
  const parents = {
    family: { x: 568, y: 384 },
    father: { x: 267, y: 398 },
  };
  const sleepPosition = { x: 145, y: 210 };
  const targets = {
    rest: { position: { x: 241, y: 291 }, rect: [157, 216, 153, 136], label: "침대", intent: "낮잠 자기", color: "#fdc1b7" },
    desk: { position: { x: 306, y: 270 }, rect: [315, 179, 137, 123], label: "책상", intent: "취업 준비", color: "#b4ead7" },
    decorate: { position: { x: 423, y: 267 }, rect: [422, 166, 73, 104], label: "옷장", intent: "방 꾸미기", color: "#eee0ff" },
    walk: { position: { x: 703, y: 289 }, rect: [699, 164, 76, 145], label: "현관", intent: "동네 산책", color: "#b3e6eb" },
    meal: { position: { x: 485, y: 275 }, rect: [560, 218, 151, 86], label: "식탁", intent: "집밥 먹기", color: "#ffdf89" },
    family: { position: { x: 518, y: 386 }, rect: [568, 353, 64, 76], label: "엄마", intent: "말 걸기", color: "#e3f2a2" },
    father: { position: { x: 315, y: 398 }, rect: [267, 365, 61, 78], label: "아빠", intent: "말 걸기", color: "#bbdde9" },
  };

  const themes = {
    mint: { label: "민트 소다", swatch: "#a4dfc4" },
    peach: { label: "복숭아 우유", swatch: "#f6a790", wall: [255, 210, 191], rug: [233, 145, 125] },
    lavender: { label: "라벤더 사탕", swatch: "#cab3ed", wall: [237, 213, 242], rug: [179, 150, 220] },
  };

  const figureSizes = { male: 66, female: 66, family: 71, father: 73, asleep: 30 };
  const atlasFrames = {
    male: [[262, 78, 469, 478], [263, 552, 470, 963]],
    female: [[654, 104, 866, 479], [652, 580, 867, 961]],
    family: [[1059, 57, 1253, 479], [1059, 534, 1253, 961]],
  };

  const home = loadImage("assets/sunlit-home.webp");
  const park = loadImage("assets/neighborhood-park.webp");
  const cast = loadImage("assets/characters.webp");
  const father = loadImage("assets/father.webp");
  const ready = Promise.allSettled([home, park, cast, father].map((image) => image.decode()));
  const sceneCache = new Map();

  function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  function isLoaded(image) {
    return image.complete && image.naturalWidth > 0;
  }

  function floorPoint(x, y) {
    if (x > 88 && x < 727 && y >= 255 && y < 342) return { x, y };
    if (x > 112 && x < 671 && y >= 342 && y < 477) return { x, y };
    return null;
  }

  function positionFor(action) {
    if (Object.hasOwn(targets, action)) return { ...targets[action].position };
    if (action === "shift") return { ...targets.walk.position };
    if (action && action !== "fandom") return { ...targets.desk.position };
    return { ...spawn };
  }

  function tint(context, bounds, target, referenceLight, includes) {
    const [x, y, width, height] = bounds;
    const sample = context.getImageData(x, y, width, height);
    const pixels = sample.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const [red, green, blue] = [pixels[i], pixels[i + 1], pixels[i + 2]];
      if (!includes(red, green, blue)) continue;
      const light = red * .2126 + green * .7152 + blue * .0722;
      const offset = light - referenceLight;
      for (let channel = 0; channel < 3; channel++) {
        pixels[i + channel] = pixels[i + channel] * .12 + (target[channel] + offset) * .88;
      }
    }
    context.putImageData(sample, x, y);
  }

  function furnishedRoom(key) {
    if (!isLoaded(home) || !themes[key]?.rug) return home;
    if (!sceneCache.has(key)) {
      const canvas = document.createElement("canvas");
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(home, 0, 0);
      const theme = themes[key];
      try {
        const plaster = (r, g, b) => r >= 200 && g >= 165 && b >= 135 && r - g < 54 && g - b < 38 && r - b > 12;
        tint(context, [38, 60, 351, 12], theme.wall, 205, plaster);
        tint(context, [488, 60, 250, 12], theme.wall, 205, plaster);
        tint(context, [258, 226, 107, 45], theme.rug, 156, (r, g, b) => g > r + 17 && b >= r - 8);
      } catch (error) {
        if (error.name !== "SecurityError") throw error;
        // Some browsers restrict reading images when the game is opened from a local file.
      }
      sceneCache.set(key, canvas);
    }
    return sceneCache.get(key);
  }

  function frameFor(variant, step = 0) {
    const [x0, y0, x1, y1] = (atlasFrames[variant] ?? atlasFrames.female)[step];
    const x = Math.floor(x0 / 2) - 1;
    const y = Math.floor(y0 / 2) - 1;
    return { x, y, w: Math.ceil(x1 / 2) - x + 1, h: Math.ceil(y1 / 2) - y + 1 };
  }

  function drawFigure(context, variant, point, { time = 0, facing = 1, moving = false, action } = {}) {
    const image = variant === "father" ? father : cast;
    if (!isLoaded(image)) return;
    const stride = moving ? Math.floor(time / 112) % 4 : 0;
    const frame = variant === "father" ? { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight } : frameFor(variant, stride % 2);
    const height = figureSizes[variant] ?? figureSizes.female;
    const width = Math.round(height * frame.w / frame.h);
    const { x, y } = point;

    context.save();
    context.fillStyle = "#5e603c48";
    context.beginPath();
    context.ellipse(x, y - 1, width * .41, 4, 0, 0, Math.PI * 2);
    context.fill();
    context.translate(Math.round(x), Math.round(y) - (stride % 2));
    context.scale(facing, 1);
    context.drawImage(image, frame.x, frame.y, frame.w, frame.h, -Math.floor(width / 2), -height, width, height);
    if (action === "meal") {
      context.fillStyle = "#8d716b";
      context.fillRect(1, -25, 15, 2);
      context.fillStyle = "#bfeaf0";
      context.fillRect(3, -23, 11, 5);
      context.fillStyle = "#f9f0d7";
      context.fillRect(4, -28, 9, 3);
      context.fillStyle = "#fff9e9";
      context.fillRect(6, -30, 5, 2);
    }
    context.restore();
  }

  function drawRest(context, profile, time) {
    if (!isLoaded(cast)) return;
    const { x, y, w, h } = frameFor(profile.gender);
    const headHeight = Math.round(h * .50);
    const width = 34;
    const height = Math.round(width * headHeight / w);

    context.save();
    context.translate(sleepPosition.x, sleepPosition.y - 3);
    context.rotate(-.10);
    context.drawImage(cast, x, y, w, headHeight, -width / 2, -height, width, height);
    const afloat = Math.floor(time / 240) % 5;
    context.font = "700 15px monospace";
    context.fillStyle = "#825574";
    context.fillText("z", 19, -height + 1 - afloat);
    context.fillText("Z", 30, -height - 7 - afloat);
    context.restore();
  }

  function parkPosition(time) {
    const offset = Math.floor(time / 27) % 248;
    return { x: 337 + (offset < 124 ? offset : 248 - offset), y: 366, facing: offset < 124 ? 1 : -1 };
  }

  function drawRoom(canvas, state, visual = {}) {
    const { time = 0, position = spawn, moving = false, facing = 1, outside = false } = visual;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    const background = outside ? park : home;
    if (!isLoaded(background)) {
      context.fillStyle = "#fff0ad";
      context.fillRect(0, 0, dimensions.width, dimensions.height);
      return;
    }
    if (outside) {
      context.drawImage(park, 0, 0);
      const walker = parkPosition(time);
      drawFigure(context, state.profile.gender, walker, { time, moving: time > 0, facing: walker.facing });
      return;
    }

    context.drawImage(furnishedRoom(visual.theme), 0, 0);
    const action = moving || visual.roaming ? "" : state.lastAction;
    const actors = Object.entries(parents).map(([variant, point]) => ({ variant, point }));
    if (action === "rest") drawRest(context, state.profile, time);
    else actors.push({ variant: state.profile.gender, point: position, options: { time, moving, facing, action } });
    actors.sort((a, b) => a.point.y - b.point.y);
    for (const { variant, point, options } of actors) drawFigure(context, variant, point, options);
  }

  function drawPortrait(canvas, profile) {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!isLoaded(cast)) return;
    const { x, y, w, h } = frameFor(profile.gender);
    const cropHeight = Math.round(h * .58);
    const width = canvas.width - 12;
    const shownHeight = Math.round(width * cropHeight / w);
    context.imageSmoothingEnabled = false;
    context.drawImage(cast, x, y, w, cropHeight, 6, canvas.height - shownHeight, width, shownHeight);
  }

  root.JobArt = {
    drawIcon, drawRoom, drawPortrait, dimensions, targets, themes, spawn, floorPoint, positionFor,
    parents, sleepPosition, figureSizes, parkPosition, ready,
  };
})(globalThis);
