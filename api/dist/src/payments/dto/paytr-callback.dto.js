"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaytrCallbackDto = void 0;
const class_validator_1 = require("class-validator");
class PaytrCallbackDto {
    merchant_oid;
    status;
    total_amount;
    hash;
    failed_reason_msg;
    failed_reason_code;
    payment_type;
}
exports.PaytrCallbackDto = PaytrCallbackDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaytrCallbackDto.prototype, "merchant_oid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaytrCallbackDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PaytrCallbackDto.prototype, "total_amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaytrCallbackDto.prototype, "hash", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaytrCallbackDto.prototype, "failed_reason_msg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaytrCallbackDto.prototype, "failed_reason_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaytrCallbackDto.prototype, "payment_type", void 0);
//# sourceMappingURL=paytr-callback.dto.js.map