


/******************************************
作者：张晓雷
邮箱：zhangxiaolei@outlook.com
******************************************/


function draw_Circle(canvas, x, y, r, para = Object.create(null)) {
    canvas.beginPath();
    canvas.lineWidth = para.lineWidth || 1;
    canvas.strokeStyle = para.strokeStyle || "black";
    canvas.moveTo(x + r, y);
    canvas.arc(x, y, r, Math.PI * 2, false);

    if (para.outLine !== 0) {
        canvas.stroke();
    }

    if (para.fillStyle) {
        canvas.fillStyle = para.fillStyle;
        canvas.fill();
    }
}

function draw_Text(canvas, text, x, y, para = Object.create(null)) {
    canvas.beginPath();
    canvas.moveTo(x, y);
    canvas.fillStyle = para.color || "black";
    canvas.font = para.font || "13px Arial";
    canvas.textAlign = para.textAlign || "center";
    canvas.fillText(text, x, y);
    canvas.stroke();
}



function fillZero(arr) {
    let len = arr.length;
    while (len--) {
        arr[len] = 0;
    }
}

function fillList(arr) {
    let len = arr.length;
    while (len--) {
        arr[len] = len + 1;
    }
    arr.reverse();
}

function hanoi(n, list) {
    function H(n, a, b, c) {
        if (n === 1) {
            list.push(a + c);
        } else {
            H(n - 1, a, c, b);
            list.push(a + c);
            H(n - 1, b, a, c);
        }
    }
    H(n, "a", "b", "c")
}

function Fline(canvas, path, width, color) {
    canvas.beginPath();
    canvas.lineWidth = width || "4";
    canvas.strokeStyle = color || "#EEE";
    canvas.lineTo(path[0][0], path[0][1])
    path.shift();
    for (var item of path) {
        canvas.lineTo(item[0], item[1]);
    }
    canvas.stroke();
}


function Fcube(canvas, x, y, w, h, number) {
    canvas.beginPath();
    canvas.fillStyle = "YellowGreen";
    canvas.lineWidth = 1;
    canvas.moveTo(x - (w / 2 - h / 2), y);
    canvas.arc(x - (w / 2 - h / 2), y - h / 2, h / 2, Math.PI * 0.5, Math.PI * 1.5, false);
    canvas.lineTo(x + (w / 2 - h / 2), y - h);
    canvas.arc(x + (w / 2 - h / 2), y - h / 2, h / 2, Math.PI * 1.5, Math.PI * 0.5, false);
    canvas.lineTo(x - (w / 2 - h / 2), y);
    canvas.closePath();
    canvas.fill();

    draw_Circle(canvas, x, y - h / 2, 8, {
        fillStyle: "white",
        outLine: 0
    });

    draw_Text(canvas, number, x - 0.5, y - h / 2 + 5, {
        color: "#555555"
    });
}




var canvas = document.querySelector("#canvas");
var pix = canvas.getContext("2d");



function cover(canvas, select, color) {
    let x, y = 30, w = 200; h = 400;
    if (select === "a") {
        x = 0;
    } else if (select === "b") {
        x = 200;
    } else if (select === "c") {
        x = 400;
    }
    canvas.beginPath();
    canvas.globalAlpha = 0.2
    canvas.fillStyle = color;
    canvas.fillRect(x, y, w, h);
}



function drawTower(x, y, tower) {
    let h = 20;
    let smallWidth = h * 2;
    let smallitem = (180 - smallWidth) / (tower.length - 1);
    let w;
    for (let i = 0; i < tower.length; i++) {
        if (tower[i]) {
            if (tower[i] !== 1) {
                w = smallWidth + smallitem * (tower[i] - 1);
            } else {
                w = smallWidth;
            }
            Fcube(pix, x, y, w, h, tower[i]);
            y = y - h - 1.2;
        }
    }
}

let game_step = 0;


function canvas_display() {
    draw_Text(pix, "第 " + game_step + " 步", 35, 20, {
        color: "#666666",
    });
}

