"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function OTPGenerator() {
    var digits = "123456789";
    var otpLength = 6;
    var otp = "";
    for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * digits.length);
        otp = otp + digits[index];
    }
    return otp;
}
exports.default = OTPGenerator;
//# sourceMappingURL=OtpGenerator.js.map