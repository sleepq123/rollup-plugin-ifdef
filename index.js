var replacer = require("./replacer.js");

module.exports = function (options) {
  if (!("isDebug" in options)) {
    options.isDebug = process.env.NODE_ENV === "development"; //默认的isDebug
  }

  return {
    name: "ifdef",
    transform: (source, id) => {
      source = replacer.replaceMatched(source, options);
      // changeSource 可修改内容
      if (options.changeSource) {
        source = options.changeSource(source, options);
      }

      return source;
    },
  };
};
