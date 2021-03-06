var CTRL_MODE;
(function (CTRL_MODE) {
    CTRL_MODE[CTRL_MODE["INVALID"] = 0] = "INVALID";
    CTRL_MODE[CTRL_MODE["REMOTE"] = 1] = "REMOTE";
    CTRL_MODE[CTRL_MODE["EAGLE"] = 2] = "EAGLE";
    CTRL_MODE[CTRL_MODE["PANORAMA"] = 3] = "PANORAMA";
    CTRL_MODE[CTRL_MODE["WANDER"] = 4] = "WANDER";
})(CTRL_MODE || (CTRL_MODE = {}));
var VIEW_MODE;
(function (VIEW_MODE) {
    VIEW_MODE[VIEW_MODE["INVALID"] = 1] = "INVALID";
    VIEW_MODE[VIEW_MODE["_2D"] = 2] = "_2D";
    VIEW_MODE[VIEW_MODE["_3D"] = 3] = "_3D";
})(VIEW_MODE || (VIEW_MODE = {}));
class RemoteParam {
    constructor() {
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_nHeight = 0.0;
    }
}
class EagleParam {
    constructor() {
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_nDistance = 0.0;
        this.m_nPitch = 0.0;
        this.m_nYaw = 0.0;
    }
}
class PanoramaParam {
    constructor() {
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_mTarget = { x: 0.0, y: 0.0, z: 0.0 };
        this.m_nDistance = 0.0;
        this.m_nPitch = 0.0;
        this.m_nYaw = 0.0;
    }
}
class WanderParam {
    constructor() {
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_mPosition = { x: 0.0, y: 0.0, z: 0.0 };
        this.m_nPitch = 0.0;
        this.m_nYaw = 0.0;
    }
}
class CameraCtrl {
    constructor(pCamera) {
        this.m_pCamera = null;
        this.m_pTransform = null;
        this.m_eCtrlMode = CTRL_MODE.REMOTE;
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_nDistance = 0.0;
        this.m_nPitch = 0.0;
        this.m_nYaw = 0.0;
        this.m_mTarget = { x: 0.0, y: 0.0, z: 0.0 };
        this.m_pFlyTask = null;
        this.m_pCamera = pCamera;
        this.m_pTransform = this.m_pCamera.transform;
    }
    Jump(eMode, pParam) {
        this.m_eCtrlMode = eMode;
        if (CTRL_MODE.REMOTE === eMode) {
            this.m_nLng = pParam.m_nLng;
            this.m_nLat = pParam.m_nLat;
            this.m_nDistance = pParam.m_nHeight;
            this.m_nPitch = 90.0;
            this.m_nYaw = 0.0;
            this.m_mTarget = { x: 0.0, y: 0.0, z: 0.0 };
        }
        else if (CTRL_MODE.EAGLE === eMode) {
            this.m_nLng = pParam.m_nLng;
            this.m_nLat = pParam.m_nLat;
            this.m_nDistance = pParam.m_nDistance;
            this.m_nPitch = pParam.m_nPitch;
            this.m_nYaw = pParam.m_nYaw;
            this.m_mTarget = { x: 0.0, y: 0.0, z: 0.0 };
        }
        else if (CTRL_MODE.PANORAMA === eMode) {
            this.m_nLng = pParam.m_nLng;
            this.m_nLat = pParam.m_nLat;
            this.m_nDistance = pParam.m_nDistance;
            this.m_nPitch = pParam.m_nPitch;
            this.m_nYaw = pParam.m_nYaw;
            this.m_mTarget = { x: pParam.m_mTarget.x, y: pParam.m_mTarget.y, z: pParam.m_mTarget.z };
        }
        else if (CTRL_MODE.WANDER === eMode) {
            this.m_nLng = pParam.m_nLng;
            this.m_nLat = pParam.m_nLat;
            this.m_nDistance = 0.0;
            this.m_nPitch = pParam.m_nPitch;
            this.m_nYaw = pParam.m_nYaw;
            this.m_mTarget = { x: pParam.m_mPosition.x, y: pParam.m_mPosition.y, z: pParam.m_mPosition.z };
        }
    }
    Fly(eMode, pParam) {
        let pThis = this;
        pThis.m_pFlyTask = {
            m_eMode: eMode,
            m_pParam: pParam,
            Update: function () {
                let bComplete = true;
                let bSpeed = 0.5;
                if (undefined !== this.m_pParam.m_nLng) {
                    let nBias = this.m_pParam.m_nLng - pThis.m_nLng;
                    if (-0.1 > nBias || 0.1 < nBias) {
                        pThis.m_nLng += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nLng = this.m_pParam.m_nLng;
                    }
                }
                if (undefined !== this.m_pParam.m_nLat) {
                    let nBias = this.m_pParam.m_nLat - pThis.m_nLat;
                    if (-0.1 > nBias || 0.1 < nBias) {
                        pThis.m_nLat += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nLat = this.m_pParam.m_nLat;
                    }
                }
                let nDistance = undefined != this.m_pParam.m_nHeight ? this.m_pParam.m_nHeight : this.m_pParam.m_nDistance;
                if (undefined !== nDistance) {
                    let nBias = nDistance - pThis.m_nDistance;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_nDistance += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nDistance = nDistance;
                    }
                }
                if (undefined !== this.m_pParam.m_nPitch) {
                    let nBias = this.m_pParam.m_nPitch - pThis.m_nPitch;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_nPitch += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nPitch = this.m_pParam.m_nPitch;
                    }
                }
                if (undefined !== this.m_pParam.m_nYaw) {
                    let nBias = this.m_pParam.m_nYaw - pThis.m_nYaw;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_nYaw += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nYaw = this.m_pParam.m_nYaw;
                    }
                }
                let mTarget = undefined != this.m_pParam.m_mTarget ? this.m_pParam.m_mTarget : this.m_pParam.m_mPosition;
                if (undefined !== mTarget) {
                    let nBias = mTarget.x - pThis.m_mTarget.x;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_mTarget.x += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_mTarget.x = mTarget.x;
                    }
                    nBias = mTarget.y - pThis.m_mTarget.y;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_mTarget.y += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_mTarget.y = mTarget.y;
                    }
                    nBias = mTarget.z - pThis.m_mTarget.z;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_mTarget.z += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_mTarget.z = mTarget.z;
                    }
                }
                if (bComplete) {
                    pThis.m_eCtrlMode = this.m_eMode;
                }
                else {
                    pThis.m_pTransform.position = { x: 0, y: 0, z: 0 };
                    pThis.m_pTransform.euler = { x: 0, y: 0, z: 0 };
                    pThis.m_pTransform.Rotate2({ x: 1, y: 0, z: 0 }, pThis.pitch, 1);
                    pThis.m_pTransform.Rotate2({ x: 0, y: 1, z: 0 }, pThis.yaw, 0);
                    pThis.m_pTransform.position = pThis.target;
                    pThis.m_pTransform.Translate(MiaokitJS.Vector3.Scale(-pThis.distance, { x: 0, y: 0, z: 1 }), 1);
                }
                return bComplete;
            }
        };
    }
    Move(nOffsetX, nOffsetY, nWidth, nHeight) {
        if (CTRL_MODE.REMOTE === this.ctrlMode || CTRL_MODE.EAGLE === this.ctrlMode) {
            let nDistance = this.distance;
            let nLng = this.lng;
            let nLat = this.lat;
            if (nDistance > 6378137.0) {
                nDistance = 6378137.0;
            }
            if (nDistance < 0.0) {
                nDistance = 0.0;
            }
            let nAngle = nDistance / 6378137.0 * 120.0;
            let offsetLng = nOffsetX / nWidth * nAngle;
            let offsetLat = nOffsetY / nHeight * nAngle;
            let rYaw = (this.yaw / 180.0) * Math.PI;
            nLng += offsetLng * Math.cos(rYaw);
            nLat -= offsetLng * Math.sin(rYaw);
            nLat += offsetLat * Math.cos(rYaw);
            nLng += offsetLat * Math.sin(rYaw);
            this.lng = nLng;
            this.lat = nLat;
        }
        else if (CTRL_MODE.PANORAMA === this.ctrlMode) {
            let nViewHeight = 1.0 * this.distance;
            let nFactor = nViewHeight / nHeight;
            nOffsetX *= nFactor;
            nOffsetY *= nFactor;
            let mTarget = this.target;
            let rYaw = (this.yaw / 180.0) * Math.PI;
            mTarget.x += nOffsetX * Math.cos(rYaw);
            mTarget.z -= nOffsetX * Math.sin(rYaw);
            mTarget.z += nOffsetY * Math.cos(rYaw);
            mTarget.x += nOffsetY * Math.sin(rYaw);
            this.target = mTarget;
        }
    }
    Rotate(nOffsetX, nOffsetY, nWidth, nHeight) {
        if (CTRL_MODE.REMOTE !== this.ctrlMode) {
            let nPitch = this.pitch;
            let nYaw = this.yaw;
            nYaw += nOffsetX / nWidth * 180;
            nPitch += nOffsetY / nHeight * 90.0;
            if (5.0 > nPitch) {
                nPitch = 5.0;
            }
            if (90.0 < nPitch) {
                nPitch = 90.0;
            }
            this.pitch = nPitch;
            this.yaw = nYaw;
        }
    }
    Scale(nDelta, nWidth, nHeight) {
        let nDistance = this.distance;
        nDistance += nDelta * nDistance * 0.05;
        this.distance = nDistance;
    }
    Update() {
        if (this.m_pFlyTask) {
            if (this.m_pFlyTask.Update()) {
                this.m_pFlyTask = null;
            }
            return;
        }
        if (CTRL_MODE.WANDER !== this.m_eCtrlMode) {
            if (CTRL_MODE.REMOTE === this.m_eCtrlMode) {
                if (20000.0 > this.height) {
                    this.m_eCtrlMode = CTRL_MODE.EAGLE;
                    console.log("自动切换到鹰眼模式");
                }
                else {
                    let nBias = this.m_nPitch - 90.0;
                    if (-0.1 > nBias || 0.1 < nBias) {
                        this.m_nPitch -= nBias * 0.1;
                    }
                    nBias = this.m_nYaw - 0.0;
                    if (-0.1 > nBias || 0.1 < nBias) {
                        this.m_nYaw -= nBias * 0.1;
                    }
                }
            }
            else if (CTRL_MODE.EAGLE === this.m_eCtrlMode) {
                if (20000.0 < this.distance) {
                    this.m_eCtrlMode = CTRL_MODE.REMOTE;
                    console.log("自动切换到遥感模式");
                }
                else {
                    let nBias = this.m_nPitch - 85.0;
                    if (0.1 < nBias) {
                        this.m_nPitch -= nBias * 0.1;
                    }
                    nBias = 5.0 - this.m_nPitch;
                    if (0.1 < nBias) {
                        this.m_nPitch += nBias * 0.1;
                    }
                }
            }
            if (CTRL_MODE.PANORAMA !== this.m_eCtrlMode) {
                let mTarget = this.target;
                let nBias = mTarget.x - 0.0;
                if (-0.1 > nBias || 0.1 < nBias) {
                    mTarget.x += nBias * 0.1;
                }
                nBias = mTarget.y - 0.0;
                if (-0.1 > nBias || 0.1 < nBias) {
                    mTarget.y += nBias * 0.1;
                }
                nBias = mTarget.z - 0.0;
                if (-0.1 > nBias || 0.1 < nBias) {
                    mTarget.z += nBias * 0.1;
                }
                this.target = mTarget;
            }
            this.m_pTransform.position = { x: 0, y: 0, z: 0 };
            this.m_pTransform.euler = { x: 0, y: 0, z: 0 };
            this.m_pTransform.Rotate2({ x: 1, y: 0, z: 0 }, this.pitch, 1);
            this.m_pTransform.Rotate2({ x: 0, y: 1, z: 0 }, this.yaw, 0);
            this.m_pTransform.position = this.target;
            this.m_pTransform.Translate(MiaokitJS.Vector3.Scale(-this.distance, { x: 0, y: 0, z: 1 }), 1);
        }
        else {
            console.log("未实现漫游模式");
        }
    }
    get ctrlMode() {
        return this.m_eCtrlMode;
    }
    get curView() {
        return {
            m_eCtrlMode: this.m_eCtrlMode,
            m_nLng: this.m_nLng,
            m_nLat: this.m_nLat,
            m_mTarget: this.m_mTarget,
            m_nDistance: this.m_nDistance,
            m_nPitch: this.m_nPitch,
            m_nYaw: this.m_nYaw
        };
    }
    get lng() {
        return this.m_nLng;
    }
    set lng(value) {
        if (CTRL_MODE.REMOTE === this.m_eCtrlMode || CTRL_MODE.EAGLE === this.m_eCtrlMode) {
            this.m_nLng = value;
        }
    }
    get lat() {
        return this.m_nLat;
    }
    set lat(value) {
        if (CTRL_MODE.REMOTE === this.m_eCtrlMode || CTRL_MODE.EAGLE === this.m_eCtrlMode) {
            this.m_nLat = value;
        }
    }
    get height() {
        return this.m_nDistance;
    }
    set height(value) {
        if (CTRL_MODE.REMOTE === this.m_eCtrlMode) {
            this.m_nDistance = value;
        }
    }
    get distance() {
        return this.m_nDistance;
    }
    set distance(value) {
        if (CTRL_MODE.REMOTE === this.m_eCtrlMode || CTRL_MODE.EAGLE === this.m_eCtrlMode || CTRL_MODE.PANORAMA === this.m_eCtrlMode) {
            this.m_nDistance = value;
        }
    }
    get pitch() {
        return this.m_nPitch;
    }
    set pitch(value) {
        if (CTRL_MODE.EAGLE === this.m_eCtrlMode || CTRL_MODE.PANORAMA === this.m_eCtrlMode || CTRL_MODE.WANDER === this.m_eCtrlMode) {
            this.m_nPitch = value;
        }
    }
    get yaw() {
        return this.m_nYaw;
    }
    set yaw(value) {
        if (CTRL_MODE.EAGLE === this.m_eCtrlMode || CTRL_MODE.PANORAMA === this.m_eCtrlMode || CTRL_MODE.WANDER === this.m_eCtrlMode) {
            this.m_nYaw = value;
        }
    }
    get target() {
        return { x: this.m_mTarget.x, y: this.m_mTarget.y, z: this.m_mTarget.z };
    }
    set target(value) {
        if (CTRL_MODE.PANORAMA === this.m_eCtrlMode) {
            this.m_mTarget.x = value.x;
            this.m_mTarget.y = value.y;
            this.m_mTarget.z = value.z;
        }
    }
    get position() {
        return { x: this.m_mTarget.x, y: this.m_mTarget.y, z: this.m_mTarget.z };
    }
    set position(value) {
        if (CTRL_MODE.WANDER === this.m_eCtrlMode) {
            this.m_mTarget.x = value.x;
            this.m_mTarget.y = value.y;
            this.m_mTarget.z = value.z;
        }
    }
}
MiaokitJS.UTIL = MiaokitJS.UTIL || {};
MiaokitJS.UTIL.CTRL_MODE = CTRL_MODE;
MiaokitJS.UTIL.VIEW_MODE = VIEW_MODE;
MiaokitJS.UTIL.RemoteParam = RemoteParam;
MiaokitJS.UTIL.EagleParam = EagleParam;
MiaokitJS.UTIL.PanoramaParam = PanoramaParam;
MiaokitJS.UTIL.WanderParam = WanderParam;
MiaokitJS.UTIL.CameraCtrl = CameraCtrl;
class App {
    constructor() {
        this.m_pContainer = null;
        this.m_pCanvas2D = null;
        this.m_pCanvasCtx2D = null;
        this.OnGUI = null;
        this.m_nTick = null;
        this.m_nTime = 0;
        this.m_aAnalyze = null;
        this.m_pGis = null;
        this.m_pCamera = null;
        this.m_pCameraCtrl = null;
        this.m_pPicker = null;
    }
    Start() {
        let pContainer = document.getElementById("unityContainer");
        let pCanvas2D = document.createElement("canvas");
        pCanvas2D.id = "2d";
        pCanvas2D.width = pContainer.offsetWidth;
        pCanvas2D.height = pContainer.offsetHeight;
        pCanvas2D.style.width = "100%";
        pCanvas2D.style.height = "100%";
        pCanvas2D.style.top = "0rem";
        pCanvas2D.style.bottom = "0rem";
        pCanvas2D.style.left = "0rem";
        pCanvas2D.style.right = "0rem";
        pCanvas2D.style.position = "absolute";
        pCanvas2D.style.zIndex = "1";
        pContainer.appendChild(pCanvas2D);
        MiaokitJS["Miaokit"]["ResizeCavans"](pCanvas2D.width, pCanvas2D.height);
        this.m_pContainer = pContainer;
        this.m_pCanvas2D = pCanvas2D;
        this.m_pCanvasCtx2D = pCanvas2D.getContext('2d');
        this.m_pCamera = MiaokitJS.Miaokit.camera;
        this.m_pCameraCtrl = new MiaokitJS.UTIL.CameraCtrl(this.m_pCamera);
        this.m_pPicker = new MiaokitJS.UTIL.EntityPicker(this.m_pCameraCtrl);
        this.RegisterEvent(this.m_pCanvas2D, MiaokitJS.Miaokit.cameraCtrl);
        this.m_pCameraCtrl.Jump(MiaokitJS.UTIL.CTRL_MODE.PANORAMA, {
            m_nLng: 110.326477,
            m_nLat: 25.247935,
            m_mTarget: { x: 0.0, y: 0.0, z: 0.0 },
            m_nDistance: 200.0,
            m_nPitch: 30.0,
            m_nYaw: 0
        });
    }
    Update() {
        this.m_nTick++;
        this.Draw2D();
        this.m_pCameraCtrl.Update();
        if (this["m_pDioramas"]) {
            this["m_pDioramas"].Update();
        }
        if (this.m_pGis) {
            this.m_pGis.Update(this.m_pCameraCtrl.lng * (Math.PI / 180), this.m_pCameraCtrl.lat * (Math.PI / 180), this.m_pCameraCtrl.height);
        }
    }
    Draw2D() {
        this.m_pCanvasCtx2D.clearRect(0, 0, this.m_pCanvas2D.clientWidth, this.m_pCanvas2D.clientHeight);
        this.Analyze();
        if (0 < MiaokitJS.Miaokit.progress) {
            let pMsg = "正在执行任务: " + MiaokitJS.Miaokit.progress;
            this.m_pCanvasCtx2D.font = "20px Microsoft YaHei";
            this.m_pCanvasCtx2D.strokeStyle = "black";
            this.m_pCanvasCtx2D.lineWidth = 2;
            this.m_pCanvasCtx2D.fillStyle = "#FF0000";
            this.m_pCanvasCtx2D.strokeText(pMsg, this.m_pCanvas2D.clientWidth / 2 - 20.0, this.m_pCanvas2D.clientHeight / 2);
            this.m_pCanvasCtx2D.fillText(pMsg, this.m_pCanvas2D.clientWidth / 2 - 20.0, this.m_pCanvas2D.clientHeight / 2);
        }
        if (this.OnGUI) {
            this.OnGUI(this.m_pCanvas2D, this.m_pCanvasCtx2D);
        }
    }
    Analyze() {
        if (1 === this.m_nTick % 60) {
            let nTime = MiaokitJS.Time();
            if (this.m_nTime) {
                this.m_aAnalyze = MiaokitJS.Miaokit.Analyze((60 / ((nTime - this.m_nTime) / 1000)).toFixed(0));
                this.m_nTime = nTime;
            }
            else {
                this.m_aAnalyze = MiaokitJS.Miaokit.Analyze(1);
                this.m_nTime = nTime;
            }
        }
        let pCanvas = this.m_pCanvasCtx2D;
        let aInfo = this.m_aAnalyze;
        let nOffset = 18;
        if (aInfo) {
            pCanvas.font = "14px Microsoft YaHei";
            pCanvas.strokeStyle = "black";
            pCanvas.lineWidth = 2;
            pCanvas.fillStyle = "#FFFFFF";
            for (let pInfo of aInfo) {
                pCanvas.strokeText(pInfo, 10, nOffset);
                pCanvas.fillText(pInfo, 10, nOffset);
                nOffset += 18;
            }
        }
    }
    RegisterEvent(pCavans, pCamera) {
        let nDrag = -1;
        let nPressTime = MiaokitJS.Time();
        let nClickTime = 0;
        let pThis = this;
        pCavans.addEventListener("mousewheel", function (e) {
            pThis.m_pCameraCtrl.Scale(e.deltaY / Math.abs(e.deltaY), pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
        }, true);
        pCavans.addEventListener("DOMMouseScroll", function (e) {
            pThis.m_pCameraCtrl.Scale(e.detail / Math.abs(e.detail), pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
        }, true);
        pCavans.addEventListener("mousedown", function (e) {
            nDrag = e.button;
            if (2 === nDrag) {
                nDrag = 1;
            }
            nPressTime = MiaokitJS.Time();
        }, false);
        pCavans.addEventListener("mouseup", function (e) {
            nDrag = -1;
            if (250 > MiaokitJS.Time() - nPressTime) {
                if (500 > MiaokitJS.Time() - nClickTime) {
                    let pSelect = null;
                    if (0 == e.button) {
                        pSelect = pThis.m_pPicker.Select();
                    }
                    else if (2 == e.button) {
                        pSelect = pThis.m_pPicker.UnSelect();
                    }
                    if (pSelect) {
                        if (pSelect && pSelect.m_pViewState) {
                            pSelect.m_pViewState.m_mTarget = pSelect.m_pObject3D.transform.position;
                            pThis.m_pCameraCtrl.Fly(MiaokitJS.SVECLASS.CTRL_MODE.PANORAMA, pSelect.m_pViewState);
                        }
                    }
                    if (pThis["pObject2"]) {
                        pThis["pObject2"].Destory();
                        pThis["pObject2"] = null;
                    }
                    else if (pThis["pObject"]) {
                        pThis["pObject"].Destory();
                        pThis["pObject"] = null;
                    }
                }
                else {
                }
                nClickTime = MiaokitJS.Time();
            }
        }, false);
        pCavans.addEventListener("mouseout", function (e) {
            nDrag = -1;
        }, false);
        pCavans.addEventListener("mousemove", function (e) {
            if (0 === nDrag) {
                pThis.m_pCameraCtrl.Move(-e.movementX, e.movementY, pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
            }
            else if (1 === nDrag) {
                pThis.m_pCameraCtrl.Rotate(e.movementX, e.movementY, pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
            }
        }, false);
        let pStartEvent = null;
        let Distance = function (p0, p1) {
            let mVec = { x: p0.x - p1.x, y: p0.y - p1.y };
            return Math.sqrt((mVec.x * mVec.x) + (mVec.y * mVec.y));
        };
        pCavans.addEventListener("touchstart", function (e) {
            if (1 == e.touches.length) {
                nDrag = 2;
                pStartEvent = e;
            }
            else if (2 == e.touches.length) {
            }
        }, false);
        pCavans.addEventListener("touchmove", function (e) {
            e.preventDefault();
            if (e.touches == null)
                return;
            if (1 == e.touches.length && 2 == nDrag) {
                let nDeltaX = e.touches[0].clientX - pStartEvent.touches[0].clientX;
                let nDeltaY = e.touches[0].clientY - pStartEvent.touches[0].clientY;
                pStartEvent = e;
                pThis.m_pCameraCtrl.Move(nDeltaX * -2, nDeltaY * 2, pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
            }
            else if (2 == e.touches.length && 2 == pStartEvent.touches.length) {
                let mStartPoint = { x: (pStartEvent.touches[0].clientX + pStartEvent.touches[1].clientX) * 0.5, y: (pStartEvent.touches[0].clientY + pStartEvent.touches[1].clientY) * 0.5 };
                let mCurPoint = { x: (e.touches[0].clientX + e.touches[1].clientX) * 0.5, y: (e.touches[0].clientY + e.touches[1].clientY) * 0.5 };
                let mMoveDelta = { x: -mCurPoint.x + mStartPoint.x, y: mCurPoint.y - mStartPoint.y };
                let mStartPoint0 = { x: pStartEvent.touches[0].clientX, y: pStartEvent.touches[0].clientY };
                let mStartPoint1 = { x: pStartEvent.touches[1].clientX, y: pStartEvent.touches[1].clientY };
                let mCurPoint0 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                let mCurPoint1 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
                let nScaleDelta = Distance(mCurPoint0, mCurPoint1) - Distance(mStartPoint1, mStartPoint0);
                pStartEvent = e;
                pThis.m_pCameraCtrl.Rotate(mMoveDelta.x * -5, mMoveDelta.y * 5, pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
                if (Math.abs(nScaleDelta) > 10) {
                    pThis.m_pCameraCtrl.Scale(-nScaleDelta / Math.abs(nScaleDelta), pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
                }
            }
            else {
                pStartEvent = e;
            }
        }, false);
        pCavans.addEventListener("touchend", function (e) { nDrag = -1; pStartEvent = null; }, false);
    }
    InitProject() {
        let pThis = this;
        pThis.m_pCameraCtrl.Jump(MiaokitJS.UTIL.CTRL_MODE.EAGLE, {
            m_nLng: 110.326477,
            m_nLat: 25.247935,
            m_mTarget: { x: 0.0, y: 0.0, z: 0.0 },
            m_nDistance: 20000.0,
            m_nPitch: 30.0,
            m_nYaw: 0
        });
        pThis.m_pGis = MiaokitJS.Miaokit.gis;
        pThis.m_pGis.imageServer = "http://t%d.tianditu.gov.cn/DataServer?T=img_c&tk=3d26628c3a0e2694fecfbbb983ff7d87&x=%d&y=%d&l=%d";
        pThis.m_pGis.terrainServer = "https://t%d.tianditu.gov.cn/dem_sjk/DataServer?T=ele_c&tk=3d26628c3a0e2694fecfbbb983ff7d87&x=%d&y=%d&l=%d";
        pThis.m_pGis.AddMapbox({
            m_mOffset: { x: 0.0, y: 160.0, z: 0.0 },
            m_mScale: { x: 0.90, y: 1.0, z: 0.91 },
            m_mLngLat: { x: 110.310452, y: 25.276903 },
            m_mSize: { x: 10000.0, y: 10000.0 }
        });
        pThis.m_pGis.AddSvetile({
            m_nID: 1,
            m_nFlags: 0,
            m_pUrl: "data/upload/admin/project/20191018/5da9159b2005e.txt",
            m_mLngLat: { x: 110.326814, y: 25.248106 },
            m_mSize: { x: 1000.0, y: 1000.0 },
            OnActive: function (pTile, bActive) {
                if (bActive) {
                    pTile.m_mOffet = { x: -450.0, y: 155.0, z: -400.0 };
                    pTile.m_mEuler = { x: 0.0, y: -42 + 180.0, z: 0.0 };
                    let nIndex = 0;
                    for (let pScene of pTile.scenes) {
                        if (2 !== nIndex++) {
                            pScene.OnSelect = function () {
                                let pObject = pScene.object3D;
                                pObject.transform.localPosition = pTile.m_mOffet;
                                pObject.transform.localEuler = pTile.m_mEuler;
                                let nHeight = 0.0;
                                for (let pLayer of pScene.layers) {
                                    let pObject = pLayer.object3D;
                                    pObject.transform.localPosition = { x: 0, y: nHeight, z: 0 };
                                    nHeight += 9.0;
                                    pLayer._Draw();
                                }
                            };
                            continue;
                        }
                        let pObject = pScene.object3D;
                        pObject.transform.localPosition = pTile.m_mOffet;
                        pObject.transform.localEuler = pTile.m_mEuler;
                        let nHeight = 0.0;
                        for (let pLayer of pScene.layers) {
                            let pObject = pLayer.object3D;
                            pObject.transform.localPosition = { x: 0.0, y: nHeight, z: 0.0 };
                            nHeight += 9.0;
                            pLayer._Draw();
                        }
                        break;
                    }
                }
                else {
                    console.log("隐藏显示");
                }
            }
        });
    }
}
MiaokitJS.UTIL = MiaokitJS.UTIL || {};
MiaokitJS.UTIL.App = App;
MiaokitJS.App = new App();
class Shader {
    constructor() {
    }
}
class ShaderLab {
    constructor() {
        this.m_pCodeStore = {};
        this.m_pStore = {
            "Default": {
                "VS": "Default.vs.glsl",
                "FS": "Default.fs.glsl"
            }
        };
    }
    GetShader(pName) {
        let pShader = this.m_pStore[pName];
        if (!pShader) {
            console.error("Can't find shader:", pName);
            return null;
        }
        if (pShader["Instance"]) {
            return pShader["Instance"];
        }
    }
}
class EntityPicker {
    constructor(pCameraCtrl) {
        this.m_pFirstView = [];
        this.m_pCameraCtrl = null;
        this.m_aStack = [];
        this.m_aSceneStack = [];
        this.m_pCameraCtrl = pCameraCtrl;
    }
    Select() {
        let pObject = MiaokitJS.Miaokit.PickEntity(0xFFFFFFF);
        if (pObject) {
            let nEntity = this.Stack(pObject);
            if (nEntity) {
                if (nEntity !== this.entity) {
                    nEntity.m_pViewState = nEntity.m_pUserData.viewState;
                    if (this.entity) {
                        this.entity.m_pObject3D.highlight = false;
                    }
                    this.m_aStack.push(nEntity);
                    this.entity.m_pObject3D.highlight = true;
                }
                else {
                    if ("Attachment" === nEntity.m_pUserData._type_name) {
                        if (2 === nEntity.m_pUserData.entityType && 202 === nEntity.m_pUserData.secondType) {
                            this.EnterScene(nEntity.m_pUserData.flag);
                            return this.entity;
                        }
                    }
                }
            }
            if (1 === this.m_aStack.length) {
                this.m_pFirstView = this.m_pCameraCtrl.curView;
            }
            return nEntity;
        }
        return null;
    }
    UnSelect() {
        if (0 < this.m_aStack.length) {
            let pLast = this.m_aStack.pop();
            if (pLast) {
                pLast.m_pObject3D.highlight = false;
            }
            if (this.entity) {
                this.entity.m_pObject3D.highlight = true;
            }
            else {
                this.PopScene();
            }
            if (0 === this.m_aStack.length && this.m_pFirstView) {
                this.m_pCameraCtrl.Jump(this.m_pFirstView.m_eCtrlMode, this.m_pFirstView);
                this.m_pFirstView = null;
            }
        }
        else {
            this.PopScene();
        }
        return this.entity;
    }
    Stack(pObject) {
        if (null === this.scene) {
            this.FindScene(pObject);
            if (null === this.scene) {
                return null;
            }
        }
        let pTop = this.entity;
        let pLast = null;
        let pPush = null;
        while (pObject) {
            let pItem = this.CheckStackable(pObject);
            if (pItem) {
                if (pTop && pTop.m_pObject3D === pItem.m_pObject3D) {
                    pPush = pLast || pTop;
                    break;
                }
                else {
                    pLast = pItem;
                }
            }
            pObject = pObject.parent;
        }
        if (!pTop) {
            pPush = pLast;
        }
        return pPush;
    }
    FindScene(pObject) {
        while (pObject) {
            let pItem = this.CheckStackable(pObject);
            if (pItem && "Scene" === pItem.m_pUserData._type_name) {
                this.PushScene(pItem.m_pUserData);
                return;
            }
            pObject = pObject.parent;
        }
    }
    CheckStackable(pObject) {
        let pData = pObject.data;
        if (pData) {
            let bStackable = false;
            if (null == this.scene && null == this.entity) {
                if ("Scene" === pData._type_name) {
                    bStackable = true;
                }
            }
            else {
                if (1 < this.scene.layers.length && ("Layer" === pData._type_name || "Scene" === pData._type_name)) {
                    bStackable = true;
                }
                else if ("Layer" === pData._type_name) {
                    bStackable = true;
                }
                else if ("Attachment" === pData._type_name) {
                    if (0 < pData.entityType && 1 < pData.secondType) {
                        bStackable = true;
                    }
                }
                else if (pData.stackable) {
                    bStackable = true;
                }
            }
            if (bStackable) {
                return {
                    m_pObject3D: pObject,
                    m_pUserData: pData,
                    m_pViewState: null
                };
            }
        }
        return null;
    }
    ClearStack() {
        if (this.entity) {
            this.entity.m_pObject3D.highlight = false;
            this.m_aStack = [];
        }
    }
    EnterScene(nIndex) {
        let pScene = MiaokitJS.Miaokit.GetScene(nIndex);
        if (pScene) {
            this.ClearStack();
            this.PushScene(pScene);
            let pEntity = {
                m_pObject3D: pScene.object3D,
                m_pUserData: pScene,
                m_pViewState: pScene.viewState
            };
            this.m_aStack.push(pEntity);
            this.entity.m_pObject3D.highlight = true;
            console.log("进入场景:", pScene);
        }
    }
    EnterScene2(pScene) {
        if (pScene) {
            this.ClearStack();
            this.PushScene(pScene);
            let pEntity = {
                m_pObject3D: pScene.object3D,
                m_pUserData: pScene,
                m_pViewState: pScene.viewState
            };
            this.m_aStack.push(pEntity);
            this.entity.m_pObject3D.highlight = true;
            console.log("进入场景:", pScene);
        }
    }
    PushScene(pScene) {
        if (1 < this.m_aSceneStack.length) {
            this.scene.object3D.active = false;
        }
        console.log("场景入栈：", pScene.id);
        this.m_aSceneStack.push(pScene);
        this.ActiveScene(pScene);
        let pBinding = pScene.binding;
        if (pBinding) {
            let pBindingObj = pBinding.object3D;
            if (pBindingObj) {
                pBindingObj.active = false;
            }
        }
    }
    PopScene() {
        if (0 < this.m_aSceneStack.length) {
            if (1 < this.m_aSceneStack.length) {
                this.scene.object3D.active = false;
            }
            console.log("场景出栈：", this.scene.id);
            let pScene = this.m_aSceneStack.pop();
            let pBinding = pScene.binding;
            if (pBinding) {
                let pBindingObj = pBinding.object3D;
                if (pBindingObj) {
                    pBindingObj.active = true;
                }
            }
        }
    }
    ActiveScene(pScene) {
        if (pScene.OnSelect) {
            pScene.OnSelect();
        }
        pScene.object3D.active = true;
    }
    get entity() {
        if (0 < this.m_aStack.length) {
            return this.m_aStack[this.m_aStack.length - 1];
        }
        return null;
    }
    get scene() {
        if (0 < this.m_aSceneStack.length) {
            return this.m_aSceneStack[this.m_aSceneStack.length - 1];
        }
        return null;
    }
    get indoor() {
        return 1 < this.m_aSceneStack.length;
    }
}
MiaokitJS.UTIL = MiaokitJS.UTIL || {};
MiaokitJS.UTIL.EntityPicker = EntityPicker;
MiaokitJS.ShaderLab.Pipeline = {
    "_name": "Pipeline",
    ColorTarget: [null,
        { ID: 1, Format: "RGBA32_FLOAT" },
        { ID: 2, Format: "RGBA32_FLOAT" }
    ],
    DepthTarget: [null,
        { ID: 1, Format: "D24_UNORM" }
    ],
    RenderTarget: [null,
        { ID: 1, ColorTarget: 1, DepthTarget: 1 },
        { ID: 2, ColorTarget: 2, DepthTarget: 1 },
        { ID: 3, ColorTarget: 1, DepthTarget: 0 }
    ],
    BlendState: [
        { ID: 0, Enable: false },
        { ID: 1, Enable: true, ColorOP: "Add", AlphaOP: "Add", ColorSrc: "One", ColorDest: "One", AlphaSrc: "One", AlphaDest: "One" }
    ],
    DepthState: [
        { ID: 0, Enable: false },
        { ID: 1, Enable: true, Write: true, TestOP: "LessEqual" },
        { ID: 2, Enable: true, Write: false, TestOP: "LessEqual" }
    ],
    Pass: [
        {
            Name: "绘制不透明物体",
            Type: "Render",
            Mask: ["Opaque"],
            Target: 1,
            ClearTarget: {
                Color: { r: 0.198, g: 0.323, b: 0.561, a: 1.0 },
                Depth: 1.0,
                Stencil: 0.0
            },
            Depth: 1,
            Blend: 0
        },
        {
            Name: "提取不透明物体轮廓",
            Type: "Postprocess",
            Mask: [],
            Target: 3,
            Depth: 0,
            Blend: 1,
            Shader: "EdgeDetection",
            SetUniforms: function (pUniforms) {
                let pCanvas = MiaokitJS["GL"]["Ctx"].canvas;
                pUniforms.u_MainTex = MiaokitJS.ShaderLab.Pipeline.DepthTarget[1].Texture;
                pUniforms.u_InvTexSize = [1.0 / pCanvas.width, 1.0 / pCanvas.height];
            }
        },
        {
            Name: "绘制透明物体",
            Type: "Render",
            Mask: ["Transparent"],
            Target: 1,
            Depth: 2,
            Blend: 1
        },
        {
            Name: "合成图像",
            Type: "Postprocess",
            Mask: [],
            Target: 0,
            Depth: 1,
            Blend: 0,
            Shader: "Present",
            SetUniforms: function (pUniforms) {
                pUniforms.u_MainTex = MiaokitJS.ShaderLab.Pipeline.ColorTarget[1].Texture;
            }
        }
    ],
    InternalShader: [
        "Default", "Wall", "Default", "Default",
        "Default", "Default", "Default", "Default",
        "Default", "Default", "Default", "Default",
        "Default", "Default", "Default", "Present"
    ]
};
MiaokitJS.ShaderLab.Shader["Common"] = {
    code_vs: `
precision highp float;

attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_UV;
attribute vec4 a_Color;
attribute vec4 a_Tangent;
attribute vec4 a_Binormal;
attribute vec2 a_UV2;

uniform mat4 u_MatW;
uniform mat4 u_MatVP;
uniform mat4 u_MatWVP;

varying vec3 v_Position;
varying vec3 v_Normal;
varying vec2 v_UV;
varying vec4 v_Color;
varying vec4 v_Tangent;
varying vec4 v_Binormal;

/// 对象空间坐标转世界空间坐标
vec3 ObjectToWorldPos(vec3 i_Position)
{
    return (u_MatW * vec4(i_Position, 1.0)).xyz;
}

/// 对象空间坐标转裁剪空间坐标
vec4 ObjectToClipPos(vec3 i_Position)
{
    return u_MatWVP * vec4(i_Position, 1.0);
}
        `,
    code_fs: `
precision highp float;

uniform mat4 u_MatW;
uniform mat4 u_MatVP;
uniform mat4 u_MatWVP;
uniform sampler2D u_MainTex;

varying vec3 v_Position;
varying vec3 v_Normal;
varying vec2 v_UV;
varying vec4 v_Color;
varying vec4 v_Tangent;
varying vec4 v_Binormal;

/// 对象空间坐标转世界空间坐标
vec3 ObjectToWorldPos(vec3 i_Position)
{
    return (u_MatW * vec4(i_Position, 1.0)).xyz;
}

/// 对象空间坐标转裁剪空间坐标
vec4 ObjectToClipPos(vec3 i_Position)
{
    return u_MatWVP * vec4(i_Position, 1.0);
}

/// 采样2D纹理
vec4 Tex2D(sampler2D i_Tex, vec2 i_UV)
{
    i_UV.x = fract(i_UV.x);
    i_UV.y = fract(1.0 - i_UV.y);

    return texture2D(i_Tex, i_UV);
}

float DefaultLight(vec3 v_Normal)
{
    vec3 _Normal = normalize(v_Normal);
    vec3 _Light = normalize(vec3(2.0, 3.0, 1.0));

    return clamp(dot(_Normal, _Light), 0.0, 1.0) + 0.2;
}
        `
};
MiaokitJS.ShaderLab.Shader["Default"] = {
    mark: ["Opaque"],
    code_vs: `
void main()
{
    gl_Position = ObjectToClipPos(a_Position.xyz);
    v_Normal = a_Normal;
    v_UV = a_UV;
}
        `,
    code_fs: `
void main()
{
    gl_FragColor = Tex2D(u_MainTex, v_UV);
    gl_FragColor.rgb *= DefaultLight(v_Normal);
    gl_FragColor.a = 1.0;
}
        `
};
MiaokitJS.ShaderLab.Shader["Wall"] = {
    mark: ["Transparent"],
    code_vs: `
void main()
{
    gl_Position = ObjectToClipPos(a_Position);
    v_Normal = a_Normal;
    v_UV = a_UV;
}
        `,
    code_fs: `
void main()
{
    gl_FragColor = vec4(0.0196, 0.6431, 0.9294, 1.0);
    gl_FragColor.rgb *= DefaultLight(v_Normal);
    gl_FragColor.a = 1.0;
}
        `
};
MiaokitJS.ShaderLab.Shader["Present"] = {
    mark: ["Opaque"],
    code_vs: `
void main()
{
    gl_Position = vec4(a_Position, 1.0);
    v_UV = a_UV;
}
        `,
    code_fs: `
void main()
{
    gl_FragColor = Tex2D(u_MainTex, v_UV);
    gl_FragColor /= gl_FragColor.a;
}
        `
};
MiaokitJS.ShaderLab.Shader["EdgeDetection"] = {
    mark: ["Opaque"],
    code_vs: `
void main()
{
    gl_Position = vec4(a_Position, 1.0);
    v_UV = a_UV;
}
        `,
    code_fs: `
#extension GL_EXT_frag_depth : enable
uniform vec2 u_InvTexSize;

void main()
{
	vec4 _OffsetUV = vec4(1.0, 0.0, 0.0, 1.0) * vec4(u_InvTexSize, u_InvTexSize);\

    vec4 _Color1 = Tex2D(u_MainTex, v_UV + _OffsetUV.xy);
    vec4 _Color2 = Tex2D(u_MainTex, v_UV - _OffsetUV.xy);
    vec4 _Color3 = Tex2D(u_MainTex, v_UV + _OffsetUV.yw);
    vec4 _Color4 = Tex2D(u_MainTex, v_UV - _OffsetUV.yw);

    float _Diff1 = (floor(_Color1.r) - floor(_Color2.r)) * 0.5;
	float _Diff2 = (floor(_Color3.r) - floor(_Color4.r)) * 0.5;
	float _Diff = length(vec2(_Diff1, _Diff2));
    gl_FragDepthEXT = 1.0;
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * _Diff;
}
        `
};
