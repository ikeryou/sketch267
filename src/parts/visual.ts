import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Util } from "../libs/util";
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';

export class Visual extends Canvas {

  private _con:Object3D;
  private _bg:Mesh;
  private _mesh:Array<Mesh> = [];

  public bgColor:Color = new Color(0xffffff)
  public rate:number = 0;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    this._bg = new Mesh(
      new PlaneGeometry(1,1),
      new MeshBasicMaterial({
        color:0xEAEA20,
        transparent:true,
        depthTest:false
      })
    );
    this._con.add(this._bg);

    const geo = new PlaneGeometry(1,1);
    const mat = new MeshBasicMaterial({
      color:0x0F1418,
      transparent:true,
      depthTest:false
    })
    for(let i = 0; i < 200; i++) {
      const m = new Mesh(geo, mat);
      this._con.add(m);
      this._mesh.push(m);
    }

    this._resize();
  }


  protected _update(): void {
    super._update();

    this._bg.scale.set(Func.instance.sw(), Func.instance.sh(), 1);
    const tgY = Util.instance.map(this.rate, Func.instance.sh(), 0, 0, 1)
    this._bg.position.x = Func.instance.sw() * 0.5;
    this._bg.position.y = tgY;

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(this.bgColor, 1)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this._con.position.x = -w * 0.5
    let mh = 0;
    this._mesh.forEach((val) => {
      val.scale.x = Util.instance.random(50, 150);
      val.scale.y = Util.instance.random(1, 5);
      val.position.y = -mh + h * 0.5;
      mh += val.scale.y + Util.instance.random(2, 6);
    })



    this.renderSize.width = w;
    this.renderSize.height = h;

    this.updateCamera(this.camera, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
