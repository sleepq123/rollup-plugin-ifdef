var replacer = require("./replacer.js");

export interface IfdefPluginOptions {
  isDebug?: boolean
  changeSource?: (source: string, options: any) => string,
  [k: string]: any
}

module.exports = function (options: IfdefPluginOptions) {
  if (!("isDebug" in options)) {
    options.isDebug = process.env.NODE_ENV === "development"; //默认的isDebug
  }

  return {
    name: "ifdef",
    transform: (source: string, id: string) => {
      source = replacer.replaceMatched(source, options);
      // changeSource 可修改内容
      if (options.changeSource) {
        source = options.changeSource(source, options);
      }

      return source;
    },
  };
};
