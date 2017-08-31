import timeParser from "../../../src/js/calendar/timeParser.js"
import config from "../../../src/js/calendar/config.js"

describe("TimeMaster Date and Time", function () {

    it("should match date prefix correctly", function () {
        expect('Sat, May 7, 10am – 11:30pm'.match(config.datePrefixPattern)[0])
            .toEqual("Sat, May 7, ");
    });

    it("should extract hour/minute range from date string", function () {
        expect(timeParser.extractHourMinuteRange("Sat, May 7, 10am – 10pm"))
            .toEqual("10am – 10pm");
        expect(timeParser.extractHourMinuteRange("Fri, April 29, 4:30pm – 5:50pm"))
            .toEqual("4:30pm – 5:50pm");
        expect(timeParser.extractHourMinuteRange("Sat, May 7, 10 – 10p"))
            .toEqual("10 – 10p");
        expect(timeParser.extractHourMinuteRange("Fri, April 29, 4:30 – 5:40"))
            .toEqual("4:30 – 5:40");
    });


    it("should support different time formats in regexp pattern (first param)", function () {
        expect('10:30'.match(config.hourMinutePattern)[0])
            .toEqual('10:30');
        expect('10:30am'.match(config.hourMinutePattern)[0])
            .toEqual('10:30am');
        expect('10:30pm'.match(config.hourMinutePattern)[0])
            .toEqual('10:30pm');
    });

    it("should support different time formats in regexp pattern (second param)", function () {
        expect('10:30 - 11:15'.match(config.hourMinutePattern)[1])
            .toEqual('11:15');
        expect('10:30am - 11:15am'.match(config.hourMinutePattern)[1])
            .toEqual('11:15am');
        expect('10:30pm - 11:15pm'.match(config.hourMinutePattern)[1])
            .toEqual('11:15pm');
    });

    it("should support different time formats in regexp pattern (full date)", function () {
        expect(timeParser.extractHourMinuteRange('Fri, April 22, 10:30 – 15:30')
                         .match(config.hourMinutePattern)[1])
            .toEqual('15:30');
        expect(timeParser.extractHourMinuteRange('Fri, April 22, 10:30am – 11:50am')
                         .match(config.hourMinutePattern)[1])
            .toEqual('11:50am');
        expect(timeParser.extractHourMinuteRange('Fri, April 22, 10:30pm – 11:55pm')
                         .match(config.hourMinutePattern)[1])
            .toEqual('11:55pm');
    });


    it("should convert time correctly", function () {
        expect(timeParser.convertTo24h('10:30'))
            .toEqual('10:30');
        expect(timeParser.convertTo24h('12:00'))
            .toEqual('12:00');
        expect(timeParser.convertTo24h('23:59'))
            .toEqual('23:59');
        expect(timeParser.convertTo24h('00:00'))
            .toEqual('00:00');

        // am/pm
        expect(timeParser.convertTo24h('10:30am'))
            .toEqual('10:30');
        expect(timeParser.convertTo24h('10:30pm'))
            .toEqual('22:30');
        expect(timeParser.convertTo24h('12:00am'))
            .toEqual('00:00');
        expect(timeParser.convertTo24h('12:00pm'))
            .toEqual('12:00');

        // am/pm without minutes
        expect(timeParser.convertTo24h('10am'))
            .toEqual('10:00');
        expect(timeParser.convertTo24h('10pm'))
            .toEqual('22:00');
        expect(timeParser.convertTo24h('12am'))
            .toEqual('00:00');
        expect(timeParser.convertTo24h('12pm'))
            .toEqual('12:00');
    });

    it("should parse time correctly", function () {
        let time1 = timeParser.parseTime("9:00");
        let time2 = timeParser.parseTime("19:30");

        expect(time1.getHours()).toEqual(9);
        expect(time1.getMinutes()).toEqual(0);

        expect(time2.getHours()).toEqual(19);
        expect(time2.getMinutes()).toEqual(30);
    });

    it("should parse start time", function () {

        let timeRange = timeParser.createTimeRangeFromTimeArray(["9:00", "16:50"]);

        let time = timeRange.startTime;

        expect(time.getHours())
            .toEqual(9);
        expect(time.getMinutes())
            .toEqual(0);
    });

    it("should parse end time", function () {
        let timeRange = timeParser.createTimeRangeFromTimeArray(["15:30", "16:50"]);

        let time = timeRange.endTime;

        expect(time.getHours())
            .toEqual(16);
        expect(time.getMinutes())
            .toEqual(50);
    });

    it("should parse duration", function () {
        let timeRange = timeParser.createTimeRangeFromTimeArray(["15:30", "16:00"]);

        let time = timeRange.durationInMinutes;

        expect(time)
            .toEqual(30);
    });

    it("should parse duration 2", function () {
        let timeRange = timeParser.createTimeRangeFromTimeArray(["9:15", "11:00"]);

        let time = timeRange.durationInMinutes;

        expect(time)
            .toEqual(105);
    });

    it("should throw error for invalid time", function () {
        expect(function () {
            timeParser.parseTime("a:00");
        })
            .toThrowError();
    });

    it("should createTimeRangeFromTimeArray with am/pm", function () {
        const startTime = timeParser.convertTo24h("1:20am");
        const endTime = timeParser.convertTo24h("2:20pm");

        expect(startTime).toEqual("01:20");
        expect(endTime).toEqual("14:20");
    });

    it("should createTimeRangeFromTimeArray without am/pm", function () {
        const startTime = timeParser.convertTo24h("1:20");
        const endTime = timeParser.convertTo24h("22:00");

        expect(startTime).toEqual("01:20");
        expect(endTime).toEqual("22:00");
    });

    xit("should createTimeRangeFromTimeArray throw error when first element is greater than second", function () {
        expect(function () {
            timeParser.createTimeRangeFromTimeArray(["23:20", "22:00"]);
        })
            .toThrowError();
    });

});
