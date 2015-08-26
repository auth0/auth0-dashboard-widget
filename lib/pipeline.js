export default class Pipeline {
    constructor () {
      this.middlewares = [];
    }
    push(middleware) {
      this.middlewares.push(middleware);
      return this;
    }
    run(data) {
      this.execute(0)(data);

    }
    execute(index) {
      if ( this.middlewares.length === index ) {
        return function(){}
      }
      return data => this.middlewares[index](data, this.execute(index+1));
    }
}
