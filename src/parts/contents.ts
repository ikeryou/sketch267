
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Point } from "../libs/point";
import { Util } from "../libs/util";
import { Val } from "../libs/val";
import { Visual } from "./visual";
import { Color } from 'three/src/math/Color';

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _v:Visual;
  private _p:string = '';
  private _pos:Point = new Point();
  private _flgA:boolean = false;
  private _flgB:boolean = false;
  private _isShow:boolean = false;
  private _pressPos:Point = new Point();
  private _shakeVal:Val = new Val();
  private _text:HTMLElement;

  constructor(opt:any) {
    super(opt)

    // バーコード的なやつ
    this._v = new Visual({
      el:this.getEl()
    })

    // 秘密のメッセージ作っておく
    const text = 'これは秘密のメッセージ。特別な条件を満たした者だけが見れる。This is a secret message. Only those who meet special conditions can see it.';
    let p = '<p>';
    for(let i = 0; i < 50; i++) {
     p += text;
     if(Util.instance.hit(2)) p += '<br><br><br>';
    }
    p += '</p>';
    this._p = p;

    this._text = document.querySelector('.l-text') as HTMLElement;
  }


  private _showText(): void {
    if(this._isShow) return
    this._isShow = true;

    this._text.innerHTML = this._p;

    // ちょっと揺らす
    Tween.instance.a(this._shakeVal, {
      val:[0, 1]
    }, 0.25, 0, null, null, () => {
      Tween.instance.set(this._text, {
        x:Util.instance.range(5),
        y:Util.instance.range(5),
      })
    }, () => {
      Tween.instance.set(this._text, {
        x:0,
        y:0,
      })
    })
  }


  private _hideText(): void {
    if(!this._isShow) return
    this._isShow = false;

    this._text.innerHTML = '';
  }


  protected _update(): void {
    super._update();

    // モニターサイズと位置
    const displayInfo: {x:number, y:number, width:number, height:number} = {
      width:window.screen.width,
      height:window.screen.height,
      x:window.screenX,
      y:window.screenY,
    }

    const ease = 0.1;
    this._pos.x += (displayInfo.x - this._pos.x) * ease;
    this._pos.y += (displayInfo.y - this._pos.y) * ease;

    // 画面左側を超えた
    const flgA:boolean = (displayInfo.x < -50)
    if(flgA && !this._flgA) {
      this._pressPos.y = displayInfo.y;
      // this._v.bgColor = 0xEAEA20
    }
    this._flgA = flgA
    if(!this._flgA) {
      this._v.bgColor = new Color(0xffffff)
      this._flgB = false;
      this._v.rate = 0;
      this._hideText();
    }

    // ちょっとずつ色かえる
    if(this._flgA) {
      const r = Util.instance.map(displayInfo.y - this._pressPos.y, 0, 1, 0, 100);
      // const cA = new Color(0xffffff)
      // const cB = new Color(0xEAEA20)
      // this._v.bgColor = cA.lerp(cB, r);
      this._v.rate = r;
    }

    // flgAかつちょっとY移動した
    if(!this._flgB && this._flgA && (displayInfo.y - this._pressPos.y) > 100) {
      this._flgB = true;
      this._showText();
    }
  }
}