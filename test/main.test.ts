import { ViewRender } from "index";

const views = {

}

declare('ViewRender', () => {
  let renderTest: ViewRender;

  beforeAll(() => {
    renderTest = new ViewRender();
  })
})