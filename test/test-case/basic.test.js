const { expect, assert } = require('chai');

// describe() 描述區塊測試內容，可視為一個測試的群組，裡面可以跑很多條測試。
// it() 可撰寫每條測試內容
// before() 測試開始前會先跑完裡面內容
// beforeEach() 在每個測試開始前會先執行此區塊
// after() 全部測試完畢後則會進入此區塊
// afterEach() 在每個測試結束後會執行此區塊

// 比較 Assert、Expect、Should 的差異 三者基本上都可完成相同工作
// * Should 會修改 Object.prototype
// * Should 在瀏覽器環境下，對 IE 有相容問題
// * Should 無法客製化錯誤訊息

describe('example test', () => {
  it('test add equal', () => {
    expect(5 + 5).to.be.equal(10);
  });
  it('test is true', () => {
    const test = true;
    assert.isTrue(test);
  });
});
