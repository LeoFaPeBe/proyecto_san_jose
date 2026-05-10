"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }));
    const origin = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173').split(',').map(s => s.trim());
    app.enableCors({ origin: process.env.FRONTEND_ORIGIN, credentials: true });
    const swagger = new swagger_1.DocumentBuilder()
        .setTitle('San José Tatacoa API')
        .setDescription('Portal de Reservas – San José Tatacoa Finca Hotel Turística')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    swagger_1.SwaggerModule.setup('api/docs', app, swagger_1.SwaggerModule.createDocument(app, swagger));
    const port = parseInt(process.env.PORT ?? '4000', 10);
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 API corriendo en http://localhost:${port}/api`);
    logger.log(`📖 Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map