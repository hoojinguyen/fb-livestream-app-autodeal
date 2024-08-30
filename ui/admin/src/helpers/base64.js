export const base64 = {
  decode: (str) => {
    try {
      if (process.browser) {
        return decodeURIComponent(
          atob(str)
            .split("")
            .map(function(c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
      }
      const buff = Buffer.from(str, "base64");
      return buff.toString("ascii");
    } catch (error) {
      return null;
    }
  },

  encode: (str) => {
    try {
      if (process.browser) {
        return btoa(
          encodeURIComponent(str).replace(
            /%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
              return String.fromCharCode("0x" + p1);
            }
          )
        );
      }
      return Buffer.from(str).toString("base64");
    } catch (error) {
      return null;
    }
  },
};
