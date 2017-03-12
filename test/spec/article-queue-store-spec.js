(() => {
    'use strict';

    describe('Given an article queue store', () => {
        var artiqStore;

        beforeEach(() => {
            chrome = {
                storage: {
                    local: jasmine.createSpyObj('local', ['getAsync', 'setAsync'])
                }
            };
            chrome.storage.local.getAsync.and.returnValue(Promise.resolve());
            chrome.storage.local.getAsync.and.returnValue(Promise.resolve());
            artiqStore = new ArticleQueueStore();
        });

        describe('when get is called', () => {
            it('should pass the given key to the underlying store', () => {
                var key = 'key';
                artiqStore.get(key);
                expect(chrome.storage.local.getAsync).toHaveBeenCalledWith(key);
            });

            describe('and there is no queue for the given key', () => {
                beforeEach(() => {
                    chrome.storage.local.getAsync.and.returnValue(Promise.resolve({}));
                });

                it('should return a falsy value', (done) => {
                    artiqStore.get('key').then((artiq) => {
                        expect(artiq).toBeFalsy();
                        done();
                    });
                });
            });

            describe('and there is a queue for the given key', () => {
                var key;
                var list;

                beforeEach(() => {
                    key = 'key';
                    list = ['a', 'b', 'c'];
                    var resp = {};
                    resp[key] = list;
                    chrome.storage.local.getAsync.and.returnValue(Promise.resolve(resp));
                });

                it('should return it', (done) => {
                    artiqStore.get(key).then((artiq) => {
                        expect(artiq.toList()).toEqual(list);
                        done();
                    });
                });
            });
        });

        describe('when put is called', () => {
            var key;
            var list;
            var artiq;

            beforeEach(() => {
                key = 'key';
                list = ['a', 'b', 'c'];
                artiq = new ArticleQueue(list);
            });

            it('should pass the given key and queue to the underlying store', () => {
                artiqStore.put(key, artiq);
                var expected = {};
                expected[key] = list;
                expect(chrome.storage.local.setAsync).toHaveBeenCalledWith(expected);
            });
        });
    });
})();
