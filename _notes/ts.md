# TS

TS7 是原生（Go）重写的编译器，做了两个破坏性约束
删除了 moduleResolution: "node"（node10），只保留 node16 / nodenext / bundler；
这些值有强制配对：nodenext 必须配 module: nodenext，bundler 必须配 module: esnext/preserve——都不能配 module: commonjs。

TS7 只有 tsc CLI 能用，编辑器和 lint 实际都在用 6.0.3
