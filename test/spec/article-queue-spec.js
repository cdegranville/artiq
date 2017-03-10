(function() {
    'use strict';

    describe('Given a value', function() {
        describe('that is falsy', function() {
            describe('when the article queue constructor is called', function() {
                it('should default to an empty queue', function() {
                    expect(new ArticleQueue().toList()).toEqual([]);
                });
            });
        });
        
        describe('that is a list', function() {
             describe('when the article queue constructor is called', function() {
                it('should initialize the queue using the items in the list', function() {
                    var list = ['1', '2', '3'];
                    expect(new ArticleQueue(list).toList()).toEqual(list);
                });
            });
        });
    });
    
    describe('Given an article queue', function() {
        var artiq;
        var origAsList;

        beforeEach(function() {
            origAsList = ['askdkljfda'];
            artiq = new ArticleQueue(origAsList);
        });

        describe('when an article is pushed to the back', function() {
            var url;

            beforeEach(function() {
                url = 'url';
                artiq.pushBack(url);
            });

            it('should be the last article in the queue', function() {
                var newAsList = artiq.toList();
                var lastUrl = newAsList[newAsList.length - 1];
                expect(lastUrl).toEqual(url);
            });

            it('should increase the queue size by 1', function() {
                expect(artiq.size()).toEqual(origAsList.length + 1);
            });
        });

        describe('when an article is popped from the front', function() {
            var url;

            beforeEach(function() {
                url = artiq.popFront();
            });

            it('should return the first article in the queue', function() {
                expect(url).toEqual(origAsList[0]);
            });

            it('should decrease the queue size by 1', function() {
                expect(artiq.size()).toEqual(origAsList.length - 1);
            });
        });

        describe('and a copy of it is made', function() {
            var copy;

            beforeEach(function() {
                copy = artiq.copy();
            });

            it('should equal the original', function() {
                expect(copy.toList()).toEqual(artiq.toList());
            });
        });
    });
})();
