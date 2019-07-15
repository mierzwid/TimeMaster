import urlParser from "../../../src/js/common/urlParser"

describe("URL Parser", function () {
    const hangoutPathnameWithParam = "/hangouts/_/roche.com/tomasz-marci-d6?authuser=0";
    const hangoutPathname = "/hangouts/_/roche.com/tomasz-marci-d6";
    
    it("should extract correct hangoutId from pathname", function () {
        expect(urlParser.getHangoutId(hangoutPathnameWithParam))
            .toEqual("roche.com/tomasz-marci-d6");
        expect(urlParser.getHangoutId(hangoutPathname))
            .toEqual("roche.com/tomasz-marci-d6");
    });
    
    it("should exclude unnecessary elements from pathname", function () {
        expect(urlParser.getHangoutId(hangoutPathnameWithParam))
            .not
            .toContain("?");
        expect(urlParser.getHangoutId(hangoutPathname))
            .not
            .toContain("?");
    });

    it("should exclude _meet from pathname", function () {
        expect(urlParser.getHangoutId("/_meet/sasad-sadasd-dssd"))
            .not
            .toContain("_meet/");
    });
});
