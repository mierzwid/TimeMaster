import PingHandler from "../../../src/js/hangouts/PingHandler.js"

describe("PingHandler", function () {

    function fiveSecondsMockHandler() {
        const handler = new PingHandler();
        handler.test_played = 0;
        handler.play = function () {
            handler.test_played++;
        };

        handler.pingTimeBeforeMeetingEndsInSeconds = 5;
        return handler;
    }

    it("should not ping earlier", function () {
        const fiveSecHandler = fiveSecondsMockHandler();

        fiveSecHandler.beforeEndOfAMeeting(4000, 10000);

        expect(fiveSecHandler.test_played)
            .toEqual(0);
    });

    it("should play on time", function () {
        const fiveSecHandler = fiveSecondsMockHandler();

        fiveSecHandler.beforeEndOfAMeeting(5000, 10000);

        expect(fiveSecHandler.test_played)
            .toEqual(1);
    });

    it("shouldn't play when person joins less than 5s before end of the meeting", function () {
        const fiveSecHandler = fiveSecondsMockHandler();

        fiveSecHandler.beforeEndOfAMeeting(1000, 10000);

        expect(fiveSecHandler.test_played)
            .toEqual(0);
    });

    it("should play once", function () {
        const fiveSecHandler = fiveSecondsMockHandler();

        fiveSecHandler.beforeEndOfAMeeting(5000, 10000);
        fiveSecHandler.beforeEndOfAMeeting(6000, 10000);

        expect(fiveSecHandler.test_played)
            .toEqual(1);
    });

    it("INTEGRATION TEST (this can ping from time to time - no worry) - should invoke handler", function () {
        let handler = PingHandler.beforeEndOfAMeetingHandler();

        // expect this to work without throwing error
        handler();
    });

});