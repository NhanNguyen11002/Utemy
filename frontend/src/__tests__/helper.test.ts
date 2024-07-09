import * as helper from "../utils/helper";

test("secondsToMinutesAndSeconds: 100 sec should be convert to 01:40", () => {
    expect(helper.secondsToMinutesAndSeconds(100)).toBe("01:40");
});

test("convertSecondsToTimeString: ", () => {
    expect(helper.convertSecondsToTimeString(3660)).toBe("1 giờ 1 phút");
});