function check_win_(list) {
    if (list[list.length - 1] !== 0) {
        let len = list.length;
        let temp = len;
        while (len--) {
            if (list[len] !== temp - len) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

function check_win(list) {
    if (check_win_(list)) {
        Stop_timer();
        clearInterval(stop_interval);
        draw_Text(pix, "YOU WIN !", 305, 220, {
            font: "35px Arial",
            color: "green"
        })
    }
}

let timer_step = 0;

let timer_stop;

function Game_timer() {
    timer_step += 1;
    pix.clearRect(300, 0, 600, 25);
    pix.globalAlpha = 1;
    draw_Text(pix, timer_step + "秒", 590, 21, {
        color: "blue",
        textAlign: "right"
    })
}

function Run_timer() {
    timer_stop = setInterval(Game_timer, 1000);
}

function Stop_timer() {
    clearInterval(timer_stop);
    timer_step = 0;
}


let tt = Object.create(null);

function refresh(floor) {
    tt.A = new Array(floor);
    tt.B = new Array(floor);
    tt.C = new Array(floor);
    fillList(tt.A);
    fillZero(tt.B);
    fillZero(tt.C);
    tt.list = [];
    hanoi(floor, tt.list);
    screenFresh();
}

let connect = false;

function takeAndPut(towerA, towerB) {

    let i = towerA.length;
    let j = i;
    let tempA = 0, tempA_index = 0;

    if (towerA[0] !== 0) {
        while (i--) {
            if (towerA[i] > 0) {
                tempA = towerA[i];
                tempA_index = i;
                break;
            }
        }
    }

    if (towerB[0] !== 0) {
        while (j--) {
            if (towerB[j] > 0) {
                if (tempA && towerB[j] > tempA) {
                    towerB.splice(j + 1, 1, tempA);
                    towerA.splice(tempA_index, 1, 0);
                    game_step += 1;
                    return;
                } else {
                    connect = true;
                    return;
                }
            }
        }
    } else {
        towerB.splice(0, 1, tempA);
        towerA.splice(tempA_index, 1, 0);
        game_step += 1;
    }
}


function screenFresh() {
    pix.fillStyle = "#FFF"
    pix.globalAlpha = 1;
    pix.clearRect(0, 30, 600, 400);
    Fline(pix, [[100, 400], [100, 100]])
    Fline(pix, [[300, 400], [300, 100]])
    Fline(pix, [[500, 400], [500, 100]])
    drawTower(100, 398, tt.A);
    drawTower(300, 398, tt.B);
    drawTower(500, 398, tt.C);
    pix.clearRect(0, 0, 300, 30);
    canvas_display();
    check_win(tt.C);
}

function displayMode() {
    move_plate(tt.list.shift());
    screenFresh();
}

function game_mode(AB) {
    move_plate(AB)
    screenFresh();
}

function move_plate(AB) {

    if (typeof AB !== "string" && AB.length !== 2) {
        console.warn("move_plate error");
        return;
    }

    switch (AB) {

        case "ac": {
            takeAndPut(tt.A, tt.C);
            break;
        };

        case "ab": {
            takeAndPut(tt.A, tt.B);
            break;
        };

        case "bc": {
            takeAndPut(tt.B, tt.C);
            break;
        };

        case "cb": {
            takeAndPut(tt.C, tt.B);
            break;
        };

        case "ba": {
            takeAndPut(tt.B, tt.A);
            break;
        };

        case "ca": {
            takeAndPut(tt.C, tt.A);
            break;
        };

        default: {
            console.warn(AB + ": move_plate erroe")
        };
    }
}


let cor = new Object(null);

function canvas_mouse_up() {
    if (cor.red || cor.green) {
        cor.red = false;
        cor.green = false;
        screenFresh();
    }
}

let len = function (s) { return s.length };

let move = "";

function pointXY(e) {
    return [e.offsetX, e.offsetY]
}

function canvas_mouse_down(event) {
    //播放模式操作无效

    if (!mode_select[2].checked) {
        return;
    }

    let x = pointXY(event)[0];

    function equal2(m) {
        if (len(m) === 2) {
            game_mode(m);
            move = "";
        }
    }

    if (x < 200) {
        //a

        if (move === "") {
            move = "a";
            if (tt.A[0] === 0) {
                cover(pix, "a", "red")
                move = "";
                cor.red = true;
            } else {
                cover(pix, "a", "green");
            }
        } else if (len(move) === 1 && move !== "a") {

            move += "a";
            equal2(move);

            if (connect) {
                cover(pix, "a", "red");
                connect = false;
                cor.red = true;
            } else {
                cover(pix, "a", "green");
                cor.green = true;
            }

        } else if (move === "a") {
            screenFresh();
            move = "";
        }
    } else if (x > 200 && x < 400) {
        //b
        if (move === "") {
            move = "b";
            if (tt.B[0] === 0) {
                cover(pix, "b", "red")
                move = "";
                cor.red = true;
            } else {
                cover(pix, "b", "green");
            }
        } else if (len(move) === 1 && move !== "b") {

            move += "b";
            equal2(move);

            if (connect) {
                cover(pix, "b", "red");
                connect = false;
                cor.red = true;
            } else {
                cover(pix, "b", "green");
                cor.green = true;
            }

        } else if (move === "b") {
            screenFresh();
            move = "";
        }

    } else if (x > 400) {

        if (move === "") {
            move = "c";
            if (tt.C[0] === 0) {
                cover(pix, "c", "red")
                move = "";
                cor.red = true;
            } else {
                cover(pix, "c", "green");
            }
        } else if (len(move) === 1 && move !== "c") {

            move += "c";
            equal2(move);

            if (connect) {
                cover(pix, "c", "red");
                connect = false;
                cor.red = true;
            } else {
                cover(pix, "c", "green");
                cor.green = true;

            }

        } else if (move === "c") {
            screenFresh();
            move = "";
        }
    }
}

function restartGame (btName) {
    Stop_timer();
    clearInterval(stop_interval);
    tt.gameRunning = false;
    tt.hand = false;
    bt_run.innerText = btName || "开始";
    game_step = 0;
    pix.clearRect(300, 0, 600, 25);
    refresh(parseInt(floor));
}

let mode_select = document.querySelector("#mode_list");

let floor_ele = document.querySelector("#input_floor");

let floor = parseInt(floor_ele.value);

refresh(parseInt(floor_ele.value));

let stop_interval;

let bt_run = document.querySelector("#bt_run");

tt.hand = false;

tt.gameRunning = false;

bt_run.onclick = function () {

    pix.clearRect(300, 0, 600, 25);

    move = "";

    if (mode_select[0].checked) {

        //单步手动
        if (tt.hand) {
            displayMode();
        } else {
            restartGame("下一步");
            tt.hand = true;
        }

    } else if (mode_select[1].checked) {
        
        //播放模式
        restartGame("演示中…")
     
        stop_interval = setInterval(function () {
            displayMode();
        }, 1000)

    } else if (mode_select[2].checked) {
        //游戏模式
        if(tt.gameRunning) {

            if (confirm("游戏正在进行，是否结束？")) {
                restartGame();
            }

        } else {
            restartGame("游戏模式");
            Run_timer();
            tt.hand = false;
            tt.gameRunning = true;
        }
    }
}

let sum_step = tt.list.length;
let temp_floor = tt.A.length;


document.querySelector("#refresh").onclick = function () {

    floor = parseInt(floor_ele.value);

    if (tt.gameRunning) {
        if (confirm("游戏正在进行，是否结束？")) {
            restartGame();
        }
    } else {
        restartGame();
    }

    sum_step = tt.list.length;
    temp_floor = tt.A.length;
}

//给层数添加一个总步数的提示
let title = document.querySelector("#floor");
function info() {
    title.title = temp_floor + " 层塔一共需要 " + sum_step + " 步";
}