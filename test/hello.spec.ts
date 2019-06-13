import Hello from "../src/hello";

describe("#Hello", () => {
    test("Should greet", () => {
        // Given
        const hello = new Hello();

        // When
        const actual = hello.greet();

        // Then
        expect(actual).toEqual("Hello There");
    })
})