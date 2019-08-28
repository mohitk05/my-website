export default function sketch(p){
    p.setup = function () {
        p.createCanvas(window.innerWidth * 0.36, window.innerHeight);
    };

    p.draw = function(){
        p.noStroke()
        //p.textFont('Work Sans')
        p.fill('#000')
        p.textSize(50)
        p.text('Mohit Karekar', 20, 120)
    }
}