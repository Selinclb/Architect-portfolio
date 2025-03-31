let particles = [];
let nameText = "FULYA AKIN";
let textPoints = [];
let isAnimating = true;
let fontSize = 140;

function getResponsiveFontSize() {
    if (windowWidth <= 480) {
        return 65;
    } else if (windowWidth <= 768) {
        return 100;
    } else if (windowWidth <= 1200) {
        return 120;
    }
    return 140;
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '1');
    
    // Text ayarları
    fontSize = getResponsiveFontSize();
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    
    // Noktaları oluştur
    createTextPoints();
}

function createTextPoints() {
    textPoints = [];
    let resolution = windowWidth <= 768 ? 15 : 12; // Mobile'da daha az nokta
    let textW = textWidth(nameText);
    let textH = fontSize;
    let startX = width/2 - textW/2;
    let startY = height/2.5 - textH/2;
    
    // Grid içinde noktalar oluştur
    for(let x = startX; x < startX + textW; x += resolution) {
        for(let y = startY; y < startY + textH; y += resolution) {
            if(random() < (windowWidth <= 768 ? 0.2 : 0.3)) { // Mobile'da daha az nokta
                let particle = {
                    pos: createVector(random(width), random(height)),
                    target: createVector(x, y),
                    vel: createVector(0, 0),
                    acc: createVector(0, 0),
                    type: floor(random(4))
                };
                textPoints.push(particle);
            }
        }
    }
}

function draw() {
    clear();
    
    // Grid çiz
    stroke(200, 50);
    strokeWeight(0.5);
    let gridSize = windowWidth <= 768 ? 30 : 50; // Mobile'da daha küçük grid
    
    for(let x = 0; x < width; x += gridSize) {
        line(x, 0, x, height);
    }
    for(let y = 0; y < height; y += gridSize) {
        line(0, y, width, y);
    }
    
    // Ana metni çiz
    fill(0);
    noStroke();
    textSize(fontSize);
    text(nameText, width/2, height/2.5);
    
    // Noktaları çiz ve animasyonla hareket ettir
    for(let p of textPoints) {
        if(isAnimating) {
            let dir = p5.Vector.sub(p.target, p.pos);
            dir.mult(0.1);
            p.vel.add(dir);
            p.vel.mult(0.95);
            p.pos.add(p.vel);
        }
        
        push();
        translate(p.pos.x, p.pos.y);
        
        // Farklı mimari elementler çiz
        stroke(0, 150);
        let elementSize = windowWidth <= 768 ? 0.7 : 1; // Mobile'da daha küçük elementler
        strokeWeight(1.5 * elementSize);
        
        switch(p.type) {
            case 0: // Kare
                noFill();
                rect(-4 * elementSize, -4 * elementSize, 8 * elementSize, 8 * elementSize);
                break;
            case 1: // Artı
                line(-5 * elementSize, 0, 5 * elementSize, 0);
                line(0, -5 * elementSize, 0, 5 * elementSize);
                break;
            case 2: // Daire
                noFill();
                circle(0, 0, 8 * elementSize);
                break;
            default: // Nokta
                strokeWeight(2 * elementSize);
                point(0, 0);
        }
        
        pop();
    }
}

function mousePressed() {
    // Noktaları rastgele konumlara dağıt
    for(let p of textPoints) {
        p.pos = createVector(random(width), random(height));
        p.vel = createVector(0, 0);
    }
    isAnimating = true;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    fontSize = getResponsiveFontSize();
    createTextPoints();
}

// Portfolio yazısı animasyonu
document.addEventListener('DOMContentLoaded', () => {
    const portfolioText = document.querySelector('.portfolio-text');
    const text = portfolioText.textContent;
    portfolioText.textContent = '';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.animation = `fadeInChar 0.1s forwards`;
        span.style.animationDelay = `${index * 0.1 + 0.5}s`;
        portfolioText.appendChild(span);
    });
}); 