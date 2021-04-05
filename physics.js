const fr = 120
const px_m = 5
let g = 3
const bounce = .8

g_acc = 0

let obj = [
  {
    id: 0,
    size: 25,
    x: 300,
    y: 250,
    dx: 0,
    dy: 0.5,
    color: "#00A0FF"
  },
  {
    id: 1,
    size: 25,
    x: 279,
    y: 300,
    dx: 0,
    dy: 0.3,
    color: "#00FFFF"
  },
]

const obst = [
  {
    x0: 50,
    y0: 0,
    x1: 0,
    y1: 1000 
  },
  {
    x0: 500,
    y0: 0,
    x1: 0,
    y1: 20 
  },
  {
    x0: 450,
    y0: 1000,
    x1: 500,
    y1: 0 
  },
  {
    x0: 0,
    y0: 1000,
    x1: 500,
    y1: 980 
  },
]

function hit_obst(ob){
  for(let o of obst){
    
    let distance = line_point_distance(ob, o)
    if(Math.abs(distance) > ob.size/2) continue
    let overlap = ob.size/2 - Math.abs(distance)
    
    // get normal vector
    let [nx, ny] = normalize_vector(-(o.y0 - o.y1), o.x0 - o.x1)
    
    // if on other side of wall, reverse normal
    // console.log(distance)
    
    // get approaching speed 
    let vx = Math.abs(ob.dx)
    let vy = Math.abs(ob.dy)
    
    // magnitude resulting force
    let f = Math.abs(vx * nx + vy * ny)
    
    // split into parts and apply direction
    let fx = f * nx * bounce
    let fy = f * ny * bounce

    // apply forces
    ob.dx += fx*2
    ob.dy += fy*2
    
    // remove overlap
    ob.x += nx*overlap
    ob.y += ny*overlap
  }
}

function line_point_distance(ob, obs){
  // line equation
  la = -(obs.y1 - obs.y0)/(obs.x1 - obs.x0)
  lb = -(obs.y0 + (la * obs.x0))
  
  // normal vector
  let [dx, dy] = normalize_vector(-(obs.y0 - obs.y1), obs.x0 - obs.x1)
    
  // normal equation
  pa = -dy/dx
  pb = -(ob.y + (pa * ob.x))  
  
  // calculate intersection point
  ix = (lb-pb)/(pa-la)
  iy = -(pa*ix+pb)
  
  // calcutale distance object and intersection point
  return Math.sqrt((ob.x - ix)*(ob.x - ix) + (ob.y - iy)*(ob.y - iy))
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
  // let every object collide with every other object once
  for(let i = ob.id; i < obj.length; i++){
    let ext_ob = obj[i]
    
    if(ob == ext_ob) continue
    
    let distance = Math.sqrt((ext_ob.x - ob.x)**2 + (ext_ob.y - ob.y)**2)
    if (distance > (ob.size/2)+(ext_ob.size/2)) continue
    let overlap = ob.size - distance
    
    // normal vetor collision plane
    let [nx, ny] = normalize_vector((ob.x - ext_ob.x), (ob.y - ext_ob.y))
    
    // get approaching speed 
    let vx = Math.abs(ob.dx - ext_ob.dx)
    let vy = Math.abs(ob.dy - ext_ob.dy)
    
    // magitude resulting force
    let f = Math.abs(vx * nx + vy * ny)
    
    // split into parts and apply direction
    let fx = f * nx * bounce
    let fy = f * ny * bounce
        
    // apply forces
    ob.dx += fx
    ob.dy += fy
    ext_ob.dx -= fx
    ext_ob.dy -= fy
    
    // remove overlap
    ob.x += nx*overlap/2
    ob.y += ny*overlap/2
    ext_ob.x -= nx*overlap/2
    ext_ob.y -= ny*overlap/2
  }
}

function draw_obj(ob){
  fill(ob.color)
  circle(ob.x, ob.y, ob.size)
}

function draw_obst(o){
  line(o.x0, o.y0, o.x1, o.y1)
  
  let [nx, ny] = normalize_vector(-(o.y0 - o.y1), o.x0 - o.x1)
  let cx = (o.x0 + o.x1)/2
  let cy = (o.y0 + o.y1)/2
  line(cx, cy, cx + nx*20, cy + ny*20)
}
  
function normalize_vector(dx, dy){
  unit = Math.sqrt((dx)*(dx) + (dy)*(dy))
  return [dx/unit, dy/unit]
}

function apply_f(ob){
  ob.dy += g_acc
  ob.y += ob.dy
  ob.x += ob.dx
}


function mouseClicked() {
  for(let i = 0; i < 5; i++)
    obj.push(
      {
        id: obj.length,
        size: 25,
        x: mouseX+25*i,
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
    hit_obj(ob)
    hit_obst(ob)
  }
  for(let o of obst){
    draw_obst(o)
  }
}
