(() => {
    'use strict';

    describe('Given a context', () => {
        var context;

        beforeEach(() => {
            context = new Context();
            console = jasmine.createSpyObj('console', ['log', 'error']);
        });

        it('should provide a request id', () => {
            expect(context.getReqId()).toBeTruthy();
        });

        it('should include the request id in info logs', () => {
            var info = 'Her?';
            var reqId = context.getReqId();
            context.log(info);
            expect(console.log).toHaveBeenCalledWith('(' + reqId + ')', info);
        });

        it('should include the request id in error logs', () => {
            var error = "I've made a huge mistake";
            var reqId = context.getReqId();
            context.error(error);
            expect(console.error).toHaveBeenCalledWith('(' + reqId + ')', error);
        });
    });
})();
