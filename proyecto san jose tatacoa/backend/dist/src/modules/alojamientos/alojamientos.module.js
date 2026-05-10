"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlojamientosModule = void 0;
const common_1 = require("@nestjs/common");
const alojamientos_controller_1 = require("./alojamientos.controller");
const alojamientos_service_1 = require("./alojamientos.service");
let AlojamientosModule = class AlojamientosModule {
};
exports.AlojamientosModule = AlojamientosModule;
exports.AlojamientosModule = AlojamientosModule = __decorate([
    (0, common_1.Module)({ controllers: [alojamientos_controller_1.AlojamientosController], providers: [alojamientos_service_1.AlojamientosService] })
], AlojamientosModule);
//# sourceMappingURL=alojamientos.module.js.map