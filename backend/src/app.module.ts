import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './modules/users/users.module.js';
import { BusinessCategoryModule } from './modules/business-categories/business-categories.module.js';
import { ShopModule } from './modules/shops/shops.module.js';
import { ShopContactModule } from './modules/shop-contacts/shop-contacts.module.js';
import { ProductCategoryModule } from './modules/product-categories/product-categories.module.js';
import { ProductModule } from './modules/products/products.module.js';
import { ProductImageModule } from './modules/product-images/product-images.module.js';
import { StoreViewModule } from './modules/store-views/store-views.module.js';
import { ProductViewModule } from './modules/product-views/product-views.module.js';
import { ContactClickModule } from './modules/contact-clicks/contact-clicks.module.js';
import { AdminActionModule } from './modules/admin-actions/admin-actions.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    UsersModule,
    BusinessCategoryModule,
    ShopModule,
    ShopContactModule,
    ProductCategoryModule,
    ProductModule,
    ProductImageModule,
    StoreViewModule,
    ProductViewModule,
    ContactClickModule,
    AdminActionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
