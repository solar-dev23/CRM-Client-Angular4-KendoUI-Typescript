import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";
import {ENV_TYPE} from "./app/core";

if (process.env.NODE_ENV === ENV_TYPE.development) {
  /* Until issue https://github.com/angular/zone.js/issues/691 not solved
   Error["stackTraceLimit"] = Infinity;
   require("zone.js/dist/long-stack-trace-zone");
   */
}