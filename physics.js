const fr = 300
const px_m = 5
let g = 9.81
const bounce = .75

g_acc = 0

let obj = [
  {
    id: 0,
    size: 25,
    x: 200,
    y: 310,
    dx: -0.000001,
    dy: 0,
    color: "#00FFFF"
  },
  {
    id: 1,
    size: 25,
    x: 300,
    y: 300,
    dx: -0.5,
    dy: 0,
    color: "#00A0FF"
  }
]

const obst = [
  {
    x0: 100,
    y0: 800,
    x1: 400,
    y1: 700 
  },
  {
    x0: 50,
    y0: 600,
    x1: 75,
    y1: 900 
  }
]

function hit_obst(ob){
  for(let o of obst){
    let [distance, rdx, rdy] = reflect_angle(ob, o)
    if(distance > ob.size/2) continue
    
    let overlap = ob.size/2 - distance
    let speed = Math.sqrt(ob.dx*ob.dx + ob.dy*ob.dy)
    
    ob.dx = rdx*speed*bounce
    ob.dy = rdy*speed*bounce
    
    ob.x += rdx*overlap
    ob.y += rdy*overlap
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW){
    g = -g
    g_acc = (g * px_m) / fr
  }
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW){
    g_acc = 0
  }
}

function hit_obj(ob){
  
  for(let i = ob.id; i < obj.length; i++){
    let ext_ob = obj[i]
    
    // check for contact
    if(ob == ext_ob) continue
    
    let distance = Math.sqrt((ext_ob.x - ob.x)**2 + (ext_ob.y - ob.y)**2)
    
    let [dx, dy] = normalize_delta((ext_ob.x - ob.x), (ext_ob.y - ob.y))
    
    // line(ob.x, ob.y, ob.x+dx*50, ob.y+dy*50)
    
    if (distance > ob.size) continue
    let overlap = ob.size - distance
    
    let kin = Math.abs(ob.dx) + Math.abs(ext_ob.dx) + Math.abs(ob.dy) + Math.abs(ext_ob.dy)
    
    ext_dx = ext_ob.dx
    ext_dy = ext_ob.dy
    
    ext_ob.dx += (ob.dx + dx) * bounce
    ext_ob.dy += (ob.dy + dy) * bounce
    
    ob.dx -= (ob.dx + dx) * bounce
    ob.dy -= (ob.dy + dy) * bounce
    
    ob.dx += (ext_dx + -dx) * bounce
    ob.dy += (ext_dy + -dy) * bounce
    
    ext_ob.dx -= (ext_dx + -dx) * bounce
    ext_ob.dy -= (ext_dy + -dy) * bounce
    
    let new_kin = Math.abs(ob.dx) + Math.abs(ext_ob.dx) + Math.abs(ob.dy) + Math.abs(ext_ob.dy)
    
    ob.dx *= kin/new_kin
    ob.dy *= kin/new_kin
    
    ext_ob.dx *= kin/new_kin
    ext_ob.dy *= kin/new_kin
    
    ob.x += -dx*overlap/2
    ob.y += -dy*overlap/2
    
    ext_ob.x += dx*overlap/2
    ext_ob.y += dy*overlap/2


  }
}

function draw_obj(ob){
  fill(ob.color)
  circle(ob.x, ob.y, ob.size)
}

function draw_obst(){
  for(let o of obst){
    line(o.x0, o.y0, o.x1, o.y1)
  }
}
  
function normalize_delta(dx, dy){
  unit = Math.sqrt((dx)*(dx) + (dy)*(dy))
  return [dx/unit, dy/unit]
}

function reflect_angle(ob, obs){
  
  // equation for the line 
  // get formula for the line
  la = -(obs.y1 - obs.y0)/(obs.x1 - obs.x0)
  lb = -(obs.y0 + (la * obs.x0))
  
  // right angle line
  let [dx, dy] = normalize_delta(-(obs.y0 - obs.y1), obs.x0 - obs.x1)
    
  // right angle equation
  pa = -dy/dx
  pb = -(ob.y + (pa * ob.x))  
  
  // get intersection point right angle
  ix = (lb-pb)/(pa-la)
  iy = -(pa*ix+pb)
    
  // get formula attack line
  pda = -ob.dy/ob.dx
  pdb = -(ob.y + (pda * ob.x))  
  
  // get intersection point reflection
  rx = (lb-pdb)/(pda-la)
  ry = -(pda*rx+pdb)
    
  // virtual point
  vx = ob.x - (ob.x-ix)*2
  vy = ob.y - (ob.y-iy)*2
  
  // calc unit delta for reflection
  let [udx, udy] = normalize_delta(rx - vx, ry - vy)
  
  // debug
//   line(rx, ry, rx+(udx*200), ry+(udy*200))
    
//   fill('#00FF00')
//   circle(vx, vy, 10)
    
//   fill('#FFFF00')
//   circle(rx, ry, 10)
//   line(ob.x, ob.y, rx, ry)
    
//   fill('#FF0000')
//   circle(ix, iy, 10)
//   line(ob.x, ob.y, ix, iy)
  
  // get distance and reflection unit vector
  let distance = Math.sqrt((ob.x - ix)*(ob.x - ix) + (ob.y - iy)*(ob.y - iy))
  if(isNaN(distance)) distance = Infinity
  if(isNaN(udx)) udx = 0
  if(isNaN(udy)) udy = 0
  return [distance, udx, udy]
}

function apply_f(ob){
  ob.dy += g_acc
  ob.y += ob.dy
  ob.x += ob.dx
}


function mouseClicked() {
  obj.push(
    {
      id: obj.length,
      size: 25,
      x: mouseX,
      y: mouseY,
      dx: 0.0001,
      dy: 0,
      color: "#00A0FF"
    }
  )
}

function setup() {
  createCanvas(500, 1000)
  frameRate(fr)
  background(220)
  g_acc = (g * px_m) / fr
}

function draw() {
  background(220)
  for(let ob of obj){
    apply_f(ob)
    draw_obj(ob)
    hit_obst(ob)
    hit_obj(ob)
  }
  draw_obst()
}
