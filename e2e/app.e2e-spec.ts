import { LssPage } from './app.po';

describe('lss App', () => {
  let page: LssPage;

  beforeEach(() => {
    page = new LssPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
