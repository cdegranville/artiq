(() => {
    'use strict';

    describe('Given the artiq popup', () => {
        var id;
        var url;
        var tabs;
        var context;
        var background;

        beforeEach(() => {
            id = 'id';
            url = 'url';
            tabs = [{
                id: id,
                url: url
            }];
            background = jasmine.createSpyObj('background', ['pushBack', 'popFront']);
            chrome = {
                tabs: jasmine.createSpyObj('tabs', ['queryAsync', 'update']),
                extension: jasmine.createSpyObj('extension', ['getBackgroundPage'])
            };
            chrome.tabs.queryAsync.and.returnValue(Promise.resolve(tabs));
            chrome.extension.getBackgroundPage.and.returnValue(background);
            context = jasmine.createSpyObj('context', ['log', 'error']);
        });

        describe('when the user clicks the push back button', () => {
            it('should pass the url and context to the background page', (done) => {
                background.pushBack.and.callFake((actualReq, actualContext) => {
                    expect(actualReq).toEqual({url: url});
                    expect(actualContext).toBe(context);
                    done();
                });
                pushBack(context);
            });

            describe('and there is an error', () => {
                var rejected;

                beforeEach(() => {
                    rejected = new Error("I've made a huge mistake");
                    background.pushBack.and.returnValue(Promise.reject(rejected));
                });

                it('should log an error message', (done) => {
                    context.error.and.callFake((actualRejected) => {
                        expect(actualRejected).toEqual(rejected.message);
                        done();
                    });
                    pushBack(context);
                });
            });
        });

        describe('when the user clicks the pop front button', () => {
            it('should pass the context to the background page', (done) => {
                background.popFront.and.callFake((actualReq, actualContext) => {
                    expect(actualReq).toEqual({});
                    expect(actualContext).toBe(context);
                    done();
                });
                popFront(context);
            });

            describe('and an article is present', () => {
                beforeEach(() => {
                    background.popFront.and.returnValue(Promise.resolve(url));
                });

                it('should navigate the current tab to the popped article', (done) => {
                    chrome.tabs.update.and.callFake((tabId, urlObj) => {
                        expect(tabId).toEqual(id);
                        expect(urlObj).toEqual({url: url});
                        done();
                    });
                    popFront(context);
                });
            });

            describe('and there is an error', () => {
                var rejected;

                beforeEach(() => {
                    rejected = new Error("I've made a huge mistake");
                    background.popFront.and.returnValue(Promise.reject(rejected));
                });

                it('should log an error message', (done) => {
                    context.error.and.callFake((actualRejected) => {
                        expect(actualRejected).toEqual(rejected.message);
                        done();
                    });
                    popFront(context);
                });
            });
        });
    });
})();
