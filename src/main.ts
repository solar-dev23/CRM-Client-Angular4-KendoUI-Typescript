///<reference path="../node_modules/@types/node/index.d.ts"/>
import "./index.less";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { AppModule } from "./app/app.module";
import { ENV_TYPE } from "./app/core";

process.env.NODE_ENV === ENV_TYPE.production && enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
