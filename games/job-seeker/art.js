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
    leaf: [[11,2,3,2],[9,3,4,2],[7,5,6,2],[5,6,5,2],[11,6,2,2],[5,8,3,2],[9,8,3,2],[4,10,6,2],[3,12,2,2]],
  };

  function drawIcon(canvas, name) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 16, 16);
    ctx.fillStyle = getComputedStyle(canvas).color;
    for (const shape of icons[name] ?? icons.star) ctx.fillRect(...shape);
  }

  function drawRoom(canvas, state, frame = 0) {
    const ctx = canvas.getContext("2d");
    const action = state.lastAction;
    const night = state.slots === 0 && action !== "walk";
    const ink = "#624c72";
    const rect = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    const box = (x, y, w, h, color, stroke = ink) => {
      rect(x, y, w, h, stroke);
      rect(x + 2, y + 2, w - 4, h - 4, color);
    };
    const steps = (x, y, rows, color) => {
      rows.forEach(([offset, width], index) => rect(x + offset, y + index, width, 1, color));
    };

    function cloud(x, y, color) {
      rect(x, y + 7, 38, 8, color);
      rect(x + 5, y + 4, 28, 10, color);
      rect(x + 13, y, 13, 9, color);
    }

    function plant(x, y) {
      box(x - 7, y - 9, 16, 10, "#ea957b", "#986a76");
      rect(x, y - 24, 2, 15, "#607d5d");
      rect(x - 8, y - 22, 8, 5, "#7bb68b");
      rect(x - 6, y - 18, 6, 3, "#88c698");
      rect(x + 2, y - 24, 7, 5, "#72a783");
      rect(x + 2, y - 16, 9, 4, "#8cbd87");
    }

    function bedroom() {
      rect(0, 0, 360, 104, night ? "#b2a1d4" : "#bcdccf");
      for (let stripe = 4; stripe < 360; stripe += 20) {
        rect(stripe, 0, 3, 100, night ? "#c2acd8" : "#c9e6d3");
        rect(stripe + 5, 7, 1, 2, night ? "#c2acd8" : "#e2f0d5");
      }
      rect(0, 87, 360, 11, night ? "#a38eb6" : "#c2bca9");
      rect(0, 87, 360, 2, night ? "#d2b9db" : "#e9e3c2");
      rect(0, 97, 360, 67, night ? "#ba8e98" : "#e9bd91");
      rect(0, 103, 360, 2, "#cd9d88");
      rect(0, 126, 360, 2, "#d4a488");
      rect(0, 151, 360, 2, "#d2a084");
      for (let seam = 9; seam < 360; seam += 52) {
        rect(seam, 105, 2, 20, "#d7a889");
        rect(seam + 19, 128, 2, 22, "#d7a889");
      }

      box(113, 10, 112, 71, "#fcdbad");
      box(121, 16, 96, 54, night ? "#8e82b9" : "#9dcef3", "#9e7788");
      rect(123, 52, 92, 16, night ? "#b49bc5" : "#bbdcee");
      if (night) {
        rect(188, 24, 11, 11, "#ffe6a4");
        rect(192, 22, 8, 8, "#8e82b9");
        for (const [x, y] of [[133,31], [164,25], [177,37], [205,21]]) rect(x, y, 2, 2, "#fff3b8");
      } else {
        cloud(129, 27, "#f8f5e5");
        cloud(176, 37, "#e7efed");
      }
      for (const [x, y, w] of [[123,56,14], [139,58,12], [154,52,12], [169,59,11], [183,54,13], [198,58,17]]) {
        rect(x, y, w, 68 - y, night ? "#7578a6" : "#90aed0");
        rect(x + 2, y + 3, 2, 2, night ? "#f3dc9c" : "#dce6ed");
        rect(x + 6, y + 3, 2, 2, night ? "#f3dc9c" : "#dce6ed");
      }
      rect(166, 16, 5, 55, "#bb8896");
      rect(167, 16, 2, 55, "#fad4aa");
      rect(110, 73, 119, 6, "#976f8c");
      rect(110, 73, 119, 2, "#f8d4a7");
      for (const x of [105, 217]) {
        rect(x, 9, 15, 46, "#947397");
        rect(x + 2, 10, 12, 44, "#e9a0a5");
        rect(x + 4, 10, 3, 43, "#ffc0b7");
        rect(x + 10, 10, 2, 39, "#e18fa6");
        rect(x - 1, 46, 17, 4, "#f5d69b");
      }

      box(32, 19, 27, 33, "#fff2c5");
      rect(34, 21, 23, 6, "#d490a4");
      for (let row = 0; row < 3; row++) {
        for (let day = 0; day < 7; day++) rect(36 + day * 3, 31 + row * 5, 2, 2, "#b693a0");
      }
      rect(36 + ((state.day - 1) % 7) * 3, 31 + Math.floor((state.day - 1) / 7) * 5, 2, 2, "#8053a1");

      rect(265, 44, 66, 4, "#956f90");
      rect(268, 46, 59, 3, "#d1a6a7");
      const bookColors = ["#85accb", "#f6b28f", "#a990ca", "#eac77d", "#9ac2a3"];
      bookColors.forEach((color, index) => {
        const height = 12 + (index * 7) % 11;
        box(270 + index * 7, 44 - height, 7, height, color, "#8b7193");
        rect(271 + index * 7, Math.floor(41 - height / 3), 5, 2, "#f4dbb4");
      });
      plant(319, 44);

      // Bed, woven rug and desk.
      box(9, 76, 11, 49, "#bf8f98");
      box(13, 90, 85, 29, "#f4c7c8");
      box(18, 89, 26, 15, "#fff0d8");
      box(43, 93, 57, 24, "#c0a4de");
      rect(45, 95, 52, 5, "#d8bde9");
      rect(45, 113, 52, 2, "#a78dc8");
      for (let x = 51; x < 97; x += 12) rect(x, 101, 4, 4, "#e7cbed");
      rect(15, 119, 5, 9, "#8b6580");
      rect(91, 118, 5, 9, "#8b6580");

      rect(107, 139, 135, 18, "#ac89bf");
      rect(111, 135, 127, 23, "#b990c6");
      rect(115, 137, 119, 18, "#e2b2dc");
      rect(121, 139, 108, 2, "#f4c9e6");
      rect(121, 151, 108, 2, "#f4c9e6");

      box(231, 91, 99, 11, "#eab58f", "#875d74");
      rect(237, 102, 6, 35, "#ab7885");
      rect(320, 102, 6, 35, "#ab7885");
      rect(244, 115, 74, 2, "#cc9a9a");
      box(247, 65, 42, 26, "#a6cfe0", "#7e657e");
      rect(252, 70, 31, 3, "#e9f2de");
      rect(252, 76, 19, 2, "#6c9aaa");
      rect(252, 81, 25, 2, "#6c9aaa");
      rect(243, 91, 51, 3, "#8a7e9d");
      if (state.application?.status === "invited" || state.outcome?.type === "offer") {
        box(264, 74, 17, 11, "#fff0ab", "#a382a1");
        rect(268, 77, 9, 2, "#d2a175");
      }
      box(307, 82, 9, 9, "#f5c1c3", "#9a788b");
      rect(315, 84, 4, 5, "#9a788b");
      rect(316, 85, 2, 2, "#e9c8a7");
      plant(345, 142);
    }

    function park() {
      rect(0, 0, 360, 164, "#b5dff2");
      cloud(42, 14, "#fdf4df");
      cloud(226, 23, "#fdf4df");
      rect(307, 12, 20, 20, "#fff1b1");
      rect(311, 8, 12, 28, "#fff1b1");
      rect(0, 66, 360, 98, "#b1d490");
      rect(0, 79, 360, 8, "#c0dda0");
      rect(0, 110, 360, 36, "#efd4a5");
      rect(0, 110, 360, 3, "#e1b68f");
      rect(0, 143, 360, 3, "#e1b68f");
      for (const [x, y] of [[40,69],[89,85],[278,82],[327,63]]) {
        rect(x - 3, y - 15, 7, 32, "#a37c78");
        rect(x - 22, y - 42, 42, 30, "#7aaa83");
        rect(x - 15, y - 49, 29, 41, "#91c283");
        rect(x - 11, y - 47, 19, 14, "#add58d");
        rect(x - 20, y - 24, 35, 11, "#83b081");
      }
      box(235, 92, 52, 8, "#f1bc8b", "#967281");
      rect(239, 100, 4, 15, "#967281");
      rect(279, 100, 4, 15, "#967281");
      for (const [x, y] of [[17,105],[121,90],[181,100],[211,89],[54,153],[299,155],[331,102]]) {
        rect(x, y, 2, 6, "#6ca881");
        rect(x - 2, y - 1, 6, 3, "#f9c299");
      }
    }

    function applicant(x, y) {
      const shortHair = state.profile?.gender === "male";
      const hair = shortHair ? "#58465a" : "#4c3b59";
      const hairLight = shortHair ? "#786078" : "#705574";
      const shirt = shortHair ? "#83b7aa" : "#e8a0b5";
      const shirtDark = shortHair ? "#61988f" : "#bf7e9d";
      const walk = action === "walk";
      const wink = frame % 10 === 8;
      const step = walk && frame % 2 ? 2 : 0;

      ctx.save();
      ctx.translate(x, y - step);
      ctx.scale(2, 2);
      rect(-4, 34 + step / 2, 36, 3, walk ? "#cba797" : "#b78cae");
      rect(3, 32, 7, 4, "#625475");
      rect(18 + step, 31, 7, 4, "#625475");
      rect(3, 34, 8, 2, "#fcdeb3");
      rect(18 + step, 34, 8, 2, "#fcdeb3");
      if (!shortHair) {
        rect(-1, 11, 7, 16, hair);
        rect(23, 10, 7, 17, hair);
        rect(25, 20, 3, 6, hairLight);
      }
      box(4, 21, 20, 12, shirt, ink);
      rect(6, 29, 16, 3, shirtDark);
      rect(12, 22, 4, 6, "#f9c6a5");
      rect(2, 23, 4, 6, shirtDark);
      rect(23, 23, 4, 6, shirtDark);
      rect(2, 29, 4, 2, "#f4b499");
      rect(23, 29, 4, 2, "#f4b499");

      rect(3, 0, 23, 21, hair);
      rect(1, 4, 27, 12, hair);
      rect(5, 2, 19, 4, hairLight);
      rect(4, 8, 21, 11, "#f5be9f");
      rect(6, 17, 17, 5, "#f5be9f");
      rect(8, 22, 13, 1, "#aa7485");
      rect(5, 7, 7, 4, hair);
      rect(21, 6, 4, 6, hair);
      rect(13, 6, 8, 2, hair);
      if (shortHair) rect(4, 4, 6, 2, hair);
      else rect(24, 6, 2, 2, "#f5d783");
      rect(8, 13, 2, wink ? 1 : 3, "#594456");
      rect(19, 13, 2, wink ? 1 : 3, "#594456");
      rect(6, 17, 3, 2, "#e89391");
      rect(20, 17, 3, 2, "#e89391");
      rect(13, 18, 3, 1, "#ac6d79");

      if (action === "meal") {
        rect(7, 26, 15, 2, "#f8e9c4");
        rect(8, 28, 13, 4, "#fff2d1");
        rect(10, 32, 9, 1, "#9b7889");
        rect(17, 23 - step, 2, 4, "#fff5df");
      } else if (action === "shift") {
        box(21, 24, 10, 10, "#e7b487");
        rect(24, 22, 4, 2, ink);
      } else if (action === "practice") {
        rect(20, 19, 4, 5, "#706784");
        rect(21, 23, 2, 6, "#8e7394");
      } else if (["letter", "portfolio", "study"].includes(action)) {
        box(5, 25, 17, 8, "#fff0ba");
        rect(12, 27, 2, 4, "#d6a7a4");
      }
      ctx.restore();
    }

    if (action === "walk") {
      park();
      applicant(124 + frame % 8 * 8, 59);
    } else {
      bedroom();
      if (action === "rest") {
        rect(22, 94, 21, 9, "#6a5269");
        rect(25, 96, 17, 7, "#f5be9f");
        rect(28, 99, 5, 1, "#6a5269");
        const rise = frame % 3 * 3;
        steps(50, 80 - rise, [[0,5],[3,2],[2,2],[1,2],[0,5]], "#785b9d");
        steps(62, 69 - rise, [[0,5],[3,2],[2,2],[1,2],[0,5]], "#9470b0");
      } else {
        const x = ["letter", "portfolio", "study"].includes(action) ? 191 : 151;
        applicant(x, 65);
      }
    }
  }

  root.JobArt = { drawIcon, drawRoom };
})(globalThis);
