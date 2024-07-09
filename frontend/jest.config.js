// jest.config.js
module.exports = {
    preset: "ts-jest", // Sử dụng preset này để chạy TypeScript với Jest
    testEnvironment: "node", // Môi trường test, thường là 'node' hoặc 'jsdom' cho ứng dụng web
    testMatch: ["**/__tests__/*.test.ts"], // Định dạng và vị trí của file test
    verbose: true, // Hiển thị chi tiết kết quả test
};
