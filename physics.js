const fr = 3000
const px_m = 5
let g = 9.81
const bounce = .8

g_acc = 0

let obj = [
  {
    id: 0,
    size: 30,
    x: 300,
    y: 250,
    dx: 0,
    dy: 0.5,
    color: "#00A0FF"
  },
  {
    id: 1,
    size: 30,
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
    x0: 0,
    y0: 20,
    x1: 500,
    y1: 0 
  },
  {
    x0: 500,
    y0: 0,
    x1: 450,
    y1: 1000 
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
    if(distance > ob.size/2) continue
    let overlap = ob.size/2 - distance
    
    let [nx, ny] = normalize_vector(-(o.y0 - o.y1), o.x0 - o.x1)
            
    let dot = ob.dx*nx + ob.dy*ny
    let vx = -ob.dx + 2*(dot)*nx
    let vy = -ob.dy + 2*(dot)*ny

    ob.dx = -vx*bounce
    ob.dy = -vy*bounce
    
    let [dx, dy] = normalize_vector(vx, vy)
    
    ob.x += -dx*overlap
    ob.y += -dy*overlap
  }
}

function line_point_distance(ob, obs){
  la = -(obs.y1 - obs.y0)/(obs.x1 - obs.x0)
  lb = -(obs.y0 + (la * obs.x0))
  
  // right angle line
  let [dx, dy] = normalize_vector(-(obs.y0 - obs.y1), obs.x0 - obs.x1)
    
  // right angle equation
  pa = -dy/dx
  pb = -(ob.y + (pa * ob.x))  
  
  // get intersection point right angle
  ix = (lb-pb)/(pa-la)
  iy = -(pa*ix+pb)
  
  return Math.abs(Math.sqrt((ob.x - ix)*(ob.x - ix) + (ob.y - iy)*(ob.y - iy)))
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
    
    if(ob == ext_ob) continue
    
    let distance = Math.sqrt((ext_ob.x - ob.x)**2 + (ext_ob.y - ob.y)**2)
    if (distance > (ob.size/2)+(ext_ob.size/2)) continue
    let overlap = ob.size - distance
    
    let [dx, dy] = normalize_vector((ob.x - ext_ob.x), (ob.y - ext_ob.y))
    
    let vx = Math.abs(ob.dx - ext_ob.dx)
    let vy = Math.abs(ob.dy - ext_ob.dy)
    
    m = Math.abs(dx * vx + dy * vy) * bounce
    
    mx = m * dx
    my = m * dy
        
    ob.dx += mx
    ob.dy += my
    
    ext_ob.dx -= mx
    ext_ob.dy -= my
    
    ob.x += dx*overlap/2
    ob.y += dy*overlap/2
    ext_ob.x -= dx*overlap/2
    ext_ob.y -= dy*overlap/2
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
  obj.push(
    {
      id: obj.length,
      size: 20,
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
