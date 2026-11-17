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

  const dimensions = { width: 600, height: 400 };
  const floor = { x: 286, y: 105, tileX: 21.3, tileY: 10.9, width: 12.45, depth: 11.25 };
  const spawn = { x: 6.5, y: 5.6 };
  const targets = {
    rest: { position: { x: 3.5, y: 6.2 }, rect: [158, 170, 165, 106], label: "침대", intent: "낮잠 자기", color: "#f5a9ce" },
    desk: { position: { x: 5.1, y: 3.3 }, rect: [361, 125, 101, 76], label: "책상", intent: "지원 준비", color: "#a9dbff" },
    meal: { position: { x: 8.5, y: 5.2 }, rect: [417, 213, 109, 78], label: "식탁", intent: "집밥 먹기", color: "#ffcf8d" },
    walk: { position: { x: 10.9, y: 2.2 }, rect: [525, 185, 69, 99], label: "현관", intent: "동네 산책", color: "#a9ebcc" },
    decorate: { position: { x: 8.0, y: 2.8 }, rect: [454, 142, 66, 86], label: "옷장", intent: "방 꾸미기", color: "#c7b5fa" },
  };

  const themes = {
    mint: { label: "민트 소다", left: "#b9e8ce", right: "#ffe5ca", pattern: "#fff0d4", stripe: "#a5dcbc", rug: ["#efb3e8", "#d68bcf", "#f9d4f1"] },
    peach: { label: "복숭아 우유", left: "#fbc5cb", right: "#ffe3bd", pattern: "#fff4d7", stripe: "#f4b7c8", rug: ["#f5b1a4", "#df8b81", "#ffe1bd"] },
    lavender: { label: "라벤더 사탕", left: "#d7c8f5", right: "#e9dafa", pattern: "#fff0ff", stripe: "#c7b6ed", rug: ["#b0ddd4", "#7dbfb6", "#d6f5de"] },
  };

  const lineColor = "#655675";
  const wooden = { top: "#fbd3a1", near: "#e6a57e", far: "#bd8190" };
  const ivory = { top: "#fff5dc", near: "#ead9bf", far: "#c8aac3" };
  const pink = { top: "#ffd1eb", near: "#ec9fcb", far: "#c580b0" };
  const violet = { top: "#d9c3ff", near: "#b8a0ed", far: "#8e7dc6" };
  const mint = { top: "#d3f7d8", near: "#93d9b3", far: "#68bda5" };

  function project(x, y, z = 0) {
    return [floor.x + (x - y) * floor.tileX, floor.y + (x + y) * floor.tileY - z];
  }

  function floorPoint(x, y) {
    const across = (x - floor.x) / floor.tileX;
    const down = (y - floor.y) / floor.tileY;
    const point = { x: (down + across) / 2, y: (down - across) / 2 };
    return point.x >= .35 && point.y >= .35 && point.x <= floor.width - .3 && point.y <= floor.depth - .3 ? point : null;
  }

  function positionFor(action) {
    if (targets[action]) return { ...targets[action].position };
    if (action === "shift") return { ...targets.walk.position };
    if (action && !["fandom", "upload"].includes(action)) return { ...targets.desk.position };
    return { ...spawn };
  }

  function paint(ctx) {
    function trace(points) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (const [x, y] of points.slice(1)) ctx.lineTo(x, y);
      ctx.closePath();
    }
    function poly(points, fill, stroke, width = 1) {
      trace(points);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.stroke();
      }
    }
    function line(points, color, width = 1) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (const [x, y] of points.slice(1)) ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }
    function rect(x, y, w, h, fill) {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, w, h);
    }
    function oval(x, y, rx, ry, color, stroke) {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    function gradient(from, to, y1 = 0, y2 = dimensions.height) {
      const fill = ctx.createLinearGradient(0, y1, 0, y2);
      fill.addColorStop(0, from);
      fill.addColorStop(1, to);
      return fill;
    }
    return { ctx, trace, poly, line, rect, oval, gradient };
  }

  function square(x, y, w, d, z = 0) {
    return [project(x, y, z), project(x + w, y, z), project(x + w, y + d, z), project(x, y + d, z)];
  }

  function box(p, x, y, w, d, z, h, palette, stroke = lineColor) {
    const [a, b, c, e] = square(x, y, w, d, z);
    const [at, bt, ct, et] = square(x, y, w, d, z + h);
    p.poly([e, c, ct, et], palette.near, stroke);
    p.poly([b, c, ct, bt], palette.far, stroke);
    p.poly([at, bt, ct, et], palette.top, stroke);
  }

  function leftFace(start, end, bottom, top, x = 0) {
    return [project(x, start, top), project(x, end, top), project(x, end, bottom), project(x, start, bottom)];
  }

  function rightFace(start, end, bottom, top, y = 0) {
    return [project(start, y, top), project(end, y, top), project(end, y, bottom), project(start, y, bottom)];
  }

  function sparkle(p, x, y, size, color) {
    p.poly([[x - size,y],[x - 1,y - 1],[x,y - size],[x + 1,y - 1],[x + size,y],
      [x + 1,y + 1],[x,y + size],[x - 1,y + 1]], color);
  }

  function cloud(p, x, y, scale = 1, color = "#fffdf0") {
    p.oval(x, y, 27 * scale, 7 * scale, color);
    p.oval(x - 9 * scale, y - 5 * scale, 13 * scale, 10 * scale, color);
    p.oval(x + 6 * scale, y - 5 * scale, 12 * scale, 8 * scale, color);
  }

  function outlinePlant(p, x, y, scale = 1, bloom = false) {
    p.ctx.save();
    p.ctx.translate(x, y);
    p.ctx.scale(scale, scale);
    p.oval(0, 1, 18, 6, "#59456726");
    p.poly([[-12,-15],[12,-15],[9,0],[-9,0]], "#eb9d78", lineColor);
    p.oval(0, -15, 13, 4, "#ffc39d", lineColor);
    p.oval(0, -15, 8, 2, "#88657a");
    p.line([[0,-16],[-1,-38],[-4,-45]], "#598773", 2);
    p.poly([[0,-29],[-15,-33],[-20,-42],[-11,-40],[-3,-35]], "#81d794", "#598d76");
    p.poly([[1,-32],[12,-49],[19,-49],[14,-39],[5,-33]], "#a0e68e", "#628f68");
    p.poly([[0,-24],[16,-32],[21,-30],[12,-24]], "#72c7a2", "#5a9a81");
    if (bloom) {
      p.oval(-4, -45, 5, 5, "#ff9bbb");
      p.oval(-7, -48, 3, 3, "#ffe796");
    }
    p.ctx.restore();
  }

  function wallWindow(p, dark, phase) {
    p.poly(leftFace(2, 6.7, 23, 83, .09), "#ffbd9f", lineColor, 1.6);
    const glass = leftFace(2.25, 6.43, 27, 80, .14);
    p.ctx.save();
    p.trace(glass);
    p.ctx.clip();
    p.rect(110, 10, 144, 156, dark ? "#7b8ed5" : "#a9e5ff");
    if (dark) {
      p.oval(173, 70, 13, 13, "#fff0a3");
      p.oval(178, 65, 12, 12, "#7b8ed5");
      for (const [x,y] of [[153,78],[194,59],[165,105],[209,58]]) sparkle(p, x, y, 3, "#fff1b9");
    } else {
      cloud(p, 148 + phase * 7, 97, .63);
      cloud(p, 208 - phase * 7, 68, .63);
    }
    const skyline = dark ? "#6267aa" : "#8dadd0";
    for (const [x,h] of [[134,17],[148,26],[163,18],[182,32],[201,23],[220,35],[238,21]]) {
      p.rect(x, 131 - h, 11, h, skyline);
      p.rect(x + 2, 134 - h, 2, 2, dark ? "#ffdf87" : "#f6f3e5");
      p.rect(x + 6, 135 - h, 2, 2, dark ? "#ffe58c" : "#e4e9f6");
    }
    p.ctx.restore();
    p.poly(glass, null, "#9d7d9b");
    p.poly(leftFace(4.25, 4.45, 26, 80, .19), "#ffcfac", "#aa83a3");
    p.poly(leftFace(2.17, 6.48, 49, 52, .2), "#ffdbb4", "#aa83a3");
    p.poly(leftFace(1.95, 6.77, 81, 85, .17), "#ad7fb4", lineColor);
    p.poly(leftFace(1.95, 6.78, 22, 25, .19), "#ffe2be", lineColor);
    for (const [start, end] of [[2.0,2.77],[5.91,6.69]]) {
      const top = leftFace(start, end, 34, 82, .26);
      p.poly([top[0],top[1],[top[2][0]+5,top[2][1]-6],[top[3][0]-3,top[3][1]+3]], "#f8a9cb", "#ba83b2");
      p.poly(leftFace(start + .1, start + .23, 43, 82, .3), "#ffe0e8");
      p.poly(leftFace(start + .1, end - .05, 43, 46, .32), "#ffdd89");
    }
  }

  function door(p) {
    p.poly(rightFace(10.22, 12.08, 0, 75, .15), "#b28dc8", lineColor, 1.5);
    p.poly(rightFace(10.39, 11.93, 1, 70, .21), "#ffdabf", lineColor);
    p.poly(rightFace(10.56, 11.78, 18, 63, .24), "#ffeacc", "#dca792");
    p.poly(rightFace(10.64, 11.7, 23, 58, .25), "#ecc1c6");
    const [x,y] = project(11.6, .26, 28);
    p.oval(x, y, 3.2, 3.2, "#f9cb68", lineColor);
    p.oval(x - 1, y - 1, 1, 1, "#fff1b9");
    p.poly(square(10.13, .72, 1.95, 1.04, .6), "#96b8eb", "#82799b");
    p.poly(square(10.27, .84, 1.69, .79, .68), "#bedcf8", "#a99acc");
  }

  function roomBase(p, theme, dark, phase) {
    const sky = dark ? ["#8194d3","#b797da"] : ["#bcefff","#f7d8f1"];
    p.rect(0, 0, dimensions.width, dimensions.height, p.gradient(...sky));
    p.oval(151, 343, 191, 47, dark ? "#9a92ce" : "#d4dafc");
    p.oval(492, 356, 152, 42, dark ? "#9a92ce" : "#e8c4ee");
    cloud(p, 95 + phase * 14, 70, 1.28, dark ? "#bac1ed" : "#fffdf2");
    cloud(p, 481 - phase * 15, 72, .92, dark ? "#bec1eb" : "#fffdf4");
    cloud(p, 562, 108, .55, dark ? "#bdbbe9" : "#fffdf4");
    for (const [x,y,s] of [[55,104,5],[135,45,4],[515,47,6],[552,303,5],[69,318,4]]) sparkle(p, x, y, s, "#fff5ce");

    p.poly(leftFace(0, floor.depth, 0, 93), theme.left, lineColor, 1.8);
    p.poly(rightFace(0, floor.width, 0, 93), theme.right, lineColor, 1.8);
    for (let i = .18; i < floor.depth; i += .67) {
      p.poly(leftFace(i, Math.min(i + .12, floor.depth), 6, 91, .02), theme.stripe);
    }
    for (let x = .55; x < floor.width; x += .67) {
      for (const z of [27, 48, 70]) {
        const [px,py] = project(x, .04, z + (Math.round(x) % 2) * 3);
        sparkle(p, px, py, 3, theme.pattern);
      }
    }
    p.poly(leftFace(0, floor.depth, 0, 6, .04), "#d4a5b3", "#95778f");
    p.poly(rightFace(0, floor.width, 0, 6, .04), "#e6adab", "#95778f");
    p.line([project(0, floor.depth, 93),project(0,0,93),project(floor.width,0,93)], "#fff4e6", 2.3);
    p.line([project(0,0,91),project(0,0,4)], "#967b9e", 1.4);
    wallWindow(p, dark, phase);
    door(p);

    const jamb = rightFace(6.95, 8.27, 57, 78, .12);
    p.poly(jamb, "#dca2be", lineColor);
    p.poly(rightFace(7.06, 8.16, 59, 76, .13), "#fff3d9");
    const [fx,fy] = project(7.62,.15,68);
    p.poly([[fx-7,fy+5],[fx+1,fy-4],[fx+9,fy+8]], "#a8d7b7");
    p.oval(fx + 4, fy - 2, 2, 2, "#ffcc79");

    box(p, 0, 0, floor.width, floor.depth, -8, 8,
      { top: "#efd3af", near: "#c787a7", far: "#a788c0" });
    const colors = ["#f9d4aa","#f4c8a4","#ffe0b4","#f2c4a8"];
    for(let y = 0, row = 0; y < floor.depth; y += .48, row++){
      const depth = Math.min(.48, floor.depth - y);
      p.poly(square(0, y, floor.width, depth, .08), colors[row % colors.length], "#dca98f", .6);
      for(let x = .9 + (row % 3) * .74; x < floor.width; x += 2.8){
        p.line([project(x,y,.1),project(x,y+depth,.1)], "#d3a389", .55);
        p.line([project(x+.15,y+.13,.14),project(Math.min(x+.72,floor.width),y+.13,.14)], "#fff2c755", .7);
      }
    }
    p.poly(square(0,0,floor.width,floor.depth,.14), null, "#875f83", 1.1);
    const rug = theme.rug;
    p.poly(square(3.25, 3.25, 5.76, 5.23, .23), "#91789b36");
    p.poly(square(3.31, 3.28, 5.55, 4.98, .7), rug[1], "#a476aa");
    p.poly(square(3.51, 3.48, 5.15, 4.54, .75), rug[2]);
    p.poly(square(3.74, 3.72, 4.68, 4.06, .8), rug[0], "#fff1f48c");
    for (const [x,y] of [[4.2,4.22],[7.8,4.28],[4.22,7.3],[7.88,7.28],[5.99,5.78]]) {
      const [sx,sy] = project(x,y,.86);
      sparkle(p, sx, sy, x === 5.99 ? 13 : 7, "#fff2df");
    }
    for (let i=0;i<10;i++){
      const x=3.49+i*.51;
      p.line([project(x,8.28,.5),project(x,8.48,.5)], rug[2], 1.5);
    }
  }

  function bookshelf(p) {
    box(p, .45, .5, 2.03, .92, 0, 47, violet);
    p.poly(rightFace(.62,2.31,9,43,1.45), "#8d74a2", lineColor);
    for (const height of [12,25,40]) box(p,.48,.49,1.99,.98,height,2.25,ivory);
    const colors = ["#f1adba", "#9ed2f1", "#fcce84", "#c6aded", "#aee9c7"];
    for(const [row,level] of [14.25,27.25].entries()){
      for(let i=0;i<5;i++){
        const shade = colors[(i+row)%colors.length];
        box(p,.64+i*.28,.87,.23,.44,level,7+(i*3+row)%4,
          {top:"#fff1cf",near:shade,far:shade});
      }
    }
    const [x,y] = project(1.9,.79,48);
    outlinePlant(p,x,y,.51,true);
  }

  function bed(p, profile, action, walking, time) {
    box(p,.52,4.2,2.85,4.57,1,10,pink);
    box(p,.49,4.13,2.91,.26,1,38,violet);
    box(p,.51,4.16,2.86,.3,39,3,pink);
    box(p,.57,8.66,2.85,.31,0,15,violet);
    box(p,.62,4.46,2.66,4.2,11,6,ivory);
    box(p,.83,4.55,2.25,1.02,17,4,{top:"#fff7e4",near:"#f5d3d9",far:"#e2bbc9"});
    box(p,.7,5.66,2.54,2.93,16,4,pink);
    p.poly(square(.78, 5.66, 2.35, .53, 20.15), "#fff1dd", "#da9cbb");
    for (let y=6.32;y<8.455;y+=.62){
      for (let x=.96;x<3.15;x+=.54) {
        const [sx,sy] = project(x,y,20.3);
        p.oval(sx,sy,2.2,1.35,"#fff0e6");
      }
    }
    if(action === "rest" && !walking){
      const [sx,sy] = project(1.85,5.04,26);
      p.oval(sx,sy,15,10,profile.gender === "male" ? "#694469" : "#49304c", "#503b63");
      p.oval(sx+2,sy+2,11,6,"#ffcaab");
      p.line([[sx+3,sy+2],[sx+8,sy+2]], "#65405e", 1.5);
      p.ctx.save();
      p.ctx.font = "bold 11px monospace";
      p.ctx.fillStyle = "#8869bc";
      p.ctx.fillText("z",sx+13,sy-12-(Math.floor(time/180)%6));
      p.ctx.font = "bold 13px monospace";
      p.ctx.fillText("Z",sx+22,sy-19-(Math.floor(time/180)%6));
      p.ctx.restore();
    }
  }

  function desk(p, action, time) {
    for (const [x,y] of [[3.7,.74],[6.3,.74],[3.7,1.98],[6.3,1.98]]) box(p,x,y,.22,.23,0,24,wooden);
    box(p,3.49,.54,3.12,1.84,23,5,wooden);
    box(p,4.15,.82,1.53,.84,28,4,violet);
    box(p,4.23,.83,1.36,.71,31,18,ivory);
    p.poly(rightFace(4.38,5.47,33,46,1.57),"#6d789e",lineColor);
    p.poly(rightFace(4.45,5.42,34,45,1.59),
      ["letter","portfolio","research","coding","upload","reporting"].includes(action) ? "#9ff0d3" : "#a8d9f2");
    for (const [x,y,z] of [[4.53,1.6,42],[4.53,1.6,39],[4.53,1.6,36]]) {
      p.line([project(x,y,z),project(x+.48,y,z)], "#658aab", 1.15);
    }
    if(Math.floor(time/480)%2) {
      const [x,y] = project(5.3,1.61,35);
      p.rect(x,y,2,2,"#f7ffda");
    }
    box(p,4.14,1.78,1.52,.39,28,2.8,violet);
    box(p,5.94,.8,.43,.43,28,1.7,mint);
    const [lampX,lampY] = project(6.13,1.02,30);
    p.line([[lampX,lampY],[lampX,lampY-18]], "#8c769f", 2);
    p.poly([[lampX-8,lampY-21],[lampX+2,lampY-26],[lampX+11,lampY-20],[lampX+8,lampY-16],[lampX-9,lampY-17]], "#ffe195", lineColor);
    p.oval(lampX+1,lampY-18,7,2,"#fff1bd");
    chair(p,5.02,2.77,mint);
  }

  function chair(p, x, y, palette) {
    for (const [dx,dy] of [[0,0],[.63,0],[0,.65],[.63,.65]]) box(p,x+dx,y+dy,.12,.13,0,9,wooden);
    box(p,x-.04,y-.03,.85,.88,9,3,palette);
    box(p,x-.04,y+.73,.85,.16,10,15,palette);
  }

  function wardrobe(p) {
    box(p,7.71,.35,1.7,.76,0,52,violet);
    p.poly(rightFace(7.82,8.53,8,46,1.16),"#e5c9fb","#987eac");
    p.poly(rightFace(8.57,9.26,8,46,1.16),"#e5c9fb","#987eac");
    for(const x of [8.42,8.67]) {
      const [px,py] = project(x,1.18,27);
      p.oval(px,py,2,2,"#fff0a6","#987eac");
    }
    box(p,7.64,.31,1.84,.86,52,4,pink);
  }

  function rice(p, x, y, scale = 1) {
    p.oval(x,y+1,10*scale,3*scale,"#7f78b1");
    p.oval(x,y-2,10*scale,4*scale,"#c6c5fb",lineColor);
    p.oval(x,y-4,7.7*scale,3.3*scale,"#fff9e6");
  }

  function dining(p, serving, time) {
    chair(p,9.61,3.6,pink);
    chair(p,8.09,4.96,violet);
    const [x,y] = project(9.16,4.23,27);
    const [baseX,baseY] = project(9.16,4.23,0);
    p.oval(baseX,baseY,44,12,"#68456b28");
    box(p,8.93,4.0,.47,.46,0,26,wooden);
    p.oval(x,y+3,40,15,"#c389a2",lineColor);
    p.oval(x,y,40,14,"#ffe3ac",lineColor);
    p.oval(x-9,y-2,17,7,"#ffccce");
    rice(p,x-4,y-3);
    p.oval(x-21,y,8,3.3,"#fff2e2",lineColor);
    p.oval(x-21,y-1,4.2,1.8,"#e59e76");
    p.oval(x+17,y-7,5.5,2.7,"#f0a3aa",lineColor);
    p.rect(x+13,y-15,8,8,"#f6b4ba");
    p.line([[x+17,y-13],[x+20,y-21]],"#894e89",1.2);
    if(serving){
      const shift=Math.floor(time/100)%9;
      p.line([[x-1,y-10-shift],[x+1,y-15-shift],[x-2,y-19-shift]],"#fff9eeaa",1.5);
      p.line([[x+6,y-9-shift],[x+7,y-13-shift],[x+5,y-17-shift]],"#fff9eeaa",1.2);
    }
  }

  function radio(p) {
    box(p,4.1,9.2,2.2,.95,0,16,wooden);
    p.poly(rightFace(4.28,6.12,4,13,10.2),"#d99aa3","#986a8b");
    const [x,y]=project(5.3,10.22,8);
    p.oval(x,y,3,1.6,"#fff0ca");
    box(p,4.67,9.32,1.1,.62,16,13,mint);
    p.poly(rightFace(4.8,5.62,18,26,9.97),"#8da1cb",lineColor);
    p.line([project(4.8,9.96,26.3),project(4.38,9.96,34)],"#8f7a98",1.3);
    p.line([project(5.5,9.98,20.5),project(4.96,9.98,20.5)],"#deffdc",1.5);
  }

  function avatar(p, x, y, profile, options = {}) {
    const time = options.time ?? 0;
    const moving = options.moving ?? false;
    const action = options.action;
    const shortHair = profile.gender === "male";
    const hair = shortHair ? "#583c54" : "#4b3353";
    const shine = shortHair ? "#93616d" : "#7e5273";
    const shirt = shortHair ? "#8ed7c1" : "#f49ebb";
    const trim = shortHair ? "#55acaa" : "#ca73a7";
    const phase = Math.floor(time/105)%2;
    const blink = Math.floor(time/160)%29===23;
    const scale=options.scale ?? 1;
    const rise=moving ? phase*2 : Math.round(Math.sin(time/340));

    if(!options.portrait) p.oval(x,y-1,22*scale,6*scale,"#54466b42");
    p.ctx.save();
    p.ctx.translate(Math.round(x),Math.round(y-rise));
    p.ctx.scale((options.facing === -1 ? -1 : 1)*scale,scale);

    // Low-resolution sprite with deliberately stepped corners and warm cheek highlights.
    p.poly([[-15,-39],[-18,-46],[-18,-57],[-14,-66],[-8,-71],[6,-72],[16,-67],[20,-57],
      [18,-43],[shortHair?15:20,-34],[10,-35],[0,-38],[-9,-34],[-16,-35]],hair,"#3e304a",1.5);
    if(!shortHair) {
      p.poly([[-16,-49],[-22,-42],[-21,-26],[-15,-25],[-10,-34],[-10,-47]],hair,"#3e304a");
      p.poly([[15,-49],[21,-43],[23,-26],[17,-25],[11,-34],[10,-47]],hair,"#3e304a");
      p.rect(-21,-40,5,3,"#f5c490");
      p.rect(17,-41,5,3,"#f5c490");
    }
    const left=-10+(moving&&phase?2:0);
    const right=3+(moving&&!phase?2:0);
    p.poly([[left,-13],[left+7,-13],[left+7,-3],[left+3,-1],[left-2,-2]],"#7a75ac","#4d4265");
    p.poly([[right,-13],[right+7,-13],[right+9,-4],[right+7,-1],[right+1,-2]],"#7a75ac","#4d4265");
    p.rect(left-2,-4,8,4,"#fff0d4");
    p.rect(right+1,-4,8,4,"#fff0d4");
    p.poly([[-4,-37],[6,-37],[13,-31],[15,-20],[12,-11],[-12,-11],[-14,-20],[-12,-30]],
      shirt,"#594263",1.4);
    p.rect(-9,-16,18,3,trim);
    p.rect(2,-28,4,4,"#fff2ac");
    p.poly([[-12,-28],[-17+(moving?phase*2:0),-24],[-15,-16],[-10,-18]],trim,"#594263");
    p.poly([[12,-29],[17-(moving?phase*2:0),-24],[15,-16],[10,-19]],trim,"#594263");
    p.rect(-16,-20,4,4,"#ffccac");
    p.rect(12,-20,4,4,"#ffccac");
    p.poly([[-5,-39],[5,-39],[5,-33],[0,-31],[-5,-33]],"#f4b394","#a06a7d");
    p.poly([[-15,-54],[-11,-60],[10,-60],[16,-53],[15,-43],[11,-36],[4,-33],[-5,-34],[-12,-39],[-15,-47]],
      "#ffcfac","#9e647b",1.2);
    p.poly([[-17,-56],[-13,-65],[-6,-68],[6,-68],[14,-64],[18,-58],[17,-49],[10,-52],[6,-59],
      [2,-55],[-9,-56],[-13,-48],[-16,-49]],hair);
    p.poly([[-13,-62],[-6,-66],[6,-66],[12,-63],[1,-63],[-4,-61]],shine);
    if(!shortHair) sparkle(p,12,-57,4,"#ffe19d");
    p.rect(-9,-50,3,blink?1:6,"#4d3851");
    p.rect(7,-50,3,blink?1:6,"#4d3851");
    if(!blink) {
      p.rect(-8,-49,1,2,"#fff9f0");
      p.rect(8,-49,1,2,"#fff9f0");
    }
    p.rect(-12,-42,5,2,"#ef98a3");
    p.rect(8,-42,5,2,"#ef98a3");
    p.line([[-2,-41],[0,-39],[3,-41]],"#a76072",1.5);
    if(action === "meal" && !moving) rice(p,1,-19,.83);
    if(action === "practice" && !moving) {
      p.oval(14,-27,4,5,"#7e73ae","#503b63");
      p.rect(13,-24,2.5,8,"#62518a");
    }
    if(action === "shift" && !moving) {
      p.poly([[9,-23],[20,-23],[21,-10],[9,-10]],"#dcac8c",lineColor);
      p.line([[12,-23],[12,-27],[17,-27],[17,-23]],lineColor,1.3);
    }
    p.ctx.restore();
  }

  function park(p, state, time) {
    p.rect(0,0,dimensions.width,dimensions.height,p.gradient("#a5e5ff","#f8e9f7"));
    p.oval(478,79,34,34,"#fff5b3");
    cloud(p,105+(time/1000)%19,58,1.18);
    cloud(p,350,103,1.07);
    p.oval(131,265,242,154,"#c3ebbe");
    p.oval(456,259,270,133,"#a4dbab");
    p.rect(0,223,dimensions.width,177,p.gradient("#b8e9ac","#81ceac",223,400));
    p.poly([[0,288],[136,259],[411,262],[600,306],[600,370],[410,314],[149,310],[0,357]],"#fbd8a6","#e2af96");
    const trees=[[65,257,1],[151,228,.81],[468,238,.92],[548,274,1.14]];
    for(const [x,y,scale] of trees){
      p.ctx.save();
      p.ctx.translate(x,y);
      p.ctx.scale(scale,scale);
      p.oval(0,2,29,8,"#739c9e57");
      p.poly([[-8,-2],[8,-2],[9,-83],[-9,-83]],"#b78c8b","#8b7180");
      p.oval(-2,-91,42,34,"#73c3a5","#5f9e92");
      p.oval(-13,-104,30,25,"#8bd9ae");
      p.oval(17,-82,25,20,"#7dccad");
      p.oval(-20,-108,10,4,"#ace4b7");
      p.ctx.restore();
    }
    p.poly([[440,273],[514,273],[514,286],[440,286]],"#e2a98d","#846581");
    p.poly([[445,249],[509,249],[509,269],[445,269]],"#ffd3a1","#846581");
    p.line([[448,258],[506,258]],"#b3818a",1.4);
    p.line([[454,268],[454,297]],"#936c82",4);
    p.line([[502,268],[502,297]],"#936c82",4);
    for(const [x,y] of [[34,366],[104,343],[155,378],[231,333],[391,362],[547,377],[568,286]]){
      p.line([[x,y],[x,y-8]],"#6da48b",1.5);
      p.oval(x,y-9,3,3,"#ffb3c9");
      p.oval(x,y-9,1,1,"#fff0a2");
    }
    const step = ((time / 1000) % 5);
    avatar(p, 240 + step*28, 305, state.profile, {time,moving:true,scale:1.13});
  }

  function drawRoom(canvas, state, visual = {}) {
    const { time = 0, position = spawn, moving = false, facing = 1, outside = false } = visual;
    const action = state.lastAction;
    const p = paint(canvas.getContext("2d"));
    p.ctx.lineJoin = "round";
    if(outside) {
      park(p,state,time);
      return;
    }
    const theme = themes[visual.theme] ?? themes.mint;
    roomBase(p, theme, state.slots === 0, Math.sin(time/2200));
    const objects = [
      {depth:2.6,draw:()=>bookshelf(p)},
      {depth:7.2,draw:()=>desk(p,action,time)},
      {depth:9.8,draw:()=>wardrobe(p)},
      {depth:10.5,draw:()=>bed(p,state.profile,action,moving || visual.roaming,time)},
      {depth:13.2,draw:()=>outlinePlant(p,...project(1.6,10.12),.88,true)},
      {depth:14.3,draw:()=>dining(p,action==="meal" && !moving && !visual.roaming,time)},
      {depth:14.88,draw:()=>radio(p)},
      {depth:19.85,draw:()=>outlinePlant(p,...project(9.4,9.4),1.04,true)},
    ];
    if(action !== "rest" || moving || visual.roaming){
      const [x,y] = project(position.x,position.y,0);
      objects.push({
        depth:position.x+position.y,
        draw:()=>avatar(p,x,y,state.profile,{time,moving,facing,action:moving || visual.roaming ? "" : action,scale:1.17}),
      });
    }
    objects.sort((a,b)=>a.depth-b.depth).forEach(({draw})=>draw());
  }

  function drawPortrait(canvas, profile, time) {
    const p = paint(canvas.getContext("2d"));
    p.ctx.clearRect(0,0,canvas.width,canvas.height);
    p.oval(canvas.width/2,canvas.height/2,32,27,"#fff6d9");
    avatar(p,canvas.width/2,canvas.height-4,profile,{time,scale:.84,portrait:true});
    sparkle(p,14,18,4,"#ffcc81");
    sparkle(p,69,32,3,"#eeb2f3");
  }

  root.JobArt = { drawIcon, drawRoom, drawPortrait, dimensions, targets, themes, spawn, floorPoint, positionFor };
})(globalThis);
