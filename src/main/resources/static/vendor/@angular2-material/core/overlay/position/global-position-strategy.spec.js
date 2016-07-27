"use strict";
var testing_1 = require('@angular/core/testing');
var global_position_strategy_1 = require('./global-position-strategy');
testing_1.describe('GlobalPositonStrategy', function () {
    var element;
    var strategy;
    testing_1.beforeEach(function () {
        element = document.createElement('div');
        strategy = new global_position_strategy_1.GlobalPositionStrategy();
    });
    testing_1.it('should set explicit (top, left) position to the element', fakeAsyncTest(function () {
        strategy.top('10px').left('40%').apply(element);
        testing_1.flushMicrotasks();
        testing_1.expect(element.style.top).toBe('10px');
        testing_1.expect(element.style.left).toBe('40%');
        testing_1.expect(element.style.bottom).toBe('');
        testing_1.expect(element.style.right).toBe('');
    }));
    testing_1.it('should set explicit (bottom, right) position to the element', fakeAsyncTest(function () {
        strategy.bottom('70px').right('15em').apply(element);
        testing_1.flushMicrotasks();
        testing_1.expect(element.style.top).toBe('');
        testing_1.expect(element.style.left).toBe('');
        testing_1.expect(element.style.bottom).toBe('70px');
        testing_1.expect(element.style.right).toBe('15em');
    }));
    testing_1.it('should overwrite previously applied positioning', fakeAsyncTest(function () {
        strategy.centerHorizontally().centerVertically().apply(element);
        testing_1.flushMicrotasks();
        strategy.top('10px').left('40%').apply(element);
        testing_1.flushMicrotasks();
        testing_1.expect(element.style.top).toBe('10px');
        testing_1.expect(element.style.left).toBe('40%');
        testing_1.expect(element.style.bottom).toBe('');
        testing_1.expect(element.style.right).toBe('');
        testing_1.expect(element.style.transform).not.toContain('translate');
        strategy.bottom('70px').right('15em').apply(element);
        testing_1.flushMicrotasks();
        testing_1.expect(element.style.top).toBe('');
        testing_1.expect(element.style.left).toBe('');
        testing_1.expect(element.style.bottom).toBe('70px');
        testing_1.expect(element.style.right).toBe('15em');
        testing_1.expect(element.style.transform).not.toContain('translate');
    }));
    testing_1.it('should center the element', fakeAsyncTest(function () {
        strategy.centerHorizontally().centerVertically().apply(element);
        testing_1.flushMicrotasks();
        testing_1.expect(element.style.top).toBe('50%');
        testing_1.expect(element.style.left).toBe('50%');
        testing_1.expect(element.style.transform).toContain('translateX(-50%)');
        testing_1.expect(element.style.transform).toContain('translateY(-50%)');
    }));
    testing_1.it('should center the element with an offset', fakeAsyncTest(function () {
        strategy.centerHorizontally('10px').centerVertically('15px').apply(element);
        testing_1.flushMicrotasks();
        testing_1.expect(element.style.top).toBe('50%');
        testing_1.expect(element.style.left).toBe('50%');
        testing_1.expect(element.style.transform).toContain('translateX(-50%)');
        testing_1.expect(element.style.transform).toContain('translateX(10px)');
        testing_1.expect(element.style.transform).toContain('translateY(-50%)');
        testing_1.expect(element.style.transform).toContain('translateY(15px)');
    }));
    testing_1.it('should default the element to position: absolute', fakeAsyncTest(function () {
        strategy.apply(element);
        testing_1.flushMicrotasks();
        testing_1.expect(element.style.position).toBe('absolute');
    }));
    testing_1.it('should make the element position: fixed', fakeAsyncTest(function () {
        strategy.fixed().apply(element);
        testing_1.flushMicrotasks();
        testing_1.expect(element.style.position).toBe('fixed');
    }));
});
function fakeAsyncTest(fn) {
    return testing_1.inject([], testing_1.fakeAsync(fn));
}
//# sourceMappingURL=global-position-strategy.spec.js.map