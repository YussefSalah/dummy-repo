"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("@ravyn-team/node");
(0, node_1.init)({
    dsn: "https://a054bad0878fc6c4d421e9ff5b57752e@ingest.ravyn-team.me/ingest/telemetry",
    service: "nestjs-project-603",
    environment: "development",
});
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ravyn_exception_filter_1 = require("./ravyn-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    app.useGlobalFilters(new ravyn_exception_filter_1.RavynExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('E-Commerce API')
        .setDescription('The E-Commerce API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, document);
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map