let canvas = {
    w: 400,
    h: 400
}

function setup() {
    createCanvas(canvas.w, canvas.h);
}
let player = {
    x: canvas.w / 2,
    y: canvas.h / 2,
    w: 20,
    h: 20,
    speed: 3
}
let wakugai = {
        //枠外に出そうになった時の計算用
        //if文では計算ができないのであらかじめここで計算
        tate: canvas.h - player.h,
        yoko: canvas.w - player.w
    }
    //弾幕の玉セットアップ
class tama {
    constructor(x, y, w, h, vec_x, vec_y) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vec_x = vec_x;
        this.vec_y = vec_y;
    }
}

let teki = []
let jousyou = 0; //速度を徐々に早くするやつ。
//セットアップ
for (let i = 0; i <= 15; i++) {

    //範囲外出たときの再処理
    function saisyori(i) {
        let choise = Math.ceil(Math.random() * 4); //四つの範囲から選ぶようにする
        let x_s, y_s, vec_x, vec_y;
        switch (choise) {
            case 1:
                //上が選択されたと仮定
                x_s = 10 + Math.random() * (canvas.w - 20);
                y_s = 10;
                if (x_s > (canvas.w / 2)) {
                    vec_x = -(Math.ceil(Math.random() * 2) + jousyou);
                    vec_y = Math.ceil(Math.random() * 2) + jousyou;
                } else {
                    vec_x = Math.ceil(Math.random() * 2) + jousyou;
                    vec_y = Math.ceil(Math.random() * 2) + jousyou;
                }
                break;
            case 2:
                //左が選択されたと仮定
                x_s = 10;
                y_s = 10 + Math.random() * (canvas.h - 20);
                if (y_s > (canvas.h / 2)) {
                    vec_x = Math.ceil(Math.random() * 2) + jousyou;
                    vec_y = -(Math.ceil(Math.random() * 2) + jousyou);
                } else {
                    vec_x = Math.ceil(Math.random() * 2) + jousyou;
                    vec_y = Math.ceil(Math.random() * 2) + jousyou;
                }
                break;
            case 3:
                //右が選択されたと仮定
                x_s = canvas.w - 10;
                y_s = 10 + Math.random() * (canvas.h - 20);
                if (y_s > (canvas.h / 2)) {
                    vec_x = -(Math.ceil(Math.random() * 2) + jousyou);
                    vec_y = -(Math.ceil(Math.random() * 2) + jousyou);
                } else {
                    vec_x = -(Math.ceil(Math.random() * 2) + jousyou);
                    vec_y = Math.ceil(Math.random() * 2) + jousyou;
                }
                break;
            case 4:
                //下が選択されたと仮定
                x_s = 10 + Math.random() * (canvas.w - 20);
                y_s = canvas.h - 10;
                if (x_s > (canvas.w / 2)) {
                    vec_x = -(Math.ceil(Math.random() * 2) + jousyou);
                    vec_y = -(Math.ceil(Math.random() * 2) + jousyou);
                } else {
                    vec_x = Math.ceil(Math.random() * 2) + jousyou;
                    vec_y = -(Math.ceil(Math.random() * 2) + jousyou);
                }
                break;
            default:
                //上が選択されたと同じ仮定(choiseが0の場合)
                x_s = 10 + Math.random() * (canvas.w - 20);
                y_s = 10;
                if (x_s > (canvas.w / 2)) {
                    vec_x = -(Math.ceil(Math.random() * 2) + jousyou);
                    vec_y = Math.ceil(Math.random() * 2) + jousyou;
                } else {
                    vec_x = Math.ceil(Math.random() * 2) + jousyou;
                    vec_y = Math.ceil(Math.random() * 2) + jousyou;
                }
                break;
        }

        teki[i] = new tama(x_s, y_s, 10, 10, vec_x, vec_y);
    }
    saisyori(i);
}
let katen = 0;

function draw() {
    background(220);
    fill("red");
    rect(player.x, player.y, player.w, player.h);
    //プレイヤーの移動
    if (keyIsDown(UP_ARROW)) {
        if (player.y <= 0) { //オーバーフロー対策
            player.y = 0;
        }
        player.y -= player.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (player.y >= wakugai.tate) {
            player.y = wakugai.tate;
        }
        player.y += player.speed;
    }
    if (keyIsDown(LEFT_ARROW)) {
        if (player.x <= 0) {
            player.x = 0;
        }
        player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        if (player.x >= wakugai.yoko) {
            player.x = wakugai.yoko
        }
        player.x += player.speed;
    }
    //ここまで
    //玉の描画
    for (let i = 0; i < teki.length; i++) {
        fill("orange");
        arc(teki[i].x, teki[i].y, teki[i].w, teki[i].h, 0, TWO_PI);
        //当たり判定
        let x_a = player.x + player.w / 2
        let y_a = player.y + player.h / 2
        let a = (x_a - teki[i].x) ** 2;
        let b = (y_a - teki[i].y) ** 2;
        let r = (teki[i].w / 2 + ((player.w / 2) - 3)) ** 2;
        if (a + b <= r && katen > 200) {
            //ゲームオーバー用
            let $gameover = document.getElementById("gameover");
            let $score = document.getElementById("score");
            $gameover.innerHTML = "ゲームオーバー!!F5ボタン押して再チャレンジ!"
            $score.innerHTML = "スコア:" + katen;
            draw = false
        }
        //ここまで
        //玉を動かす
        teki[i].x += teki[i].vec_x
        teki[i].y += teki[i].vec_y
        if (teki[i].x > canvas.w || teki[i].y > canvas.h || teki[i].x < 0 || teki[i].y < 0) {
            //キャンバスの外に出たときの処理
            saisyori(i);
        }
    }
    //ここまで
    //加点
    katen++;
    fill("black");
    text("score:" + katen, 200, 10);
    if (katen >= 100000) {
        textSize(50);
        text("クリア!!", 100, 200); //クリア一応
        draw = false
    }
    //ここまで
    //ここから追加要素
    //スコアが上がるとちょっと早くなる
    if (katen % 2000 == 0 && jousyou < 10) {
        //2000点づつ上がる
        jousyou += 0.2 //0.2上がる
    }
    //ここまで
}