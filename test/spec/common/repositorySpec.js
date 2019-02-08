import repository from "../../../src/js/common/timeRangeRepository.js"

describe("Repository", function () {

    it("should return true for an old or empty entry", function () {
        let now = new Date();
        let oneWeakAgo = new Date();
        oneWeakAgo.setDate(oneWeakAgo.getDate() - 7);
        let entry = {creationTime: oneWeakAgo.toJSON()};

        expect(repository.private.isOldEntry(entry, now)).toBeTruthy();
        expect(repository.private.isOldEntry(entry, oneWeakAgo)).toBeFalsy();
        expect(repository.private.isOldEntry({}, oneWeakAgo)).toBeTruthy();
    });

    it("should filter out old entries", function () {
        //given
        let now = new Date();
        let overOneWeakAgo = new Date();
        overOneWeakAgo.setDate(overOneWeakAgo.getDate() - 8);
        let entries = {
            entry1: {creationTime: overOneWeakAgo.toJSON()},
            entry2: {creationTime: now.toJSON()},
            entry3: {}
        };

        //when
        let keys = repository.private.findOldEntryKeys(entries);

        expect(keys).toContain("entry1");
        expect(keys).toContain("entry3");
        expect(keys.length).toEqual(2)
    });
});
