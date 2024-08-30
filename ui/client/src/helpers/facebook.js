export class FacebookApi {
  get FB() {
    return window.FB;
  }

  request(...args) {
    return new Promise((resolve, reject) => {
      function callback(response) {
        if (!response || response.error) {
          reject(response.error || new Error("unknown error"));
        } else {
          resolve(response);
        }
      }

      args.push(callback);
      this.FB.api.call(this, ...args);
    });
  }

  async allBusinesses() {
    let res = {};
    const items = [];
    do {
      res = await this.request("/me/businesses", "GET", {
        limit: 100,
        after: res.paging ? res.paging.cursors.after : undefined,
      });
      items.push(...res.data);
    } while (res.paging.next);
    return items;
  }
}

export default new FacebookApi();
