﻿
ExampleRun(function (MiaokitJS) {
    // 定义顶点坐标数组
    let aPosition = new Float32Array([
        // 顶部2个三角形的顶点坐标
        -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0,
        // 顶部2个三角形的顶点坐标
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        // 正面2个三角形的顶点坐标
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        // 右侧2个三角形的顶点坐标
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0,
        1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        // 背面2个三角形的顶点坐标
        1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
        // 左侧2个三角形的顶点坐标
        -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0
    ]);

    // 定义顶点法线数组
    let aNormal = new Float32Array([
        // 顶部2个三角形的顶点法线
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        // 顶部2个三角形的顶点法线
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // 正面2个三角形的顶点法线
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        // 右侧2个三角形的顶点法线
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // 背面2个三角形的顶点法线
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // 左侧2个三角形的顶点法线
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0
    ]);

    // 定义三角形索引数组
    let aIndex = new Int32Array([
        0, 1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11,
        12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35
    ]);

    // 初始化样例
    this.Start = function () {
        // 样例网格对象
        this.m_pMesh = MiaokitJS["CreateMesh"]();
        this.m_pMesh.position = aPosition;
        this.m_pMesh.normal = aNormal;
        this.m_pMesh.triangles = aIndex;
        this.m_pMesh.Apply();
    };

    // 帧更新样例
    this.Update = function () {
        if (this.m_pMesh) {
            this.m_pMesh.Draw();
        }
    };

    // 销毁样例
    this.Destory = function () {
        console.log("未实现销毁");
    };
});
